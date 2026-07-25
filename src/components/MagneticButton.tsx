import { useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { spring } from '../lib/motion';

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
  href: string;
  target?: string;
  rel?: string;
  'aria-label'?: string;
  onClick?: (e: ReactMouseEvent) => void;
}

function isInternal(href: string) {
  return href.startsWith('/') && !href.startsWith('//');
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.28,
  href,
  target,
  rel,
  onClick,
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 18, mass: 0.4 });
  const scale = useSpring(1, spring.snappy);

  const handleMove = (e: ReactMouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const motionStyle = { x: sx, y: sy, scale, display: 'inline-flex' as const };

  // Internal app routes — real React Router Link (always clickable)
  if (isInternal(href)) {
    return (
      <motion.div style={motionStyle} className="inline-flex max-w-full">
        <Link
          to={href}
          ref={(node) => {
            ref.current = node;
          }}
          onMouseMove={handleMove}
          onMouseEnter={() => scale.set(1.03)}
          onMouseLeave={handleLeave}
          onClick={onClick}
          className={className}
          {...rest}
        >
          {children}
        </Link>
      </motion.div>
    );
  }

  // Hash / external / mailto
  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      style={motionStyle}
      ref={(node) => {
        ref.current = node;
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => scale.set(1.03)}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

export function TiltCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 22 });
  const sry = useSpring(ry, { stiffness: 200, damping: 22 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 12);
    rx.set(-py * 10);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="perspective-scene h-full">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: 'preserve-3d',
        }}
        className={`relative h-full card-3d ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
