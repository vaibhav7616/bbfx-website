import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import SectionHeading from './SectionHeading';

type Slide = {
  id: string;
  src?: string;
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
    id: 'nas',
    pair: 'NAS100',
    tf: 'M30 · CME',
    signal: 'BUY',
    regime: 'Bullish Structure',
    last: '21,856',
    conf: '7.6/10',
    change: '+0.74%',
    up: true,
    label: 'Indices · Risk mapped',
  },
];

function MockChart({ slide }: { slide: Slide }) {
  const isBuy = slide.signal === 'BUY';
  const seed = slide.id.charCodeAt(0) + slide.id.charCodeAt(1);
  const candles = Array.from({ length: 28 }, (_, i) => {
    const base = 40 + ((seed * (i + 3)) % 40) + i * 2.2;
    const body = 8 + ((seed + i * 7) % 18);
    const up = (i + seed) % 3 !== 0;
    return {
      x: 36 + i * 24,
      open: up ? base : base + body,
      close: up ? base + body : base,
      high: base + body + 6 + (i % 5),
      low: base - 6 - (i % 4),
      up,
    };
  });

  const maxY = 190;
  const scale = (v: number) => 220 - (v / maxY) * 180;

  const ema1 = candles.map((c, i) => `${c.x + 6},${scale((c.open + c.close) / 2 + 10 + Math.sin(i / 3) * 4)}`).join(' ');
  const ema2 = candles.map((c, i) => `${c.x + 6},${scale((c.open + c.close) / 2 - 8 + Math.cos(i / 4) * 3)}`).join(' ');

  return (
    <div className="relative w-full bg-[#0a0b10] aspect-[16/9] min-h-[240px]">
      <svg viewBox="0 0 720 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1={20}
            x2={700}
            y1={30 + i * 40}
            y2={30 + i * 40}
            stroke="rgba(255,255,255,0.05)"
          />
        ))}
        <line x1={20} x2={700} y1={48} y2={48} stroke="#22d3ee" strokeDasharray="5 4" opacity={0.45} />
        <text x={690} y={44} fill="#22d3ee" fontSize={9} textAnchor="end" fontFamily="monospace">
          Daily High
        </text>
        <line x1={20} x2={700} y1={210} y2={210} stroke="#fb7185" strokeDasharray="5 4" opacity={0.4} />
        <text x={690} y={222} fill="#fb7185" fontSize={9} textAnchor="end" fontFamily="monospace">
          Daily Low
        </text>
        <line x1={20} x2={700} y1={62} y2={62} stroke="#34d399" opacity={0.35} />
        <text x={28} y={58} fill="#34d399" fontSize={9} fontFamily="monospace">
          TP3
        </text>
        <line x1={20} x2={700} y1={78} y2={78} stroke="#34d399" opacity={0.45} />
        <text x={28} y={74} fill="#34d399" fontSize={9} fontFamily="monospace">
          TP2
        </text>
        <line x1={20} x2={700} y1={94} y2={94} stroke="#34d399" opacity={0.55} />
        <text x={28} y={90} fill="#34d399" fontSize={9} fontFamily="monospace">
          TP1
        </text>
        <line x1={20} x2={700} y1={168} y2={168} stroke="#fb7185" opacity={0.55} />
        <text x={28} y={180} fill="#fb7185" fontSize={9} fontFamily="monospace">
          SL
        </text>
        <polyline points={ema1} fill="none" stroke="#f5c451" strokeWidth={1.6} opacity={0.9} />
        <polyline points={ema2} fill="none" stroke="#a78bfa" strokeWidth={1.5} opacity={0.8} />
        {candles.map((c, i) => {
          const color = c.up ? '#34d399' : '#fb7185';
          const top = scale(Math.max(c.open, c.close));
          const h = Math.max(2, Math.abs(scale(c.open) - scale(c.close)));
          return (
            <g key={i}>
              <line
                x1={c.x + 6}
                x2={c.x + 6}
                y1={scale(c.high)}
                y2={scale(c.low)}
                stroke={color}
                strokeWidth={1.2}
              />
              <rect x={c.x} y={top} width={12} height={h} rx={1} fill={color} opacity={0.92} />
            </g>
          );
        })}
        <g transform={`translate(${isBuy ? 420 : 280}, ${isBuy ? 150 : 70})`}>
          <rect
            x={-22}
            y={isBuy ? -26 : 8}
            width={48}
            height={18}
            rx={3}
            fill={isBuy ? '#34d399' : '#fb7185'}
          />
          <text
            x={2}
            y={isBuy ? -13 : 21}
            fill={isBuy ? '#05050a' : '#fff'}
            fontSize={10}
            fontWeight={700}
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            {slide.signal}
          </text>
          <line
            x1={2}
            x2={2}
            y1={isBuy ? -6 : 0}
            y2={isBuy ? 4 : 8}
            stroke={isBuy ? '#34d399' : '#fb7185'}
            strokeWidth={1.5}
          />
        </g>
        <g transform="translate(560, 28)">
          <rect width={120} height={40} rx={8} fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth={1} />
          <text x={60} y={16} fill="#9494a8" fontSize={8} textAnchor="middle" fontFamily="monospace">
            AI CONFIDENCE
          </text>
          <text x={60} y={32} fill="#f5c451" fontSize={13} fontWeight={700} textAnchor="middle" fontFamily="monospace">
            {slide.conf}
          </text>
        </g>
      </svg>

      <div className="absolute top-3 left-3 glass rounded-xl px-3 py-2 border border-white/10 hidden sm:block">
        <div className="text-[9px] font-mono text-gold tracking-wider mb-1">BLACKBOX HUD</div>
        <div className="space-y-1 text-[10px] font-mono">
          <div className="flex gap-4 justify-between">
            <span className="text-muted">Signal</span>
            <span className={isBuy ? 'text-signal' : 'text-danger'}>{slide.signal}</span>
          </div>
          <div className="flex gap-4 justify-between">
            <span className="text-muted">Pair</span>
            <span className="text-white">{slide.pair}</span>
          </div>
          <div className="flex gap-4 justify-between">
            <span className="text-muted">Regime</span>
            <span className="text-violet">{slide.regime.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChartMockup() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = SLIDES[index];

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next, paused]);

  return (
    <section id="chart" className="section-pad relative">
      <div className="absolute inset-0 bg-gradient-to-b from-neon/[0.015] via-transparent to-gold/[0.02]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="On-Chart Intelligence"
          title="TradingView Terminal Preview"
          subtitle="Swipe through live-style BlackBoxFX setups — BUY/SELL labels, confidence scoring, regime detection, and full risk mapping."
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
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-signal/10 text-signal border border-signal/25">
                  LIVE
                </span>
                <span className="text-[10px] font-mono text-muted">
                  {index + 1}/{SLIDES.length}
                </span>
                <Expand className="w-3.5 h-3.5 text-white/30" />
              </div>
            </div>

            {/* Status strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-5 py-3 border-b border-white/[0.05] bg-[#0a0b0f]">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="font-display text-sm font-bold text-white">{slide.pair}</span>
                <span className="text-xs text-muted font-mono">{slide.tf}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
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

            <div className="relative bg-black">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {slide.src ? (
                    <img
                      src={slide.src}
                      alt={`${slide.pair} BlackBoxFX TradingView terminal preview`}
                      className="w-full h-auto block max-h-[560px] object-cover object-left"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <MockChart slide={slide} />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.04]" />

              {/* Nav arrows */}
              <button
                type="button"
                onClick={prev}
                aria-label="Previous chart"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass border border-white/15 flex items-center justify-center text-white hover:border-violet/50 hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next chart"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass border border-white/15 flex items-center justify-center text-white hover:border-violet/50 hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails / dots */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`text-left rounded-xl px-3 py-3 border transition-all ${
                  i === index
                    ? 'glass-gold border-violet/40 ring-aurora'
                    : 'glass border-white/[0.06] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-display text-xs font-semibold text-white">{s.pair}</span>
                  <span
                    className={`text-[10px] font-mono ${
                      s.signal === 'BUY' ? 'text-signal' : 'text-danger'
                    }`}
                  >
                    {s.signal}
                  </span>
                </div>
                <div className="text-[10px] text-muted truncate">{s.label}</div>
              </button>
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
