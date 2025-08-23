#!/usr/bin/env bash
set -euo pipefail
WORKER_URL="${WORKER_URL:-https://ubasfintrust-api.jcrish4eva.workers.dev}"
EMAIL="${USER_EMAIL:-testuser@example.com}"
PASSWORD="${USER_PASSWORD:-TestPassword123!}"

# Try login; if not found, register then login
LOGIN=$(curl -s -X POST "$WORKER_URL/api/v1/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"identifier":"'"$EMAIL"'","password":"'"$PASSWORD"'"}')
if echo "$LOGIN" | grep -q 'User not found'; then
  echo "Registering user $EMAIL"
  REG=$(curl -s -X POST "$WORKER_URL/api/v1/auth/register" \
    -H 'Content-Type: application/json' \
    -d '{"email":"'"$EMAIL"'","password":"'"$PASSWORD"'","first_name":"Test","last_name":"User"}')
  echo "$REG" | head -c 140; echo
  LOGIN=$(curl -s -X POST "$WORKER_URL/api/v1/auth/login" \
    -H 'Content-Type: application/json' \
    -d '{"identifier":"'"$EMAIL"'","password":"'"$PASSWORD"'"}')
fi

TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d '"' -f4 || true)
if [ -z "${TOKEN:-}" ]; then
  echo "User login failed: $LOGIN"; exit 1
fi

echo "User login OK"
# Validate profile
curl -s -H "Authorization: Bearer $TOKEN" "$WORKER_URL/api/v1/users/profile" | sed -e 's/.\{160\}/&\n/g' | head -n 1
# Validate accounts
curl -s -H "Authorization: Bearer $TOKEN" "$WORKER_URL/api/v1/users/accounts" | sed -e 's/.\{160\}/&\n/g' | head -n 1
# Transactions
curl -s -H "Authorization: Bearer $TOKEN" "$WORKER_URL/api/v1/users/transactions?page=1&limit=5" | sed -e 's/.\{160\}/&\n/g' | head -n 1

echo "User smoke complete"