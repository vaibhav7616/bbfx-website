import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/AdminPage';

function ScrollManager() {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    // Non-home pages always open at top
    if (pathname !== '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    // Home section anchors: /#/  +  #pricing  (hash router keeps section hash in location.hash sometimes)
    // With HashRouter, section links are plain "#pricing" on the home page document.
    const section = hash && !hash.startsWith('#/') ? hash.replace('#', '') : '';
    if (section) {
      const t = window.setTimeout(() => {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => window.clearTimeout(t);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash, search]);

  return null;
}

export default function App() {
  return (
    // HashRouter = reliable checkout navigation on static hosts / preview iframes
    <HashRouter>
      <ScrollManager />
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
