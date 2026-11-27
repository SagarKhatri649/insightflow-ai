import {
  FileDown,
  Globe2,
  MessageCircle,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";

const features = [
  {
    Icon: Upload,
    title: "Upload Files or Paste YouTube Links",
    description:
      "Upload MP4, MOV, WEBM, MKV, MP3, or WAV files up to 20 MB — or paste any YouTube URL to extract captions or generate an AI transcript.",
  },
  {
    Icon: Globe2,
    title: "Multilingual Whisper Transcription",
    description:
      "Powered by Groq Whisper for accurate speech-to-text across English and Indian-language recordings, lectures, and meetings.",
  },
  {
    Icon: Sparkles,
    title: "Structured AI Summaries",
    description:
      "Turns even multi-part long transcripts into readable Markdown headings, key insights, and concise takeaways automatically.",
  },
  {
    Icon: Search,
    title: "Instant Search & .TXT Download",
    description:
      "Jump to exact phrases with live highlighted keyword matches, view word counts, copy in one click, or save plain text.",
  },
  {
    Icon: MessageCircle,
    title: "Transcript-Grounded AI Q&A",
    description:
      "Ask custom questions or click starter prompts. Answers stay grounded in what was spoken and save to your video workspace.",
  },
  {
    Icon: FileDown,
    title: "One-Click PDF Report & Library",
    description:
      "Export a formatted PDF summary anytime and keep all processed videos organized with search and status filters in your library.",
  },
];

export default function BenefitsSection() {
  return (
    <section
      id="Features"
      className="scroll-mt-24 border-t border-[#F4F4F5] bg-[#FAFAFA] py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs font-medium tracking-widest text-[#71717A] uppercase">
            Capabilities
          </p>
          <h2 className="font-heading text-3xl font-medium leading-tight tracking-[-0.03em] text-[#111111] md:text-4xl">
            Everything you need to understand any video faster.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4D4D8] hover:shadow-[0_14px_30px_-18px_rgba(17,17,17,0.18)]"
            >
              <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAFAFA] text-[#111111]">
                <Icon aria-hidden="true" className="h-4.5 w-4.5" />
              </span>
              <h3 className="font-heading text-lg font-semibold tracking-tight text-[#111111]">
                {title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#6B7280]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
