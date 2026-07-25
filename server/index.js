import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

const PORT = Number(process.env.PORT || 8787);
const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'blackbox-admin';
const CURRENCY = 'INR';

const PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    amountInr: 99,
    periodDays: 30,
    label: '₹99 / month',
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly',
    amountInr: 999,
    periodDays: 365,
    label: '₹999 / year',
  },
};

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]', 'utf8');

function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function uid(prefix = 'ord') {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
}

const razorpay =
  KEY_ID && KEY_SECRET
    ? new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET })
    : null;

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    razorpay: Boolean(razorpay),
    mode: razorpay ? 'live-keys-configured' : 'demo',
  });
});

app.get('/api/config', (_req, res) => {
  res.json({
    razorpayKeyId: KEY_ID || null,
    demoMode: !razorpay,
    currency: CURRENCY,
    plans: Object.values(PLANS).map((p) => ({
      id: p.id,
      name: p.name,
      amountInr: p.amountInr,
      label: p.label,
      periodDays: p.periodDays,
    })),
    supportWhatsApp: process.env.SUPPORT_WHATSAPP || '',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@blackboxfx.io',
    accessSla: process.env.ACCESS_SLA || '2 hours',
  });
});

app.post('/api/checkout/create', async (req, res) => {
  try {
    const {
      planId,
      fullName,
      email,
      phone = '',
      tradingViewUsername,
    } = req.body || {};

    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    const name = String(fullName || '').trim();
    const mail = String(email || '').trim().toLowerCase();
    const tv = String(tradingViewUsername || '').trim();
    const mobile = String(phone || '').trim();

    if (name.length < 2) return res.status(400).json({ error: 'Full name is required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (tv.length < 2) {
      return res.status(400).json({ error: 'TradingView username is required' });
    }
    if (mobile && !/^[+0-9\s-]{8,18}$/.test(mobile)) {
      return res.status(400).json({ error: 'Enter a valid phone number' });
    }

    const orderId = uid('bbfx');
    const amountPaise = plan.amountInr * 100;
    const createdAt = new Date().toISOString();
    const expiresAt = addDays(createdAt, plan.periodDays);

    let razorpayOrderId = null;

    if (razorpay) {
      const rpOrder = await razorpay.orders.create({
        amount: amountPaise,
        currency: CURRENCY,
        receipt: orderId.slice(0, 40),
        notes: {
          planId: plan.id,
          email: mail,
          tradingViewUsername: tv,
          phone: mobile,
          fullName: name,
          localOrderId: orderId,
        },
      });
      razorpayOrderId = rpOrder.id;
    }

    const order = {
      id: orderId,
      planId: plan.id,
      planName: plan.name,
      amountInr: plan.amountInr,
      currency: CURRENCY,
      fullName: name,
      email: mail,
      phone: mobile,
      tradingViewUsername: tv,
      status: 'created',
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
      razorpayOrderId,
      razorpayPaymentId: null,
      createdAt,
      paidAt: null,
      expiresAt,
      accessNote: 'Invite-only TradingView script access after payment confirmation',
    };

    const orders = readOrders();
    orders.unshift(order);
    writeOrders(orders);

    res.json({
      orderId: order.id,
      amountInr: order.amountInr,
      amountPaise,
      currency: CURRENCY,
      plan: { id: plan.id, name: plan.name, label: plan.label },
      razorpayOrderId,
      razorpayKeyId: KEY_ID || null,
      demoMode: !razorpay,
      customer: { fullName: name, email: mail, phone: mobile, tradingViewUsername: tv },
    });
  } catch (err) {
    console.error('create order error', err);
    res.status(500).json({ error: err?.message || 'Failed to create order' });
  }
});

app.post('/api/checkout/verify', async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      demo = false,
    } = req.body || {};

    const orders = readOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.paymentStatus === 'paid') {
      return res.json({ ok: true, order, alreadyPaid: true });
    }

    if (demo || !razorpay) {
      order.status = 'paid';
      order.paymentStatus = 'paid';
      order.paidAt = new Date().toISOString();
      order.razorpayPaymentId = razorpay_payment_id || `demo_pay_${Date.now()}`;
      order.razorpayOrderId = razorpay_order_id || order.razorpayOrderId || `demo_order_${Date.now()}`;
      order.deliveryStatus = 'queued';
      order.demoPayment = true;
      writeOrders(orders);
      return res.json({ ok: true, order, demoMode: true });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing Razorpay payment fields' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', KEY_SECRET).update(body).digest('hex');

    if (expected !== razorpay_signature) {
      order.paymentStatus = 'failed';
      order.status = 'failed';
      writeOrders(orders);
      return res.status(400).json({ error: 'Payment signature verification failed' });
    }

    if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ error: 'Order mismatch' });
    }

    order.status = 'paid';
    order.paymentStatus = 'paid';
    order.paidAt = new Date().toISOString();
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.deliveryStatus = 'queued';
    order.demoPayment = false;
    writeOrders(orders);

    if (process.env.NOTIFY_WEBHOOK_URL) {
      fetch(process.env.NOTIFY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order.paid',
          order,
        }),
      }).catch((e) => console.error('notify webhook failed', e.message));
    }

    res.json({ ok: true, order });
  } catch (err) {
    console.error('verify error', err);
    res.status(500).json({ error: err?.message || 'Verification failed' });
  }
});

app.get('/api/orders/:id', (req, res) => {
  const orders = readOrders();
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

app.get('/api/admin/orders', (req, res) => {
  const token = req.header('x-admin-token') || req.query.token;
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ orders: readOrders() });
});

app.patch('/api/admin/orders/:id', (req, res) => {
  const token = req.header('x-admin-token') || req.query.token;
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });

  const orders = readOrders();
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const { deliveryStatus, status, notes } = req.body || {};
  if (deliveryStatus) order.deliveryStatus = deliveryStatus;
  if (status) order.status = status;
  if (typeof notes === 'string') order.adminNotes = notes;
  order.updatedAt = new Date().toISOString();
  writeOrders(orders);
  res.json({ ok: true, order });
});

app.post('/api/webhooks/razorpay', (req, res) => {
  try {
    if (!WEBHOOK_SECRET) return res.status(200).json({ ok: true, skipped: true });
    const signature = req.headers['x-razorpay-signature'];
    const raw = JSON.stringify(req.body || {});
    const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(raw).digest('hex');
    if (signature !== expected) return res.status(400).json({ error: 'Invalid webhook signature' });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Webhook error' });
  }
});

const dist = path.join(ROOT, 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`BlackBoxFX API on :${PORT} | Razorpay: ${razorpay ? 'configured' : 'DEMO MODE'}`);
});
