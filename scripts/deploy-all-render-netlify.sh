#!/usr/bin/env bash
# Guided deploy: Render backend + Netlify frontend + smoke tests
set -euo pipefail
IFS=$'\n\t'

color(){ local c=$1; shift; printf "\033[%sm%s\033[0m\n" "$c" "$*"; }
info(){ color 34 "[INFO] $*"; }
err(){ color 31 "[ERROR] $*" >&2; }
success(){ color 32 "[OK] $*"; }

required_bins=(curl jq netlify)
for b in "${required_bins[@]}"; do command -v "$b" >/dev/null 2>&1 || { err "Missing dependency: $b"; missing=1; }; done
if [[ ${missing:-0} -eq 1 ]]; then err "Install missing tools (netlify, curl, jq) and re-run"; exit 1; fi

DOMAIN=${DOMAIN:-ubasfintrust.com}
API_VERSION=${API_VERSION:-v1}
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

info "Build SPA"
pushd "$REPO_ROOT" >/dev/null
npm ci >/dev/null 2>&1 || npm install >/dev/null 2>&1
npm run build || { err "Build failed"; exit 1; }

info "Set Netlify env"
netlify env:set VITE_API_URL "${API_BASE:-https://api.$DOMAIN/api/$API_VERSION}"
netlify env:set VITE_SOCKET_URL "${SOCKET_URL:-https://api.$DOMAIN}"

info "Deploy SPA to Netlify"
netlify deploy --prod --dir=dist || { err "Netlify deploy failed"; exit 1; }

success "Frontend deployed. Next: ensure your Render API is live and CORS allows https://$DOMAIN."
*** End Patch
