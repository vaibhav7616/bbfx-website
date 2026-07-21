import { motion } from 'framer-motion';

/** Soft animated mesh / aurora blobs — motion.dev style depth */
export default function AuroraBg({ intensity = 'normal' }: { intensity?: 'soft' | 'normal' | 'strong' }) {
  const o = intensity === 'strong' ? 0.55 : intensity === 'soft' ? 0.28 : 0.4;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute -top-[20%] left-[10%] w-[55vw] h-[55vw] max-w-[720px] max-h-[720px] rounded-full blur-[100px]"
        style={{ background: `radial-gradient(circle, rgba(167,139,250,${o}) 0%, transparent 70%)` }}
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] max-w-[640px] max-h-[640px] rounded-full blur-[110px]"
        style={{ background: `radial-gradient(circle, rgba(34,211,238,${o * 0.85}) 0%, transparent 70%)` }}
        animate={{ x: [0, -50, 20, 0], y: [0, -25, 35, 0], scale: [1, 0.94, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[25%] w-[45vw] h-[45vw] max-w-[560px] max-h-[560px] rounded-full blur-[100px]"
        style={{ background: `radial-gradient(circle, rgba(245,196,81,${o * 0.55}) 0%, transparent 70%)` }}
        animate={{ x: [0, 30, -40, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#05050a_75%)]" />
    </div>
  );
}
