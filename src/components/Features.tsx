import { motion } from 'framer-motion';
import {
  Layers,
  Gauge,
  Activity,
  Grid3x3,
  RefreshCcw,
  Shield,
  Radar,
  MonitorSmartphone,
  type LucideIcon,
} from 'lucide-react';
import { FEATURES } from '../lib/constants';
import { cardItem, staggerContainer } from '../lib/motion';
import SectionHeading from './SectionHeading';
import AuroraBg from './AuroraBg';
import { TiltCard } from './MagneticButton';

const ICONS: Record<string, LucideIcon> = {
  Layers,
  Gauge,
  Activity,
  Grid3x3,
  RefreshCcw,
  Shield,
  Radar,
  MonitorSmartphone,
};

const accentStyles = {
  gold: {
    border: 'group-hover:border-gold/40',
    iconBg: 'from-gold/25 via-gold/10 to-violet/10 text-gold border-gold/25',
    glow: 'group-hover:shadow-[0_20px_50px_rgba(245,196,81,0.12)]',
    bar: 'from-gold via-violet to-transparent',
  },
  neon: {
    border: 'group-hover:border-neon/40',
    iconBg: 'from-neon/25 via-neon/10 to-violet/10 text-neon border-neon/25',
    glow: 'group-hover:shadow-[0_20px_50px_rgba(34,211,238,0.12)]',
    bar: 'from-neon via-violet to-transparent',
  },
  signal: {
    border: 'group-hover:border-signal/40',
    iconBg: 'from-signal/25 via-signal/10 to-neon/10 text-signal border-signal/25',
    glow: 'group-hover:shadow-[0_20px_50px_rgba(52,211,153,0.12)]',
    bar: 'from-signal via-neon to-transparent',
  },
};

export default function Features() {
  return (
    <section id="features" className="section-pad relative">
      <AuroraBg intensity="soft" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Core Intelligence"
          title="Eight Engines. One Edge."
          subtitle="BlackBoxFX v3.0 fuses institutional analytics into a single TradingView terminal — built for precision, speed, and conviction."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4"
        >
          {FEATURES.map((f) => {
            const Icon = ICONS[f.icon];
            const style = accentStyles[f.accent];
            return (
              <motion.div key={f.id} variants={cardItem}>
                <TiltCard>
                  <article
                    className={`group glass rounded-2xl p-5 md:p-6 border border-white/[0.07] ${style.border} ${style.glow} transition-all duration-300 overflow-hidden h-full`}
                  >
                    <div className={`absolute top-0 left-5 right-5 h-px bg-gradient-to-r ${style.bar} opacity-60`} />
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br border ${style.iconBg}`}
                      style={{ transform: 'translateZ(24px)' }}
                    >
                      {Icon && <Icon className="w-5 h-5" strokeWidth={1.5} />}
                    </div>
                    <h3
                      className="font-display text-[15px] md:text-base font-semibold text-white mb-2 leading-snug"
                      style={{ transform: 'translateZ(16px)' }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-[13px] text-muted leading-relaxed">{f.description}</p>
                  </article>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
