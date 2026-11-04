import { ArrowRight, Check, FileVideo, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-[#064e3b] py-16 text-white md:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:px-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Link
            href="/#Features"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Powered by AI
          </Link>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-[52px]">
            Know <span className="text-[#10b981]">what&apos;s inside</span> —
            without watching the whole video.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#ecfdf5] md:text-lg">
            Upload your video and get AI-powered summaries, Q&amp;A, and
            timestamps in seconds. Perfect for educators, creators, and teams.
          </p>
          <div className="mt-8">
            <Link
              href="/upload"
              className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-lg bg-white px-6 py-3.5 text-base font-bold text-[#064e3b] shadow-lg transition hover:bg-[#ecfdf5]"
            >
              Try Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="mx-auto max-w-2xl rounded-xl border border-white/15 bg-white/24 p-4 shadow-2xl backdrop-blur-sm sm:p-5">
            <div className="flex items-center justify-between border-b border-white/15 pb-3 text-sm font-semibold">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                InsightFlow
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-wide">
                AI-powered
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-5">
              <div className="flex min-h-40 flex-col items-center justify-center rounded-lg bg-white/25 p-4 text-center sm:col-span-2">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <Play className="h-5 w-5 fill-white" />
                </div>
                <span className="text-xs font-semibold">AI Transcription</span>
                <span className="mt-1 text-[11px] text-[#ecfdf5]">Watch less, understand more</span>
              </div>
              <div className="space-y-3 sm:col-span-3">
                <div className="rounded-lg bg-white/25 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <FileVideo className="h-4 w-4 text-[#10b981]" />
                    Instant AI Summaries
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/20" />
                  <div className="mt-2 h-2 w-4/5 rounded-full bg-white/20" />
                </div>
                <div className="rounded-lg bg-white/25 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Check className="h-4 w-4 text-[#10b981]" />
                    Easy Export &amp; Share
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-[#ecfdf5]">
                    Get clear, fluent English insights in seconds.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-white/25 p-4">
              <div className="mb-3 text-xs font-semibold">99%+ Accurate Transcripts</div>
              <div className="h-2 rounded-full bg-white/20" />
              <div className="mt-2 h-2 w-11/12 rounded-full bg-white/20" />
              <div className="mt-2 h-2 w-3/4 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
