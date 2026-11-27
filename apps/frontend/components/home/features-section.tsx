import {
  FileDown,
  Globe2,
  MessageCircle,
  Sparkles,
  Youtube,
} from "lucide-react";

const capabilities = [
  { Icon: Youtube, label: "YouTube Import" },
  { Icon: Globe2, label: "Groq Whisper" },
  { Icon: Sparkles, label: "AI Summaries" },
  { Icon: MessageCircle, label: "Transcript Q&A" },
  { Icon: FileDown, label: "PDF Export" },
];

export default function FeaturesSection() {
  return (
    <section id="problem" className="scroll-mt-24 bg-white pt-4 pb-20 md:pb-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Minimal monochrome capability strip matching reference */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 border-b border-[#F4F4F5] pb-14 sm:justify-between">
          {capabilities.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm font-semibold tracking-tight text-[#3F3F46]"
            >
              <Icon aria-hidden="true" className="h-4 w-4 text-[#111111]" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Centered two-tone editorial statement matching reference */}
        <div className="mx-auto max-w-4xl pt-16 text-center md:pt-20">
          <h2 className="font-heading text-3xl font-medium leading-[1.22] tracking-[-0.03em] sm:text-4xl lg:text-[44px]">
            <span className="text-[#111111]">InsightFlow turns </span>
            <span className="text-[#9CA3AF]">hours of raw video</span>
            <br className="hidden sm:inline" />{" "}
            <span className="text-[#9CA3AF]">into </span>
            <span className="text-[#111111]">instant clarity</span>{" "}
            <span className="text-[#9CA3AF]">with AI.</span>
            <br className="hidden sm:inline" />{" "}
            <span className="text-[#9CA3AF]">built for </span>
            <span className="text-[#111111]">creators</span>{" "}
            <span className="mx-1 inline-flex h-9 w-9 overflow-hidden rounded-full border border-[#E5E7EB] bg-[#F4F4F5] align-middle shadow-2xs sm:h-11 sm:w-11">
              <img
                src="/speaker-avatar.jpg"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            </span>{" "}
            <span className="text-[#111111]">&amp; teams.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
