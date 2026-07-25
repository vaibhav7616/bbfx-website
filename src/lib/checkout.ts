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
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (resp: unknown) => void) => void;
    };
  }
}

export function apiBase() {
  const env = import.meta.env.VITE_API_BASE as string | undefined;
  if (env) return env.replace(/\/$/, '');
  // Dev proxy / same origin in production when API serves SPA
  return '';
}

export async function fetchCheckoutConfig() {
  const res = await fetch(`${apiBase()}/api/config`);
  if (!res.ok) throw new Error('Could not load checkout config');
  return res.json();
}

export async function createCheckoutOrder(data: CheckoutFormData): Promise<CreateOrderResponse> {
  const res = await fetch(`${apiBase()}/api/checkout/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create order');
  return json;
}

export async function verifyPayment(payload: {
  orderId: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  demo?: boolean;
}): Promise<{ ok: boolean; order: PaidOrder; demoMode?: boolean }> {
  const res = await fetch(`${apiBase()}/api/checkout/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Payment verification failed');
  return json;
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
