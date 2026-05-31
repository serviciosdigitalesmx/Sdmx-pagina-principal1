#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="/Users/jesusvilla/Desktop/Sdmx-pagina-principal"
ENV_FILE="$PROJECT_ROOT/apps/web-admin/.env.local"

cd "$PROJECT_ROOT"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ No existe $ENV_FILE"
  exit 1
fi

if [ ! -f ".vercel/project.json" ]; then
  echo "❌ No existe .vercel/project.json. Ejecuta: vercel link"
  exit 1
fi

echo "===== VERCEL PROJECT ====="
cat .vercel/project.json
echo

echo "===== VARIABLES A SINCRONIZAR DESDE apps/web-admin/.env.local ====="

KEYS=$(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "$ENV_FILE" \
  | cut -d '=' -f1 \
  | grep -E '^NEXT_PUBLIC_' \
  | sort -u)

echo "$KEYS"
echo

if [ -z "$KEYS" ]; then
  echo "❌ No encontré variables NEXT_PUBLIC_ en $ENV_FILE"
  exit 1
fi

for ENV in production preview development; do
  echo
  echo "=============================="
  echo "SYNC ENV: $ENV"
  echo "=============================="

  while IFS= read -r KEY; do
    [ -z "$KEY" ] && continue

    RAW_VALUE=$(grep -E "^${KEY}=" "$ENV_FILE" | tail -n 1 | sed "s/^${KEY}=//")

    VALUE=$(node -e "
      const raw = process.argv[1] ?? '';
      let v = raw.trim();
      if (
        (v.startsWith('\"') && v.endsWith('\"')) ||
        (v.startsWith(\"'\") && v.endsWith(\"'\"))
      ) v = v.slice(1, -1);
      process.stdout.write(v);
    " "$RAW_VALUE")

    if [ -z "$VALUE" ]; then
      echo "⚠️  Saltando $KEY porque está vacía"
      continue
    fi

    echo "→ Reset $KEY en $ENV"

    vercel env rm "$KEY" "$ENV" -y >/dev/null 2>&1 || true
    printf "%s" "$VALUE" | vercel env add "$KEY" "$ENV" >/dev/null
  done <<< "$KEYS"
done

echo
echo "✅ Variables sincronizadas."
echo "Ahora fuerza redeploy con commit vacío."

git commit --allow-empty -m "chore(vercel): refresh web-admin env vars"
git push

echo
echo "✅ Push listo. Vercel debe disparar deployment nuevo."
