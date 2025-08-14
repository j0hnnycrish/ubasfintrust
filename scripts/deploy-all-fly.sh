#!/usr/bin/env bash
# Wrapper to deploy both backend and frontend to Fly.io using existing script.
set -euo pipefail
IFS=$'\n\t'

color(){ local c=$1; shift; printf "\033[%sm%s\033[0m\n" "$c" "$*"; }
info(){ color 34 "[INFO] $*"; }
err(){ color 31 "[ERROR] $*" >&2; }
success(){ color 32 "[OK] $*"; }

command -v flyctl >/dev/null || { err "flyctl not installed"; exit 1; }

ADMIN_EMAIL=${ADMIN_EMAIL:-admin@ubasfintrust.com}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-Strong#Password1}

info "Deploying to Fly.io"
ADMIN_EMAIL="$ADMIN_EMAIL" ADMIN_PASSWORD="$ADMIN_PASSWORD" bash "$(dirname "$0")/deploy-flyio.sh"

success "Fly.io full deployment done"
