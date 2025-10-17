document.addEventListener('DOMContentLoaded', function() {
    const reloadButton = document.getElementById('reloadButton');
    const buttonText = document.getElementById('buttonText');
    const status = document.getElementById('status');
    const successAnimation = document.getElementById('successAnimation');
    
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
    
    reloadButton.addEventListener('click', async function() {
        try {
            // Disable button to prevent multiple clicks
            reloadButton.disabled = true;
            buttonText.textContent = '🧹 Limpiando...';
            showStatus('Limpiando caché y cerrando conexiones', 'loading');
            
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
            }, 3000);
            
            // Get the active tab
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!activeTab) {
                throw new Error('No se pudo obtener la pestaña activa');
            }
            
            // Get the origin of the current tab
            const origin = new URL(activeTab.url).origin;
            
            // Clear ONLY cache data (NO cookies, NO localStorage, NO session data)
            try {
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
            
            // Close sockets by injecting JavaScript to close connections
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
            buttonText.textContent = '🔄 Recargando...';
            showStatus('Ejecutando hard refresh', 'loading');
            
            // Hard refresh (equivalent to Cmd + Shift + R)
            // This bypasses cache completely and forces a fresh load
            await chrome.tabs.reload(activeTab.id, { bypassCache: true });
            
            // Show success animation instead of text
            showSuccessAnimation();
            
            // Close the popup after animation
            setTimeout(() => window.close(), 2000);
            
        } catch (error) {
            console.error('Error:', error);
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
