import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { PERFORMANCE } from '../lib/constants';
import SectionHeading from './SectionHeading';

function AnimatedStat({ value, label, sub, delay }: { value: string; label: string; sub: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => {
    if (value.includes('%')) return `${Math.round(v)}%`;
    if (value.includes('s')) return `<${Math.max(1, Math.round(v))}s`;
    return value;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (value.includes('%')) animate(mv, 100, { duration: 1.6, delay });
          else if (value.includes('s')) animate(mv, 1, { duration: 1.2, delay });
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, mv, value]);

  const showAnimated = value.includes('%') || value.includes('s');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="glass rounded-2xl p-6 border border-white/5 hover:border-gold/25 transition-colors group"
    >
      <div className="font-display text-3xl md:text-4xl font-bold gold-gradient mb-2">
        {showAnimated ? <motion.span>{display}</motion.span> : value}
      </div>
      <div className="text-sm font-semibold text-white mb-1">{label}</div>
      <div className="text-xs text-muted">{sub}</div>
      <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold via-neon to-signal"
          initial={{ width: 0 }}
          whileInView={{ width: `${70 + (delay * 100) % 30}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.2 }}
        />
      </div>
    </motion.div>
  );
}

export default function Performance() {
  return (
    <section id="performance" className="section-pad relative">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="System Performance"
          title="Built for Serious Capital"
          subtitle="Every module is engineered for clarity under pressure — the same standards expected on institutional desks."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {PERFORMANCE.map((p, i) => (
            <AnimatedStat key={p.label} {...p} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
