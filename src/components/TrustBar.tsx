import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Zap, Award, Users, Globe2 } from 'lucide-react';

const STATS = [
  { icon: Users, value: '2,674', label: 'Active traders' },
  { icon: Globe2, value: '1', label: 'Country' },
  { icon: Zap, value: '<1s', label: 'Alert latency' },
  { icon: Award, value: '4.9/5', label: 'Avg. rating' },
];

const BADGES = [
  { icon: ShieldCheck, label: 'Non-repainting logic' },
  { icon: Lock, label: 'Secure subscription access' },
  { icon: Zap, label: 'Instant TradingView access' },
];

export default function TrustBar() {
  return (
    <section className="relative border-y border-white/[0.05] bg-obsidian/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-10">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-3">
                  <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                </div>
                <div className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">{s.value}</div>
                <div className="text-xs text-muted mt-1 tracking-wide">{s.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.label}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.07] text-xs text-muted"
              >
                <Icon className="w-3.5 h-3.5 text-neon" strokeWidth={1.75} />
                {b.label}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
