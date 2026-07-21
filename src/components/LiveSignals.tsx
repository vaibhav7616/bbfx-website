import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

interface Signal {
  id: number;
  pair: string;
  side: 'BUY' | 'SELL';
  conf: number;
  tf: string;
  entry: string;
  time: string;
}

const POOL: Omit<Signal, 'id' | 'time'>[] = [
  { pair: 'XAUUSD', side: 'BUY', conf: 8.7, tf: 'H1', entry: '4,071.20' },
  { pair: 'EURUSD', side: 'SELL', conf: 7.4, tf: 'M15', entry: '1.0846' },
  { pair: 'BTCUSD', side: 'BUY', conf: 9.1, tf: 'H4', entry: '97,180' },
  { pair: 'NAS100', side: 'BUY', conf: 7.9, tf: 'H1', entry: '21,840' },
  { pair: 'GBPUSD', side: 'BUY', conf: 6.8, tf: 'M30', entry: '1.2712' },
  { pair: 'USDJPY', side: 'SELL', conf: 8.2, tf: 'H1', entry: '149.74' },
  { pair: 'ETHUSD', side: 'BUY', conf: 7.6, tf: 'H1', entry: '3,598' },
  { pair: 'US30', side: 'SELL', conf: 6.5, tf: 'M15', entry: '43,188' },
];

function nowLabel() {
  const d = new Date();
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function LiveSignals() {
  const [signals, setSignals] = useState<Signal[]>(() =>
    POOL.slice(0, 5).map((s, i) => ({
      ...s,
      id: i,
      time: nowLabel(),
    }))
  );

  useEffect(() => {
    let n = 5;
    const t = setInterval(() => {
      const next = POOL[n % POOL.length];
      n += 1;
      setSignals((prev) =>
        [{ ...next, id: Date.now(), time: nowLabel() }, ...prev].slice(0, 6)
      );
    }, 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="section-pad relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon/[0.015] to-transparent" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Real-Time Desk Feed"
          title="Institutional Signal Stream"
          subtitle="A live preview of how BlackBoxFX surfaces multi-asset opportunities with confidence-ranked conviction."
        />

        <div className="mt-12 grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 glass rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-neon" />
                <span className="text-sm font-semibold text-white">Signal Tape</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                STREAMING
              </div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              <div className="hidden sm:grid grid-cols-6 gap-2 px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted/70">
                <span>Time</span>
                <span>Pair</span>
                <span>Side</span>
                <span>TF</span>
                <span>Entry</span>
                <span className="text-right">Conf</span>
              </div>

              <AnimatePresence initial={false} mode="popLayout">
                {signals.map((s) => (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, x: -12, backgroundColor: 'rgba(212,175,55,0.08)' }}
                    animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-2 sm:grid-cols-6 gap-2 px-5 py-3.5 items-center text-sm"
                  >
                    <span className="font-mono text-xs text-muted">{s.time}</span>
                    <span className="font-semibold text-white">{s.pair}</span>
                    <span className={`inline-flex items-center gap-1 font-mono text-xs font-bold ${
                      s.side === 'BUY' ? 'text-signal' : 'text-danger'
                    }`}>
                      {s.side === 'BUY' ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {s.side}
                    </span>
                    <span className="font-mono text-xs text-muted">{s.tf}</span>
                    <span className="font-mono text-xs text-white/90">{s.entry}</span>
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden sm:block w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold to-neon"
                          style={{ width: `${s.conf * 10}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold text-gold-bright">{s.conf.toFixed(1)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="glass-gold rounded-2xl p-6 flex-1">
              <div className="text-[11px] font-mono tracking-widest text-gold uppercase mb-3">Desk Summary</div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">Confidence-first execution</h3>
              <p className="text-sm text-muted leading-relaxed mb-5">
                Every alert is scored 1–10 before it hits your chart. Filter noise. Scale only when the matrix agrees.
              </p>
              <ul className="space-y-3 text-sm">
                {[
                  'Multi-timeframe bias lock',
                  'Regime-aware entries',
                  'Auto SL + TP1/TP2/TP3',
                  'Currency strength filter',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-white/85">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-2xl p-5 border border-white/[0.06]">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[11px] text-muted font-mono mb-1">SESSION WIN RATE</div>
                  <div className="font-display text-3xl font-bold text-signal">76.8%</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-muted font-mono mb-1">AVG R:R</div>
                  <div className="font-display text-3xl font-bold text-gold">1:2.9</div>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-muted leading-relaxed">
                Illustrative session metrics from structured high-confidence setups. Not a performance guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
