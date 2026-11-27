const steps = [
  {
    number: "01",
    title: "Upload or Link a Video",
    description:
      "Drop an audio or video file from your device, or paste a YouTube link directly into the importer.",
  },
  {
    number: "02",
    title: "Generate Transcript & Summary",
    description:
      "Groq Whisper transcribes spoken audio and AI distills long content into structured headings and key points.",
  },
  {
    number: "03",
    title: "Search, Ask Q&A & Export",
    description:
      "Highlight keywords inside the transcript, chat with AI for answers, and download a formatted PDF anytime.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-to-use"
      className="scroll-mt-24 border-t border-[#E5E7EB]/80 bg-white py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs font-medium tracking-widest text-[#71717A] uppercase">
            How It Works
          </p>
          <h2 className="font-heading text-3xl font-medium leading-tight tracking-[-0.03em] text-[#111111] md:text-4xl">
            From raw video to clear answers in three steps.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(({ number, title, description }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA]/70 p-7 transition-colors duration-200 hover:bg-white"
            >
              <span className="mb-5 font-mono text-xs font-semibold tracking-wider text-[#71717A]">
                {number}
              </span>
              <h3 className="mb-2.5 font-heading text-xl font-semibold tracking-tight text-[#111111]">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[#6B7280]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
