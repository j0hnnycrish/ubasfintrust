#!/usr/bin/env bash
# Guided deploy: Railway backend + Vercel frontend + smoke tests
set -euo pipefail
IFS=$'\n\t'

color(){ local c=$1; shift; printf "\033[%sm%s\033[0m\n" "$c" "$*"; }
info(){ color 34 "[INFO] $*"; }
err(){ color 31 "[ERROR] $*" >&2; }
success(){ color 32 "[OK] $*"; }

required_bins=(railway vercel node jq curl sed)
for b in "${required_bins[@]}"; do command -v "$b" >/dev/null 2>&1 || { err "Missing dependency: $b"; missing=1; }; done
if [[ ${missing:-0} -eq 1 ]]; then err "Install missing tools (railway, vercel, node, jq, curl) and re-run"; exit 1; fi

DOMAIN=${DOMAIN:-ubasfintrust.com}
API_VERSION=${API_VERSION:-v1}
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

info "Generating secrets (use scripts/gen-secrets.sh to generate your own)"
[[ -z "${JWT_SECRET:-}" ]] && JWT_SECRET=$(openssl rand -base64 48)
[[ -z "${JWT_REFRESH_SECRET:-}" ]] && JWT_REFRESH_SECRET=$(openssl rand -base64 48)
[[ -z "${SESSION_SECRET:-}" ]] && SESSION_SECRET=$(openssl rand -base64 48)

ALLOWED_ORIGINS=${ALLOWED_ORIGINS:-"https://$DOMAIN,https://www.$DOMAIN"}
SOCKET_IO_CORS_ORIGIN=${SOCKET_IO_CORS_ORIGIN:-"https://$DOMAIN"}

pushd "$REPO_ROOT/server" >/dev/null
info "Setting Railway variables"
railway variables set \
  NODE_ENV=production \
  API_VERSION="$API_VERSION" \
  JWT_SECRET="$JWT_SECRET" \
  JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" \
  SESSION_SECRET="$SESSION_SECRET" \
  ALLOWED_ORIGINS="$ALLOWED_ORIGINS" \
  SOCKET_IO_CORS_ORIGIN="$SOCKET_IO_CORS_ORIGIN" \
  ADMIN_EMAIL="${ADMIN_EMAIL:-admin@$DOMAIN}" \
  ADMIN_PASSWORD="${ADMIN_PASSWORD:-Strong#Password1}" || { err "Failed to set Railway vars"; exit 1; }

info "Ensuring DB/Redis plugins (optional if you set your own URLs)"
railway add plugin postgresql || true
railway add plugin redis || true

info "Deploying backend"
railway up --detach || { err "Railway deploy failed"; exit 1; }
BACKEND_URL=$(railway url 2>/dev/null | sed -n '1p')
[[ -z "$BACKEND_URL" ]] && { err "Couldn't get backend URL"; exit 1; }
success "Backend: $BACKEND_URL"

info "Waiting for readiness"
for ((i=1;i<=40;i++)); do curl -fsS "$BACKEND_URL/health" >/dev/null && break; sleep 5; done

popd >/dev/null

pushd "$REPO_ROOT" >/dev/null
info "Building SPA"
npm ci >/dev/null 2>&1 || npm install >/dev/null 2>&1
npm run build || { err "SPA build failed"; exit 1; }

info "Deploying SPA to Vercel"
VITE_API_URL="$BACKEND_URL/api/$API_VERSION" \
VITE_SOCKET_URL="$BACKEND_URL" \
VITE_APP_NAME="UBAS Financial Trust" \
VITE_NODE_ENV=production \
vercel deploy --prebuilt --prod --yes > /tmp/vercel_deploy.log 2>&1 || vercel --prod --yes > /tmp/vercel_deploy.log 2>&1 || { err "Vercel deploy failed"; exit 1; }
FRONTEND_URL=$(grep -Eo 'https://[^ ]+\.vercel\.app' /tmp/vercel_deploy.log | tail -1 || true)
success "Frontend: ${FRONTEND_URL:-<check log>}"

info "Running smoke tests"
BACKEND_URL="$BACKEND_URL" API_BASE="$BACKEND_URL/api/$API_VERSION" ADMIN_EMAIL="${ADMIN_EMAIL:-admin@$DOMAIN}" ADMIN_PASSWORD="${ADMIN_PASSWORD:-Strong#Password1}" bash scripts/post-deploy-smoke.sh

success "Done. Map custom domains next." 
*** End Patch
