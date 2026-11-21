"use client";

import { useMemo, useRef, useState } from "react";
import { Copy, Download, FileText, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/sonner";

type TranscriptPanelProps = {
  transcript: string;
  fileName: string;
};

// Strip path segments, extensions and characters that are unsafe in a
// download filename, so the saved file is always a plain .txt name.
function sanitizeFileName(fileName: string) {
  const base = fileName.split(/[\\/]/).pop() ?? "";
  const withoutExtension = base.replace(/\.[^.]*$/, "").trim();
  const cleaned = withoutExtension
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-")
    .trim();
  return cleaned || "transcript";
}

type HighlightResult = {
  nodes: React.ReactNode[];
  matchCount: number;
};

// Split the transcript around case-insensitive matches using plain string
// comparison, so special characters in the query are never treated as a
// regular expression. The original string is only read, never modified.
function buildHighlight(
  transcript: string,
  rawQuery: string,
): HighlightResult | null {
  const query = rawQuery.trim().toLocaleLowerCase();
  if (!query) return null;

  const haystack = transcript.toLocaleLowerCase();
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let matchCount = 0;
  let index = haystack.indexOf(query);

  while (index !== -1) {
    if (index > cursor) {
      nodes.push(transcript.slice(cursor, index));
    }
    nodes.push(
      <mark
        key={matchCount}
        className="rounded-sm bg-[#fef08a] px-0.5 text-[#064e3b]"
      >
        {transcript.slice(index, index + query.length)}
      </mark>,
    );
    cursor = index + query.length;
    matchCount += 1;
    index = haystack.indexOf(query, cursor);
  }
  nodes.push(transcript.slice(cursor));

  return { nodes, matchCount };
}

export default function TranscriptPanel({
  transcript,
  fileName,
}: TranscriptPanelProps) {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const trimmedQuery = query.trim();
  const highlight = useMemo(
    () => buildHighlight(transcript, trimmedQuery),
    [transcript, trimmedQuery],
  );

  const wordCount = transcript.trim().split(/\s+/).length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      toast.success("Transcript copied to clipboard");
    } catch (error) {
      console.error("Failed to copy transcript:", error);
      toast.error("Could not copy transcript. Please try again.");
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizeFileName(fileName)}-transcript.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Transcript downloaded");
    } catch (error) {
      console.error("Failed to download transcript:", error);
      toast.error("Could not download transcript. Please try again.");
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    // The clear button unmounts with the query, so keep focus in the search
    // field instead of letting it fall back to the document.
    searchInputRef.current?.focus();
  };

  return (
    <section
      aria-labelledby="transcript-heading"
      className="rounded-xl border border-[#dee1e6] bg-white p-5 shadow-sm sm:p-7"
    >
      {/* Header: title, counts, actions and search */}
      <div className="mb-4 border-b border-[#dee1e6] pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#064e3b]">
              <FileText aria-hidden="true" className="h-4 w-4 text-[#064e3b]" />
            </div>
            <h2
              id="transcript-heading"
              className="font-heading text-base font-bold text-[#064e3b] sm:text-lg"
            >
              Full Transcript
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#5f6368] sm:text-sm">
            <span>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
            {highlight && (
              <span aria-live="polite">
                • {highlight.matchCount}{" "}
                {highlight.matchCount === 1 ? "match" : "matches"}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-9 rounded-lg border-[#dee1e6] bg-white px-3.5 font-heading text-xs font-semibold text-[#064e3b] shadow-2xs hover:border-[#064e3b] hover:bg-[#ecfdf5] focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
            >
              <Copy aria-hidden="true" className="h-3.5 w-3.5" />
              Copy
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-9 rounded-lg border-[#dee1e6] bg-white px-3.5 font-heading text-xs font-semibold text-[#064e3b] shadow-2xs hover:border-[#064e3b] hover:bg-[#ecfdf5] focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
            >
              <Download aria-hidden="true" className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>

          <div className="relative w-full sm:ml-auto sm:max-w-xs">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5f6368]"
            />
            <Input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transcript…"
              aria-label="Search transcript"
              className="h-9 rounded-lg border-[#dee1e6] bg-white pl-8 pr-8 text-sm shadow-2xs focus-visible:border-[#064e3b] focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
            />
            {trimmedQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear transcript search"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#5f6368] transition-colors hover:text-[#064e3b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transcript body — original text with optional highlights */}
      <div
        role="region"
        aria-label="Transcript content"
        tabIndex={0}
        className="max-h-[min(70vh,50rem)] overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-[#dee1e6]/60 bg-[#f8faf9] p-5 text-sm leading-7 text-[#3c4043] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2 sm:p-6 sm:text-base"
      >
        <div className="sm:max-w-[75ch]">
          {highlight ? highlight.nodes : transcript}
        </div>
      </div>
    </section>
  );
}
