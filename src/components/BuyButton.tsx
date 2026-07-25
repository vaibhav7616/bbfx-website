import { type ReactNode, type CSSProperties, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';

type Plan = 'monthly' | 'yearly';

interface Props {
  plan?: Plan;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

/**
 * Buy CTA — always routes to /checkout?plan=...
 * Uses React Router Link + hard fallback so it never "does nothing".
 */
export default function BuyButton({
  plan = 'monthly',
  children,
  className = '',
  style,
  onClick,
}: Props) {
  const to = `/checkout?plan=${plan}`;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();

    // If something blocks client routing, force a full navigation after a tick.
    // HashRouter + BrowserRouter both work with absolute path assign fallback.
    window.setTimeout(() => {
      const path = window.location.pathname + window.location.search + window.location.hash;
      const landed =
        path.includes('/checkout') ||
        path.includes('checkout?') ||
        /#\/?checkout/.test(window.location.href);
      if (!landed) {
        // Hash-style first (works on static hosts / iframes without rewrite)
        window.location.assign(`${window.location.pathname}${window.location.search}#/checkout?plan=${plan}`);
      }
    }, 120);

    // Don't prevent default — let <Link> do SPA navigation first.
    // Only stop bubbling so parent handlers can't cancel the click.
    e.stopPropagation();
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
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
    >
      {children}
    </Link>
  );
}
