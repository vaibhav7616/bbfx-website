import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ClipboardList,
  Hexagon,
  Loader2,
  LogOut,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { fetchAdminOrders, patchAdminOrder, type PaidOrder } from '../lib/checkout';

const TOKEN_KEY = 'bbfx_admin_token';

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [input, setInput] = useState(token);
  const [orders, setOrders] = useState<PaidOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const queued = useMemo(
    () => orders.filter((o) => o.paymentStatus === 'paid' || o.paymentStatus === 'demo_paid'),
    [orders]
  );

  const load = async (t = token) => {
    if (!t) return;
    setLoading(true);
    setError('');
    try {
      const list = await fetchAdminOrders(t);
      setOrders(list);
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLogin = (e: FormEvent) => {
    e.preventDefault();
    load(input.trim());
  };

  const markDelivered = async (order: PaidOrder) => {
    setBusyId(order.id);
    try {
      const updated = await patchAdminOrder(token, order.id, {
        deliveryStatus: 'delivered',
        notes: `TV access granted for @${order.tradingViewUsername} at ${new Date().toISOString()}`,
      });
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setBusyId('');
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setInput('');
    setOrders([]);
  };

  return (
    <div className="min-h-screen bg-void text-white">
      <header className="border-b border-white/[0.06] bg-void/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-gold" strokeWidth={1.5} />
            <span className="font-display text-sm font-bold">
              BLACKBOX<span className="text-gold">FX</span>{' '}
              <span className="text-muted font-sans font-normal">Admin</span>
            </span>
          </Link>
          {token && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => load()}
                className="btn-ghost px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-xs text-muted hover:text-white inline-flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {!token ? (
          <form onSubmit={onLogin} className="max-w-md mx-auto glass rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-gold" />
              <h1 className="font-display text-xl font-bold">Orders desk</h1>
            </div>
            <p className="text-sm text-muted mb-4">
              Enter admin token (set <code className="text-gold">ADMIN_TOKEN</code> on server). Default
              is <code className="text-neon">blackbox-admin</code>.
            </p>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field mb-3"
              placeholder="Admin token"
              type="password"
              required
            />
            {error && <div className="text-sm text-danger mb-3">{error}</div>}
            <button type="submit" className="btn-gold w-full py-3 rounded-xl">
              Open orders
            </button>
          </form>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <ClipboardList className="w-7 h-7 text-violet" /> Paid orders
                </h1>
                <p className="text-sm text-muted mt-1">
                  After payment, add their TradingView username on your invite-only script, then mark
                  delivered.
                </p>
              </div>
              <div className="text-sm text-muted">
                {queued.length} order{queued.length === 1 ? '' : 's'} · {orders.filter((o) => o.deliveryStatus === 'queued').length}{' '}
                queued
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            {loading && !orders.length ? (
              <div className="flex items-center gap-2 text-muted">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : orders.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center text-muted border border-white/10">
                No orders yet. Complete a checkout to see them here.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="glass rounded-2xl border border-white/[0.07] p-4 md:p-5 grid lg:grid-cols-[1.2fr_1fr_auto] gap-4 items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gold">{o.id}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            o.deliveryStatus === 'delivered'
                              ? 'border-signal/30 text-signal bg-signal/10'
                              : 'border-gold/30 text-gold bg-gold/10'
                          }`}
                        >
                          {o.deliveryStatus}
                        </span>
                        {o.demoPayment && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-violet/30 text-violet bg-violet/10">
                            demo
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-white">
                        {o.fullName} · {o.planName} · ₹{o.amountInr}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        {o.email}
                        {o.phone ? ` · ${o.phone}` : ''}
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        Paid {o.paidAt ? new Date(o.paidAt).toLocaleString() : '—'} · Expires{' '}
                        {o.expiresAt ? new Date(o.expiresAt).toLocaleDateString() : '—'}
                      </div>
                    </div>

                    <div className="rounded-xl bg-black/30 border border-white/[0.06] px-3 py-2">
                      <div className="text-[10px] uppercase tracking-wider text-muted mb-0.5">
                        TradingView username
                      </div>
                      <div className="font-mono text-sm text-neon break-all">@{o.tradingViewUsername}</div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {o.deliveryStatus !== 'delivered' ? (
                        <button
                          type="button"
                          disabled={busyId === o.id}
                          onClick={() => markDelivered(o)}
                          className="btn-gold px-4 py-2.5 rounded-xl text-sm inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
                        >
                          {busyId === o.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          Mark TV access given
                        </button>
                      ) : (
                        <div className="text-xs text-signal inline-flex items-center gap-1.5 justify-center py-2">
                          <CheckCircle2 className="w-4 h-4" /> Delivered
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
