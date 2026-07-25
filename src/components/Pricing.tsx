import { motion } from 'framer-motion';
import { Check, Crown, Shield, Zap, Headphones, RefreshCw, BadgeCheck, Sparkles } from 'lucide-react';
import { PRICING_FEATURES, PRICING_PLANS } from '../lib/constants';
import SectionHeading from './SectionHeading';
import MagneticButton from './MagneticButton';
import { cardItem, staggerContainer } from '../lib/motion';

const ASSURANCES = [
  { icon: Zap, label: 'Instant invite delivery' },
  { icon: RefreshCw, label: 'Free version updates' },
  { icon: Headphones, label: 'Priority support' },
  { icon: BadgeCheck, label: 'Cancel anytime (monthly)' },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 radial-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-violet/[0.06] blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple Plans. Serious Edge."
          subtitle="Start monthly or save big with yearly access. Prices in INR — built for Indian traders."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid md:grid-cols-2 gap-5 max-w-4xl mx-auto"
        >
          {PRICING_PLANS.map((plan) => (
            <motion.div key={plan.id} variants={cardItem} className="relative">
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-gold/90 to-violet/90 text-[10px] font-bold tracking-wider uppercase text-void shadow-lg">
                    <Crown className="w-3 h-3" /> Best value
                  </span>
                </div>
              )}

              <div
                className={`relative h-full rounded-3xl p-7 md:p-8 overflow-hidden ${
                  plan.featured
                    ? 'glass-gold ring-aurora border border-violet/30'
                    : 'glass border border-white/[0.08]'
                }`}
              >
                {plan.featured && (
                  <>
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold via-violet to-neon" />
                    <div className="absolute -top-20 -right-12 w-40 h-40 bg-violet/20 rounded-full blur-3xl" />
                  </>
                )}

                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-1">
                      {plan.badge}
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                      {plan.name}
                    </h3>
                  </div>
                  {plan.featured ? (
                    <Sparkles className="w-5 h-5 text-gold" />
                  ) : (
                    <Zap className="w-5 h-5 text-neon" />
                  )}
                </div>

                <div className="flex items-end gap-1.5 mb-1">
                  <span className="font-display text-5xl md:text-6xl font-extrabold gold-gradient leading-none">
                    ₹{plan.price}
                  </span>
                  <span className="text-muted text-sm mb-2 font-medium">/{plan.period}</span>
                </div>

                {plan.note && (
                  <p className="text-xs text-signal font-medium mb-5">{plan.note}</p>
                )}
                {!plan.note && <div className="mb-5" />}

                <p className="text-sm text-muted mb-6 leading-relaxed">{plan.description}</p>

                <ul className="space-y-2.5 mb-8">
                  {PRICING_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-signal/15 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-signal" strokeWidth={3} />
                      </span>
                      <span className="text-white/88">{f}</span>
                    </li>
                  ))}
                </ul>

                <MagneticButton
                  href={`/checkout?plan=${plan.id}`}
                  className={`${
                    plan.featured ? 'btn-gold' : 'btn-ghost'
                  } w-full py-3.5 rounded-xl text-center text-[15px] inline-flex items-center justify-center`}
                >
                  {plan.cta}
                </MagneticButton>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Shield className="w-3 h-3 text-gold" /> Razorpay secure
                  </span>
                  <span>·</span>
                  <span>UPI / Card / Netbanking</span>
                  <span>·</span>
                  <span>TV invite-only</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ASSURANCES.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.label}
                className="glass rounded-xl p-4 border border-white/[0.05] flex items-center gap-3"
              >
                <Icon className="w-4 h-4 text-neon shrink-0" strokeWidth={1.75} />
                <span className="text-xs text-muted leading-snug">{a.label}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[11px] text-muted/80 leading-relaxed max-w-2xl mx-auto">
          Trading involves substantial risk of loss. BlackBoxFX is an analytical tool for TradingView and does not guarantee profits. Always use proper risk management.
        </p>
      </div>
    </section>
  );
}
