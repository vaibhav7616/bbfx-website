import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, Pause, Play } from 'lucide-react';
import SectionHeading from './SectionHeading';

type Slide = {
  id: string;
  src: string;
  pair: string;
  tf: string;
  signal: 'BUY' | 'SELL';
  regime: string;
  last: string;
  conf: string;
  change: string;
  up: boolean;
  label: string;
};

const SLIDES: Slide[] = [
  {
    id: 'xau-buy',
    src: '/uploads/blackboxfx-chart.png',
    pair: 'XAUUSD',
    tf: '15 · OANDA',
    signal: 'BUY',
    regime: 'Strong Uptrend',
    last: '4,075.01',
    conf: '7/10',
    change: '+1.68%',
    up: true,
    label: 'Gold · Buy setup',
  },
  {
    id: 'xau-sell',
    src: '/uploads/blackboxfx-chart-2.png',
    pair: 'XAUUSD',
    tf: '5 · OANDA',
    signal: 'SELL',
    regime: 'Strong Downtrend',
    last: '4,081.09',
    conf: '8/10',
    change: '-1.18%',
    up: false,
    label: 'Gold · Sell active',
  },
  {
    id: 'xau-sell-2',
    src: '/uploads/blackboxfx-chart-3.png',
    pair: 'XAUUSD',
    tf: '5 · OANDA',
    signal: 'SELL',
    regime: 'Strong Downtrend',
    last: '4,063.675',
    conf: '6.2/10',
    change: '-1.60%',
    up: false,
    label: 'Gold · Sell continuation',
  },
  {
    id: 'xau-sell-3',
    src: '/uploads/blackboxfx-chart-4.png',
    pair: 'XAUUSD',
    tf: '5 · OANDA',
    signal: 'SELL',
    regime: 'Weak Trend',
    last: '4,052.845',
    conf: '6.7/10',
    change: '+0.08%',
    up: true,
    label: 'Gold · Scalp sell mode',
  },
];

const AUTO_MS = 3000; // auto-advance every 3 seconds
const easeSmooth = [0.22, 1, 0.36, 1] as const;

export default function ChartMockup() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchX = useRef<number | null>(null);
  const slide = SLIDES[index];

  const goTo = useCallback((next: number, direction = 1) => {
    setDir(direction);
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setProgressKey((k) => k + 1);
  }, []);

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  // Preload all slide images for buttery transitions
  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, []);

  // Smooth auto-play
  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => {
      setDir(1);
      setIndex((i) => (i + 1) % SLIDES.length);
      setProgressKey((k) => k + 1);
    }, AUTO_MS);
    return () => window.clearTimeout(t);
  }, [index, paused]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 48) {
      if (dx < 0) next();
      else prev();
    }
    setPaused(false);
  };

  return (
    <section id="chart" className="section-pad relative">
      <div className="absolute inset-0 bg-gradient-to-b from-neon/[0.015] via-transparent to-gold/[0.02]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="On-Chart Intelligence"
          title="TradingView Terminal Preview"
          subtitle="Auto-sliding live BlackBoxFX setups — BUY/SELL labels, confidence scoring, regime detection, and full risk mapping."
        />

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="rounded-2xl md:rounded-[1.35rem] overflow-hidden border border-white/10 bg-[#0c0e12] shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
            {/* Window chrome */}
            <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 bg-[#12141a] border-b border-white/[0.06]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="hidden sm:inline text-[11px] font-mono text-white/35 ml-2 truncate">
                  tradingview.com / {slide.pair} · BlackBoxFX v3.0
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="w-7 h-7 rounded-md border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                >
                  {paused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
                </button>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-signal/10 text-signal border border-signal/25">
                  LIVE
                </span>
                <span className="text-[10px] font-mono text-muted tabular-nums">
                  {index + 1}/{SLIDES.length}
                </span>
                <Expand className="w-3.5 h-3.5 text-white/30" />
              </div>
            </div>

            {/* Status strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-5 py-3 border-b border-white/[0.05] bg-[#0a0b0f]">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={slide.id + '-pair'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: easeSmooth }}
                    className="font-display text-sm font-bold text-white"
                  >
                    {slide.pair}
                  </motion.span>
                </AnimatePresence>
                <span className="text-xs text-muted font-mono">{slide.tf}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors duration-500 ${
                    slide.signal === 'BUY'
                      ? 'bg-signal/12 text-signal border-signal/25'
                      : 'bg-danger/12 text-danger border-danger/25'
                  }`}
                >
                  {slide.signal} ACTIVE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-gold/10 text-gold border border-gold/25">
                  {slide.regime}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-[11px] font-mono">
                <span className="text-muted">
                  Last <span className="text-white">{slide.last}</span>
                </span>
                <span className="text-muted">
                  Conf <span className="text-gold-bright">{slide.conf}</span>
                </span>
                <span className={slide.up ? 'text-signal' : 'text-danger'}>{slide.change}</span>
              </div>
            </div>

            <div
              className="relative bg-black aspect-[16/9] max-h-[560px] overflow-hidden select-none"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={slide.id}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 28, scale: 1.01 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: dir * -20, scale: 0.995 }}
                  transition={{ duration: 0.35, ease: easeSmooth }}
                  className="absolute inset-0"
                >
                  <img
                    src={slide.src}
                    alt={`${slide.pair} BlackBoxFX TradingView terminal preview — ${slide.label}`}
                    className="w-full h-full object-cover object-left block"
                    draggable={false}
                    decoding="async"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.04]" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/25 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/25 to-transparent" />

              {/* Nav arrows */}
              <button
                type="button"
                onClick={prev}
                aria-label="Previous chart"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass border border-white/15 flex items-center justify-center text-white hover:border-violet/50 hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next chart"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass border border-white/15 flex items-center justify-center text-white hover:border-violet/50 hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Auto-play progress */}
              <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/[0.06] z-10">
                {!paused && (
                  <motion.div
                    key={progressKey}
                    className="h-full origin-left"
                    style={{
                      background: 'linear-gradient(90deg, #f5c451, #a78bfa, #22d3ee)',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={`group relative text-left rounded-xl overflow-hidden border transition-all duration-300 ${
                  i === index
                    ? 'border-violet/45 ring-aurora scale-[1.01]'
                    : 'border-white/[0.06] hover:border-white/20 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="relative h-16 sm:h-20 overflow-hidden bg-black">
                  <img
                    src={s.src}
                    alt=""
                    className="w-full h-full object-cover object-left transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                    <span className="font-display text-[11px] font-semibold text-white">{s.pair}</span>
                    <span
                      className={`text-[10px] font-mono ${
                        s.signal === 'BUY' ? 'text-signal' : 'text-danger'
                      }`}
                    >
                      {s.signal}
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-2 bg-[#0c0e12]/95">
                  <div className="text-[10px] text-muted truncate">{s.label}</div>
                  {i === index && (
                    <div className="mt-1.5 h-[2px] rounded-full bg-white/10 overflow-hidden">
                      {!paused ? (
                        <motion.div
                          key={`thumb-${progressKey}`}
                          className="h-full bg-gradient-to-r from-gold to-violet origin-left"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
                        />
                      ) : (
                        <div className="h-full w-full bg-violet/40" />
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index
                    ? 'w-8 bg-gradient-to-r from-gold via-violet to-neon'
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono">
            {[
              { c: 'bg-signal', t: 'BUY labels' },
              { c: 'bg-danger', t: 'SELL labels' },
              { c: 'bg-gold', t: 'Confidence score' },
              { c: 'bg-neon', t: 'EMA structure' },
              { c: 'bg-violet', t: 'TP / SL levels' },
              { c: 'bg-white/40', t: 'Regime HUD' },
            ].map((x) => (
              <span
                key={x.t}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-muted"
              >
                <span className={`w-2 h-2 rounded-sm ${x.c}`} />
                {x.t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
