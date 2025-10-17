# ReloadBO - Chrome Extension

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Una extensión profesional de Chrome para limpiar caché y realizar hard refresh en aplicaciones web empresariales. Resuelve problemas de loops infinitos y caché corrupto con un solo clic.

## 🚀 Características

- **Hard Refresh Automático**: Equivalente a `Cmd + Shift + R` (Mac) o `Ctrl + Shift + R` (Windows)
- **Limpieza de Caché**: Borra caché de archivos CSS, JS e imágenes
- **Cierre de Conexiones**: Cierra WebSockets y conexiones colgadas
- **Preserva Sesiones**: No afecta cookies ni datos de login
- **Animación de Éxito**: Feedback visual tipo MercadoLibre
- **Diseño Profesional**: Interfaz moderna con colores corporativos

## 📋 Requisitos

- Google Chrome 88+
- Manifest V3
- Permisos: `tabs`, `browsingData`, `activeTab`, `scripting`

## 🛠️ Instalación

### Para Desarrollo

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/reloadbo.git
cd reloadbo
```

2. Abre Chrome y ve a `chrome://extensions/`
3. Activa el "Modo de desarrollador"
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta del proyecto

### Para Producción

1. Descarga el archivo `.crx` desde [Releases](../../releases)
2. Arrastra el archivo a `chrome://extensions/`

## 📁 Estructura del Proyecto

```
reloadbo/
├── manifest.json          # Configuración de la extensión
├── popup.html            # Interfaz del popup
├── popup.js              # Lógica principal
├── icon16.png            # Icono 16x16
├── icon48.png            # Icono 48x48
├── icon128.png           # Icono 128x128
├── README.md             # Documentación
└── LICENSE               # Licencia MIT
```

## 🎯 Uso

1. Haz clic en el icono de ReloadBO en la barra de herramientas
2. Haz clic en el botón "ReloadBO"
3. La extensión:
   - Limpia la caché del sitio actual
   - Cierra conexiones colgadas
   - Ejecuta hard refresh
   - Muestra animación de éxito

## 🔧 Funcionalidades Técnicas

### Limpieza de Datos
- `cache`: Caché normal del navegador
- `cacheStorage`: Cache API moderno
- `indexedDB`: Base de datos local
- `localStorage`: Almacenamiento local
- `serviceWorkers`: Service Workers
- `cookies`: Cookies del sitio

### Cierre de Conexiones
- WebSockets colgados
- Fetch requests pendientes
- XMLHttpRequests activos

### Hard Refresh
- `bypassCache: true` - Ignora completamente la caché
- Descarga todos los recursos desde el servidor
- Equivalente a `Cmd + Shift + R`

## 🎨 Personalización

### Colores
La extensión usa una paleta de colores corporativa:
- **Azul Principal**: `#3b82f6`
- **Azul Profundo**: `#1e3a8a`
- **Cian**: `#06b6d4`
- **Verde Éxito**: `#10b981`

### Iconos
Reemplaza los archivos `icon16.png`, `icon48.png`, `icon128.png` con tus propios iconos.

## 🔒 Seguridad

- **Permisos mínimos**: Solo los necesarios para funcionar
- **No datos externos**: No envía información a servidores
- **Solo pestaña actual**: No afecta otras pestañas
- **Preserva sesiones**: No borra cookies ni datos de login

## 🐛 Solución de Problemas

### La extensión no funciona
- Verifica que Chrome esté actualizado (versión 88+)
- Revisa la consola de desarrollador para errores
- Asegúrate de que los permisos estén habilitados

### No se cierra el popup
- Verifica que `window.close()` esté funcionando
- Algunos navegadores bloquean el cierre automático

### La animación no aparece
- Verifica que el CSS esté cargado correctamente
- Revisa la consola para errores de JavaScript

## 📝 Changelog

### v1.0.0
- Lanzamiento inicial
- Hard refresh automático
- Limpieza de caché
- Cierre de conexiones
- Animación de éxito
- Diseño profesional

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollado por**: Enterprise IT Team
- **Empresa**: XEPELIN
- **Contacto**: [tu-email@xepelin.com](mailto:tu-email@xepelin.com)

## 🙏 Agradecimientos

- Inspirado en la necesidad de resolver loops infinitos en aplicaciones web
- Diseño inspirado en MercadoLibre para la animación de éxito
- Colores corporativos de XEPELIN

---

**ReloadBO** - Simplificando el desarrollo web empresarial 🚀
