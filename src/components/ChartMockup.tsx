import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
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

const AUTO_MS = 4500;

const springSlide = {
  type: 'spring' as const,
  stiffness: 90,
  damping: 22,
  mass: 0.95,
};

export default function ChartMockup() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchX = useRef<number | null>(null);
  const slide = SLIDES[index];

  const slideTo = useCallback((nextIndex: number) => {
    const i = ((nextIndex % SLIDES.length) + SLIDES.length) % SLIDES.length;
    setIndex(i);
    setProgressKey((k) => k + 1);
  }, []);

  const next = useCallback(() => slideTo(index + 1), [index, slideTo]);
  const prev = useCallback(() => slideTo(index - 1), [index, slideTo]);

  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => slideTo(index + 1), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, slideTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) {
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
          subtitle="Real BlackBoxFX chart captures — full-frame images with smooth auto-slide."
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="rounded-2xl md:rounded-[1.25rem] overflow-hidden border border-white/10 bg-[#0b0d12] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            {/* Chrome */}
            <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 bg-[#12151c] border-b border-white/[0.06]">
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
              </div>
            </div>

            {/* Status — asset, setup type, strength only */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-5 py-2.5 border-b border-white/[0.05] bg-[#0a0c11]">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="font-display text-sm font-bold text-gold">Gold</span>
                <span className="text-xs text-muted font-mono">{slide.pair}</span>
                <span className="text-xs text-muted font-mono">{slide.tf}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    slide.signal === 'BUY'
                      ? 'bg-signal/12 text-signal border-signal/25'
                      : 'bg-danger/12 text-danger border-danger/25'
                  }`}
                >
                  {slide.signal} SETUP
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-gold/10 text-gold border border-gold/25">
                  {slide.regime}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-[11px] font-mono">
                <span className="text-muted">
                  Conf <span className="text-gold-bright">{slide.conf}</span>
                </span>
                <span className={slide.up ? 'text-signal' : 'text-danger'}>{slide.change}</span>
              </div>
            </div>

            {/* Image slider — full image, proper box, smooth spring track */}
            <div
              className="relative bg-[#05060a] select-none"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="overflow-hidden w-full">
                <motion.div
                  className="flex flex-nowrap will-change-transform"
                  // % is relative to the track width (n slides), so step = 100/n
                  animate={{ x: `${-(index * 100) / SLIDES.length}%` }}
                  transition={springSlide}
                  style={{ width: `${SLIDES.length * 100}%` }}
                >
                  {SLIDES.map((s) => (
                    <div
                      key={s.id}
                      className="shrink-0 grow-0 flex items-center justify-center bg-[#05060a]"
                      style={{ width: `${100 / SLIDES.length}%` }}
                    >
                      <img
                        src={s.src}
                        alt={`${s.pair} BlackBoxFX chart — ${s.label}`}
                        className="block w-full h-auto max-h-[min(70vh,620px)] object-contain object-center"
                        draggable={false}
                        decoding="async"
                        loading={s.id === SLIDES[0].id ? 'eager' : 'lazy'}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>

              <button
                type="button"
                onClick={prev}
                aria-label="Previous chart"
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/80 hover:border-violet/40 transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next chart"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/80 hover:border-violet/40 transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/[0.06] z-10">
                {!paused && (
                  <motion.div
                    key={progressKey}
                    className="h-full origin-left rounded-r-full"
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

          {/* Simple dots only — no thumbnail cards */}
          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}: ${s.signal} ${s.regime}`}
                  onClick={() => slideTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === index
                      ? 'w-8 bg-gradient-to-r from-gold via-violet to-neon'
                      : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-xs sm:text-sm text-muted">
              <span className="text-gold font-semibold">Gold (XAUUSD)</span>
              <span className="mx-2 text-white/20">·</span>
              <span className={slide.signal === 'BUY' ? 'text-signal font-semibold' : 'text-danger font-semibold'}>
                {slide.signal}
              </span>
              <span className="mx-2 text-white/20">·</span>
              <span className="text-white/80">{slide.regime}</span>
              <span className="mx-2 text-white/20">·</span>
              <span className="text-gold-bright font-mono">Conf {slide.conf}</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
