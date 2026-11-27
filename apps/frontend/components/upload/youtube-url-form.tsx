"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/sonner";
import { importYouTubeTranscriptAction } from "@/actions/youtube-actions";

export default function YouTubeUrlForm() {
  const formId = useId();
  const inputId = `${formId}-url`;
  const helpId = `${formId}-help`;
  const { toast } = useToast();
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessing) return;

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      toast.error("Paste a YouTube link to import");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await importYouTubeTranscriptAction({ url: trimmedUrl });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Transcript ready! Redirecting…");
      router.push(`/videos/${result.workspaceItemId}`);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAFAFA] text-[#111111]">
          <Youtube aria-hidden="true" className="h-4 w-4 text-[#111111]" />
        </span>
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold tracking-tight text-[#111111]">
            Import from YouTube
          </h2>
          <p className="mt-0.5 text-xs leading-5 text-[#6B7280] sm:text-sm">
            Paste a YouTube link. We use existing captions when available, or
            generate a transcript with AI.
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        aria-busy={isProcessing}
        className="relative flex w-full flex-col gap-3 sm:flex-row sm:items-end"
      >
        <p className="sr-only" role="status" aria-live="polite">
          {isProcessing
            ? "Importing transcript from YouTube. Please wait."
            : ""}
        </p>
        <div className="min-w-0 flex-1">
          <label
            htmlFor={inputId}
            className="mb-1.5 block font-heading text-xs font-semibold text-[#111111]"
          >
            YouTube link
          </label>
          <Input
            id={inputId}
            name="youtubeUrl"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://www.youtube.com/watch?v=…"
            value={url}
            disabled={isProcessing}
            aria-describedby={helpId}
            onChange={(e) => setUrl(e.target.value)}
            className="h-10 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#111111] placeholder:text-[#9CA3AF] focus-visible:border-[#111111] focus-visible:bg-white focus-visible:ring-[#111111]/15"
          />
        </div>
        <Button
          type="submit"
          disabled={isProcessing}
          className="h-10 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#111111] px-6 font-heading text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#27272A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isProcessing ? (
            <Loader2
              aria-hidden="true"
              className="h-4 w-4 animate-spin text-white"
            />
          ) : (
            <Youtube aria-hidden="true" className="h-4 w-4 text-white" />
          )}
          <span>{isProcessing ? "Importing…" : "Import"}</span>
        </Button>
      </form>
      <p id={helpId} className="mt-2.5 text-xs leading-5 text-[#6B7280]">
        Captions are used when available. Videos without captions are
        transcribed with AI, which can take a minute or two.
      </p>
    </div>
  );
}
