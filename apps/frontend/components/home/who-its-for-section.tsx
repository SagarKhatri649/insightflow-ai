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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {audiences.map((audience) => (
            <div
              key={audience}
              className="rounded-[10px] border border-[#dee1e6] bg-white px-5 py-4 text-center text-sm font-bold text-[#202124] shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[#10b981] md:text-base"
            >
              {audience}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
