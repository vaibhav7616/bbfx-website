import { motion } from 'framer-motion';
import { Play, Maximize2 } from 'lucide-react';
import SectionHeading from './SectionHeading';

export default function Demo() {
  return (
    <section id="demo" className="section-pad relative py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Product Walkthrough"
          title="See the Terminal in Action"
          subtitle="Four minutes covering confluence layers, confidence scoring, regime labels, and automatic risk mapping on live structure."
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-12 relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)] group cursor-pointer"
        >
          <img
            src="/uploads/blackboxfx-chart.png"
            alt="BlackBoxFX demo preview"
            className="absolute inset-0 w-full h-full object-cover object-left scale-[1.02] group-hover:scale-105 transition-transform duration-700 opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
          <div className="absolute inset-0 grid-bg opacity-30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full bg-gold/15 border border-gold/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold/25 transition-all duration-300 shadow-[0_0_50px_rgba(212,175,55,0.35)]">
              <Play className="w-7 h-7 md:w-8 md:h-8 text-gold fill-gold ml-1" />
            </div>
            <p className="mt-5 font-display text-sm md:text-base text-white tracking-wide">
              BlackBoxFX v3.0 Walkthrough
            </p>
            <p className="mt-1.5 text-xs text-muted font-mono">04:32 · 1080p · English</p>
          </div>

          <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 border border-white/10 text-white/60">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>

          <div className="absolute bottom-0 inset-x-0 p-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-white/50">01:28</span>
              <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="w-[34%] h-full rounded-full bg-gradient-to-r from-gold to-neon" />
              </div>
              <span className="text-[10px] font-mono text-white/50">04:32</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          {['Dashboard overview', 'Confidence engine', 'Risk levels & alerts'].map((t, i) => (
            <div
              key={t}
              className="glass rounded-xl px-4 py-3 text-center text-xs text-muted border border-white/[0.05]"
            >
              <span className="text-gold font-mono mr-2">0{i + 1}</span>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
