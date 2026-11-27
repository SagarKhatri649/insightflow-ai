"use client";

import { useRef, useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/sonner";

type DownloadPdfButtonProps = {
  workspaceItemId: string;
  /** Used to derive the suggested download filename. */
  fileName: string;
  /** When false, the PDF contains the transcript only — tell the user up front. */
  hasSummary: boolean;
};

// Strip path segments, extensions and characters that are unsafe in a
// download filename, matching the server-side sanitization intent.
function sanitizeFileName(fileName: string) {
  const base = fileName.split(/[\\/]/).pop() ?? "";
  const withoutExtension = base.replace(/\.[^.]*$/, "").trim();
  const cleaned = withoutExtension
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-")
    .trim();
  return cleaned || "video";
}

export default function DownloadPdfButton({
  workspaceItemId,
  fileName,
  hasSummary,
}: DownloadPdfButtonProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef(false);

  const handleDownload = async () => {
    // Duplicate-click guard alongside the disabled button state.
    if (isDownloading) return;
    restoreFocusRef.current = document.activeElement === buttonRef.current;
    setIsDownloading(true);

    try {
      const response = await fetch(
        `/api/videos/${encodeURIComponent(workspaceItemId)}/export-pdf`,
      );

      // Report endpoint errors honestly — never claim success before the
      // download has actually started.
      if (!response.ok) {
        let message = "Failed to generate the PDF report. Please try again.";
        try {
          const data = await response.json();
          if (typeof data?.message === "string" && data.message) {
            message = data.message;
          }
        } catch {
          // Non-JSON error body; keep the generic message.
        }
        toast.error(message);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizeFileName(fileName)}-insightflow-report.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      if (hasSummary) {
        toast.success("PDF report downloaded");
      } else {
        toast.info(
          "PDF report downloaded — it contains the full transcript only, because no summary has been generated yet.",
        );
      }
    } catch (error) {
      console.error("Failed to download PDF report:", error);
      toast.error("Failed to download the PDF report. Please try again.");
    } finally {
      setIsDownloading(false);
      if (restoreFocusRef.current) {
        requestAnimationFrame(() => {
          // Restore focus only if the disabled button caused it to fall back
          // to the document and the user has not moved focus elsewhere.
          if (document.activeElement === document.body) {
            buttonRef.current?.focus();
          }
          restoreFocusRef.current = false;
        });
      }
    }
  };

  return (
    <Button
      ref={buttonRef}
      type="button"
      size="sm"
      variant="outline"
      onClick={handleDownload}
      disabled={isDownloading}
      aria-busy={isDownloading}
      aria-label={
        isDownloading
          ? "Preparing PDF report"
          : "Download video insight report as PDF"
      }
      className="h-9 rounded-lg border-[#dee1e6] bg-white px-3.5 font-heading text-xs font-semibold text-[#111111] shadow-2xs hover:border-[#111111] hover:bg-[#F4F4F5] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDownloading ? (
        <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <FileDown aria-hidden="true" className="h-3.5 w-3.5" />
      )}
      {isDownloading ? "Preparing PDF…" : "Download PDF"}
    </Button>
  );
}
