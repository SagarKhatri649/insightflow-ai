import { Brain, Check, Clock3, FileDown, FileText, MessageCircle, Zap } from 'lucide-react';

export default function FeaturesSection() {
  const benefits = [
    { Icon: Zap, label: 'Instant AI Summaries' },
    { Icon: Check, label: '99%+ Accurate Transcripts' },
    { Icon: Brain, label: 'Key-insights' },
    { Icon: Clock3, label: 'Smart TimeStamps' },
    { Icon: MessageCircle, label: 'AI-powered Q&A' },
    { Icon: FileDown, label: 'PDF Export & Download' },
  ];

  return (
    <section id="Features" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#064e3b]">
            Key Benefits
          </div>
          <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-[#202124] md:text-3xl lg:text-4xl">
            Know what&apos;s inside without watching the whole video.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#3c4043]">
            Upload your video and get AI-powered summaries, Q&amp;A, and
            timestamps in seconds. Perfect for educators, creators, and teams.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ Icon, label }) => (
            <div
              key={label}
              className="group flex items-center gap-3 rounded-xl border border-[#dee1e6] bg-white p-5 text-[#202124] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#a7f3d0] hover:shadow-md"
            >
              <Icon className="h-5 w-5 shrink-0 text-[#10b981] transition-transform duration-200 group-hover:scale-110" />
              <span className="font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
