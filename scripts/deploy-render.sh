#!/usr/bin/env bash
# Deploy backend (Node) + frontend (static) to Render using render.yaml
# Prereqs: render.yaml configured, render CLI (if available) OR manual git push to Render-connected repo.
# This script provides helper API calls if RENDER_API_KEY is set.

set -euo pipefail
IFS=$'\n\t'

color() { local c=$1; shift; printf "\033[%sm%s\033[0m\n" "$c" "$*"; }
info(){ color 34 "[INFO] $*"; }
err(){ color 31 "[ERROR] $*" >&2; }
success(){ color 32 "[OK] $*"; }

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RENDER_API="https://api.render.com/v1"

if [[ -z "${RENDER_API_KEY:-}" ]]; then
  info "RENDER_API_KEY not set—fall back to git push workflow. Ensure your GitHub repo is linked to Render."
  exit 0
fi

# Simple example: list services and trigger deploys
info "Listing services"
SERVICES_JSON=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" "$RENDER_API/services")
if [[ -z "$SERVICES_JSON" ]]; then err "Failed to fetch services"; exit 1; fi

BACKEND_ID=$(echo "$SERVICES_JSON" | jq -r '.[] | select(.serviceType=="web_service" and (.name|test("backend";"i"))) | .id' | head -1 || true)
FRONTEND_ID=$(echo "$SERVICES_JSON" | jq -r '.[] | select(.serviceType=="static_site" and (.name|test("front|site";"i"))) | .id' | head -1 || true)

[[ -z "$BACKEND_ID" ]] && err "Could not find backend service (name should contain 'backend')" && exit 1
[[ -z "$FRONTEND_ID" ]] && err "Could not find frontend static service (name should contain 'front' or 'site')" && exit 1

for ID in "$BACKEND_ID" "$FRONTEND_ID"; do
  info "Triggering deploy for service $ID"
  curl -s -X POST -H "Authorization: Bearer $RENDER_API_KEY" -H 'Content-Type: application/json' \
    -d '{}' "$RENDER_API/services/$ID/deploys" >/dev/null || err "Failed to trigger deploy for $ID"
  sleep 2
done

info "Polling backend readiness"
ATTEMPTS=0; MAX=40; SLEEP=10
BACKEND_HOST=$(echo "$SERVICES_JSON" | jq -r ".[] | select(.id==\"$BACKEND_ID\") | .serviceDetails.url")
while (( ATTEMPTS < MAX )); do
  if curl -fsS "$BACKEND_HOST/health/readiness" >/dev/null 2>&1; then
    success "Backend ready: $BACKEND_HOST"
    break
  fi
  ((ATTEMPTS++))
  sleep $SLEEP
  info "Waiting ($ATTEMPTS/$MAX) ..."
endone
if (( ATTEMPTS == MAX )); then err "Backend not ready in time"; exit 1; fi

success "Render deploys triggered & backend healthy"
echo "Backend URL: $BACKEND_HOST"
