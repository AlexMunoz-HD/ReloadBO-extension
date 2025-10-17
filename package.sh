#!/bin/bash

# Script para empaquetar la extensión ReloadBO
# Uso: ./package.sh

echo "🚀 Empaquetando ReloadBO Chrome Extension..."

# Crear directorio de distribución
mkdir -p dist

# Copiar archivos necesarios
cp manifest.json dist/
cp popup.html dist/
cp popup.js dist/
cp icon16.png dist/
cp icon48.png dist/
cp icon128.png dist/

# Crear archivo ZIP
cd dist
zip -r ../reloadbo-v1.0.0.zip .
cd ..

echo "✅ Empaquetado completado!"
echo "📦 Archivo creado: reloadbo-v1.0.0.zip"
echo ""
echo "Para instalar:"
echo "1. Extrae el ZIP"
echo "2. Ve a chrome://extensions/"
echo "3. Activa 'Modo de desarrollador'"
echo "4. Haz clic en 'Cargar extensión sin empaquetar'"
echo "5. Selecciona la carpeta extraída"
echo ""
echo "Para crear .crx:"
echo "1. Ve a chrome://extensions/"
echo "2. Haz clic en 'Empaquetar extensión'"
echo "3. Selecciona la carpeta dist/"
echo "4. Genera el archivo .crx"
