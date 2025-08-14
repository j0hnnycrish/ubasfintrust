#!/usr/bin/env bash
set -euo pipefail

rand_b64(){ openssl rand -base64 48 | tr -d '\n'; }
rand_hex32(){ head -c 32 /dev/urandom | xxd -p -c 256 | tr -d '\n'; }

echo "# Export these in your shell to use them in deploy scripts"
echo "export JWT_SECRET='$(rand_b64)'"
echo "export JWT_REFRESH_SECRET='$(rand_b64)'"
echo "export SESSION_SECRET='$(rand_b64)'"
echo "export ENCRYPTION_KEY='$(rand_hex32)'"
