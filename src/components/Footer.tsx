import { Hexagon } from 'lucide-react';

const COLS = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'How it works' },
      { href: '#chart', label: 'Terminal preview' },
      { href: '#pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '#demo', label: 'Demo' },
      { href: '#faq', label: 'FAQ' },
      { href: '#signals', label: 'Signal feed' },
      { href: '#final-cta', label: 'Get access' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: 'mailto:support@blackboxfx.io', label: 'Email support' },
      { href: '#faq', label: 'Installation help' },
      { href: '#pricing', label: 'Licensing' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#040405]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <a href="#top" className="inline-flex items-center gap-2.5">
              <Hexagon className="w-7 h-7 text-gold fill-gold/10" strokeWidth={1.5} />
              <div>
                <div className="font-display font-bold text-sm tracking-[0.14em]">
                  BLACKBOX<span className="text-gold">FX</span>
                </div>
                <div className="text-[10px] text-muted tracking-widest uppercase">v3.0 Professional</div>
              </div>
            </a>
            <p className="mt-4 text-sm text-muted leading-relaxed max-w-sm">
              Institutional-grade multi-confirmation trading intelligence for TradingView — built for serious Forex, Gold, Crypto, Indices & equity desks.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              Systems operational
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/40 mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-muted hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-7 border-t border-white/[0.05] flex flex-col lg:flex-row justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} BlackBoxFX. All rights reserved.</p>
          <p className="max-w-xl lg:text-right leading-relaxed">
            Risk disclosure: Trading leveraged products carries a high level of risk and may not be suitable for all investors. Past results are not indicative of future performance. BlackBoxFX is an analytical indicator and does not provide financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
