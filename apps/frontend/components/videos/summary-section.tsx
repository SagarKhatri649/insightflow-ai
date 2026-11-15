"use client";

import { useState } from "react";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";
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
  | { kind: "bullet"; text: string };

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

  const savedSummary = summary?.trim() ? summary : null;

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateWorkspaceItemSummaryAction({
        workspaceItemId,
      });

      if (result.success) {
        setSummary(result.summary);
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
    }
  };

  return (
    <section
      aria-labelledby="ai-summary-heading"
      className="rounded-xl border border-[#dee1e6] bg-white p-5 shadow-xs sm:p-7"
    >
      {/* Header: title and generate action */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#dee1e6] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#064e3b]">
            <Lightbulb className="h-4 w-4 text-[#064e3b]" />
          </div>
          <h2
            id="ai-summary-heading"
            className="text-base font-bold text-[#064e3b] sm:text-lg"
          >
            AI Summary
          </h2>
        </div>

        {savedSummary === null && hasTranscript && (
          <Button
            type="button"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-[#064e3b] text-xs font-semibold text-white hover:bg-[#04382b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {isGenerating ? "Generating…" : "Generate Summary"}
          </Button>
        )}
      </div>

      {/* Saved or generated summary */}
      {savedSummary ? (
        <div className="max-h-[min(70vh,50rem)] overflow-y-auto rounded-lg border border-[#dee1e6]/60 bg-[#f8faf9] p-5 text-sm leading-relaxed text-[#3c4043] sm:p-6 sm:text-base">
          <div className="sm:max-w-[75ch]">
            {parseSummaryMarkdown(savedSummary).map((block, index) => {
              if (block.kind === "heading") {
                return (
                  <h3
                    key={index}
                    className="mb-2 mt-4 text-sm font-bold text-[#064e3b] first:mt-0 sm:text-base"
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
                      className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#10b981]"
                    />
                    <span>{block.text}</span>
                  </p>
                );
              }

              return (
                <p key={index} className="mb-3 leading-relaxed last:mb-0">
                  {block.text}
                </p>
              );
            })}
          </div>
        </div>
      ) : hasTranscript ? (
        <div className="rounded-lg bg-[#f8faf9] p-5 text-xs text-[#5f6368] sm:p-6">
          {isGenerating ? (
            <p className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[#064e3b]" />
              Generating a summary and key points from the transcript…
            </p>
          ) : (
            <p>
              {error ??
                "Generate a summary and key points from the saved transcript."}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-[#f8faf9] p-5 text-xs text-[#5f6368] sm:p-6">
          <p>
            Summaries become available once transcription is complete. Check
            back after the transcript is ready.
          </p>
        </div>
      )}
    </section>
  );
}
