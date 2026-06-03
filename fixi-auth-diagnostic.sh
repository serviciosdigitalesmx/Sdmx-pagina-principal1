#!/usr/bin/env bash

set -e

API_URL="https://api.serviciosdigitalesmx.online"

echo
echo "========================================"
echo " FIXI AUTH DIAGNOSTIC"
echo "========================================"
echo

echo "1) API HEALTH"
echo "----------------------------------------"
curl -s "${API_URL}/health" || true
echo
echo

echo "2) REGISTER ENDPOINT TEST"
echo "----------------------------------------"
curl -i -X POST "${API_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "workshopName":"Diagnostic Test",
    "email":"diagnostic-test@example.com",
    "password":"Test123456!",
    "phone":"8111111111"
  }' || true

echo
echo

echo "3) SEARCH REGISTER FLOW"
echo "----------------------------------------"
rg -n "register" apps/api/src 2>/dev/null || true

echo
echo

echo "4) SEARCH CREATE USER"
echo "----------------------------------------"
rg -n "createUser" apps/api/src packages 2>/dev/null || true

echo
echo

echo "5) SEARCH AUTH EXCHANGE"
echo "----------------------------------------"
rg -n "exchange" apps/api/src 2>/dev/null || true

echo
echo

echo "6) SEARCH SUPABASE CLIENTS"
echo "----------------------------------------"
rg -n "createClient" packages/database apps/api 2>/dev/null || true

echo
echo

echo "7) SEARCH SERVICE ROLE"
echo "----------------------------------------"
rg -n "SUPABASE_SERVICE_ROLE_KEY" . 2>/dev/null || true

echo
echo

echo "8) SEARCH SUPABASE URL"
echo "----------------------------------------"
rg -n "SUPABASE_URL" . 2>/dev/null || true

echo
echo

echo "9) SEARCH AUTH BRIDGE"
echo "----------------------------------------"
rg -n "auth/bridge" apps 2>/dev/null || true

echo
echo

echo "10) SEARCH GOOGLE CALLBACK"
echo "----------------------------------------"
rg -n "google|callback" apps/web-public apps/web-admin 2>/dev/null || true

echo
echo

echo "11) SEARCH TENANT FLOW"
echo "----------------------------------------"
rg -n "tenant_slug|tenant_id|req.scope" apps/api/src 2>/dev/null || true

echo
echo
echo "========================================"
echo " DONE"
echo "========================================"
