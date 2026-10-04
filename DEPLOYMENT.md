# ESSÈF STORE V5 — Step-by-step Cloudflare deployment

## 0. Requirements
- A Cloudflare account
- Node.js 20+ recommended
- npm
- This project folder

Cloudflare's current React + Vite integration uses the Cloudflare Vite plugin and Wrangler. The official guide supports deploying a React SPA with a Worker API and static assets.

## 1. Install dependencies
Open a terminal in this folder:

```bash
npm install
```

## 2. Test locally
```bash
npm run dev
```
Open the URL printed by Vite.

The account API will only be fully connected after the KV binding exists. For UI-only development, the store still loads.

## 3. Authenticate Wrangler
```bash
npx wrangler login
```
A browser window will open. Authorize your Cloudflare account.

## 4. Create the KV namespace
Run:

```bash
npx wrangler kv namespace create ESSEF_KV
```

Cloudflare will return an ID. It will look similar to:

```text
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Copy that ID.

## 5. Edit wrangler.jsonc
Open `wrangler.jsonc` and replace:

```json
"id": "REPLACE_WITH_KV_NAMESPACE_ID"
```

with the ID from step 4.

The binding must remain:

```json
"binding": "ESSEF_KV"
```

## 6. Build
```bash
npm run build
```

The Cloudflare Vite plugin generates the deployable Worker/static-asset output.

## 7. Preview the production build locally
```bash
npm run preview
```

Test:
- Arabic / French / English
- Theme toggle
- Product filtering
- Cart
- Register
- Login
- Logout

## 8. Deploy
```bash
npm run deploy
```

Wrangler will upload the React static assets and Worker. You should receive a `workers.dev` URL.

## 9. Test the account system
On the deployed site:

1. Click `My account` / `حسابي`.
2. Choose `Create account`.
3. Use a real email you control for testing.
4. Use a password of at least 8 characters.
5. Log out.
6. Log back in.

The account is stored in Workers KV. The browser receives only an HttpOnly session cookie, not the password hash.

## 10. Custom domain (optional)
In Cloudflare Dashboard:

Workers & Pages → your Worker → Settings / Domains & Routes → Add Custom Domain.

Use a domain/subdomain such as:

`shop.example.com`

## 11. Updating the store
After changing React code:

```bash
npm run build
npm run deploy
```

## 12. Cloudflare free-plan considerations
Workers Free currently includes 100,000 Worker requests/day. Workers KV currently has 100,000 reads/day, 1,000 writes/day, and 1 GB storage on the Free plan. Static assets do not consume the Worker request quota in the same way as Worker execution; the React SPA is therefore a good fit for this architecture.

## 13. Important production security note
This package is an Option B prototype. KV is not a relational database. It is suitable for lightweight account/session data, settings and simple key/value records. Before accepting real payments or storing sensitive customer information, add a production-grade authentication/password-hashing approach and a proper order/data model.

Never store:
- card numbers
- CVV
- payment secrets
- API keys
- plaintext passwords

## 14. Useful commands
```bash
npm run dev
npm run build
npm run preview
npm run deploy
npx wrangler kv namespace create ESSEF_KV
npx wrangler kv key list --namespace-id YOUR_ID
```
