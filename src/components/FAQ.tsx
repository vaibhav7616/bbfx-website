import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../lib/constants';
import SectionHeading from './SectionHeading';

export default function FAQ() {
  return (
    <section id="faq" className="section-pad relative">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Support"
          title="Frequently Asked Questions"
          subtitle="Clear answers before you deploy BlackBoxFX on your desk."
        />

        <div className="mt-12 space-y-2.5">
          {FAQS.map((f, i) => (
            <motion.details
              key={f.q}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group glass rounded-xl border border-white/[0.06] open:border-gold/25 open:bg-white/[0.035] transition-colors"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 md:px-6 md:py-5">
                <span className="text-sm md:text-[15px] font-semibold text-white text-left pr-2">
                  {f.q}
                </span>
                <span className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                  <ChevronDown className="faq-chevron w-4 h-4 text-gold transition-transform duration-300" />
                </span>
              </summary>
              <div className="px-5 md:px-6 pb-5 md:pb-6 -mt-1">
                <p className="text-sm text-muted leading-relaxed border-t border-white/[0.05] pt-4">
                  {f.a}
                </p>
              </div>
            </motion.details>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Still have questions?{' '}
          <a href="mailto:support@blackboxfx.io" className="text-neon hover:underline underline-offset-4">
            Contact support
          </a>
        </p>
      </div>
    </section>
  );
}
