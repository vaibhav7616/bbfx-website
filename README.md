# BlackBoxFX v3.0 — Website + Checkout

Premium landing + purchase flow for the BlackBoxFX TradingView invite-only indicator.

## Buy flow

1. **Plan** — User clicks Monthly (₹99) or Yearly (₹999) → `/checkout?plan=...`
2. **Details** — Name, email, TradingView username (required), phone (optional)
3. **Payment** — Demo mode (no charge) or Razorpay (UPI / card / netbanking)
4. **Success** — `/success` shows order + “access within X hours”
5. **Delivery** — You add TV username on invite-only script → mark delivered in `/admin`

```
Home → Pricing CTA → /checkout → Pay → /success → TV Invite-only access
```

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing page |
| `/checkout?plan=monthly\|yearly` | Checkout form |
| `/success?order=...` | Payment / demo confirmation |
| `/admin` | Orders desk (admin token) |

## Local development

```bash
npm install
npm run dev          # Vite + API together
# web:  http://localhost:5173
# api:  http://localhost:8787
```

Demo checkout works with **no Razorpay keys** (`VITE_FORCE_DEMO=true`).

## Go live with Razorpay (India)

1. Create Razorpay account → get Key ID + Secret  
2. In `.env`:

```env
VITE_FORCE_DEMO=false
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
ADMIN_TOKEN=your-strong-token
SUPPORT_WHATSAPP=91XXXXXXXXXX
```

3. Restart server (`npm run start` or Docker)  
4. Users pay with UPI/card; orders save in `data/orders.json`  
5. Open `/admin` → add TV username on TradingView → **Mark TV access given**

## Docker

```bash
docker compose build web
docker compose up web -d
# http://localhost:8080  (API + SPA)
```

## Admin

- URL: `/admin`
- Default token: `blackbox-admin` (change via `ADMIN_TOKEN`)
- API: `GET /api/admin/orders` with header `x-admin-token`

## Stack

Vite · React 19 · Tailwind · Framer Motion · Three.js · Express · Razorpay
