export default function WhoItsForSection() {
  const audiences = [
    "Students",
    "Professionals",
    "Content creators",
    "Researchers",
    "Teams",
  ];

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#064e3b]">
            Who It&apos;s For
          </div>
          <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-[#202124] md:text-3xl lg:text-4xl">
            Built for anyone learning from video.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map((audience) => (
            <div
              key={audience}
              className="rounded-lg border border-[#dee1e6] bg-white px-5 py-4 text-center font-semibold text-[#202124] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#a7f3d0] hover:bg-[#ecfdf5] hover:shadow-md"
            >
              {audience}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
