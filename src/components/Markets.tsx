import { motion } from 'framer-motion';
import {
  DollarSign,
  Coins,
  Bitcoin,
  TrendingUp,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';
import { MARKETS } from '../lib/constants';
import SectionHeading from './SectionHeading';

const ICONS: Record<string, LucideIcon> = {
  DollarSign,
  Coins,
  Bitcoin,
  TrendingUp,
  BarChart3,
};

export default function Markets() {
  return (
    <section className="section-pad relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Multi-Asset Coverage"
          title="Supported Markets"
          subtitle="One indicator. Full market stack. Deploy BlackBoxFX wherever liquidity and opportunity meet."
        />

        <div className="mt-14 flex flex-wrap justify-center gap-4 md:gap-5">
          {MARKETS.map((m, i) => {
            const Icon = ICONS[m.icon];
            return (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 24, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="float-anim w-[140px] sm:w-[160px] glass-gold rounded-2xl p-5 text-center"
                style={{ animationDelay: `${i * 0.7}s` }}
              >
                <div className="mx-auto w-14 h-14 rounded-2xl bg-void/80 border border-violet/25 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(167,139,250,0.2)]">
                  {Icon && <Icon className="w-7 h-7 text-neon" strokeWidth={1.5} />}
                </div>
                <div className="font-display text-sm font-semibold text-white">{m.name}</div>
                <div className="text-[11px] text-muted mt-1">{m.desc}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
