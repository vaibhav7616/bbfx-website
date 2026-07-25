import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Hexagon } from 'lucide-react';

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'System' },
  { href: '#signals', label: 'Signals' },
  { href: '#chart', label: 'Terminal' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-[#05050a]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.45)]'
          : 'bg-[#05050a]/40 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 h-[4.25rem] flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative">
            <Hexagon className="w-8 h-8 text-gold fill-gold/10 group-hover:text-gold-bright transition-colors" strokeWidth={1.5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-display font-bold text-gold">BB</span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-[13px] tracking-[0.14em] text-white">
              BLACKBOX<span className="text-gold">FX</span>
            </span>
            <span className="text-[9px] text-muted tracking-[0.22em] uppercase mt-0.5">Institutional v3.0</span>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-0.5">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-[13px] text-white/55 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2.5">
          <a href="#demo" className="btn-ghost px-4 py-2 rounded-lg text-[13px]">
            Watch Demo
          </a>
          <a href="/checkout?plan=monthly" className="btn-gold px-5 py-2 rounded-lg text-[13px]">
            Buy Now — ₹99/mo
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden p-2.5 rounded-xl border border-white/10 text-white bg-white/[0.03]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-white/[0.06] bg-[#05050a]/98 backdrop-blur-2xl"
          >
            <div className="px-4 py-5 flex flex-col gap-1 max-h-[calc(100dvh-4.25rem)] overflow-y-auto">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3.5 text-[15px] text-white/70 hover:text-white rounded-xl hover:bg-white/[0.04]"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-3 grid gap-2">
                <a
                  href="#demo"
                  onClick={() => setOpen(false)}
                  className="btn-ghost text-center px-5 py-3.5 rounded-xl text-sm"
                >
                  Watch Demo
                </a>
                <a
                  href="/checkout?plan=monthly"
                  onClick={() => setOpen(false)}
                  className="btn-gold text-center px-5 py-3.5 rounded-xl text-sm"
                >
                  Buy Now — ₹99/mo
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
