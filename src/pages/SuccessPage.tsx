import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock3,
  Copy,
  Hexagon,
  Mail,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { apiBase, readLocalOrder, type PaidOrder } from '../lib/checkout';

export default function SuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get('order') || '';
  const [order, setOrder] = useState<PaidOrder | null>(readLocalOrder());
  const [copied, setCopied] = useState(false);
  const [sla] = useState('2 hours');

  useEffect(() => {
    if (!orderId) return;
    fetch(`${apiBase()}/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.order) setOrder(d.order);
      })
      .catch(() => {
        /* keep local */
      });
  }, [orderId]);

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

  const wa =
    import.meta.env.VITE_SUPPORT_WHATSAPP
      ? `https://wa.me/${String(import.meta.env.VITE_SUPPORT_WHATSAPP).replace(/\D/g, '')}?text=${encodeURIComponent(
          `Hi, I paid for BlackBoxFX. Order: ${order?.id || orderId}. TV: ${order?.tradingViewUsername || ''}`
        )}`
      : 'mailto:support@blackboxfx.io';

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <header className="relative border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-4 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <Hexagon className="w-7 h-7 text-gold fill-gold/10" strokeWidth={1.5} />
            <span className="font-display text-sm font-bold tracking-wider">
              BLACKBOX<span className="text-gold">FX</span>
            </span>
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

          <h1 className="font-display text-3xl md:text-4xl font-bold">Payment received</h1>
          <p className="mt-3 text-muted text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Access will be granted within <span className="text-white font-semibold">{sla}</span>.
            We will add your TradingView username to the invite-only BlackBoxFX script.
          </p>

          {order?.demoPayment && (
            <div className="mt-4 inline-flex px-3 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-xs text-gold">
              Demo payment mode — connect Razorpay keys for live UPI/card capture
            </div>
          )}

          <div className="mt-8 grid sm:grid-cols-2 gap-3 text-left">
            <Info label="Order ID" value={order?.id || orderId || '—'} mono />
            <Info label="Plan" value={order ? `${order.planName} · ₹${order.amountInr}` : '—'} />
            <Info label="Email" value={order?.email || '—'} />
            <div className="glass rounded-xl p-4 border border-white/[0.06]">
              <div className="text-[11px] uppercase tracking-wider text-muted mb-1">TradingView username</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm text-white break-all">
                  {order?.tradingViewUsername || '—'}
                </span>
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
            <Info
              label="Access expiry"
              value={order?.expiresAt ? new Date(order.expiresAt).toLocaleString() : '—'}
            />
            <Info label="Delivery status" value={order?.deliveryStatus || 'queued'} />
          </div>

          <div className="mt-8 rounded-2xl bg-black/30 border border-white/[0.06] p-5 text-left">
            <div className="flex items-center gap-2 text-white font-semibold mb-3">
              <Clock3 className="w-4 h-4 text-neon" />
              What happens next
            </div>
            <ol className="space-y-2.5 text-sm text-muted">
              <li>1. Your order is saved (plan, amount, email, TV username, expiry).</li>
              <li>2. You receive confirmation (email / WhatsApp when configured).</li>
              <li>3. We add your TV username on the invite-only Pine script.</li>
              <li>
                4. Open TradingView → Indicators → Invite-only → <span className="text-white">BlackBoxFX</span>.
              </li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={wa} className="btn-gold px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2">
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
            <Link to="/" className="btn-ghost px-6 py-3 rounded-xl inline-flex items-center justify-center">
              Back to home
            </Link>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-signal" />
            Secure checkout · Invite-only delivery
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
