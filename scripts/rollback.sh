#!/usr/bin/env bash
# Rollback helper for Railway, Vercel, Fly.io (best-effort generic approach)
# NOTE: Each platform has its own native rollback; this script wraps common CLI invocations.

set -euo pipefail
IFS=$'\n\t'
color(){ printf "\033[%sm%s\033[0m\n" "$1" "$2"; }
info(){ color 34 "[INFO] $*"; }
err(){ color 31 "[ERROR] $*" >&2; }
success(){ color 32 "[OK] $*"; }

ACTION=${1:-list}

case "$ACTION" in
  list)
    info "List recent deploys"
    command -v railway >/dev/null && railway deployments || true
    command -v vercel >/dev/null && vercel ls || true
    command -v flyctl >/dev/null && flyctl releases || true
    ;;
  railway)
    ID=${2:-}
    [[ -z "$ID" ]] && { err "Usage: rollback.sh railway <deployment-id>"; exit 1; }
    railway rollback "$ID"
    ;;
  vercel)
    URL=${2:-}
    [[ -z "$URL" ]] && { err "Usage: rollback.sh vercel <previous-alias-or-url>"; exit 1; }
    vercel alias "$URL" production
    ;;
  fly)
    APP=${2:?App name required}
    VERSION=${3:?Version required}
    flyctl releases --app "$APP" | grep "$VERSION" || { err "Version not found in releases"; exit 1; }
    flyctl deploy --image "registry.fly.io/$APP:$VERSION" --app "$APP"
    ;;
  *)
    err "Unknown action: $ACTION"
    exit 1
    ;;
esac
success "Done"
