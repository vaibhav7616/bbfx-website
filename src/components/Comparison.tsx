import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import SectionHeading from './SectionHeading';

const ROWS = [
  { label: 'Multi-timeframe confluence', manual: false, bb: true },
  { label: 'AI trade confidence score (1–10)', manual: false, bb: true },
  { label: 'Automatic SL / TP1–TP3 levels', manual: false, bb: true },
  { label: 'Market regime detection', manual: false, bb: true },
  { label: 'Currency strength matrix', manual: false, bb: true },
  { label: 'Non-repainting signal logic', manual: false, bb: true },
  { label: 'On-chart institutional HUD', manual: false, bb: true },
  { label: 'Works across Forex, Gold, Crypto, Indices', manual: true, bb: true },
  { label: 'Emotional decision-making reduced', manual: false, bb: true },
  { label: 'Setup quality filter before entry', manual: false, bb: true },
];

export default function Comparison() {
  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Why Traders Upgrade"
          title="Manual Charts vs BlackBoxFX"
          subtitle="Stop stitching five indicators together. Deploy one institutional stack built for decision clarity."
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0e]/90"
        >
          <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] sm:grid-cols-[1.6fr_1fr_1fr] gap-0 text-sm">
            <div className="px-4 sm:px-6 py-4 text-[11px] font-mono uppercase tracking-wider text-muted border-b border-white/[0.06]">
              Capability
            </div>
            <div className="px-3 sm:px-6 py-4 text-[11px] font-mono uppercase tracking-wider text-muted text-center border-b border-l border-white/[0.06]">
              Manual
            </div>
            <div className="px-3 sm:px-6 py-4 text-[11px] font-mono uppercase tracking-wider text-gold text-center border-b border-l border-violet/25 bg-gradient-to-b from-violet/10 to-gold/[0.04]">
              BlackBoxFX
            </div>

            {ROWS.map((r, i) => (
              <div key={r.label} className="contents">
                <div className={`px-4 sm:px-6 py-3.5 text-white/85 border-b border-white/[0.04] ${
                  i % 2 === 0 ? 'bg-white/[0.01]' : ''
                }`}>
                  {r.label}
                </div>
                <div className={`flex items-center justify-center px-3 py-3.5 border-b border-l border-white/[0.04] ${
                  i % 2 === 0 ? 'bg-white/[0.01]' : ''
                }`}>
                  {r.manual ? (
                    <Check className="w-4 h-4 text-muted" />
                  ) : (
                    <X className="w-4 h-4 text-danger/60" />
                  )}
                </div>
                <div className={`flex items-center justify-center px-3 py-3.5 border-b border-l border-gold/10 bg-gold/[0.03] ${
                  i % 2 === 0 ? 'bg-gold/[0.05]' : ''
                }`}>
                  {r.bb ? (
                    <Check className="w-4 h-4 text-signal" strokeWidth={2.5} />
                  ) : (
                    <X className="w-4 h-4 text-muted" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
