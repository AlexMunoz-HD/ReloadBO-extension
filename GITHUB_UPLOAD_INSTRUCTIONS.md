# 🚀 Instrucciones para Subir a GitHub

## 1. Crear Repositorio en GitHub

### Opción A: Desde GitHub Web
1. Ve a [github.com](https://github.com)
2. Clic en "New repository"
3. Nombre: `reloadbo-chrome-extension`
4. Descripción: `Extensión profesional de Chrome para limpiar caché y realizar hard refresh`
5. Marcar como **Público**
6. **NO** inicializar con README (ya tenemos uno)
7. Clic en "Create repository"

### Opción B: Desde Terminal
```bash
# Crear repositorio desde CLI (requiere GitHub CLI)
gh repo create reloadbo-chrome-extension --public --description "Extensión profesional de Chrome para limpiar caché y realizar hard refresh"
```

## 2. Configurar Git Local

```bash
# Navegar al directorio del proyecto
cd /Users/alex.munoz/ReoladBO

# Inicializar repositorio git
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit: ReloadBO Chrome Extension v1.0.0

- Hard refresh automático (Cmd + Shift + R)
- Limpieza de caché sin afectar sesiones
- Cierre de conexiones colgadas (WebSockets, fetch, XMLHttpRequest)
- Animación de éxito tipo MercadoLibre
- Diseño profesional con colores corporativos XEPELIN
- Manifest V3 compatible
- Permisos mínimos para máxima seguridad"

# Agregar remote (reemplazar con tu usuario)
git remote add origin https://github.com/TU-USUARIO/reloadbo-chrome-extension.git

# Push inicial
git push -u origin main
```

## 3. Configurar Repositorio

### Topics/Tags
Agregar estos topics en la configuración del repositorio:
- `chrome-extension`
- `cache-cleaner`
- `hard-refresh`
- `web-development`
- `enterprise`
- `xepelin`
- `javascript`
- `manifest-v3`

### Configuración Recomendada
- ✅ Issues habilitados
- ✅ Wiki habilitado
- ✅ Discussions habilitado
- ✅ Projects habilitado

## 4. Crear Release

### Opción A: Desde GitHub Web
1. Ve a "Releases" en el repositorio
2. Clic en "Create a new release"
3. Tag: `v1.0.0`
4. Título: `ReloadBO Chrome Extension v1.0.0`
5. Descripción: Usar contenido de `GITHUB_DESCRIPTION.md`
6. Subir archivo ZIP (usar `package.sh` para crear)

### Opción B: Desde Terminal
```bash
# Crear tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions creará automáticamente el release
```

## 5. Archivos Incluidos

El repositorio incluye:
- ✅ `manifest.json` - Configuración Manifest V3
- ✅ `popup.html` - Interfaz profesional
- ✅ `popup.js` - Lógica de la extensión
- ✅ `icon16.png`, `icon48.png`, `icon128.png` - Iconos
- ✅ `README.md` - Documentación completa
- ✅ `LICENSE` - Licencia MIT
- ✅ `.gitignore` - Archivos a ignorar
- ✅ `package.sh` - Script de empaquetado
- ✅ `.github/workflows/release.yml` - CI/CD automático

## 6. Verificación

Después de subir:
1. Verificar que todos los archivos estén presentes
2. Probar la instalación desde el repositorio
3. Verificar que el README se vea correctamente
4. Confirmar que el release esté disponible

## 7. Próximos Pasos

- [ ] Configurar branch protection
- [ ] Crear issues template
- [ ] Configurar CODEOWNERS
- [ ] Agregar badges al README
- [ ] Crear documentación adicional

---

**¡Listo para subir a GitHub!** 🎉
