import { Upload } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-[#064e3b] py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="flex flex-col items-center rounded-2xl border border-white/[0.12] bg-white/24 p-10 text-center backdrop-blur-[12px] md:p-14">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
            Stop replaying. Start extracting what matters.
          </h2>
          <p className="mx-auto mt-4 mb-8 max-w-2xl text-base leading-relaxed text-[#ecfdf5] md:text-lg">
            Upload your next video and get the transcript, summary, and key
            insights you need in minutes.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-lg bg-white px-7 py-3.5 font-heading text-base font-bold text-[#064e3b] shadow-lg transition-[background-color,box-shadow] duration-200 hover:bg-[#ecfdf5] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#064e3b]"
          >
            Upload a Video
            <Upload aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
