# Repository Configuration

## Project Details
- **Type**: React + TypeScript + Vite Frontend Application
- **Framework**: React 18 with Vite build system
- **UI**: Shadcn/ui + Tailwind CSS + Radix UI
- **Deployment**: Cloudflare Pages

## Testing Framework
- **targetFramework**: Playwright
- **Test Location**: `tests/` directory
- **Configuration**: `playwright.config.ts`

## Key Fixes Applied
- Updated `vite.config.ts` base path for absolute asset loading in production
- Created `wrangler-pages.toml` for Cloudflare Pages deployment
- Fixed deployment scripts for proper project naming and branch targeting