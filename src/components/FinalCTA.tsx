import { motion } from 'framer-motion';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import AuroraBg from './AuroraBg';
import BuyButton from './BuyButton';
import { fadeUp, staggerContainer } from '../lib/motion';

export default function FinalCTA() {
  return (
    <section id="final-cta" className="section-pad relative overflow-hidden pb-28 md:pb-32">
      <AuroraBg intensity="normal" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative mx-auto max-w-4xl text-center px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative glass-gold rounded-3xl p-8 md:p-14 border border-violet/25 overflow-hidden ring-aurora"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold via-violet to-transparent" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet/20 rounded-full blur-3xl pointer-events-none" />

          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal/10 border border-signal/30 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            <span className="text-[11px] font-mono text-signal tracking-wider uppercase">Systems Online</span>
          </motion.div>

          <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Start Trading with{' '}
            <span className="hero-gradient-text">Institutional-Level</span> Precision
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-white/55 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Join traders using BlackBoxFX v3.0 to identify high-probability opportunities with confidence-scored setups and automatic risk levels.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-20">
            <BuyButton
              plan="monthly"
              className="btn-gold px-8 py-3.5 rounded-xl text-base inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Checkout ₹99/mo
              <ArrowRight className="w-4 h-4" />
            </BuyButton>
            <BuyButton
              plan="yearly"
              className="btn-ghost px-8 py-3.5 rounded-xl text-base inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Checkout ₹999/yr
            </BuyButton>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4">
            <a
              href="mailto:support@blackboxfx.io"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-neon transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-signal" />
              Opens secure checkout form
            </span>
            <span className="text-white/15">·</span>
            <span>No scroll loop</span>
            <span className="text-white/15">·</span>
            <span>Instant TradingView invite flow</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
