import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import SectionHeading from './SectionHeading';

/** Only real uploaded screenshots — no mock charts */
const SLIDES = [
  {
    id: 'chart-1',
    src: '/uploads/blackboxfx-chart.png',
    signal: 'BUY' as const,
    regime: 'Strong Uptrend',
    conf: '7/10',
  },
  {
    id: 'chart-2',
    src: '/uploads/blackboxfx-chart-2.png',
    signal: 'SELL' as const,
    regime: 'Strong Downtrend',
    conf: '8/10',
  },
  {
    id: 'chart-3',
    src: '/uploads/blackboxfx-chart-3.png',
    signal: 'SELL' as const,
    regime: 'Strong Downtrend',
    conf: '6.2/10',
  },
  {
    id: 'chart-4',
    src: '/uploads/blackboxfx-chart-4.png',
    signal: 'SELL' as const,
    regime: 'Weak Trend',
    conf: '6.7/10',
  },
];

const AUTO_MS = 4500;
const N = SLIDES.length;

export default function ChartMockup() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchX = useRef<number | null>(null);
  const indexRef = useRef(0);
  const slide = SLIDES[index];

  const slideTo = useCallback((nextIndex: number) => {
    const i = ((nextIndex % N) + N) % N;
    indexRef.current = i;
    setIndex(i);
    setProgressKey((k) => k + 1);
  }, []);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => slideTo(indexRef.current + 1), AUTO_MS);
    return () => window.clearInterval(t);
  }, [paused, slideTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) {
      slideTo(indexRef.current + (dx < 0 ? 1 : -1));
    }
  };

  return (
    <section id="chart" className="section-pad relative">
      <div className="absolute inset-0 bg-gradient-to-b from-neon/[0.015] via-transparent to-gold/[0.02]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="On-Chart Intelligence"
          title="TradingView Terminal Preview"
          subtitle="Real BlackBoxFX chart captures — auto-sliding full screenshots only."
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mt-12"
        >
          <div
            className="rounded-2xl md:rounded-[1.25rem] overflow-hidden border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Minimal bar */}
            <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 bg-[#0e1016] border-b border-white/[0.06]">
              <span className="text-[11px] font-mono text-white/40">
                BlackBoxFX · XAUUSD · {index + 1}/{N}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="w-7 h-7 rounded-md border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/60 hover:text-white"
                  aria-label={paused ? 'Play' : 'Pause'}
                >
                  {paused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
                </button>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-signal/10 text-signal border border-signal/25">
                  LIVE
                </span>
              </div>
            </div>

            {/* Image track — real PNGs only */}
            <div
              className="relative bg-black select-none"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="overflow-hidden w-full">
                <div
                  className="flex flex-nowrap transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                  style={{
                    width: `${N * 100}%`,
                    transform: `translate3d(-${(index * 100) / N}%, 0, 0)`,
                  }}
                >
                  {SLIDES.map((s, i) => (
                    <div
                      key={s.id}
                      className="shrink-0 grow-0 bg-black"
                      style={{ width: `${100 / N}%` }}
                    >
                      <img
                        src={s.src}
                        alt={`BlackBoxFX TradingView chart ${i + 1}`}
                        className="block w-full h-auto"
                        draggable={false}
                        decoding="async"
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => slideTo(indexRef.current - 1)}
                aria-label="Previous"
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/75 border border-white/20 flex items-center justify-center text-white hover:bg-violet/30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => slideTo(indexRef.current + 1)}
                aria-label="Next"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/75 border border-white/20 flex items-center justify-center text-white hover:bg-violet/30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/[0.06] z-10 pointer-events-none">
                {!paused && (
                  <motion.div
                    key={progressKey}
                    className="h-full origin-left"
                    style={{ background: 'linear-gradient(90deg, #f5c451, #a78bfa, #22d3ee)' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Dots only — no fake thumbnail cards */}
          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => slideTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? 'w-9 bg-gradient-to-r from-gold via-violet to-neon'
                      : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-xs sm:text-sm text-muted">
              <span className="text-gold font-semibold">XAUUSD</span>
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
