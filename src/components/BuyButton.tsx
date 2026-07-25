import { type ReactNode, type CSSProperties } from 'react';
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
 * Reliable checkout CTA — real React Router link + plain href fallback path.
 * Avoids motion wrappers that can swallow clicks.
 */
export default function BuyButton({
  plan = 'monthly',
  children,
  className = '',
  style,
  onClick,
}: Props) {
  const to = `/checkout?plan=${plan}`;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 5,
        ...style,
      }}
      data-buy-cta="true"
    >
      {children}
    </Link>
  );
}
