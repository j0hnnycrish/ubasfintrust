#!/usr/bin/env bash
set -euo pipefail
WORKER_URL="https://ubasfintrust-api.jcrish4eva.workers.dev"

# Admin login
LOGIN=$(curl -s -X POST "$WORKER_URL/api/v1/auth/admin/login" \
  -H 'Content-Type: application/json' \
  -d '{"identifier":"admin@ubasfintrust.com","password":"Admin25@@"}')
TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d '"' -f4 || true)
if [ -z "${TOKEN:-}" ]; then
  echo "Admin login failed: $LOGIN"; exit 1
fi

echo "Admin login OK"
# Users profile
curl -s -H "Authorization: Bearer $TOKEN" "$WORKER_URL/api/v1/users/profile" | sed -e 's/.\{140\}/&\n/g' | head -n 1
# Notifications providers health
curl -s -H "Authorization: Bearer $TOKEN" "$WORKER_URL/api/v1/notifications/providers/health" | sed -e 's/.\{140\}/&\n/g' | head -n 1

echo "Smoke complete"