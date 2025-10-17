# Configuración del Repositorio GitHub

## Nombre del Repositorio
`reloadbo-chrome-extension`

## Descripción
Extensión profesional de Chrome para limpiar caché y realizar hard refresh en aplicaciones web empresariales. Desarrollada por XEPELIN.

## Tags/Topics
- chrome-extension
- cache-cleaner
- hard-refresh
- web-development
- enterprise
- xepelin
- javascript
- manifest-v3

## Configuración del Repositorio

### Visibilidad
- **Público** (recomendado para portfolio)
- **Privado** (si es solo para uso interno)

### Configuración Recomendada
- ✅ Issues habilitados
- ✅ Wiki habilitado
- ✅ Discussions habilitado
- ✅ Projects habilitado
- ✅ Actions habilitado

### Branch Protection
- Proteger rama `main`
- Requerir pull requests para cambios
- Requerir reviews de código

### Archivos de Configuración
- `.gitignore` - Archivos a ignorar
- `LICENSE` - Licencia MIT
- `README.md` - Documentación principal
- `package.sh` - Script de empaquetado

## Comandos Git para Subir

```bash
# Inicializar repositorio
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit: ReloadBO Chrome Extension v1.0.0"

# Agregar remote (reemplazar con tu URL)
git remote add origin https://github.com/tu-usuario/reloadbo-chrome-extension.git

# Push inicial
git push -u origin main
```

## Estructura Final del Repositorio
```
reloadbo-chrome-extension/
├── .gitignore
├── .github/
│   └── workflows/
│       └── release.yml
├── manifest.json
├── popup.html
├── popup.js
├── icon16.png
├── icon48.png
├── icon128.png
├── README.md
├── LICENSE
├── PROJECT_INFO.md
├── GITHUB_DESCRIPTION.md
├── package.sh
└── dist/
    └── (archivos empaquetados)
```

## Releases
- **v1.0.0** - Lanzamiento inicial
- Archivos: `.zip`, `.crx` (cuando esté listo)
- Changelog en cada release

## Contribución
- Fork del repositorio
- Pull requests para mejoras
- Issues para reportar bugs
- Discussions para preguntas
