#!/usr/bin/env bash

set +e

echo
echo "======================================================"
echo " FIXI MASTER DIAGNOSTIC"
echo "======================================================"
echo

echo "===== SYSTEM ====="
echo "DATE:"
date
echo

echo "NODE:"
node -v 2>/dev/null
echo

echo "NPM:"
npm -v 2>/dev/null
echo

echo "PNPM:"
pnpm -v 2>/dev/null
echo

echo "RG:"
rg --version 2>/dev/null | head -1
echo

echo "======================================================"
echo " REPOSITORY"
echo "======================================================"
echo

git status --short
echo

echo "======================================================"
echo " AUTH ROUTES"
echo "======================================================"
echo

rg -n "register|google|exchange|session|tenantSlug" apps/api/src/routes apps/api/src/controllers 2>/dev/null

echo
echo "======================================================"
echo " CREATE USER"
echo "======================================================"
echo

rg -n "createUser|admin.createUser|signUp" apps/api/src 2>/dev/null

echo
echo "======================================================"
echo " TENANT CREATION"
echo "======================================================"
echo

rg -n "tenant|tenant_slug|tenant_id" apps/api/src/controllers/auth.controller.ts apps/api/src 2>/dev/null | head -200

echo
echo "======================================================"
echo " SUPABASE CLIENTS"
echo "======================================================"
echo

rg -n "SUPABASE_URL|SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY|createClient" apps/api/src packages 2>/dev/null

echo
echo "======================================================"
echo " AUTH BRIDGE"
echo "======================================================"
echo

rg -n "exchangeSupabaseSession|auth/bridge|bridge" apps 2>/dev/null

echo
echo "======================================================"
echo " GOOGLE AUTH"
echo "======================================================"
echo

rg -n "google|oauth|callback" apps/api/src apps/web-public apps/web-admin 2>/dev/null

echo
echo "======================================================"
echo " API HEALTH"
echo "======================================================"
echo

curl -s https://api.serviciosdigitalesmx.online/health
echo
echo

echo "======================================================"
echo " REGISTER TEST"
echo "======================================================"
echo

EMAIL="fixi$(date +%s)@test.com"
PHONE="82$(date +%s | tail -c 8)"

cat > /tmp/fixi-register.json <<JSON
{
  "workshopName":"Diagnostic Test",
  "email":"$EMAIL",
  "password":"Test123456!",
  "phone":"$PHONE"
}
JSON

echo "EMAIL:"
echo "$EMAIL"

echo
echo "PHONE:"
echo "$PHONE"

echo
echo "PAYLOAD:"
cat /tmp/fixi-register.json

echo
echo "REGISTER RESPONSE:"
curl -i \
-X POST \
https://api.serviciosdigitalesmx.online/api/auth/register \
-H "Content-Type: application/json" \
--data @/tmp/fixi-register.json

echo
echo
echo "======================================================"
echo " AUTH CONTROLLER"
echo "======================================================"
echo

sed -n '1,400p' apps/api/src/controllers/auth.controller.ts 2>/dev/null

echo
echo
echo "======================================================"
echo " DONE"
echo "======================================================"
