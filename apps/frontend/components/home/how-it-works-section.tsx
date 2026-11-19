const steps = [
  {
    title: "Upload Your Video",
    description:
      "Upload lectures, meetings, tutorials, or presentations from your device.",
  },
  {
    title: "Generate Insights",
    description:
      "Let AI transcribe your video and create summaries and key insights.",
  },
  {
    title: "Review and Export",
    description:
      "Review the transcript, Q&A, and summary, then download your results as a PDF.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-to-use"
      className="scroll-mt-24 border-y border-gray-100 bg-[#f8faf9] py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#064e3b]">
            HOW IT WORKS
          </div>
          <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-[#202124] md:text-3xl lg:text-4xl">
            From video to clear insights in three simple steps.
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map(({ title, description }, idx) => (
            <div
              key={title}
              className="flex flex-col rounded-xl border border-[#dee1e6] bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-[#d1fae5] bg-[#ecfdf5] text-lg font-bold text-[#064e3b]">
                {idx + 1}
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#202124]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#3c4043] md:text-base">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
