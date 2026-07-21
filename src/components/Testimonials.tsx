import { motion } from 'framer-motion';
import { Star, Quote, BadgeCheck } from 'lucide-react';
import { TESTIMONIALS } from '../lib/constants';
import SectionHeading from './SectionHeading';

export default function Testimonials() {
  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Social Proof"
          title="Trusted on Real Desks"
          subtitle="Operators use BlackBoxFX to filter noise, score conviction, and execute with structure — not impulse."
        />

        <div className="mt-14 grid md:grid-cols-3 gap-4 md:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-6 md:p-7 border border-white/[0.06] hover:border-gold/25 transition-all duration-300 relative flex flex-col"
            >
              <Quote className="absolute top-5 right-5 w-7 h-7 text-gold/10" />
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-muted">VERIFIED</span>
              </div>
              <p className="text-sm md:text-[15px] text-white/88 leading-relaxed mb-6 flex-1">
                "{t.quote}"
              </p>
              <footer className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/35 via-gold/10 to-neon/25 flex items-center justify-center font-display text-[11px] font-bold text-white ring-1 ring-white/10">
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    {t.name}
                    <BadgeCheck className="w-3.5 h-3.5 text-neon shrink-0" />
                  </div>
                  <div className="text-xs text-muted truncate">{t.role}</div>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
