#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:4000}"
API_BASE_URL="${API_BASE_URL%/}"
CUSTOM_REQUEST_ID="t16-smoke-$(date +%s)"
TMP_DIR="$(mktemp -d)"

trap 'rm -rf "$TMP_DIR"' EXIT

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

safe_body_preview() {
  sed -E \
    -e 's/(Bearer )[A-Za-z0-9._~+\/=-]+/\1[redacted]/g' \
    -e 's/(authorization|cookie|password|secret|public_token|message_body|wa_me_url)[^,}[:space:]]*/\1[redacted]/Ig' \
    "$1" | sed -n '1,12p'
}

request_id_header() {
  grep -i '^x-request-id:' "$1" | sed -n '1s/^[^:]*:[[:space:]]*//p' | sed 's/\r$//' || true
}

contains_secret() {
  grep -Eiq 'SUPABASE_SERVICE_ROLE_KEY|SUPABASE_URL|authorization|cookie|password|secret|public_token|message_body|wa_me_url' "$1"
}

http_get() {
  local label="$1"
  local url="$2"
  local headers_file="$TMP_DIR/${label}.headers"
  local body_file="$TMP_DIR/${label}.body"
  shift 2

  local status
  if ! status="$(curl -sS -D "$headers_file" -o "$body_file" -w "%{http_code}" "$@" "$url")"; then
    echo "Endpoint: $url" >&2
    echo "HTTP status: curl_failed" >&2
    safe_body_preview "$body_file" >&2 || true
    exit 1
  fi

  printf '%s\n%s\n%s\n' "$status" "$headers_file" "$body_file"
}

assert_request_id_header() {
  local headers_file="$1"
  local endpoint="$2"
  local request_id
  request_id="$(request_id_header "$headers_file")"
  if [ -z "$request_id" ]; then
    echo "Endpoint: $endpoint" >&2
    echo "HTTP status: missing x-request-id" >&2
    fail "Missing x-request-id response header"
  fi
  echo "$request_id"
}

validate_superficial_health() {
  local endpoint="$1"
  local label
  label="$(echo "$endpoint" | sed 's#[^A-Za-z0-9]#_#g')"
  local result status headers body request_id
  result="$(http_get "$label" "${API_BASE_URL}${endpoint}")"
  status="$(echo "$result" | sed -n '1p')"
  headers="$(echo "$result" | sed -n '2p')"
  body="$(echo "$result" | sed -n '3p')"

  request_id="$(assert_request_id_header "$headers" "$endpoint")"

  if [ "$status" != "200" ]; then
    echo "Endpoint: $endpoint" >&2
    echo "HTTP status: $status" >&2
    echo "x-request-id: $request_id" >&2
    safe_body_preview "$body" >&2
    exit 1
  fi

  if ! grep -Eq '"status"|"service"|^\{' "$body"; then
    echo "Endpoint: $endpoint" >&2
    echo "HTTP status: $status" >&2
    echo "x-request-id: $request_id" >&2
    safe_body_preview "$body" >&2
    fail "Health body does not look like basic JSON"
  fi

  echo "OK $endpoint $status request_id=$request_id"
}

validate_dependency_health() {
  local endpoint="$1"
  local label
  label="$(echo "$endpoint" | sed 's#[^A-Za-z0-9]#_#g')"
  local result status headers body request_id
  result="$(http_get "$label" "${API_BASE_URL}${endpoint}")"
  status="$(echo "$result" | sed -n '1p')"
  headers="$(echo "$result" | sed -n '2p')"
  body="$(echo "$result" | sed -n '3p')"

  request_id="$(assert_request_id_header "$headers" "$endpoint")"

  if [ "$status" != "200" ] && [ "$status" != "503" ]; then
    echo "Endpoint: $endpoint" >&2
    echo "HTTP status: $status" >&2
    echo "x-request-id: $request_id" >&2
    safe_body_preview "$body" >&2
    exit 1
  fi

  if contains_secret "$body"; then
    echo "Endpoint: $endpoint" >&2
    echo "HTTP status: $status" >&2
    echo "x-request-id: $request_id" >&2
    safe_body_preview "$body" >&2
    fail "Dependency health body contains sensitive text"
  fi

  grep -q '"dependencies"' "$body" || fail "$endpoint missing dependencies"
  grep -q '"database"' "$body" || fail "$endpoint missing database"
  grep -q '"requestId"' "$body" || fail "$endpoint missing requestId"

  if [ "$status" = "503" ]; then
    echo "DEGRADED_OK $endpoint $status request_id=$request_id"
  else
    echo "OK $endpoint $status request_id=$request_id"
  fi
}

validate_custom_request_id() {
  local endpoint="/api/health/dependencies"
  local result status headers body request_id
  result="$(http_get "custom_request_id" "${API_BASE_URL}${endpoint}" -H "x-request-id: ${CUSTOM_REQUEST_ID}")"
  status="$(echo "$result" | sed -n '1p')"
  headers="$(echo "$result" | sed -n '2p')"
  body="$(echo "$result" | sed -n '3p')"
  request_id="$(assert_request_id_header "$headers" "$endpoint")"

  if [ "$status" != "200" ] && [ "$status" != "503" ]; then
    echo "Endpoint: $endpoint" >&2
    echo "HTTP status: $status" >&2
    echo "x-request-id: $request_id" >&2
    safe_body_preview "$body" >&2
    exit 1
  fi

  if [ "$request_id" != "$CUSTOM_REQUEST_ID" ]; then
    echo "WARN: server returned x-request-id '$request_id' instead of custom id"
  fi

  if grep -q '"requestId"' "$body" && ! grep -q "$request_id" "$body"; then
    echo "WARN: dependency health JSON requestId differs from response header"
  fi

  echo "OK custom x-request-id request_id=$request_id"
}

validate_optional_get() {
  local name="$1"
  local url="$2"
  local auth_token="${3:-}"
  local label
  label="$(echo "$name" | sed 's#[^A-Za-z0-9]#_#g')"

  local result
  if [ -n "$auth_token" ]; then
    result="$(http_get "$label" "$url" -H "Authorization: Bearer ${auth_token}")"
  else
    result="$(http_get "$label" "$url")"
  fi

  local status headers body request_id
  status="$(echo "$result" | sed -n '1p')"
  headers="$(echo "$result" | sed -n '2p')"
  body="$(echo "$result" | sed -n '3p')"
  request_id="$(request_id_header "$headers")"

  if [ -z "$request_id" ]; then
    echo "Endpoint: $name" >&2
    echo "HTTP status: $status" >&2
    safe_body_preview "$body" >&2
    fail "Missing x-request-id response header"
  fi

  if echo "$status" | grep -Eq '^5'; then
    echo "Endpoint: $name" >&2
    echo "HTTP status: $status" >&2
    echo "x-request-id: $request_id" >&2
    safe_body_preview "$body" >&2
    exit 1
  fi

  if contains_secret "$body"; then
    echo "Endpoint: $name" >&2
    echo "HTTP status: $status" >&2
    echo "x-request-id: $request_id" >&2
    safe_body_preview "$body" >&2
    fail "Optional flow body contains sensitive text"
  fi

  case "$status" in
    200|401|403|404) echo "OK optional $name $status request_id=$request_id" ;;
    *)
      echo "Endpoint: $name" >&2
      echo "HTTP status: $status" >&2
      echo "x-request-id: $request_id" >&2
      safe_body_preview "$body" >&2
      fail "Unexpected optional flow status"
      ;;
  esac
}

echo "T16 smoke API base: $API_BASE_URL"

validate_superficial_health "/health"
validate_superficial_health "/healthz"
validate_superficial_health "/api/health"
validate_dependency_health "/health/dependencies"
validate_dependency_health "/api/health/dependencies"
validate_custom_request_id

if [ -n "${T16_PRODUCTIVITY_URL:-}" ]; then
  validate_optional_get "T16_PRODUCTIVITY_URL" "$T16_PRODUCTIVITY_URL" "${T16_AUTH_TOKEN:-}"
fi

if [ -n "${T16_PUBLIC_PORTAL_URL:-}" ]; then
  validate_optional_get "T16_PUBLIC_PORTAL_URL" "$T16_PUBLIC_PORTAL_URL"
fi

if [ -n "${T16_PUBLIC_AUTHORIZATION_URL:-}" ]; then
  validate_optional_get "T16_PUBLIC_AUTHORIZATION_URL" "$T16_PUBLIC_AUTHORIZATION_URL"
fi

echo "T16 smoke OK"
