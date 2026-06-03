#!/usr/bin/env bash

echo
echo "======================================================"
echo " FIXI GOD DIAGNOSTIC"
echo "======================================================"
echo

echo "===== SYSTEM ====="
echo "NODE:"
node -v 2>/dev/null

echo
echo "NPM:"
npm -v 2>/dev/null

echo
echo "PNPM:"
pnpm -v 2>/dev/null

echo
echo "===== GIT STATUS ====="
git status --short

echo
echo "===== ENV FILES ====="
find . -name ".env*" -type f

echo
echo "===== AUTH ROUTES ====="
grep -R "router.post('/register" apps/api/src 2>/dev/null
grep -R "router.post('/exchange" apps/api/src 2>/dev/null
grep -R "router.get('/google" apps/api/src 2>/dev/null

echo
echo "===== API HEALTH ====="
curl -s https://api.serviciosdigitalesmx.online/health
echo

echo
echo "===== REGISTER CONTROLLER ====="
sed -n '100,250p' apps/api/src/controllers/auth.controller.ts

echo
echo "===== EXCHANGE CONTROLLER ====="
sed -n '300,460p' apps/api/src/controllers/auth.controller.ts

echo
echo "===== ADMIN BRIDGE ====="
grep -R "auth/bridge" apps/web-admin apps/web-public 2>/dev/null

echo
echo "===== GOOGLE AUTH ====="
grep -R "google" apps/web-admin apps/web-public apps/api/src 2>/dev/null

echo
echo "===== NEXT_PUBLIC_API_URL ====="
grep -R "NEXT_PUBLIC_API_URL" apps packages 2>/dev/null

echo
echo "===== NEXT_PUBLIC_API_BASE_URL ====="
grep -R "NEXT_PUBLIC_API_BASE_URL" apps packages 2>/dev/null

echo
echo "===== API CLIENTS ====="
grep -R "fetchJson" apps packages 2>/dev/null

echo
echo "===== AUTH TOKEN STORAGE ====="
grep -R "token" apps/web-admin/src apps/web-public/src apps/web-clientes/src 2>/dev/null | head -200

echo
echo "===== TENANT SLUG ====="
grep -R "tenant_slug" apps/api/src apps/web-admin/src apps/web-public/src apps/web-clientes/src 2>/dev/null

echo
echo "===== TENANT ID ====="
grep -R "tenant_id" apps/api/src apps/web-admin/src apps/web-public/src apps/web-clientes/src 2>/dev/null

echo
echo "===== SCOPE ====="
grep -R "req.scope" apps/api/src 2>/dev/null

echo
echo "===== VALIDATE TENANT ====="
grep -R "validateTenant" apps/api/src 2>/dev/null

echo
echo "===== REQUIRE AUTH ====="
grep -R "requireAuth" apps/api/src 2>/dev/null

echo
echo "===== REGISTER TEST ====="

EMAIL="fixi$(date +%s)@test.com"
PHONE="81$(date +%s | tail -c 9)"

cat > /tmp/fixi-register.json <<JSON
{
  "workshopName":"Diagnostic Test",
  "email":"$EMAIL",
  "password":"Test123456!",
  "phone":"$PHONE"
}
JSON

echo
echo "EMAIL:"
echo "$EMAIL"

echo
echo "PHONE:"
echo "$PHONE"

echo
echo "REGISTER RESPONSE:"
curl -i \
-X POST \
https://api.serviciosdigitalesmx.online/api/auth/register \
-H "Content-Type: application/json" \
--data @/tmp/fixi-register.json

echo
echo
echo "===== ONBOARDING SUCCESS ====="
sed -n '1,250p' apps/web-public/src/app/onboarding/success/redirect-to-admin.tsx 2>/dev/null

echo
echo
echo "===== WEB LOGIN ====="
sed -n '1,250p' apps/web-public/src/app/login/page.tsx 2>/dev/null

echo
echo
echo "===== ADMIN LOGIN ====="
sed -n '1,250p' apps/web-admin/src/app/login/page.tsx 2>/dev/null

echo
echo
echo "===== ROOT AUTH REDIRECT ====="
sed -n '1,250p' apps/web-public/src/components/root-auth-hash-redirect.tsx 2>/dev/null

echo
echo
echo "======================================================"
echo " END DIAGNOSTIC"
echo "======================================================"

