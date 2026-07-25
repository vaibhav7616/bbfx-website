import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Zap, Target, LineChart, ShieldCheck, ChevronDown } from 'lucide-react';
import { METRICS } from '../lib/constants';
import { fadeUp, spring, staggerContainer, staggerFast } from '../lib/motion';
import ParticleField from './ParticleField';
import AuroraBg from './AuroraBg';
import MagneticButton from './MagneticButton';

const HeroTerminal = lazy(() => import('./HeroTerminal'));

const iconMap = [LineChart, Sparkles, Target, Zap];

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[calc(100dvh-4.25rem)] flex items-center overflow-hidden">
      <AuroraBg intensity="strong" />
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 noise-overlay opacity-[0.04] pointer-events-none" />
      <ParticleField />

      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%] opacity-45 sm:opacity-60 md:opacity-85 lg:opacity-100 pointer-events-none">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-2 border-violet/30 border-t-neon animate-spin" />
            </div>
          }
        >
          <HeroTerminal />
        </Suspense>
      </div>

      {/* Soft vignette so text stays readable over 3D */}
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/90 to-void/20 lg:to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/50 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 w-full py-14 md:py-20 lg:py-24">
        <motion.div
          className="max-w-2xl lg:max-w-3xl"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-gold mb-6 ring-aurora"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-signal" />
            </span>
            <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-gold-bright">
              TradingView · AI Desk System · v3.0
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[2.2rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight"
          >
            <span className="text-white">Trade Like </span>
            <span className="hero-gradient-text">Institutions</span>
            <br />
            <span className="text-white/95">with BlackBoxFX </span>
            <span className="neon-gradient">v3.0</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 md:mt-6 text-[15px] sm:text-lg md:text-xl text-white/55 max-w-xl leading-relaxed"
          >
            AI-powered multi-confirmation trading system built for Forex, Gold, Crypto, Indices & Stocks —
            confidence scoring, regime detection, and automatic risk levels on every setup.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-3">
            <MagneticButton
              href="/checkout?plan=monthly"
              className="btn-gold px-8 py-3.5 rounded-xl text-center text-[15px] inline-flex items-center justify-center"
            >
              Get Access — ₹99/mo
            </MagneticButton>
            <MagneticButton
              href="#demo"
              strength={0.25}
              className="btn-ghost px-8 py-3.5 rounded-xl text-center text-[15px] inline-flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch 4-min Demo
            </MagneticButton>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-muted"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-signal" /> From ₹99/month
            </span>
            <span className="text-white/15">·</span>
            <span>Free updates</span>
            <span className="text-white/15">·</span>
            <span>TradingView ready</span>
            <span className="text-white/15">·</span>
            <span>Non-repainting</span>
          </motion.div>

          <motion.div
            variants={staggerFast}
            className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
          >
            {METRICS.map((m, i) => {
              const Icon = iconMap[i];
              const color =
                m.color === 'gold' ? 'text-gold' : m.color === 'neon' ? 'text-neon' : 'text-signal';
              return (
                <motion.div
                  key={m.label}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: spring.snappy }}
                  className="glass rounded-xl p-3.5 sm:p-4 border border-white/[0.07] hover:border-violet/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className={`font-mono text-xs font-semibold ${color}`}>{m.value}</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted leading-snug">{m.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1 text-muted hover:text-violet transition-colors"
        aria-label="Scroll to features"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">Explore</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.a>
    </section>
  );
}
