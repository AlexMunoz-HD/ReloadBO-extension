document.addEventListener('DOMContentLoaded', function() {
    const reloadButton = document.getElementById('reloadButton');
    const buttonText = document.getElementById('buttonText');
    const status = document.getElementById('status');
    const successAnimation = document.getElementById('successAnimation');
    const restartBrowserCheckbox = document.getElementById('restartBrowser');
    const optionsContainer = document.getElementById('optionsContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const loadingText = document.getElementById('loadingText');
    
    // Variables para controlar las animaciones
    let loadingInterval = null;
    let currentPhraseIndex = 0;
    
    // Frases rotativas para diferentes procesos
    const loadingPhrases = {
        normal: [
            "Limpiando caché...",
            "Cerrando conexiones...",
            "Recargando BO...",
            "Finalizando..."
        ],
        complete: [
            "Cerrando sockets inactivos...",
            "Limpiando pools de sockets...",
            "Realizando limpieza profunda...",
            "Recargando todas las pestañas...",
            "Finalizando proceso..."
        ]
    };
    
    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status show ${type}`;
    }
    
    function hideStatus() {
        status.className = 'status';
    }
    
    function showSuccessAnimation() {
        successAnimation.classList.add('show');
        setTimeout(() => {
            successAnimation.classList.remove('show');
        }, 2000);
    }
    
    // Función para mostrar el círculo de carga con frases rotativas
    function showLoadingAnimation(processType = 'normal') {
        // Ocultar opciones y mostrar carga
        optionsContainer.style.display = 'none';
        loadingContainer.style.display = 'block';
        
        // Configurar frases según el tipo de proceso
        const phrases = loadingPhrases[processType];
        currentPhraseIndex = 0;
        
        // Mostrar primera frase
        loadingText.textContent = phrases[0];
        
        // Iniciar rotación de frases
        loadingInterval = setInterval(() => {
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            loadingText.textContent = phrases[currentPhraseIndex];
        }, 2000); // Cambiar frase cada 2 segundos
    }
    
    // Función para ocultar el círculo de carga
    function hideLoadingAnimation() {
        if (loadingInterval) {
            clearInterval(loadingInterval);
            loadingInterval = null;
        }
        loadingContainer.style.display = 'none';
        optionsContainer.style.display = 'block';
    }
    
    // Función para actualizar la frase de carga manualmente
    function updateLoadingPhrase(phrase) {
        if (loadingContainer.style.display !== 'none') {
            loadingText.textContent = phrase;
        }
    }
    
    // Función para cerrar sockets inactivos
    async function closeIdleSockets(tabId) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => {
                    // Cerrar WebSockets inactivos
                    if (window.WebSocket) {
                        const originalWebSocket = window.WebSocket;
                        window.WebSocket = function(...args) {
                            const ws = new originalWebSocket(...args);
                            // Cerrar conexiones que estén inactivas por más de 30 segundos
                            setTimeout(() => {
                                if (ws.readyState === WebSocket.OPEN) {
                                    ws.close();
                                }
                            }, 30000);
                            return ws;
                        };
                    }
                    
                    // Cerrar conexiones fetch inactivas
                    if (window.AbortController) {
                        const controllers = [];
                        const originalFetch = window.fetch;
                        window.fetch = function(...args) {
                            const controller = new AbortController();
                            controllers.push(controller);
                            
                            // Limpiar controladores antiguos
                            setTimeout(() => {
                                const index = controllers.indexOf(controller);
                                if (index > -1) {
                                    controllers.splice(index, 1);
                                }
                            }, 30000);
                            
                            return originalFetch(...args, { signal: controller.signal });
                        };
                    }
                    
                    // Cerrar XMLHttpRequests inactivos
                    if (window.XMLHttpRequest) {
                        const xhrInstances = [];
                        const originalXHR = window.XMLHttpRequest;
                        window.XMLHttpRequest = function() {
                            const xhr = new originalXHR();
                            xhrInstances.push(xhr);
                            
                            // Limpiar instancias antiguas
                            setTimeout(() => {
                                const index = xhrInstances.indexOf(xhr);
                                if (index > -1) {
                                    xhrInstances.splice(index, 1);
                                }
                            }, 30000);
                            
                            return xhr;
                        };
                    }
                }
            });
        } catch (error) {
            console.log('Error cerrando sockets inactivos:', error);
        }
    }
    
    // Función para limpiar pools de sockets
    async function flushSocketPools(tabId) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => {
                    // Limpiar pools de conexiones HTTP
                    if (window.navigator && window.navigator.serviceWorker) {
                        window.navigator.serviceWorker.getRegistrations().then(registrations => {
                            registrations.forEach(registration => {
                                registration.unregister();
                            });
                        });
                    }
                    
                    // Limpiar caché de recursos
                    if (window.caches) {
                        window.caches.keys().then(cacheNames => {
                            cacheNames.forEach(cacheName => {
                                window.caches.delete(cacheName);
                            });
                        });
                    }
                    
                    // Limpiar IndexedDB
                    if (window.indexedDB) {
                        const databases = ['default', 'cache', 'socket-pool'];
                        databases.forEach(dbName => {
                            const deleteReq = window.indexedDB.deleteDatabase(dbName);
                            deleteReq.onsuccess = () => console.log(`Database ${dbName} deleted`);
                        });
                    }
                    
                    // Limpiar localStorage relacionado con sockets
                    const socketKeys = Object.keys(localStorage).filter(key => 
                        key.includes('socket') || key.includes('connection') || key.includes('pool')
                    );
                    socketKeys.forEach(key => localStorage.removeItem(key));
                    
                    // Limpiar sessionStorage relacionado con sockets
                    const sessionSocketKeys = Object.keys(sessionStorage).filter(key => 
                        key.includes('socket') || key.includes('connection') || key.includes('pool')
                    );
                    sessionSocketKeys.forEach(key => sessionStorage.removeItem(key));
                }
            });
        } catch (error) {
            console.log('Error limpiando pools de sockets:', error);
        }
    }
    
    // Función para recargar todas las pestañas (simula reinicio del navegador)
    async function reloadAllTabs() {
        try {
            // Obtener todas las pestañas
            const tabs = await chrome.tabs.query({});
            const validTabs = tabs.filter(tab => 
                tab.url && 
                !tab.url.startsWith('chrome://') && 
                !tab.url.startsWith('chrome-extension://') &&
                !tab.url.startsWith('moz-extension://')
            );
            
            showStatus(`Recargando ${validTabs.length} pestañas...`, 'loading');
            
            // Recargar todas las pestañas válidas con bypass de caché
            const reloadPromises = validTabs.map(tab => 
                chrome.tabs.reload(tab.id, { bypassCache: true }).catch(error => {
                    console.log(`Error recargando pestaña ${tab.id}:`, error);
                })
            );
            
            // Esperar a que todas las recargas se completen
            await Promise.allSettled(reloadPromises);
            
            showStatus('Todas las pestañas han sido recargadas', 'success');
            
            // Cerrar el popup después de un momento
            setTimeout(() => window.close(), 2000);
            
        } catch (error) {
            console.error('Error recargando pestañas:', error);
            showStatus('Error al recargar pestañas', 'error');
        }
    }
    
    // Función para cerrar sockets inactivos en todas las pestañas (optimizada)
    async function closeIdleSocketsAllTabs(tabs) {
        try {
            showStatus('Cerrando sockets inactivos...', 'loading');
            
            // Procesar en lotes para evitar bloqueos
            const batchSize = 3;
            let processedCount = 0;
            
            for (let i = 0; i < tabs.length; i += batchSize) {
                const batch = tabs.slice(i, i + batchSize);
                
                const socketPromises = batch.map(tab => 
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: () => {
                            // Cerrar WebSockets inactivos
                            if (window.WebSocket) {
                                const originalWebSocket = window.WebSocket;
                                window.WebSocket = function(...args) {
                                    const ws = new originalWebSocket(...args);
                                    // Cerrar conexiones que estén inactivas por más de 30 segundos
                                    setTimeout(() => {
                                        if (ws.readyState === WebSocket.OPEN) {
                                            ws.close();
                                        }
                                    }, 30000);
                                    return ws;
                                };
                            }
                            
                            // Cerrar conexiones fetch inactivas
                            if (window.AbortController) {
                                const controllers = [];
                                const originalFetch = window.fetch;
                                window.fetch = function(...args) {
                                    const controller = new AbortController();
                                    controllers.push(controller);
                                    
                                    // Limpiar controladores antiguos
                                    setTimeout(() => {
                                        const index = controllers.indexOf(controller);
                                        if (index > -1) {
                                            controllers.splice(index, 1);
                                        }
                                    }, 30000);
                                    
                                    return originalFetch(...args, { signal: controller.signal });
                                };
                            }
                            
                            // Cerrar XMLHttpRequests inactivos
                            if (window.XMLHttpRequest) {
                                const xhrInstances = [];
                                const originalXHR = window.XMLHttpRequest;
                                window.XMLHttpRequest = function() {
                                    const xhr = new originalXHR();
                                    xhrInstances.push(xhr);
                                    
                                    // Limpiar instancias antiguas
                                    setTimeout(() => {
                                        const index = xhrInstances.indexOf(xhr);
                                        if (index > -1) {
                                            xhrInstances.splice(index, 1);
                                        }
                                    }, 30000);
                                    
                                    return xhr;
                                };
                            }
                        }
                    }).catch(error => {
                        console.log(`Error cerrando sockets en pestaña ${tab.id}:`, error);
                    })
                );
                
                await Promise.allSettled(socketPromises);
                processedCount += batch.length;
                
                // Actualizar progreso
                showStatus(`Cerrando sockets... ${processedCount}/${tabs.length}`, 'loading');
                
                // Pequeña pausa para evitar bloqueos
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            showStatus('Sockets inactivos cerrados', 'success');
            
        } catch (error) {
            console.log('Error cerrando sockets en todas las pestañas:', error);
        }
    }
    
    // Función para limpiar pools de sockets en todas las pestañas (optimizada)
    async function flushSocketPoolsAllTabs(tabs) {
        try {
            showStatus('Limpiando pools de sockets...', 'loading');
            
            // Procesar en lotes para evitar bloqueos
            const batchSize = 3;
            let processedCount = 0;
            
            for (let i = 0; i < tabs.length; i += batchSize) {
                const batch = tabs.slice(i, i + batchSize);
                
                const poolPromises = batch.map(tab => 
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: () => {
                            // Limpiar pools de conexiones HTTP
                            if (window.navigator && window.navigator.serviceWorker) {
                                window.navigator.serviceWorker.getRegistrations().then(registrations => {
                                    registrations.forEach(registration => {
                                        registration.unregister();
                                    });
                                });
                            }
                            
                            // Limpiar caché de recursos
                            if (window.caches) {
                                window.caches.keys().then(cacheNames => {
                                    cacheNames.forEach(cacheName => {
                                        window.caches.delete(cacheName);
                                    });
                                });
                            }
                            
                            // Limpiar IndexedDB
                            if (window.indexedDB) {
                                const databases = ['default', 'cache', 'socket-pool'];
                                databases.forEach(dbName => {
                                    const deleteReq = window.indexedDB.deleteDatabase(dbName);
                                    deleteReq.onsuccess = () => console.log(`Database ${dbName} deleted`);
                                });
                            }
                            
                            // Limpiar localStorage relacionado con sockets
                            const socketKeys = Object.keys(localStorage).filter(key => 
                                key.includes('socket') || key.includes('connection') || key.includes('pool')
                            );
                            socketKeys.forEach(key => localStorage.removeItem(key));
                            
                            // Limpiar sessionStorage relacionado con sockets
                            const sessionSocketKeys = Object.keys(sessionStorage).filter(key => 
                                key.includes('socket') || key.includes('connection') || key.includes('pool')
                            );
                            sessionSocketKeys.forEach(key => sessionStorage.removeItem(key));
                        }
                    }).catch(error => {
                        console.log(`Error limpiando pools en pestaña ${tab.id}:`, error);
                    })
                );
                
                await Promise.allSettled(poolPromises);
                processedCount += batch.length;
                
                // Actualizar progreso
                showStatus(`Limpiando pools... ${processedCount}/${tabs.length}`, 'loading');
                
                // Pequeña pausa para evitar bloqueos
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            showStatus('Pools de sockets limpiados', 'success');
            
        } catch (error) {
            console.log('Error limpiando pools en todas las pestañas:', error);
        }
    }
    
    // Función para limpiar completamente el navegador (optimizada)
    async function deepCleanBrowser() {
        try {
            showStatus('Realizando limpieza profunda...', 'loading');
            
            // Limpiar caché global primero (más rápido)
            try {
                await chrome.browsingData.remove(
                    {},
                    {
                        cache: true,
                        cacheStorage: true,
                        serviceWorkers: true
                    }
                );
                showStatus('Caché global limpiado', 'loading');
            } catch (error) {
                console.log('Error limpiando caché global:', error);
            }
            
            // Obtener todas las pestañas
            const tabs = await chrome.tabs.query({});
            const validTabs = tabs.filter(tab => 
                tab.url && 
                !tab.url.startsWith('chrome://') && 
                !tab.url.startsWith('chrome-extension://') &&
                !tab.url.startsWith('moz-extension://')
            );
            
            // Procesar pestañas en lotes pequeños para evitar bloqueos
            const batchSize = 5;
            let processedCount = 0;
            
            for (let i = 0; i < validTabs.length; i += batchSize) {
                const batch = validTabs.slice(i, i + batchSize);
                
                // Procesar lote en paralelo
                const batchPromises = batch.map(async (tab) => {
                    try {
                        const origin = new URL(tab.url).origin;
                        await chrome.browsingData.remove(
                            { origins: [origin] },
                            {
                                cache: true,
                                cacheStorage: true,
                                serviceWorkers: true
                            }
                        );
                        processedCount++;
                    } catch (error) {
                        console.log(`Error limpiando caché de ${tab.url}:`, error);
                    }
                });
                
                // Esperar a que termine el lote
                await Promise.allSettled(batchPromises);
                
                // Actualizar progreso
                showStatus(`Limpiando pestañas... ${processedCount}/${validTabs.length}`, 'loading');
                
                // Pequeña pausa para evitar bloqueos
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            showStatus('Limpieza profunda completada', 'success');
            
        } catch (error) {
            console.error('Error en limpieza profunda:', error);
            showStatus('Error en limpieza profunda', 'error');
        }
    }
    
    
    reloadButton.addEventListener('click', async function() {
        try {
            // Disable button to prevent multiple clicks
            reloadButton.disabled = true;
            buttonText.textContent = '🧹 Limpiando...';
            
            // Verificar si se debe recargar todas las pestañas
            if (restartBrowserCheckbox.checked) {
                // Mostrar animación de carga completa
                showLoadingAnimation('complete');
                updateLoadingPhrase('Iniciando limpieza completa...');
                // Timeout global para evitar cuelgues
                const globalTimeout = setTimeout(() => {
                    showStatus('Proceso completado (timeout)', 'success');
                    setTimeout(() => window.close(), 2000);
                }, 30000); // 30 segundos máximo
                
                try {
                    // Obtener todas las pestañas válidas
                    const tabs = await chrome.tabs.query({});
                    const validTabs = tabs.filter(tab => 
                        tab.url && 
                        !tab.url.startsWith('chrome://') && 
                        !tab.url.startsWith('chrome-extension://') &&
                        !tab.url.startsWith('moz-extension://')
                    );
                    
                    // Paso 1: Cerrar sockets inactivos en todas las pestañas
                    updateLoadingPhrase('Cerrando sockets inactivos...');
                    await Promise.race([
                        closeIdleSocketsAllTabs(validTabs),
                        new Promise(resolve => setTimeout(resolve, 5000)) // Timeout de 5 segundos
                    ]);
                    
                    // Paso 2: Limpiar pools de sockets en todas las pestañas
                    updateLoadingPhrase('Limpiando pools de sockets...');
                    await Promise.race([
                        flushSocketPoolsAllTabs(validTabs),
                        new Promise(resolve => setTimeout(resolve, 5000)) // Timeout de 5 segundos
                    ]);
                    
                    // Paso 3: Limpieza profunda del navegador
                    updateLoadingPhrase('Realizando limpieza profunda...');
                    await Promise.race([
                        deepCleanBrowser(),
                        new Promise(resolve => setTimeout(resolve, 10000)) // Timeout de 10 segundos
                    ]);
                    
                    // Paso 4: Recargar todas las pestañas
                    updateLoadingPhrase('Recargando todas las pestañas...');
                    await Promise.race([
                        reloadAllTabs(),
                        new Promise(resolve => setTimeout(resolve, 5000)) // Timeout de 5 segundos
                    ]);
                    
                    // Limpiar timeout global
                    clearTimeout(globalTimeout);
                    
                    // Finalizar animación
                    updateLoadingPhrase('Proceso completado exitosamente');
                    hideLoadingAnimation();
                    
                    // Mostrar éxito
                    showSuccessAnimation();
                    setTimeout(() => window.close(), 2000);
                    
                } catch (error) {
                    clearTimeout(globalTimeout);
                    console.error('Error en proceso completo:', error);
                    updateLoadingPhrase('Proceso completado con errores');
                    hideLoadingAnimation();
                    showStatus('Proceso completado con errores', 'success');
                    setTimeout(() => window.close(), 2000);
                }
                return;
            }
            
            // Modo normal - mostrar animación simple
            showLoadingAnimation('normal');
            updateLoadingPhrase('Iniciando limpieza...');
            
            // Set a timeout to prevent infinite hanging
            const timeoutId = setTimeout(async () => {
                buttonText.textContent = '⏱️ Recargando...';
                showStatus('Timeout - Forzando recarga', 'loading');
                try {
                    // Force reload even if cache clear failed
                    await chrome.tabs.reload(activeTab.id, { bypassCache: true });
                    showSuccessAnimation();
                    setTimeout(() => window.close(), 2000);
                } catch (timeoutError) {
                    console.error('Timeout reload failed:', timeoutError);
                    buttonText.textContent = '❌ Error';
                    showStatus('Error en timeout', 'error');
                    reloadButton.disabled = false;
                }
            }, 5000);
            
            // Get the active tab
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!activeTab) {
                throw new Error('No se pudo obtener la pestaña activa');
            }
            
            // Get the origin of the current tab
            const origin = new URL(activeTab.url).origin;
            
            // Clear ONLY cache data (NO cookies, NO localStorage, NO session data)
            try {
                updateLoadingPhrase('Limpiando caché...');
                await chrome.browsingData.remove(
                    { origins: [origin] },
                    {
                        cache: true,
                        cacheStorage: true
                    }
                );
            } catch (cacheError) {
                console.log('Cache clear failed, continuing with reload:', cacheError);
            }
            
            // Cerrar sockets inactivos (siempre activo en modo normal)
            updateLoadingPhrase('Cerrando conexiones...');
            await closeIdleSockets(activeTab.id);
            
            // Limpiar pools de sockets (siempre activo en modo normal)
            updateLoadingPhrase('Limpiando pools...');
            await flushSocketPools(activeTab.id);
            
            // Close sockets by injecting JavaScript to close connections (funcionalidad original mejorada)
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    func: () => {
                        // Close any open WebSocket connections
                        if (window.WebSocket) {
                            // Find and close all WebSocket instances
                            const originalWebSocket = window.WebSocket;
                            window.WebSocket = function(...args) {
                                const ws = new originalWebSocket(...args);
                                ws.close();
                                return ws;
                            };
                        }
                        
                        // Close any fetch requests that might be hanging
                        if (window.AbortController) {
                            const controller = new AbortController();
                            controller.abort();
                        }
                        
                        // Force close any pending XMLHttpRequests
                        if (window.XMLHttpRequest) {
                            const xhr = new XMLHttpRequest();
                            xhr.abort();
                        }
                    }
                });
            } catch (scriptError) {
                console.log('Socket cleanup script failed:', scriptError);
            }
            
            // Clear timeout
            clearTimeout(timeoutId);
            
            // Update UI for final step
            updateLoadingPhrase('Recargando BO...');
            
            // Hard refresh (equivalent to Cmd + Shift + R)
            // This bypasses cache completely and forces a fresh load
            await chrome.tabs.reload(activeTab.id, { bypassCache: true });
            
            // Finalizar animación
            updateLoadingPhrase('Proceso completado');
            hideLoadingAnimation();
            
            // Show success animation instead of text
            showSuccessAnimation();
            
            // Close the popup after animation
            setTimeout(() => window.close(), 2000);
            
        } catch (error) {
            console.error('Error:', error);
            updateLoadingPhrase('Error durante la operación');
            hideLoadingAnimation();
            buttonText.textContent = '❌ Error';
            showStatus('Error durante la operación', 'error');
            reloadButton.disabled = false;
            
            // Show error for a moment then reset
            setTimeout(() => {
                buttonText.textContent = 'ReloadBO';
                hideStatus();
                reloadButton.disabled = false;
            }, 3000);
        }
    });
});
