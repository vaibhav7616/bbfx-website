import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pricing = document.getElementById('pricing');
      if (!pricing) {
        setShow(window.scrollY > 600);
        return;
      }
      const rect = pricing.getBoundingClientRect();
      const pastHero = window.scrollY > 700;
      const overPricing = rect.top < window.innerHeight && rect.bottom > 0;
      setShow(pastHero && !overPricing);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-0 inset-x-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
        >
          <div className="glass-gold rounded-2xl p-3 flex items-center gap-3 shadow-2xl shadow-black/50 border border-gold/30">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">BlackBoxFX v3.0</div>
              <div className="text-[11px] text-muted">
                <span className="text-gold font-semibold">₹99</span>
                <span className="ml-1">/mo</span>
                <span className="mx-1.5 text-white/20">·</span>
                <span className="text-violet font-semibold">₹999</span>
                <span className="ml-1">/yr</span>
              </div>
            </div>
            <Link to="/checkout?plan=monthly" className="btn-gold shrink-0 px-4 py-2.5 rounded-xl text-sm">
              Get Access
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
