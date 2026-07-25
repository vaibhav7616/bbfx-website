import { type ReactNode, type CSSProperties, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

type Plan = 'monthly' | 'yearly';

interface Props {
  plan?: Plan;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

/**
 * Checkout CTA — always navigates to the checkout page (not in-page scroll).
 * Uses React Router navigate + hard fallback so it works in every host.
 */
export default function BuyButton({
  plan = 'monthly',
  children,
  className = '',
  style,
  onClick,
}: Props) {
  const navigate = useNavigate();
  const to = `/checkout?plan=${plan}`;

  const goCheckout = (e: MouseEvent<HTMLAnchorElement>) => {
    // Always take over the click so hash/scroll handlers can't steal it
    e.preventDefault();
    e.stopPropagation();
    onClick?.();

    try {
      navigate(to);
    } catch {
      // ignore
    }

    // Hard navigation fallback (covers broken SPA hosts / stuck routers)
    window.setTimeout(() => {
      if (!window.location.pathname.startsWith('/checkout')) {
        window.location.assign(to);
      }
    }, 80);
  };

  return (
    <a
      href={to}
      onClick={goCheckout}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 30,
        textDecoration: 'none',
        ...style,
      }}
      data-buy-cta="true"
      role="link"
    >
      {children}
    </a>
  );
}
