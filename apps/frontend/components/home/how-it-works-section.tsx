'use client';

import { Brain, Sparkles, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    Icon: Upload,
    title: 'Upload Your Video',
    description: 'Upload lectures, meetings, tutorials, or presentations from your device.',
  },
  {
    Icon: Brain,
    title: 'Generate Insights',
    description:
      'Let AI transcribe your video and create summaries, timestamps, and key insights.',
  },
  {
    Icon: Sparkles,
    title: 'Review and Share',
    description:
      'Review the transcript, Q&A, and summaries, then export or share your results.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-to-use" className="scroll-mt-24 border-y border-gray-100 bg-[#f8faf9] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#064e3b]">
            HOW IT WORKS
          </div>
          <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-[#202124] md:text-3xl lg:text-4xl">
            From video to clear insights in three simple steps.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ Icon, title, description }, idx) => (
            <motion.div
              key={title}
              className="group min-h-64 rounded-xl border border-[#dee1e6] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#10b981] hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.15 }}
            >
              <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#ecfdf5] text-sm font-bold text-[#064e3b]">
                {idx + 1}
              </div>
              <div className="mb-3 flex items-center gap-3">
                <Icon className="h-5 w-5 text-[#10b981] transition-transform group-hover:scale-110" />
                <h3 className="font-semibold text-[#202124]">{title}</h3>
              </div>
              <p className="leading-relaxed text-[#5f6368]">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
