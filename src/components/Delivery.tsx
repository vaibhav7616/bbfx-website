import { motion } from 'framer-motion';
import { KeyRound, MonitorSmartphone, ShieldCheck, UserCheck } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { cardItem, staggerContainer } from '../lib/motion';

const STEPS = [
  {
    icon: UserCheck,
    title: 'You share TV username',
    desc: 'At checkout we collect your exact TradingView username — required for invite-only access.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure payment',
    desc: 'Pay via UPI, cards or netbanking (Razorpay). Order is saved with plan, amount and expiry.',
  },
  {
    icon: KeyRound,
    title: 'Invite-only unlock',
    desc: 'We add your username on the BlackBoxFX Pine script access list after payment confirms.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Open in TradingView',
    desc: 'Indicators → Invite-only → BlackBoxFX. Apply on chart and trade with the full dashboard.',
  },
];

export default function Delivery() {
  return (
    <section id="delivery" className="section-pad relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="How you receive access"
          title="TradingView Invite-Only Delivery"
          subtitle="No zip files. No shady downloads. Professional invite-only script delivery on TradingView."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                variants={cardItem}
                className="glass rounded-2xl p-5 border border-white/[0.06] hover:border-violet/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-violet/10 border border-violet/25 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-violet" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-xs text-white/25">0{i + 1}</span>
                </div>
                <h3 className="font-display text-base font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
