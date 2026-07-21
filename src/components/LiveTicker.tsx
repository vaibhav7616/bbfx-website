import { useMemo } from 'react';

const TICKS = [
  { s: 'XAUUSD', p: '4,075.01', c: '+1.68%', up: true },
  { s: 'EURUSD', p: '1.0842', c: '-0.12%', up: false },
  { s: 'BTCUSD', p: '97,420', c: '+2.41%', up: true },
  { s: 'NAS100', p: '21,856', c: '+0.74%', up: true },
  { s: 'GBPUSD', p: '1.2718', c: '+0.09%', up: true },
  { s: 'USDJPY', p: '149.62', c: '-0.21%', up: false },
  { s: 'ETHUSD', p: '3,612', c: '+1.95%', up: true },
  { s: 'US30', p: '43,210', c: '+0.38%', up: true },
  { s: 'SPX500', p: '5,892', c: '+0.52%', up: true },
  { s: 'USOIL', p: '71.24', c: '-0.64%', up: false },
];

export default function LiveTicker() {
  const row = useMemo(() => [...TICKS, ...TICKS], []);

  return (
    <div className="relative z-40 border-b border-white/[0.06] bg-[#07070f]/95 backdrop-blur-md">
      <div className="flex items-center">
        <div className="shrink-0 px-3 sm:px-4 py-2 bg-gradient-to-r from-violet/20 to-gold/10 border-r border-violet/25 flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-signal" />
          </span>
          <span className="text-[10px] font-mono font-semibold tracking-widest text-gold uppercase">Live</span>
        </div>
        <div className="overflow-hidden flex-1 mask-ticker">
          <div className="ticker-track flex whitespace-nowrap py-2">
            {row.map((t, i) => (
              <div key={`${t.s}-${i}`} className="inline-flex items-center gap-2 px-5 font-mono text-[11px] sm:text-xs">
                <span className="text-white/70 font-medium">{t.s}</span>
                <span className="text-white">{t.p}</span>
                <span className={t.up ? 'text-signal' : 'text-danger'}>{t.c}</span>
                <span className="text-violet/30">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
