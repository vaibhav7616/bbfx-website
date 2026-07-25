import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock3,
  Copy,
  FlaskConical,
  Hexagon,
  Home,
  Mail,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { readLocalOrder, type PaidOrder } from '../lib/checkout';

export default function SuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get('order') || '';
  const isDemo = params.get('demo') === '1';
  const [order] = useState<PaidOrder | null>(() => {
    const local = readLocalOrder();
    if (local && (!orderId || local.id === orderId)) return local;
    return local;
  });
  const [copied, setCopied] = useState(false);
  const sla = '2 hours';

  const demo = isDemo || Boolean(order?.demoPayment);

  const summary = useMemo(
    () => ({
      id: order?.id || orderId || '—',
      plan: order ? `${order.planName} · ₹${order.amountInr}` : '—',
      email: order?.email || '—',
      tv: order?.tradingViewUsername || '—',
      expires: order?.expiresAt ? new Date(order.expiresAt).toLocaleString() : '—',
      delivery: order?.deliveryStatus || 'queued',
    }),
    [order, orderId]
  );

  const copyTv = async () => {
    if (!order?.tradingViewUsername) return;
    try {
      await navigator.clipboard.writeText(order.tradingViewUsername);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const wa = import.meta.env.VITE_SUPPORT_WHATSAPP
    ? `https://wa.me/${String(import.meta.env.VITE_SUPPORT_WHATSAPP).replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hi, I completed BlackBoxFX checkout. Order: ${summary.id}. TV: ${summary.tv}`
      )}`
    : 'mailto:support@blackboxfx.io';

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <header className="relative border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Hexagon className="w-7 h-7 text-gold fill-gold/10" strokeWidth={1.5} />
            <span className="font-display text-sm font-bold tracking-wider">
              BLACKBOX<span className="text-gold">FX</span>
            </span>
          </Link>
          <Link to="/" className="text-sm text-muted hover:text-white inline-flex items-center gap-1.5">
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-gold rounded-3xl p-7 md:p-10 border border-signal/20 text-center ring-aurora"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-signal/15 border border-signal/30 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-8 h-8 text-signal" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {demo ? 'Demo order confirmed' : 'Payment received'}
          </h1>
          <p className="mt-3 text-muted text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            {demo ? (
              <>
                Checkout flow works. In live mode, access is granted within{' '}
                <span className="text-white font-semibold">{sla}</span> after real payment.
              </>
            ) : (
              <>
                Access will be granted within <span className="text-white font-semibold">{sla}</span>. We
                will add your TradingView username to the invite-only BlackBoxFX script.
              </>
            )}
          </p>

          {demo && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-xs text-gold">
              <FlaskConical className="w-3.5 h-3.5" />
              Demo mode — no real money charged. Razorpay comes next.
            </div>
          )}

          <div className="mt-8 grid sm:grid-cols-2 gap-3 text-left">
            <Info label="Order ID" value={summary.id} mono />
            <Info label="Plan" value={summary.plan} />
            <Info label="Email" value={summary.email} />
            <div className="glass rounded-xl p-4 border border-white/[0.06]">
              <div className="text-[11px] uppercase tracking-wider text-muted mb-1">TradingView username</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm text-white break-all">{summary.tv}</span>
                {order?.tradingViewUsername && (
                  <button
                    type="button"
                    onClick={copyTv}
                    className="shrink-0 p-1.5 rounded-md border border-white/10 hover:bg-white/5"
                    aria-label="Copy username"
                  >
                    <Copy className="w-3.5 h-3.5 text-muted" />
                  </button>
                )}
              </div>
              {copied && <div className="text-[10px] text-signal mt-1">Copied</div>}
            </div>
            <Info label="Access expiry" value={summary.expires} />
            <Info label="Delivery status" value={summary.delivery} />
          </div>

          <div className="mt-8 rounded-2xl bg-black/30 border border-white/[0.06] p-5 text-left">
            <div className="flex items-center gap-2 text-white font-semibold mb-3">
              <Clock3 className="w-4 h-4 text-neon" />
              What happens next
            </div>
            <ol className="space-y-2.5 text-sm text-muted">
              <li>1. Order details saved (plan, amount, email, TV username, expiry).</li>
              <li>2. Confirmation shown here (email/WhatsApp when live).</li>
              <li>3. TV username added on invite-only Pine script after real payment.</li>
              <li>
                4. Open TradingView → Indicators → Invite-only →{' '}
                <span className="text-white">BlackBoxFX</span>.
              </li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/checkout?plan=monthly" className="btn-gold px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2">
              Run another demo order
            </Link>
            <a href={wa} className="btn-ghost px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Contact support
            </a>
            <a
              href="mailto:support@blackboxfx.io"
              className="btn-ghost px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email us
            </a>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-signal" />
            {demo ? 'Demo checkout complete' : 'Secure checkout · Invite-only delivery'}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="glass rounded-xl p-4 border border-white/[0.06]">
      <div className="text-[11px] uppercase tracking-wider text-muted mb-1">{label}</div>
      <div className={`text-sm text-white break-all ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  );
}
