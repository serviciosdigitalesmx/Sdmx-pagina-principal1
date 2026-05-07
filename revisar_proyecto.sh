#!/bin/bash

# Configuración de ruta
PROJECT_PATH="/Users/jesusvilla/Desktop/Sdmx-pagina-principal"

echo "========================================="
echo "  REVISIÓN DE ESTRUCTURA Y CONTRATOS     "
echo "========================================="
echo "Ruta: $PROJECT_PATH"

# 1. LS - Estructura de Directorios
echo -e "\n[+] ESTRUCTURA DEL PROYECTO (LS):"
ls -R "$PROJECT_PATH" | grep ":$" | sed -e 's/:$//' -e 's/[^-][^\/]*\//--/g' -e 's/^/   /'

# 2. GREP - Búsqueda de términos clave en contratos y config
echo -e "\n[+] BUSCANDO PALABRAS CLAVE (Contracts/Status/Env):"
grep -rEi "contract|status|process.env|config" "$PROJECT_PATH" \
    --exclude-dir={node_modules,.next,.git} \
    --color=always | head -n 20

# 3. RS - (Simulación vía awk/column para MacBook) 
# Dado que 'rs' no siempre está presente, usamos column para dar formato
echo -e "\n[+] RESUMEN DE ARCHIVOS PRINCIPALES (Formato Tabla):"
ls -lh "$PROJECT_PATH" | awk '{print $9, "\t", $5, "\t", $6, $7}' | column -t

# 4. CAT - Verificación de Variables de Entorno (Solo estructura)
if [ -f "$PROJECT_PATH/.env.example" ]; then
    echo -e "\n[+] ESTRUCTURA DE VARIABLES (cat .env.example):"
    cat "$PROJECT_PATH/.env.example"
else
    echo -e "\n[!] .env.example no encontrado."
fi

echo -e "\n========================================="
echo "          REVISIÓN FINALIZADA            "
echo "========================================="
