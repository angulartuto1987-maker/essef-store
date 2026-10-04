# ESSÈF STORE V5 — React + Cloudflare Workers + KV

Option B migration of ESSÈF STORE v4 Black/White into React + Vite with a Cloudflare Worker API and Workers KV user/account storage.

## Included
- React + TypeScript + Vite
- Cloudflare Vite plugin / Workers
- Black & white theme
- AR default + FR + EN
- ESSÈF product catalog and Aydin 550 TND recommendation
- Cart stored locally
- Search and category filters
- Account register/login/logout/profile via Worker + KV
- Secure HttpOnly session cookie
- PWA manifest

## Important
This is a lightweight KV architecture. KV is excellent for a small prototype, but it is not relational. Do not store payment card data or other sensitive information in KV. Passwords are never stored in plaintext; the demo hashes them with SHA-256. For a production authentication system, prefer a dedicated auth provider or stronger password hashing strategy available in a suitable backend/runtime.

See DEPLOYMENT.md for exact Cloudflare steps.

## Project structure
- `src/main.tsx` — React UI and catalog
- `src/styles.css` — black/white responsive theme
- `worker/index.ts` — KV-backed account API
- `wrangler.jsonc` — Worker + KV binding
- `assets/` — existing ESSÈF branding/product images
