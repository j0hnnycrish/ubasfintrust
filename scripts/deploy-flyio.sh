#!/usr/bin/env bash
# Deploy combined app to Fly.io using separate processes (backend + static frontend) via two apps or one multi-process image.
# Strategy here: deploy backend (Node) as one Fly app, and (optionally) deploy frontend static via Nginx Dockerfile.production as another app.
# Prereqs: flyctl logged in. fly.toml templates will be generated if absent.

set -euo pipefail
IFS=$'\n\t'
color(){ printf "\033[%sm%s\033[0m\n" "$1" "$2"; }
info(){ color 34 "[INFO] $*"; }
err(){ color 31 "[ERROR] $*" >&2; }
success(){ color 32 "[OK] $*"; }

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_APP=${FLY_BACKEND_APP:-ubasfintrust-backend}
FRONTEND_APP=${FLY_FRONTEND_APP:-ubasfintrust-frontend}
REGION=${FLY_REGION:-iad}

command -v flyctl >/dev/null || { err "flyctl not installed"; exit 1; }

# Backend fly.toml
if [[ ! -f "$REPO_ROOT/server/fly.toml" ]]; then
cat > "$REPO_ROOT/server/fly.toml" <<EOF
app = "$BACKEND_APP"
primary_region = "$REGION"
[build]
  dockerfile = "Dockerfile"
[env]
  PORT = "5000"
[http_service]
  internal_port = 5000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]
[[vm]]
  size = "shared-cpu-1x"
EOF
fi

# Frontend fly.toml
if [[ ! -f "$REPO_ROOT/fly.toml" ]]; then
cat > "$REPO_ROOT/fly.toml" <<EOF
app = "$FRONTEND_APP"
primary_region = "$REGION"
[build]
  dockerfile = "Dockerfile.production"
[http_service]
  internal_port = 80
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]
[[vm]]
  size = "shared-cpu-1x"
EOF
fi

# Deploy backend
pushd "$REPO_ROOT/server" >/dev/null
info "Deploying backend ($BACKEND_APP)"
flyctl deploy --remote-only --build-arg NODE_ENV=production || { err "Backend deploy failed"; exit 1; }
BACKEND_URL=$(flyctl status --app "$BACKEND_APP" --json | jq -r '.app.url' || true)
[[ -z "$BACKEND_URL" ]] && err "Could not fetch backend URL" && exit 1
success "Backend deployed: $BACKEND_URL"
popd >/dev/null

# Deploy frontend with API URL baked
pushd "$REPO_ROOT" >/dev/null
API_BASE="$BACKEND_URL/api/v1"
info "Deploying frontend ($FRONTEND_APP) with VITE_API_URL=$API_BASE"
flyctl deploy --remote-only --build-arg VITE_API_URL="$API_BASE" --build-arg VITE_APP_NAME="UBAS Financial Trust" || { err "Frontend deploy failed"; exit 1; }
FRONTEND_URL=$(flyctl status --app "$FRONTEND_APP" --json | jq -r '.app.url' || true)
[[ -z "$FRONTEND_URL" ]] && err "Could not fetch frontend URL" && exit 1
success "Frontend deployed: $FRONTEND_URL"
popd >/dev/null

info "Readiness probe for backend"
ATT=0; MAX=40; SLEEP=5
while (( ATT < MAX )); do
  if curl -fsS "$BACKEND_URL/health/readiness" >/dev/null 2>&1; then
    success "Backend readiness OK"
    break
  fi
  ((ATT++)); sleep $SLEEP
  info "Waiting ($ATT/$MAX) ..."
done
(( ATT == MAX )) && { err "Backend never ready"; exit 1; }

info "Running system-check script against backend"
pushd "$REPO_ROOT" >/dev/null
ADMIN_EMAIL=${ADMIN_EMAIL:?ADMIN_EMAIL required} \
ADMIN_PASSWORD=${ADMIN_PASSWORD:?ADMIN_PASSWORD required} \
DIAGNOSTICS_TOKEN=${DIAGNOSTICS_TOKEN:-diagtoken} \
API_BASE="$API_BASE" node scripts/system-check.mjs || { err "System check failed"; exit 1; }
popd >/dev/null

success "Fly.io deployment complete"
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo "API Base: $API_BASE"
