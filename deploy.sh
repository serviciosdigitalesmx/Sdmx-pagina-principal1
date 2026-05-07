#!/bin/bash
set -e
echo "📦 Subiendo cambios a GitHub..."
git add .
git commit -m "Deploy automático: $(date '+%Y-%m-%d %H:%M')" || echo "No hay cambios nuevos"
git push origin main
echo "✅ Código en GitHub. Vercel y Render ya están desplegando."
