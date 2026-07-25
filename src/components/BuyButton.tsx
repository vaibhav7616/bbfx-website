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

/** Public helper for building checkout URLs (hash router). */
export function checkoutUrl(plan: Plan = 'monthly') {
  return `/checkout?plan=${plan}`;
}

/**
 * Buy CTA — always opens the real checkout page.
 * Never scrolls between #pricing and #final-cta.
 */
export default function BuyButton({
  plan = 'monthly',
  children,
  className = '',
  style,
  onClick,
}: Props) {
  const navigate = useNavigate();

  const goCheckout = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.();

    // React Router navigation (HashRouter → #/checkout?plan=...)
    navigate(`/checkout?plan=${plan}`);

    // Hard fallback for stubborn hosts / iframes
    window.setTimeout(() => {
      const desired = `#/checkout?plan=${plan}`;
      if (!window.location.hash.startsWith('#/checkout')) {
        window.location.hash = desired;
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 0);
  };

  return (
    <button
      type="button"
      onClick={goCheckout}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 50,
        border: 'none',
        ...style,
      }}
      data-buy-cta="true"
      aria-label={plan === 'yearly' ? 'Buy yearly plan' : 'Buy monthly plan'}
    >
      {children}
    </button>
  );
}
