export type PlanId = 'monthly' | 'yearly';

export interface CheckoutPlan {
  id: PlanId;
  name: string;
  amountInr: number;
  period: string;
  periodDays: number;
  badge: string;
  featured?: boolean;
}

export const CHECKOUT_PLANS: Record<PlanId, CheckoutPlan> = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    amountInr: 99,
    period: 'month',
    periodDays: 30,
    badge: 'Flexible',
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly',
    amountInr: 999,
    period: 'year',
    periodDays: 365,
    badge: 'Best value',
    featured: true,
  },
};

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  tradingViewUsername: string;
  planId: PlanId;
}

export interface CreateOrderResponse {
  orderId: string;
  amountInr: number;
  amountPaise: number;
  currency: string;
  plan: { id: string; name: string; label: string };
  razorpayOrderId: string | null;
  razorpayKeyId: string | null;
  demoMode: boolean;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    tradingViewUsername: string;
  };
}

export interface PaidOrder {
  id: string;
  planId: string;
  planName: string;
  amountInr: number;
  currency: string;
  fullName: string;
  email: string;
  phone: string;
  tradingViewUsername: string;
  status: string;
  paymentStatus: string;
  deliveryStatus: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  createdAt: string;
  paidAt?: string | null;
  expiresAt: string;
  demoPayment?: boolean;
  adminNotes?: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (resp: unknown) => void) => void;
    };
  }
}

/**
 * When true: never open Razorpay; complete as demo payment.
 * Still tries API first so orders can be saved server-side if backend is running.
 */
export const FORCE_DEMO =
  String(import.meta.env.VITE_FORCE_DEMO ?? 'true').toLowerCase() !== 'false';

export function apiBase() {
  const env = import.meta.env.VITE_API_BASE as string | undefined;
  if (env) return env.replace(/\/$/, '');
  return '';
}

function uid(prefix = 'BBFX') {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${t}-${r}`;
}

function normalizeForm(data: CheckoutFormData): CheckoutFormData {
  return {
    planId: data.planId,
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    tradingViewUsername: data.tradingViewUsername.trim().replace(/^@/, ''),
  };
}

function buildLocalOrder(data: CheckoutFormData, orderId?: string): PaidOrder {
  const form = normalizeForm(data);
  const plan = CHECKOUT_PLANS[form.planId];
  const now = new Date();
  const expires = new Date(now.getTime() + plan.periodDays * 24 * 60 * 60 * 1000);
  return {
    id: orderId || uid('ORD'),
    planId: plan.id,
    planName: plan.name,
    amountInr: plan.amountInr,
    currency: 'INR',
    fullName: form.fullName,
    email: form.email,
    phone: form.phone,
    tradingViewUsername: form.tradingViewUsername,
    status: 'paid',
    paymentStatus: 'demo_paid',
    deliveryStatus: 'queued',
    razorpayOrderId: null,
    razorpayPaymentId: `demo_${uid('PAY').toLowerCase()}`,
    createdAt: now.toISOString(),
    paidAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    demoPayment: true,
  };
}

function buildCreateResponse(data: CheckoutFormData, order: PaidOrder): CreateOrderResponse {
  const plan = CHECKOUT_PLANS[data.planId];
  return {
    orderId: order.id,
    amountInr: plan.amountInr,
    amountPaise: plan.amountInr * 100,
    currency: 'INR',
    plan: { id: plan.id, name: plan.name, label: `BlackBoxFX ${plan.name}` },
    razorpayOrderId: null,
    razorpayKeyId: null,
    demoMode: true,
    customer: {
      fullName: order.fullName,
      email: order.email,
      phone: order.phone,
      tradingViewUsername: order.tradingViewUsername,
    },
  };
}

export function validateCheckoutForm(data: CheckoutFormData): string | null {
  const form = normalizeForm(data);
  if (!CHECKOUT_PLANS[form.planId]) return 'Invalid plan selected';
  if (form.fullName.length < 2) return 'Full name is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email is required';
  if (form.tradingViewUsername.length < 2) return 'TradingView username is required';
  if (form.phone && !/^[+0-9\s-]{8,18}$/.test(form.phone)) return 'Enter a valid phone number';
  return null;
}

export async function fetchCheckoutConfig() {
  try {
    const res = await fetch(`${apiBase()}/api/config`);
    if (!res.ok) throw new Error('config failed');
    const json = await res.json();
    return {
      ...json,
      demoMode: Boolean(json.demoMode) || FORCE_DEMO,
    };
  } catch {
    return {
      demoMode: true,
      accessSla: '2 hours',
      currency: 'INR',
      plans: Object.values(CHECKOUT_PLANS),
      supportEmail: 'support@blackboxfx.io',
    };
  }
}

export async function createCheckoutOrder(data: CheckoutFormData): Promise<CreateOrderResponse> {
  const form = normalizeForm(data);
  const err = validateCheckoutForm(form);
  if (err) throw new Error(err);

  // Prefer server (saves order in data/orders.json)
  try {
    const res = await fetch(`${apiBase()}/api/checkout/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create order');

    // If FORCE_DEMO, strip razorpay so UI takes demo path even when keys exist
    if (FORCE_DEMO) {
      return {
        ...(json as CreateOrderResponse),
        demoMode: true,
        razorpayKeyId: null,
        razorpayOrderId: null,
      };
    }

    return json as CreateOrderResponse;
  } catch {
    // Offline / no API — pure client demo
    const order = buildLocalOrder(form);
    try {
      sessionStorage.setItem('bbfx_pending_order', JSON.stringify(order));
    } catch {
      /* ignore */
    }
    return buildCreateResponse(form, order);
  }
}

export async function verifyPayment(payload: {
  orderId: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  demo?: boolean;
  form?: CheckoutFormData;
}): Promise<{ ok: boolean; order: PaidOrder; demoMode?: boolean }> {
  // Try server verify first (works for demo + live)
  try {
    const res = await fetch(`${apiBase()}/api/checkout/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: payload.orderId,
        razorpay_order_id: payload.razorpay_order_id,
        razorpay_payment_id: payload.razorpay_payment_id,
        razorpay_signature: payload.razorpay_signature,
        demo: FORCE_DEMO || payload.demo || false,
      }),
    });
    const json = await res.json();
    if (res.ok && json.order) {
      try {
        sessionStorage.removeItem('bbfx_pending_order');
      } catch {
        /* ignore */
      }
      return json;
    }
  } catch {
    /* fall through to local */
  }

  // Local demo fallback
  if (FORCE_DEMO || payload.demo) {
    let order: PaidOrder | null = null;
    try {
      const raw = sessionStorage.getItem('bbfx_pending_order');
      if (raw) order = JSON.parse(raw) as PaidOrder;
    } catch {
      order = null;
    }

    if (!order || order.id !== payload.orderId) {
      if (payload.form) {
        order = buildLocalOrder(payload.form, payload.orderId);
      } else {
        order = {
          id: payload.orderId,
          planId: 'monthly',
          planName: 'Monthly',
          amountInr: 99,
          currency: 'INR',
          fullName: 'Customer',
          email: 'customer@email.com',
          phone: '',
          tradingViewUsername: 'tv_user',
          status: 'paid',
          paymentStatus: 'demo_paid',
          deliveryStatus: 'queued',
          createdAt: new Date().toISOString(),
          paidAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
          demoPayment: true,
        };
      }
    }

    order = {
      ...order,
      status: 'paid',
      paymentStatus: 'demo_paid',
      deliveryStatus: 'queued',
      paidAt: new Date().toISOString(),
      demoPayment: true,
      razorpayPaymentId:
        payload.razorpay_payment_id || order.razorpayPaymentId || `demo_pay_${Date.now()}`,
    };

    try {
      sessionStorage.removeItem('bbfx_pending_order');
    } catch {
      /* ignore */
    }

    return { ok: true, order, demoMode: true };
  }

  throw new Error('Payment verification failed');
}

export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function saveLocalOrder(order: PaidOrder) {
  try {
    localStorage.setItem('bbfx_last_order', JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function readLocalOrder(): PaidOrder | null {
  try {
    const raw = localStorage.getItem('bbfx_last_order');
    return raw ? (JSON.parse(raw) as PaidOrder) : null;
  } catch {
    return null;
  }
}

export async function fetchAdminOrders(token: string) {
  const res = await fetch(`${apiBase()}/api/admin/orders`, {
    headers: { 'x-admin-token': token },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to load orders');
  return json.orders as PaidOrder[];
}

export async function patchAdminOrder(
  token: string,
  orderId: string,
  body: { deliveryStatus?: string; status?: string; notes?: string }
) {
  const res = await fetch(`${apiBase()}/api/admin/orders/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update order');
  return json.order as PaidOrder;
}
