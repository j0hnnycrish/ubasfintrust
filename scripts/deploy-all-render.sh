#!/usr/bin/env bash
# Automated backend deploy to Render using RENDER_API_KEY, then SPA deploy to Netlify or Vercel via environment.
set -euo pipefail
IFS=$'\n\t'

color(){ local c=$1; shift; printf "\033[%sm%s\033[0m\n" "$c" "$*"; }
info(){ color 34 "[INFO] $*"; }
err(){ color 31 "[ERROR] $*" >&2; }
success(){ color 32 "[OK] $*"; }

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RENDER_API=${RENDER_API:-"https://api.render.com/v1"}
[[ -z "${RENDER_API_KEY:-}" ]] && { err "RENDER_API_KEY required"; exit 1; }

# Expect a pre-created Render service and environment. We can list, find, and trigger a deploy.
info "Fetching Render services"
SERVICES=$(curl -fsS -H "Authorization: Bearer $RENDER_API_KEY" "$RENDER_API/services") || { err "Failed to get services"; exit 1; }
BACKEND_ID=$(echo "$SERVICES" | jq -r '.[] | select(.serviceType=="web_service") | .id' | head -1)
[[ -z "$BACKEND_ID" ]] && { err "No Render web service found"; exit 1; }

info "Trigger backend deploy"
curl -fsS -X POST -H "Authorization: Bearer $RENDER_API_KEY" -H 'Content-Type: application/json' \
  -d '{}' "$RENDER_API/services/$BACKEND_ID/deploys" > /dev/null || { err "Failed to trigger"; exit 1; }

BACKEND_HOST=$(echo "$SERVICES" | jq -r ".[] | select(.id==\"$BACKEND_ID\") | .serviceDetails.url")
[[ -z "$BACKEND_HOST" ]] && { err "No backend host URL"; exit 1; }

info "Wait for readiness"
ATT=0; MAX=40; SLEEP=10
while (( ATT < MAX )); do
  curl -fsS "$BACKEND_HOST/health" >/dev/null 2>&1 && break
  ((ATT++)); sleep $SLEEP; info "Waiting ($ATT/$MAX) ..."
done
(( ATT == MAX )) && { err "Backend not ready"; exit 1; }
success "Backend ready: $BACKEND_HOST"

info "Run smoke tests"
BACKEND_URL="$BACKEND_HOST" API_BASE="$BACKEND_HOST/api/v1" ADMIN_EMAIL="${ADMIN_EMAIL:-admin@example.com}" ADMIN_PASSWORD="${ADMIN_PASSWORD:-Strong#Password1}" bash "$REPO_ROOT/scripts/post-deploy-smoke.sh"

success "Render backend deployment complete"
echo "Backend: $BACKEND_HOST"
