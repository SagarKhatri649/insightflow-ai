import {
  Brain,
  Check,
  Clock3,
  FileDown,
  MessageCircle,
  Zap,
} from "lucide-react";

const benefits = [
  { Icon: Zap, label: "AI Summaries" },
  { Icon: Check, label: "Video Transcripts" },
  { Icon: Brain, label: "Key Insights" },
  { Icon: Clock3, label: "Smart Timestamps" },
  { Icon: MessageCircle, label: "AI-powered Q&A" },
  { Icon: FileDown, label: "PDF Export & Download" },
];

export default function BenefitsSection() {
  return (
    <section id="Features" className="scroll-mt-24 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#064e3b]">
            KEY BENEFITS
          </div>
          <h2 className="mb-5 text-2xl font-extrabold leading-snug tracking-tight text-[#202124] md:text-3xl lg:text-4xl">
            Everything you need to understand a video.
          </h2>
          <p className="text-base leading-relaxed text-[#3c4043] md:text-lg">
            Transcripts, summaries, insights, timestamps, answers, and exports —
            all from one upload.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-[#dee1e6] bg-white p-5 text-[#202124] shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[#10b981] hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf5]">
                <Icon aria-hidden="true" className="h-5 w-5 text-[#064e3b]" />
              </span>
              <span className="font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
