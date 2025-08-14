#!/usr/bin/env bash
# Auto-configure domains in config files and produce ready-to-paste env blocks
set -euo pipefail
IFS=$'\n\t'

DOMAIN=${1:-ubasfintrust.com}
API_DOMAIN="api.$DOMAIN"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

update_file(){ local f="$1"; local from="$2"; local to="$3"; [[ -f "$f" ]] || return 0; sed -i "s|$from|$to|g" "$f"; }

# Update SPA configs
update_file "$REPO_ROOT/vercel.json" "api.example.com" "$API_DOMAIN"
update_file "$REPO_ROOT/netlify.toml" "api.example.com" "$API_DOMAIN"
update_file "$REPO_ROOT/.env.production" "api.example.com" "$API_DOMAIN"

cat <<EOF
# Use these values in your hosts:
# Server (API)
ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN
SOCKET_IO_CORS_ORIGIN=https://$DOMAIN

# Frontend (SPA)
VITE_API_URL=https://$API_DOMAIN/api/v1
VITE_SOCKET_URL=https://$API_DOMAIN
EOF
