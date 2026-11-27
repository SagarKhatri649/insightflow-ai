"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Copy,
  FileDown,
  FileText,
  MessageCircle,
  Search,
  Sparkles,
  Youtube,
} from "lucide-react";
import Link from "next/link";

type CardPreviewMode = "transcript" | "summary" | "qa";

export default function HeroSection() {
  const [previewMode, setPreviewMode] = useState<CardPreviewMode>("transcript");

  return (
    <section className="bg-white pt-8 pb-12 sm:pt-12 sm:pb-14 md:pt-14 md:pb-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-10">
        {/* Balanced 12-col editorial header: zero dead right-side space */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10"
        >
          <div className="lg:col-span-7">
            <h1 className="font-heading text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-[#111111] sm:text-5xl lg:text-[58px]">
              Long Videos Into
              <br />
              Instant Insights.
            </h1>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5 lg:items-end lg:text-right">
            <p className="max-w-md text-sm leading-relaxed text-[#52525B] sm:text-[15px]">
              Upload recordings or paste any YouTube link to generate searchable
              transcripts, structured summaries, Q&amp;A answers, and clean PDFs
              in one workspace.
            </p>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Link
                href="/upload"
                className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-[#111111] px-6 py-3 font-heading text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#27272A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
              >
                <span>Get Started</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/upload#upload-youtube"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-5 py-3 font-heading text-sm font-medium text-[#111111] transition-colors duration-200 hover:border-[#111111] hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
              >
                <Youtube
                  aria-hidden="true"
                  className="h-4 w-4 text-[#111111]"
                />
                Import YouTube
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Wide rounded studio showcase card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          className="relative mt-8 overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-gradient-to-br from-[#8D959C] via-[#AAB2B8] to-[#D2D7DB] shadow-[0_24px_65px_-25px_rgba(17,17,17,0.22)] md:mt-10"
        >
          {/* Studio backdrop photography */}
          <div className="relative h-[250px] w-full sm:h-[400px] lg:h-[440px]">
            <img
              src="/hero-studio.jpg"
              alt="Creator reviewing AI video insights in a minimalist studio"
              className="h-full w-full object-cover object-[50%_18%]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#111111]/30 via-transparent to-[#111111]/15"
            />

            {/* Top-right compact file status card (fills upper-right space cleanly) */}
            <div className="hidden items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/75 px-4 py-2.5 text-[#111111] shadow-lg backdrop-blur-xl sm:absolute sm:top-6 sm:right-6 sm:flex sm:w-[310px] md:w-[340px]">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-medium text-[#52525B]">
                  12:40 PM Today • Lecture_04.mp4
                </p>
                <p className="truncate text-xs font-semibold text-[#111111]">
                  System Design &amp; Caching Walkthrough
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#F4F4F5] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#111111]">
                Completed
              </span>
            </div>

            {/* Left floating capability orb cluster + connector (desktop/tablet) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-10 left-6 hidden items-center md:flex lg:left-9"
            >
              <div className="relative flex h-24 w-24 items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/85 shadow-lg backdrop-blur-md">
                  <img src="/breeze.svg" alt="" className="h-5 w-5" />
                </div>
                <span className="absolute -top-1 left-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/80 text-[#111111] shadow-sm backdrop-blur-md">
                  <Youtube className="h-3.5 w-3.5" />
                </span>
                <span className="absolute top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/80 text-[#111111] shadow-sm backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span className="absolute bottom-2 -left-3 flex h-6 w-6 items-center justify-center rounded-full border border-white/60 bg-white/80 text-[#111111] shadow-sm backdrop-blur-md">
                  <FileText className="h-3 w-3" />
                </span>
              </div>
              <svg
                width="95"
                height="34"
                viewBox="0 0 95 34"
                fill="none"
                className="-ml-2 mt-6 text-black/45"
              >
                <path
                  d="M1 12C1 24 14 31 32 31H94"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
                <circle cx="92" cy="31" r="2.2" fill="currentColor" />
              </svg>
            </div>

            {/* Curved arrow toward lower-right card */}
            <svg
              aria-hidden="true"
              width="125"
              height="52"
              viewBox="0 0 125 52"
              fill="none"
              className="pointer-events-none absolute right-[365px] bottom-12 hidden text-black/45 lg:block"
            >
              <path
                d="M2 12C32 46 86 46 121 10"
                stroke="currentColor"
                strokeWidth="1.15"
              />
              <path
                d="M114 10L122 9L120 17"
                stroke="currentColor"
                strokeWidth="1.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Interactive Insight Card: stacks cleanly below photo on mobile, floats on sm+ */}
          <div className="relative border-t border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:border-t-0 sm:bg-transparent sm:p-0">
            <div className="relative rounded-2xl border border-black/10 bg-white p-4 text-[#111111] shadow-sm sm:absolute sm:right-6 sm:bottom-6 sm:w-[325px] sm:border-white/70 sm:bg-white/85 sm:shadow-xl sm:backdrop-blur-xl md:w-[350px]">
              {/* Interactive mode toolbar */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:-mt-8 sm:justify-end">
                <span className="font-mono text-[10px] font-medium text-[#52525B] sm:hidden">
                  Lecture_04.mp4 • Completed
                </span>
                <div className="flex w-fit items-center gap-1 rounded-full border border-[#E5E7EB] bg-white px-1.5 py-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("transcript")}
                    aria-pressed={previewMode === "transcript"}
                    title="Preview Transcript Search"
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      previewMode === "transcript"
                        ? "bg-[#111111] text-white"
                        : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#111111]"
                    }`}
                  >
                    <Search aria-hidden="true" className="h-3 w-3" />
                    Transcript
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("summary")}
                    aria-pressed={previewMode === "summary"}
                    title="Preview Summary"
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      previewMode === "summary"
                        ? "bg-[#111111] text-white"
                        : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#111111]"
                    }`}
                  >
                    <Sparkles aria-hidden="true" className="h-3 w-3" />
                    Summary
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("qa")}
                    aria-pressed={previewMode === "qa"}
                    title="Preview Q&A"
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      previewMode === "qa"
                        ? "bg-[#111111] text-white"
                        : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#111111]"
                    }`}
                  >
                    <MessageCircle aria-hidden="true" className="h-3 w-3" />
                    Q&amp;A
                  </button>
                </div>
              </div>

              {previewMode === "transcript" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-[#111111]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111111] text-[10px] font-bold text-white">
                        IF
                      </span>
                      Transcript Match
                    </div>
                    <span className="font-mono text-[11px] text-[#52525B]">
                      04:18
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#3F3F46]">
                    &ldquo;Placing a{" "}
                    <mark className="rounded-sm bg-[#E4E4E7] px-1 font-semibold text-[#111111]">
                      Redis cache
                    </mark>{" "}
                    in front of PostgreSQL reduces database latency while
                    Whisper transcribes async.&rdquo;
                  </p>
                  <div className="flex items-center justify-between border-t border-black/10 pt-2 font-mono text-[10px] text-[#52525B]">
                    <span>5,420 words • 2 matches</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#111111]">
                      <Copy aria-hidden="true" className="h-3 w-3" />
                      .TXT Ready
                    </span>
                  </div>
                </div>
              )}

              {previewMode === "summary" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#111111]">
                      Key Takeaways
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-[#111111]">
                      <FileDown aria-hidden="true" className="h-3 w-3" />
                      PDF Ready
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-[#3F3F46]">
                    <li className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#111111]"
                      />
                      Use Redis caching with strict TTL for read-heavy routes.
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#111111]"
                      />
                      Offload Whisper transcription &amp; PDF exports to async
                      jobs.
                    </li>
                  </ul>
                </div>
              )}

              {previewMode === "qa" && (
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <span className="rounded-lg bg-[#F4F4F5] px-2.5 py-1 text-[11px] font-semibold text-[#111111]">
                      What are the key takeaways?
                    </span>
                  </div>
                  <p className="rounded-lg border border-black/10 bg-[#FAFAFA] px-2.5 py-2 text-xs leading-relaxed text-[#3F3F46] sm:bg-white/80">
                    Add Redis read caching in front of PostgreSQL and keep
                    transcription jobs asynchronous so API latency stays low.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
