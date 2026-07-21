import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../lib/motion';

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className={align === 'center' ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'}
    >
      <motion.div
        variants={fadeUp}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold mb-4"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-gold to-violet" />
        <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.18em] uppercase text-gold-bright">
          {eyebrow}
        </span>
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className="font-display text-[1.75rem] sm:text-4xl md:text-[2.85rem] font-bold tracking-tight text-white leading-[1.12]"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="mt-4 text-white/50 text-[15px] md:text-lg leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
