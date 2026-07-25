# BlackBoxFX v3.0 — Landing + Checkout

Premium TradingView indicator website with **Razorpay checkout**, order storage, and invite-only delivery flow.

## Stack

- Vite + React 19 + TypeScript + Tailwind
- Express API (`server/index.js`)
- Razorpay (UPI / Card / Netbanking)
- File-based order store (`data/orders.json`) — swap to Postgres later if needed
- Docker multi-stage production image

## Features

1. Marketing landing page
2. Checkout form: name, email, **TradingView username** (required), phone (optional)
3. Plans: **₹99/month**, **₹999/year**
4. Razorpay payment (or demo mode without keys)
5. Success page + order saved (plan, amount, email, TV username, expiry)
6. Delivery instructions for invite-only Pine script

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

- Frontend: `http://localhost:5173` (proxies `/api` → API)
- API: `http://localhost:8787`

### Live Razorpay

Set in `.env`:

```env
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
ADMIN_TOKEN=strong-secret
SUPPORT_WHATSAPP=91XXXXXXXXXX
```

Without keys, checkout runs in **demo mode** (marks paid for UX testing).

## Production

```bash
npm run build
npm start
# serves API + dist on PORT (default 8787)
```

### Docker

```bash
docker compose up web -d
# → http://localhost:8787
```

## Admin

List orders:

```bash
curl -H "x-admin-token: $ADMIN_TOKEN" http://localhost:8787/api/admin/orders
```

Mark delivered:

```bash
curl -X PATCH -H "x-admin-token: $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"deliveryStatus":"delivered"}' \
  http://localhost:8787/api/admin/orders/ORDER_ID
```

## Delivery ops (invite-only)

After paid order:

1. Open TradingView script access
2. Add `tradingViewUsername` from order
3. Patch order `deliveryStatus` → `delivered`
4. Optional: wire `NOTIFY_WEBHOOK_URL` to email/WhatsApp automation

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing |
| `/checkout?plan=monthly\|yearly` | Checkout |
| `/success?order=...` | Payment success |

## License

Proprietary — BlackBoxFX.
