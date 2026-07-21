import type { Transition, Variants } from 'framer-motion';

/** Motion.dev–inspired spring presets */
export const spring = {
  snappy: { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 } as Transition,
  soft: { type: 'spring', stiffness: 120, damping: 20, mass: 1 } as Transition,
  bouncy: { type: 'spring', stiffness: 260, damping: 18, mass: 0.9 } as Transition,
  slow: { type: 'spring', stiffness: 80, damping: 22, mass: 1.1 } as Transition,
  layout: { type: 'spring', stiffness: 350, damping: 35, mass: 0.8 } as Transition,
};

export const easeOut = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: easeOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: easeOut },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export const cardItem: Variants = {
  hidden: { opacity: 0, y: 32, rotateX: 8 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};
