const audiences = [
  {
    role: "Students",
    detail: "Turn multi-hour lectures into clean study notes and exam Q&As.",
  },
  {
    role: "Professionals",
    detail: "Review recorded calls and demos without replaying the timeline.",
  },
  {
    role: "Content Creators",
    detail: "Pull structured takeaways and quotes from YouTube videos.",
  },
  {
    role: "Researchers",
    detail: "Search interviews and talks by exact spoken keywords.",
  },
  {
    role: "Teams",
    detail: "Share exportable PDF briefs across engineering and product.",
  },
];

export default function WhoItsForSection() {
  return (
    <section className="border-t border-[#E5E7EB]/80 bg-[#FAFAFA] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs font-medium tracking-widest text-[#71717A] uppercase">
            Who It&apos;s For
          </p>
          <h2 className="font-heading text-3xl font-medium leading-tight tracking-[-0.03em] text-[#111111] md:text-4xl">
            Built for everyone learning or working from video.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map(({ role, detail }) => (
            <div
              key={role}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:border-[#D4D4D8] hover:shadow-sm"
            >
              <h3 className="font-heading text-base font-semibold tracking-tight text-[#111111]">
                {role}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6B7280] sm:text-[13px]">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
