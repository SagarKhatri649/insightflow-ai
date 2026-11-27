"use client";

import { useRef, useState } from "react";
import { AlertCircle, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/sonner";
import { generateWorkspaceItemSummaryAction } from "@/actions/upload-actions";

type SummarySectionProps = {
  workspaceItemId: string;
  /** Saved summary rendered server-side, or null when none exists yet. */
  initialSummary: string | null;
  /** Whether a transcript exists — generation is only possible with one. */
  hasTranscript: boolean;
};

type SummaryBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "bullet"; text: string }
  | { kind: "ordered"; number: number; text: string };

/**
 * Splits text into regular/bold segments at Markdown **bold** markers so they
 * can be rendered as real <strong> content instead of literal asterisks.
 * Unmatched asterisks are left untouched.
 */
function splitInlineBold(text: string): Array<{ text: string; bold: boolean }> {
  const parts: Array<{ text: string; bold: boolean }> = [];

  for (const [index, segment] of text.split(/\*\*(.+?)\*\*/g).entries()) {
    if (!segment) continue;
    parts.push({ text: segment, bold: index % 2 === 1 });
  }

  return parts.length > 0 ? parts : [{ text, bold: false }];
}

/** Renders inline bold segments as plain text with real <strong> elements. */
function InlineText({ text }: { text: string }) {
  const parts = splitInlineBold(text);
  return (
    <>
      {parts.map((part, index) =>
        part.bold ? (
          <strong key={index} className="font-semibold">
            {part.text}
          </strong>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}

/**
 * Renders the limited Markdown shape the summary model is prompted to emit
 * (## headings, plain paragraphs and • bullets). No Markdown package needed.
 */
function parseSummaryMarkdown(summary: string): SummaryBlock[] {
  const blocks: SummaryBlock[] = [];

  for (const rawLine of summary.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("##")) {
      blocks.push({ kind: "heading", text: line.replace(/^#+\s*/, "") });
      continue;
    }

    if (/^[•\-*]\s+/.test(line)) {
      blocks.push({ kind: "bullet", text: line.replace(/^[•\-*]\s+/, "") });
      continue;
    }

    const orderedMatch = /^(\d+)[.)]\s+(.*)$/.exec(line);
    if (orderedMatch) {
      blocks.push({
        kind: "ordered",
        number: Number.parseInt(orderedMatch[1], 10),
        text: orderedMatch[2],
      });
      continue;
    }

    blocks.push({ kind: "paragraph", text: line });
  }

  return blocks;
}

export default function SummarySection({
  workspaceItemId,
  initialSummary,
  hasTranscript,
}: SummarySectionProps) {
  const { toast } = useToast();
  const [summary, setSummary] = useState<string | null>(initialSummary);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const summaryHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const generateButtonRef = useRef<HTMLButtonElement | null>(null);
  const restoreGenerateFocusRef = useRef(false);

  const savedSummary = summary?.trim() ? summary : null;

  const handleGenerate = async () => {
    if (isGenerating) return;
    restoreGenerateFocusRef.current =
      document.activeElement === generateButtonRef.current;
    setIsGenerating(true);
    setError(null);
    setAnnouncement("");

    try {
      const result = await generateWorkspaceItemSummaryAction({
        workspaceItemId,
      });

      if (result.success) {
        setSummary(result.summary);
        setAnnouncement(
          result.cached ? "Saved summary loaded." : "Summary generated.",
        );
        // The Generate button unmounts once a summary exists, so move focus to
        // the stable summary heading instead of leaving it on the document.
        restoreGenerateFocusRef.current = false;
        summaryHeadingRef.current?.focus();
        toast.success(result.cached ? "Summary loaded" : "Summary ready");
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (caught) {
      // Server actions can still throw on network/serialization errors;
      // show a safe, retryable message.
      console.error("Failed to generate summary:", caught);
      const message = "Failed to generate summary. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
      if (restoreGenerateFocusRef.current) {
        requestAnimationFrame(() => {
          // Only restore focus if generation completed without the user
          // moving focus elsewhere while the button was disabled.
          if (document.activeElement === document.body) {
            generateButtonRef.current?.focus();
          }
          restoreGenerateFocusRef.current = false;
        });
      }
    }
  };

  return (
    <section
      aria-labelledby="ai-summary-heading"
      aria-busy={isGenerating}
      className="rounded-xl border border-[#E5E7EB] bg-[#F4F4F5] p-5 shadow-sm sm:p-7"
    >
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </p>

      {/* Header: title and generate action */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB]/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#111111] shadow-2xs">
            <Lightbulb aria-hidden="true" className="h-4 w-4 text-[#111111]" />
          </div>
          <h2
            id="ai-summary-heading"
            ref={summaryHeadingRef}
            tabIndex={-1}
            className="rounded font-heading text-base font-bold text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F4F5] sm:text-lg"
          >
            AI Summary
          </h2>
        </div>

        {savedSummary === null && hasTranscript && (
          <Button
            type="button"
            size="sm"
            ref={generateButtonRef}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="h-9 rounded-lg bg-[#111111] px-3.5 font-heading text-xs font-semibold text-white shadow-sm hover:bg-[#27272A] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2
                aria-hidden="true"
                className="h-3.5 w-3.5 animate-spin"
              />
            ) : (
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            {isGenerating ? "Generating…" : "Generate Summary"}
          </Button>
        )}
      </div>

      {/* Saved or generated summary */}
      {savedSummary ? (
        <div
          role="region"
          aria-label="Summary content"
          tabIndex={0}
          className="max-h-[min(70vh,50rem)] overflow-y-auto rounded-lg border border-[#E5E7EB]/70 bg-white p-5 text-sm leading-7 text-[#3c4043] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 sm:p-6 sm:text-base"
        >
          <div className="sm:max-w-[75ch]">
            {parseSummaryMarkdown(savedSummary).map((block, index) => {
              if (block.kind === "heading") {
                return (
                  <h3
                    key={index}
                    className="mb-2 mt-4 font-heading text-sm font-bold text-[#111111] first:mt-0 sm:text-base"
                  >
                    {block.text}
                  </h3>
                );
              }

              if (block.kind === "bullet") {
                return (
                  <p key={index} className="mb-1.5 flex gap-2 leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#111111]"
                    />
                    <span>
                      <InlineText text={block.text} />
                    </span>
                  </p>
                );
              }

              if (block.kind === "ordered") {
                return (
                  <p key={index} className="mb-1.5 flex gap-2 leading-relaxed">
                    <span className="shrink-0 font-semibold text-[#111111]">
                      {block.number}.
                    </span>
                    <span>
                      <InlineText text={block.text} />
                    </span>
                  </p>
                );
              }

              return (
                <p key={index} className="mb-3 leading-relaxed last:mb-0">
                  <InlineText text={block.text} />
                </p>
              );
            })}
          </div>
        </div>
      ) : hasTranscript ? (
        isGenerating ? (
          <div className="rounded-lg border border-[#E5E7EB]/70 bg-white p-5 text-sm leading-6 text-[#5f6368] sm:p-6">
            <p className="flex items-center gap-2">
              <Loader2
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 animate-spin text-[#111111]"
              />
              Generating a summary and key points from the transcript…
            </p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700 sm:p-6"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            <p>{error}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-[#E5E7EB]/70 bg-white p-5 text-sm leading-6 text-[#5f6368] sm:p-6">
            <p>Generate a summary and key points from the saved transcript.</p>
          </div>
        )
      ) : (
        <div className="rounded-lg border border-[#E5E7EB]/70 bg-white p-5 text-sm leading-6 text-[#5f6368] sm:p-6">
          <p>
            Summaries become available once transcription is complete. Check
            back after the transcript is ready.
          </p>
        </div>
      )}
    </section>
  );
}
