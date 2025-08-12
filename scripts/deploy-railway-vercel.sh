#!/usr/bin/env bash
# Automated deployment script: Backend -> Railway, Frontend -> Vercel, then system check.
# Make executable: chmod +x scripts/deploy-railway-vercel.sh
# Requires: railway CLI, vercel CLI, node, jq.
# Usage (example):
#   export ADMIN_EMAIL=admin@ubasfintrust.com ADMIN_PASSWORD='StrongPass#1' \
#          JWT_SECRET='...' JWT_REFRESH_SECRET='...' SESSION_SECRET='...' \
#          DIAGNOSTICS_TOKEN='diag123'; ./scripts/deploy-railway-vercel.sh

set -euo pipefail
IFS=$'\n\t'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

color() { local c=$1; shift; printf "\033[%sm%s\033[0m\n" "$c" "$*"; }
info(){ color 34 "[INFO] $*"; }
warn(){ color 33 "[WARN] $*"; }
err(){ color 31 "[ERROR] $*" >&2; }
success(){ color 32 "[OK] $*"; }

required_bins=(railway vercel node jq sed grep)
for b in "${required_bins[@]}"; do command -v "$b" >/dev/null 2>&1 || { err "Missing dependency: $b"; missing=1; }; done
if [[ ${missing:-0} -eq 1 ]]; then err "Install missing tools then re-run."; exit 1; fi

API_VERSION=${API_VERSION:-v1}

[[ -z "${ADMIN_EMAIL:-}" ]] && { err "ADMIN_EMAIL required"; exit 1; }
[[ -z "${ADMIN_PASSWORD:-}" ]] && { err "ADMIN_PASSWORD required"; exit 1; }
[[ -z "${JWT_SECRET:-}" ]] && { err "JWT_SECRET required"; exit 1; }
[[ -z "${JWT_REFRESH_SECRET:-}" ]] && { err "JWT_REFRESH_SECRET required"; exit 1; }
[[ -z "${SESSION_SECRET:-}" ]] && { err "SESSION_SECRET required"; exit 1; }

START_TIME=$(date +%s)
info "Starting deployment (Railway backend / Vercel frontend)"

# Backend Deploy
pushd "$REPO_ROOT/server" >/dev/null
if ! railway status >/dev/null 2>&1; then
  info "Initializing Railway project (if first time)."
  railway init -y || true
fi

info "Setting backend environment variables on Railway"
railway variables set \
  NODE_ENV=production \
  API_VERSION="$API_VERSION" \
  ADMIN_EMAIL="$ADMIN_EMAIL" \
  ADMIN_PASSWORD="$ADMIN_PASSWORD" \
  JWT_SECRET="$JWT_SECRET" \
  JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" \
  SESSION_SECRET="$SESSION_SECRET" \
  DIAGNOSTICS_TOKEN="${DIAGNOSTICS_TOKEN:-diagtoken}" \
  ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-https://ubasfintrust.com,https://www.ubasfintrust.com}" \
  SOCKET_IO_CORS_ORIGIN="${SOCKET_IO_CORS_ORIGIN:-https://ubasfintrust.com}" \
  UPLOAD_PATH="${UPLOAD_PATH:-/tmp/uploads}" \
  MAX_FILE_SIZE=5242880 \
  ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf || { err "Failed to set Railway vars"; exit 1; }

if [[ -z "${DATABASE_URL:-}" ]]; then
  info "Provision PostgreSQL plugin (if not already)"
  railway add plugin postgresql || true
fi
if [[ -z "${REDIS_URL:-}" ]]; then
  info "Provision Redis plugin (if not already)"
  railway add plugin redis || true
fi

info "Trigger backend deploy (build + migrations)"
railway up --detach || { err "Railway deploy failed"; exit 1; }

info "Waiting for backend readiness (health/readiness)"
ATTEMPTS=0; MAX_ATTEMPTS=40; SLEEP=5
while (( ATTEMPTS < MAX_ATTEMPTS )); do
  if curl -fsS "$BACKEND_URL/health/readiness" >/dev/null 2>&1; then
    success "Backend readiness probe passed"
    break
  fi
  ((ATTEMPTS++))
  sleep $SLEEP
done
if (( ATTEMPTS == MAX_ATTEMPTS )); then
  err "Backend did not become ready in time"; exit 1
fi

BACKEND_URL=$(railway url 2>/dev/null | sed -n '1p')
if [[ -z "$BACKEND_URL" ]]; then
  err "Could not determine backend URL via 'railway url'"
  exit 1
fi
success "Backend deployed: $BACKEND_URL"
BACKEND_API="$BACKEND_URL/api/$API_VERSION"
popd >/dev/null

# Frontend Deploy
pushd "$REPO_ROOT" >/dev/null
info "Building frontend locally"
npm install >/dev/null 2>&1
npm run build >/dev/null 2>&1 || { err "Frontend build failed"; exit 1; }

info "Deploying frontend to Vercel"
VITE_API_URL="$BACKEND_API" \
VITE_SOCKET_URL="$BACKEND_URL" \
VITE_APP_NAME="UBAS Financial Trust" \
VITE_NODE_ENV=production \
vercel deploy --prebuilt --prod --yes > /tmp/vercel_deploy.log 2>&1 || {
  warn "Prebuilt deploy failed, attempting source deploy"; \
  vercel --prod --yes > /tmp/vercel_deploy.log 2>&1 || { err "Vercel deploy failed"; exit 1; }; }

FRONTEND_URL=$(grep -Eo 'https://[^ ]+\.vercel\.app' /tmp/vercel_deploy.log | tail -1 || true)
if [[ -z "$FRONTEND_URL" ]]; then
  warn "Could not parse frontend URL from Vercel output; see /tmp/vercel_deploy.log"
else
  success "Frontend deployed: $FRONTEND_URL"
fi
popd >/dev/null

# System Integration Test
info "Running system-check against deployed backend"
pushd "$REPO_ROOT" >/dev/null
API_BASE="$BACKEND_API" \
ADMIN_EMAIL="$ADMIN_EMAIL" \
ADMIN_PASSWORD="$ADMIN_PASSWORD" \
DIAGNOSTICS_TOKEN="${DIAGNOSTICS_TOKEN:-diagtoken}" \
node scripts/system-check.mjs || { err "System check failed"; exit 1; }
popd >/dev/null

END_TIME=$(date +%s)
ELAPSED=$((END_TIME-START_TIME))
success "Deployment + validation complete in ${ELAPSED}s"
echo "Backend: $BACKEND_URL"
echo "Frontend: ${FRONTEND_URL:-<check log>}"
echo "API Base: $BACKEND_API"
echo "Next: Map custom domains & update ALLOWED_ORIGINS if needed."
