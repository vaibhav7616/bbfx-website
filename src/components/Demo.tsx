import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import SectionHeading from './SectionHeading';

const CHAPTERS = [
  { t: 'Dashboard overview', d: '0:00' },
  { t: 'Confidence engine', d: '1:20' },
  { t: 'Risk levels & alerts', d: '2:45' },
];

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      videoRef.current?.pause();
      setPlaying(false);
      const v = modalVideoRef.current;
      if (v) {
        v.currentTime = 0;
        v.muted = false;
        setMuted(false);
        void v.play().catch(() => undefined);
      }
    } else {
      modalVideoRef.current?.pause();
    }
  }, [open]);

  const toggleInline = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      try {
        await v.play();
        setPlaying(true);
      } catch {
        setOpen(true);
      }
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section id="demo" className="section-pad relative py-16 md:py-24 scroll-mt-28">
      <div className="absolute inset-0 bg-gradient-to-b from-violet/[0.03] via-transparent to-gold/[0.03] pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Product Walkthrough"
          title="Watch the 4-Min Demo"
          subtitle="See BlackBoxFX v3.0 on chart — confluence layers, confidence scoring, regime labels, and automatic risk mapping."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="mt-12"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)] bg-black ring-aurora">
            {/* Browser chrome */}
            <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 bg-[#12141a] border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-[11px] font-mono text-white/40 ml-1">BlackBoxFX v3.0 · Demo</span>
              </div>
              <span className="text-[10px] font-mono text-gold">04:00 HD</span>
            </div>

            <div className="relative aspect-video bg-[#07080c] group">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src="/videos/blackboxfx-demo.mp4"
                poster="/uploads/blackboxfx-chart.png"
                muted={muted}
                playsInline
                loop
                preload="metadata"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20 transition-opacity duration-300 ${
                  playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                }`}
              />

              {/* Center play */}
              <button
                type="button"
                onClick={toggleInline}
                className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 transition-opacity ${
                  playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                }`}
                aria-label={playing ? 'Pause demo video' : 'Play demo video'}
              >
                <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center shadow-[0_0_50px_rgba(245,196,81,0.35)] hover:scale-110 transition-transform">
                  {playing ? (
                    <Pause className="w-7 h-7 md:w-8 md:h-8 text-gold fill-gold" />
                  ) : (
                    <Play className="w-7 h-7 md:w-8 md:h-8 text-gold fill-gold ml-1" />
                  )}
                </span>
                {!playing && (
                  <>
                    <div className="text-center px-4">
                      <p className="font-display text-sm md:text-lg text-white tracking-wide">
                        BlackBoxFX v3.0 Walkthrough
                      </p>
                      <p className="mt-1.5 text-xs text-muted font-mono">4-min demo · HD · Tap to play</p>
                    </div>
                  </>
                )}
              </button>

              {/* Controls */}
              <div className="absolute bottom-0 inset-x-0 z-20 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 bg-gradient-to-t from-black/90 to-transparent">
                <button
                  type="button"
                  onClick={toggleInline}
                  className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/15"
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = !muted;
                    setMuted(next);
                    if (videoRef.current) videoRef.current.muted = next;
                  }}
                  className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/15"
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r from-gold to-neon transition-all ${playing ? 'w-2/5 animate-pulse' : 'w-[8%]'}`} />
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg btn-gold text-xs sm:text-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Fullscreen
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.t}
                type="button"
                onClick={() => setOpen(true)}
                className="glass rounded-xl px-4 py-3 text-left border border-white/[0.05] hover:border-violet/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gold font-mono text-[11px]">0{i + 1}</span>
                  <span className="text-[10px] font-mono text-muted">{c.d}</span>
                </div>
                <div className="mt-1 text-xs sm:text-sm text-white/80">{c.t}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button type="button" onClick={() => setOpen(true)} className="btn-gold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              Watch 4-Min Demo
            </button>
            <a href="#pricing" className="btn-ghost px-6 py-3 rounded-xl text-sm">
              Get Access — ₹99/mo
            </a>
          </div>
        </motion.div>
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0e1016]">
                <div>
                  <div className="font-display text-sm font-semibold text-white">BlackBoxFX v3.0 Demo</div>
                  <div className="text-[11px] text-muted font-mono">4-minute product walkthrough</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white/10"
                  aria-label="Close video"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="relative aspect-video bg-black">
                <video
                  ref={modalVideoRef}
                  className="w-full h-full object-contain bg-black"
                  src="/videos/blackboxfx-demo.mp4"
                  poster="/uploads/blackboxfx-chart.png"
                  controls
                  autoPlay
                  playsInline
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
