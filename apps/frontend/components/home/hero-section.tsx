import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-[#064e3b] py-16 text-white md:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:px-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <Link
            href="/#Features"
            className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#064e3b]"
          >
            VIDEO TO INSIGHTS
          </Link>
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight md:text-5xl lg:text-[52px]">
            Turn long videos into useful insights in minutes.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#ecfdf5] md:text-lg">
            Upload a video to generate a transcript, summary, key insights, and
            notes in one workspace.
          </p>
          <div className="mt-8">
            <Link
              href="/upload"
              className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-lg bg-white px-6 py-3.5 font-heading text-base font-bold text-[#064e3b] shadow-lg transition duration-200 hover:bg-[#ecfdf5] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#064e3b]"
            >
              Upload a Video
              <ArrowRight
                aria-hidden="true"
                className="h-5 w-5 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="w-full rounded-xl border border-white/[0.12] bg-white/[0.24] p-6 shadow-2xl backdrop-blur-[12px]">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#10b981]"
                />
                <span className="truncate font-heading text-sm font-bold tracking-wide text-white md:text-base">
                  InsightFlow
                </span>
              </div>
              <span className="shrink-0 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                AI-powered
              </span>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex min-h-[190px] flex-col justify-between rounded-[10px] border border-white/10 bg-white/[0.15] p-4 backdrop-blur-[8px]">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-white">
                  Video preview
                </span>
                <div className="flex flex-1 items-center justify-center py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25 shadow-inner">
                    <Play
                      aria-hidden="true"
                      className="ml-0.5 h-5 w-5 fill-white text-white"
                    />
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="space-y-2 border-t border-white/10 pt-3"
                >
                  <div className="h-2 w-full rounded-full bg-white/20" />
                  <div className="h-2 w-2/3 rounded-full bg-white/20" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="rounded-[10px] border border-white/10 bg-white/[0.15] p-3.5 backdrop-blur-[8px]">
                  <div className="mb-2 font-heading text-[11px] font-bold uppercase tracking-wider text-white">
                    Summary
                  </div>
                  <div aria-hidden="true" className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-white/20" />
                    <div className="h-2 w-full rounded-full bg-white/20" />
                    <div className="h-2 w-4/5 rounded-full bg-white/20" />
                  </div>
                </div>

                <div className="rounded-[10px] border border-white/10 bg-white/[0.15] p-3.5 backdrop-blur-[8px]">
                  <div className="mb-2 font-heading text-[11px] font-bold uppercase tracking-wider text-white">
                    Key insights
                  </div>
                  <div aria-hidden="true" className="space-y-2.5">
                    <div className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#10b981]" />
                      <span className="h-2 flex-1 rounded-full bg-white/20" />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#10b981]" />
                      <span className="h-2 w-5/6 rounded-full bg-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[10px] border border-white/10 bg-white/[0.15] p-3.5 backdrop-blur-[8px]">
              <div className="mb-2 font-heading text-[11px] font-bold uppercase tracking-wider text-white">
                Transcript preview
              </div>
              <div aria-hidden="true" className="space-y-2">
                <div className="h-2 w-full rounded-full bg-white/20" />
                <div className="h-2 w-11/12 rounded-full bg-white/20" />
                <div className="h-2 w-3/4 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
