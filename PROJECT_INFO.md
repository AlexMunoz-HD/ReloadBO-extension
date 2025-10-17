# ReloadBO Chrome Extension

## Descripción
Extensión profesional de Chrome para limpiar caché y realizar hard refresh en aplicaciones web empresariales.

## Archivos del Proyecto

### Archivos Principales
- `manifest.json` - Configuración de la extensión (Manifest V3)
- `popup.html` - Interfaz del popup con diseño profesional
- `popup.js` - Lógica principal de la extensión

### Iconos
- `icon16.png` - Icono 16x16 para barra de herramientas
- `icon48.png` - Icono 48x48 para página de extensiones
- `icon128.png` - Icono 128x128 para Chrome Web Store

### Documentación
- `README.md` - Documentación completa del proyecto
- `LICENSE` - Licencia MIT

## Funcionalidades

### Limpieza de Caché
- Borra caché normal del navegador
- Limpia Cache API moderno
- Preserva sesiones y cookies

### Hard Refresh
- Equivalente a Cmd + Shift + R (Mac) / Ctrl + Shift + R (Windows)
- Ignora completamente la caché
- Descarga todos los recursos desde el servidor

### Cierre de Conexiones
- Cierra WebSockets colgados
- Termina fetch requests pendientes
- Aborta XMLHttpRequests activos

### Animación de Éxito
- Pantalla verde completa tipo MercadoLibre
- Checkmark animado que se dibuja línea por línea
- Anillo pulsante para feedback visual

## Instalación

### Desarrollo
1. Abrir `chrome://extensions/`
2. Activar "Modo de desarrollador"
3. Clic en "Cargar extensión sin empaquetar"
4. Seleccionar carpeta del proyecto

### Producción
1. Crear archivo .crx desde Chrome
2. Instalar desde Chrome Web Store (cuando esté publicado)

## Permisos Requeridos
- `tabs` - Para obtener pestaña activa
- `browsingData` - Para limpiar caché
- `activeTab` - Para limitar alcance a pestaña actual
- `scripting` - Para inyectar código de limpieza

## Seguridad
- No envía datos a servidores externos
- Solo afecta la pestaña actual
- Preserva sesiones de usuario
- Permisos mínimos necesarios

## Tecnologías
- Manifest V3
- Vanilla JavaScript
- CSS3 con animaciones
- Chrome Extensions API

## Empresa
Desarrollado por XEPELIN para uso empresarial interno.
