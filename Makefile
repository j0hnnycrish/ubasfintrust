SHELL := /usr/bin/env bash

# UBAS Financial Trust — Make shortcuts
# Usage examples:
#   make deploy-railway               # Backend (Railway) + Frontend (Vercel)
#   make deploy-render                # Backend (Render API key) + Frontend (Netlify)
#   make deploy-fly                   # Backend+Frontend on Fly.io
#   make gen-secrets                  # Print export lines for strong secrets
#   make auto-config DOMAIN=example.com
#   make smoke BACKEND_URL=https://api.example.com API_BASE=https://api.example.com/api/v1 \
#              ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='Strong#Password1'

.PHONY: help deploy-railway deploy-render deploy-render-backend deploy-netlify-frontend deploy-fly \
	vercel netlify cpanel gen-secrets auto-config smoke \
	install-cli install-cli-prefix install-cli-vercel install-cli-netlify install-cli-railway install-cli-fly install-cli-helpers

help:
	@echo "Targets:"
	@echo "  deploy-railway           - Railway backend + Vercel frontend (one-command)"
	@echo "  deploy-render            - Render backend (API key) + Netlify frontend"
	@echo "  deploy-render-backend    - Render backend only (API key required)"
	@echo "  deploy-netlify-frontend  - Netlify SPA deploy only"
	@echo "  deploy-fly               - Fly.io backend+frontend"
	@echo "  vercel                   - Vercel SPA deploy only"
	@echo "  netlify                  - Netlify SPA deploy only"
	@echo "  cpanel                   - Build + package SPA for cPanel"
	@echo "  gen-secrets              - Generate strong secrets (export lines)"
	@echo "  auto-config              - Update configs for DOMAIN (make auto-config DOMAIN=ubasfintrust.com)"
	@echo "  smoke                    - Post-deploy smoke tests (requires BACKEND_URL, API_BASE, ADMIN_*)"
	@echo "  dev-db-up                - Start local Postgres & Redis via docker-compose"
	@echo "  dev-db-down              - Stop local Postgres & Redis"
	@echo "  dev-api                  - Build server, ensure .env, run migrations, and start API"
	@echo "  install-cli              - Install Railway, Vercel, Netlify, Fly.io CLIs locally (no sudo)"
	@echo "  install-cli-vercel       - Install Vercel CLI (local npm prefix)"
	@echo "  install-cli-netlify      - Install Netlify CLI (local npm prefix)"
	@echo "  install-cli-railway      - Install Railway CLI"
	@echo "  install-cli-fly          - Install Fly.io CLI"
	@echo "  install-cli-helpers      - Install helper tools (jq)"

# --- One-command deploys ---

deploy-railway:
	@bash ./scripts/deploy-all.sh

deploy-render:
	@bash ./scripts/deploy-all-render.sh
	@bash ./scripts/deploy-all-render-netlify.sh

deploy-render-backend:
	@bash ./scripts/deploy-all-render.sh

deploy-netlify-frontend:
	@bash ./scripts/deploy-all-render-netlify.sh

deploy-fly:
	@bash ./scripts/deploy-all-fly.sh

# --- Frontend-only helpers ---

vercel:
	@bash ./scripts/deploy-vercel.sh

netlify:
	@bash ./scripts/deploy-netlify.sh

cpanel:
	@bash ./scripts/deploy-cpanel.sh

# --- Utilities ---

gen-secrets:
	@bash ./scripts/gen-secrets.sh

DOMAIN ?= ubasfintrust.com
auto-config:
	@bash ./scripts/auto-config.sh $(DOMAIN)

smoke:
	@test -n "$(BACKEND_URL)" || (echo "BACKEND_URL required" && exit 1)
	@BACKEND_URL="$(BACKEND_URL)" API_BASE="$(or $(API_BASE),$(BACKEND_URL)/api/v1)" \
	  ADMIN_EMAIL="$(or $(ADMIN_EMAIL),admin@$(DOMAIN))" \
	  ADMIN_PASSWORD="$(or $(ADMIN_PASSWORD),Strong#Password1)" \
	  bash ./scripts/post-deploy-smoke.sh

# --- Local development helpers ---

dev-db-up:
	@cd server && npm run db:up

dev-db-down:
	@cd server && npm run db:down

dev-api:
	@cd server && npm install && npm run build && npm run env:init && ENABLE_REDIS=false npm run migrate && ENABLE_REDIS=false npm run start

# --- CLI installers (no sudo, safe local prefixes) ---

install-cli: install-cli-prefix install-cli-railway install-cli-vercel install-cli-netlify install-cli-fly install-cli-helpers
	@echo "\n[OK] CLIs installed. If commands not found, run: export PATH=\"$$HOME/.npm-global/bin:$$HOME/.railway/bin:$$PATH\" and ensure Fly's bin in PATH."

install-cli-prefix:
	@mkdir -p "$$HOME/.npm-global"
	@npm config set prefix "$$HOME/.npm-global" >/dev/null
	@echo "Local npm prefix set to $$HOME/.npm-global"
	@echo "Add to your shell rc: export PATH=\"$$HOME/.npm-global/bin:$$PATH\""
	@echo "Or run now in this shell: export PATH=\"$$HOME/.npm-global/bin:$$PATH\""

install-cli-vercel:
	@PATH="$$HOME/.npm-global/bin:$$PATH" npm install -g vercel
	@echo "Vercel CLI installed. Ensure PATH includes $$HOME/.npm-global/bin"

install-cli-netlify:
	@PATH="$$HOME/.npm-global/bin:$$PATH" npm install -g netlify-cli
	@echo "Netlify CLI installed. Ensure PATH includes $$HOME/.npm-global/bin"

install-cli-helpers:
	@PATH="$$HOME/.npm-global/bin:$$PATH" npm install -g jq
	@echo "jq installed (via npm)."

install-cli-railway:
	@curl -fsSL https://railway.app/install.sh | sh
	@echo "Railway CLI installed to $$HOME/.railway/bin. Add to PATH: export PATH=\"$$HOME/.railway/bin:$$PATH\""

install-cli-fly:
	@curl -L https://fly.io/install.sh | sh
	@echo "Flyctl installed. Add to PATH (if needed): export PATH=\"$$HOME/.fly/bin:$$PATH\""
