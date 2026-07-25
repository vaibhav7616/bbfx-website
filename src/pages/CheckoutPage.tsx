import { FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  FlaskConical,
  Hexagon,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import {
  CHECKOUT_PLANS,
  FORCE_DEMO,
  createCheckoutOrder,
  fetchCheckoutConfig,
  loadRazorpay,
  saveLocalOrder,
  type PlanId,
  verifyPayment,
} from '../lib/checkout';

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialPlan = (params.get('plan') === 'yearly' ? 'yearly' : 'monthly') as PlanId;

  const [planId, setPlanId] = useState<PlanId>(initialPlan);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tvUser, setTvUser] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(FORCE_DEMO);
  const [accessSla, setAccessSla] = useState('2 hours');

  const plan = CHECKOUT_PLANS[planId];

  useEffect(() => {
    fetchCheckoutConfig()
      .then((cfg) => {
        setDemoMode(Boolean(cfg.demoMode) || FORCE_DEMO);
        if (cfg.accessSla) setAccessSla(cfg.accessSla);
      })
      .catch(() => setDemoMode(true));
  }, []);

  const features = useMemo(
    () => [
      'Full BlackBoxFX v3.0 invite-only access',
      'TradingView username linked after checkout',
      'Free updates during active plan',
      'Installation guide + support',
      demoMode ? 'Demo checkout (no real charge)' : 'UPI / Card / Netbanking via Razorpay',
    ],
    [demoMode]
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agree) {
      setError('Please accept the terms to continue.');
      return;
    }

    const form = {
      planId,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      tradingViewUsername: tvUser.trim(),
    };

    setLoading(true);
    try {
      const created = await createCheckoutOrder(form);

      // Demo mode — complete flow locally (no Razorpay keys needed)
      if (created.demoMode || demoMode || FORCE_DEMO || !created.razorpayKeyId || !created.razorpayOrderId) {
        // Small delay so UX feels real
        await new Promise((r) => setTimeout(r, 700));
        const verified = await verifyPayment({
          orderId: created.orderId,
          demo: true,
          form,
        });
        saveLocalOrder(verified.order);
        navigate(`/success?order=${encodeURIComponent(created.orderId)}&demo=1`);
        return;
      }

      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) {
        throw new Error('Could not load Razorpay checkout. Please retry.');
      }

      const rzp = new window.Razorpay({
        key: created.razorpayKeyId,
        amount: created.amountPaise,
        currency: created.currency,
        name: 'BlackBoxFX',
        description: `BlackBoxFX v3.0 · ${created.plan.name}`,
        order_id: created.razorpayOrderId,
        prefill: {
          name: created.customer.fullName,
          email: created.customer.email,
          contact: created.customer.phone || undefined,
        },
        notes: {
          tradingViewUsername: created.customer.tradingViewUsername,
          planId: created.plan.id,
          localOrderId: created.orderId,
        },
        theme: { color: '#a78bfa' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verified = await verifyPayment({
              orderId: created.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            saveLocalOrder(verified.order);
            navigate(`/success?order=${encodeURIComponent(created.orderId)}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment verification failed');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on('payment.failed', () => {
        setError('Payment failed or cancelled. You can try again.');
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <header className="relative border-b border-white/[0.06] bg-void/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Hexagon className="w-7 h-7 text-gold fill-gold/10" strokeWidth={1.5} />
            <div className="leading-none">
              <div className="font-display text-sm font-bold tracking-wider">
                BLACKBOX<span className="text-gold">FX</span>
              </div>
              <div className="text-[10px] text-muted tracking-widest uppercase">
                {demoMode ? 'Demo checkout' : 'Secure checkout'}
              </div>
            </div>
          </Link>
          <Link to="/#pricing" className="text-sm text-muted hover:text-white inline-flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-14">
        {demoMode && (
          <div className="mb-6 rounded-xl border border-gold/25 bg-gold/10 px-4 py-3 flex items-start gap-3">
            <FlaskConical className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gold-bright">Demo mode is ON</div>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">
                No real payment is charged. Submit the form to test the full order → success flow.
                Later we will connect Razorpay for live UPI/card payments.
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] font-mono">
            {[
              { n: 1, t: 'Plan', on: true },
              { n: 2, t: 'Details', on: true },
              { n: 3, t: demoMode ? 'Confirm' : 'Payment', on: true },
              { n: 4, t: 'TV Access', on: false },
            ].map((s, i) => (
              <div key={s.t} className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full border ${
                    s.on
                      ? 'border-violet/40 text-gold bg-violet/10'
                      : 'border-white/10 text-muted bg-white/[0.02]'
                  }`}
                >
                  {s.n}. {s.t}
                </span>
                {i < 3 && <span className="text-white/20">→</span>}
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold mb-3">
            <Lock className="w-3 h-3 text-gold" />
            <span className="text-[11px] font-medium tracking-wider uppercase text-gold-bright">
              {demoMode ? 'Demo checkout' : 'Secure checkout'}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {demoMode ? 'Enter details & confirm' : 'Complete your access'}
          </h1>
          <p className="mt-2 text-muted max-w-xl">
            Choose Monthly (₹99) or Yearly (₹999), enter name, email and TradingView username
            {demoMode
              ? ' — confirm to test success page (no real charge).'
              : ', then pay via UPI / card / netbanking.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 glass rounded-2xl border border-white/[0.07] p-5 sm:p-7 space-y-5"
          >
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">Choose plan</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {(Object.keys(CHECKOUT_PLANS) as PlanId[]).map((id) => {
                  const p = CHECKOUT_PLANS[id];
                  const active = planId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPlanId(id)}
                      className={`text-left rounded-xl p-4 border transition-all ${
                        active
                          ? 'border-violet/50 bg-violet/10 ring-aurora'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-semibold">{p.name}</span>
                        {p.featured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/25">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <div className="font-display text-2xl font-bold gold-gradient">₹{p.amountInr}</div>
                      <div className="text-xs text-muted mt-0.5">per {p.period}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" required>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Rahul Sharma"
                    autoComplete="name"
                  />
                </div>
              </Field>
              <Field label="Email" required>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@email.com"
                    autoComplete="email"
                  />
                </div>
              </Field>
            </div>

            <Field
              label="TradingView username"
              required
              hint="Must match exactly — used for invite-only script access"
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gold">TV</span>
                <input
                  required
                  value={tvUser}
                  onChange={(e) => setTvUser(e.target.value)}
                  className="input-field pl-10"
                  placeholder="your_tv_username"
                  autoComplete="username"
                />
              </div>
            </Field>

            <Field label="Phone (optional)" hint="WhatsApp support in India">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field pl-10"
                  placeholder="+91 98XXXXXXXX"
                  autoComplete="tel"
                />
              </div>
            </Field>

            <label className="flex items-start gap-3 text-sm text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 accent-[#a78bfa]"
              />
              <span>
                I understand TradingView access is invite-only, trading involves risk, and
                {demoMode ? ' this is a demo checkout with no real charge.' : ' access is delivered after successful payment.'}
              </span>
            </label>

            {error && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl text-base inline-flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {demoMode ? 'Confirming demo order…' : 'Processing…'}
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  {demoMode ? `Confirm demo order · ₹${plan.amountInr}` : `Pay ₹${plan.amountInr} securely`}
                </>
              )}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted">
              {demoMode ? (
                <>
                  <span>No real charge</span>
                  <span>·</span>
                  <span>Full success-page flow</span>
                  <span>·</span>
                  <span>Razorpay later</span>
                </>
              ) : (
                <>
                  <span>UPI · Cards · Netbanking</span>
                  <span>·</span>
                  <span>Razorpay secure</span>
                  <span>·</span>
                  <span>Live payments on</span>
                </>
              )}
            </div>
          </motion.form>

          <aside className="lg:col-span-2 space-y-4">
            <div className="glass-gold rounded-2xl p-6 border border-violet/25 ring-aurora">
              <div className="text-[11px] font-mono uppercase tracking-wider text-gold mb-2">Order summary</div>
              <div className="font-display text-xl font-bold text-white">BlackBoxFX v3.0</div>
              <div className="text-sm text-muted mt-1">{plan.name} plan</div>
              <div className="mt-5 flex items-end justify-between">
                <span className="text-muted text-sm">{demoMode ? 'Demo total' : 'Total due today'}</span>
                <span className="font-display text-4xl font-extrabold gold-gradient">₹{plan.amountInr}</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-white/85">
                    <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-2xl p-5 border border-white/[0.06] text-sm text-muted leading-relaxed">
              <div className="font-semibold text-white mb-2">After checkout</div>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Order saved with your TV username</li>
                <li>Confirmation on success page</li>
                <li>Invite-only access added (usually within {accessSla})</li>
                <li>Open TradingView → Indicators → Invite-only → BlackBoxFX</li>
              </ol>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-1 text-sm font-medium text-white/90">
        {label}
        {required && <span className="text-danger">*</span>}
      </div>
      {children}
      {hint && <div className="mt-1.5 text-[11px] text-muted">{hint}</div>}
    </label>
  );
}
