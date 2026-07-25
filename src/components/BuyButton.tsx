import { type ReactNode, type CSSProperties, type MouseEvent } from 'react';

type Plan = 'monthly' | 'yearly';

interface Props {
  plan?: Plan;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

/** Build a stable checkout URL that works with HashRouter on static hosts. */
export function checkoutUrl(plan: Plan = 'monthly') {
  return `#/checkout?plan=${plan}`;
}

/**
 * Buy CTA — always opens the checkout page.
 * Uses hard hash navigation so it never gets stuck on section anchors like #final-cta.
 */
export default function BuyButton({
  plan = 'monthly',
  children,
  className = '',
  style,
  onClick,
}: Props) {
  const href = checkoutUrl(plan);

  const goCheckout = (e?: MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    onClick?.();

    // Always hard-navigate via hash (HashRouter). Reliable in iframes & static hosts.
    const target = `#/checkout?plan=${plan}`;
    if (window.location.hash !== target) {
      window.location.hash = target;
    } else {
      // Force remount if already on checkout with same hash
      window.location.hash = '#/';
      window.setTimeout(() => {
        window.location.hash = target;
      }, 0);
    }

    // Ensure we land at top of checkout
    window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 30);
  };

  return (
    <a
      href={href}
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
        textDecoration: 'none',
        ...style,
      }}
      data-buy-cta="true"
      role="button"
    >
      {children}
    </a>
  );
}
