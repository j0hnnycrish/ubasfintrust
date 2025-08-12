#!/usr/bin/env bash
# Post-deploy smoke test wrapper calling system-check plus minimal latency probes.

set -euo pipefail
IFS=$'\n\t'
color(){ printf "\033[%sm%s\033[0m\n" "$1" "$2"; }
info(){ color 34 "[INFO] $*"; }
err(){ color 31 "[ERROR] $*" >&2; }
success(){ color 32 "[OK] $*"; }

BACKEND_URL=${BACKEND_URL:?Set BACKEND_URL (e.g. https://service.onrender.com)}
API_BASE=${API_BASE:-$BACKEND_URL/api/v1}
ATTEMPTS=${ATTEMPTS:-40}
SLEEP=${SLEEP:-5}

info "Waiting for readiness: $BACKEND_URL/health/readiness"
for ((i=1;i<=ATTEMPTS;i++)); do
  if curl -fsS "$BACKEND_URL/health/readiness" >/dev/null 2>&1; then
    success "Ready after $i attempts"
    break
  fi
  sleep $SLEEP
  [[ $i -eq $ATTEMPTS ]] && { err "Never became ready"; exit 1; }
  info "Attempt $i/$ATTEMPTS ..."
done

info "Latency probe set"
for path in "/health/liveness" "/health/readiness" "/api/v1/_diagnostics"; do
  START=$(date +%s%3N)
  code=$(curl -w '%{http_code}' -o /dev/null -fsS "$BACKEND_URL$path" || echo 000)
  END=$(date +%s%3N)
  ms=$((END-START))
  echo "$path -> $code (${ms}ms)"
done

info "Full system scenario (system-check)"
ADMIN_EMAIL=${ADMIN_EMAIL:?ADMIN_EMAIL required} \
ADMIN_PASSWORD=${ADMIN_PASSWORD:?ADMIN_PASSWORD required} \
DIAGNOSTICS_TOKEN=${DIAGNOSTICS_TOKEN:-diagtoken} \
API_BASE="$API_BASE" node scripts/system-check.mjs

success "Smoke tests passed"
