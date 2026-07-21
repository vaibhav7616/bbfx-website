import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 140, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 140, damping: 28, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX - 220);
      y.set(e.clientY - 220);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[1] hidden md:block w-[440px] h-[440px] rounded-full mix-blend-screen opacity-40"
      style={{
        x: sx,
        y: sy,
        background:
          'radial-gradient(circle, rgba(167,139,250,0.18) 0%, rgba(34,211,238,0.08) 35%, transparent 70%)',
      }}
    />
  );
}
