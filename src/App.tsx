import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/AdminPage';

function ScrollManager() {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    // Checkout / success / admin — always start at top of the new page
    if (pathname !== '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    // Home hash anchors (features, pricing, etc.)
    if (hash) {
      const id = hash.replace('#', '');
      // small delay so home sections are mounted
      const t = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
      return () => window.clearTimeout(t);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash, search]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
