import { ArrowRight, Youtube } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="border-t border-[#E5E7EB]/80 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="flex flex-col items-center rounded-3xl border border-[#E5E7EB] bg-[#FAFAFA] p-10 text-center md:p-16">
          <h2 className="max-w-2xl font-heading text-3xl font-medium leading-tight tracking-[-0.03em] text-[#111111] md:text-4xl">
            Stop replaying.{" "}
            <span className="text-[#9CA3AF]">
              Start extracting what matters.
            </span>
          </h2>
          <p className="mx-auto mt-4 mb-8 max-w-xl text-base leading-relaxed text-[#6B7280]">
            Upload your next video or paste a YouTube link to get the
            transcript, AI summary, Q&amp;A chat, and PDF export in minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/upload"
              className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-[#111111] px-7 py-3.5 font-heading text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#27272A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
            >
              Upload a Video
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/upload#upload-youtube"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-6 py-3.5 font-heading text-sm font-medium text-[#111111] transition-colors duration-200 hover:border-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
            >
              <Youtube aria-hidden="true" className="h-4 w-4 text-[#111111]" />
              Import YouTube Link
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
