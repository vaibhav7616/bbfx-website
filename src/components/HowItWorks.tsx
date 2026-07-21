import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { STEPS } from '../lib/constants';
import SectionHeading from './SectionHeading';
import { Search, Brain, Crosshair } from 'lucide-react';
import { cardItem, staggerContainer } from '../lib/motion';
import AuroraBg from './AuroraBg';

const icons = [Search, Brain, Crosshair];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 40%'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="section-pad relative overflow-hidden">
      <AuroraBg intensity="soft" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Execution Flow"
          title="How It Works"
          subtitle="Three disciplined stages from market scan to risk-defined execution."
        />

        <div ref={ref} className="mt-16 relative">
          <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full origin-left rounded-full"
              style={{
                scaleX: lineScale,
                background: 'linear-gradient(90deg, #f5c451, #a78bfa, #22d3ee)',
              }}
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 md:gap-8"
          >
            {STEPS.map((s, i) => {
              const Icon = icons[i];
              return (
                <motion.div key={s.step} variants={cardItem} className="relative">
                  <div className="glass-gold rounded-2xl p-6 md:p-8 h-full hover:ring-aurora transition-shadow duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <motion.div
                        whileHover={{ rotate: 8, scale: 1.08 }}
                        className="w-14 h-14 rounded-2xl bg-void border border-violet/30 flex items-center justify-center"
                        style={{
                          boxShadow: '0 0 30px rgba(167,139,250,0.2)',
                        }}
                      >
                        <Icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
                      </motion.div>
                      <span className="font-display text-4xl font-bold bg-gradient-to-b from-white/15 to-transparent bg-clip-text text-transparent">
                        {s.step}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-neon mb-2 tracking-wider">STEP {s.step}</div>
                    <h3 className="font-display text-xl font-semibold text-white mb-3">{s.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{s.description}</p>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div className="hidden md:flex absolute top-14 -right-4 z-10 w-8 h-8 items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet shadow-[0_0_16px_#a78bfa]" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
