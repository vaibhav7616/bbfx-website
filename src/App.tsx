import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/AdminPage';

const SECTION_IDS = new Set([
  'top',
  'features',
  'how-it-works',
  'signals',
  'chart',
  'demo',
  'pricing',
  'faq',
  'final-cta',
  'delivery',
  'performance',
]);

function ScrollManager() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Legacy / broken hashes like "#final-cta" (missing slash) are NOT routes.
    // HashRouter would treat them as path "/final-cta". Recover to home + scroll.
    const raw = window.location.hash || '';
    // Patterns: #final-cta  |  #pricing  (no leading slash after #)
    if (raw && !raw.startsWith('#/')) {
      const section = raw.replace(/^#/, '').split('?')[0];
      if (SECTION_IDS.has(section)) {
        // Normalize URL to home route, then scroll to section
        if (window.location.hash !== '#/') {
          window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/`);
        }
        navigate('/', { replace: true });
        window.setTimeout(() => {
          const el = document.getElementById(section);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
      }
    }

    if (pathname !== '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    // Home with optional section via query: #/?section=pricing
    const sectionParam = new URLSearchParams(search).get('section');
    if (sectionParam && SECTION_IDS.has(sectionParam)) {
      const t = window.setTimeout(() => {
        const el = document.getElementById(sectionParam);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => window.clearTimeout(t);
    }

    // Also support remaining plain hashes after home is mounted
    const section = hash && !hash.startsWith('#/') ? hash.replace('#', '') : '';
    if (section && SECTION_IDS.has(section)) {
      const t = window.setTimeout(() => {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => window.clearTimeout(t);
    }

    if (pathname === '/' && !sectionParam) {
      // don't force scroll top on every home render if user is mid-page after nav
    }
  }, [pathname, hash, search, navigate]);

  return null;
}

function SectionLinkFix() {
  // Intercept in-page section anchor clicks so they don't break HashRouter
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const a = t.closest('a') as HTMLAnchorElement | null;
      if (!a) return;
      if (a.dataset.buyCta === 'true') return;

      const href = a.getAttribute('href') || '';
      // Section anchors: #pricing, #final-cta, etc.
      if (href.startsWith('#') && !href.startsWith('#/')) {
        const id = href.slice(1).split('?')[0];
        if (!id || !SECTION_IDS.has(id)) return;
        e.preventDefault();
        // Stay on hash home route
        if (!window.location.hash.startsWith('#/')) {
          window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/`);
        } else if (!window.location.hash.startsWith('#/checkout') && !window.location.hash.startsWith('#/success') && !window.location.hash.startsWith('#/admin')) {
          // already on a route; if not home, go home first
          if (window.location.hash !== '#/' && !window.location.hash.startsWith('#/?')) {
            window.location.hash = '#/';
          }
        } else {
          window.location.hash = '#/';
        }
        window.setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
        return;
      }

      // Plain path checkout links → hash checkout
      if (href.startsWith('/checkout')) {
        e.preventDefault();
        const q = href.includes('?') ? href.split('?')[1] : 'plan=monthly';
        window.location.hash = `#/checkout?${q}`;
        return;
      }
      if (href === '/admin') {
        e.preventDefault();
        window.location.hash = '#/admin';
        return;
      }
      if (href === '/success') {
        e.preventDefault();
        window.location.hash = '#/success';
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollManager />
      <SectionLinkFix />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
