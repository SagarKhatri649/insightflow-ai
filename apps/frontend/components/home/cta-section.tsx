import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-[#064e3b] py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/15 bg-white/24 p-10 text-center shadow-lg backdrop-blur-sm md:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-white/10 bg-white/5" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full border border-white/10 bg-white/5" />
          <div className="relative">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-[#ecfdf5]">
              Ready when you are
            </div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
              Ready to save hours of watching videos?
            </h2>
            <p className="mx-auto mt-4 mb-8 max-w-2xl text-base leading-relaxed text-[#ecfdf5] md:text-lg">
              Podcasters, creators, and educators use our platform to generate accurate
              timestamps, summaries, and titles — all in seconds, with a single click.
            </p>
            <Link
              href="/upload"
              className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-lg bg-white px-7 py-3.5 text-base font-bold text-[#064e3b] shadow-lg transition hover:bg-[#ecfdf5] hover:shadow-xl"
            >
              Upload a Video
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <p className="mt-4 text-sm text-[#ecfdf5]/80">No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  );
}
