"use client";

import { z } from "zod";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/sonner";
import { useUploadThing } from "@/utils/uploadthing";
import {
  markWorkspaceItemFailedAction,
  saveWorkspaceItemTranscriptAction,
  saveWorkspaceItemAction,
} from "@/actions/upload-actions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Check,
  FileText,
  Lightbulb,
  Loader2,
  Lock,
  Menu,
  Sparkles,
  Upload,
  Video,
  X,
} from "lucide-react";

const schema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 20 * 1024 * 1024, "File must be ≤20 MB")
    .refine(
      (f) => f.type.startsWith("audio/") || f.type.startsWith("video/"),
      "Must be an audio or video file",
    ),
});

type UploadFormVariant = "full" | "compact";

export default function UploadForm({
  variant = "full",
}: {
  variant?: UploadFormVariant;
}) {
  const isCompact = variant === "compact";
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  const [fileName, setFileName] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const isMounted = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

  const { startUpload } = useUploadThing("videoOrAudioUploader", {
    onUploadBegin: () => {
      toast("Upload started");
    },
    onClientUploadComplete: () => {
      toast.success("Upload complete");
    },
    onUploadError: () => {
      toast.error("Upload error");
    },
  });

  const handleTranscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return toast.error("Please sign in first");

    const input = e.currentTarget.elements.namedItem(
      "file",
    ) as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return toast.error("Please select a file");

    const parsed = schema.safeParse({ file });
    if (!parsed.success) {
      return toast.error(
        parsed.error.flatten().fieldErrors.file?.[0] ?? "Invalid file",
      );
    }

    setFileName(file.name);
    setIsProcessing(true);

    let workspaceItemId: string | undefined;
    let transcriptionCompleted = false;

    try {
      const uploadResults = await startUpload([file]);
      const uploaded = Array.isArray(uploadResults)
        ? uploadResults[0]
        : undefined;
      if (!uploaded?.url) throw new Error("File storage failed");

      const workspaceItemResult = await saveWorkspaceItemAction({
        fileName: file.name,
        fileUrl: uploaded.url,
        fileType: file.type,
        fileSize: file.size,
      });
      if (!workspaceItemResult.success) {
        throw new Error(
          workspaceItemResult.message || "Failed to save uploaded file",
        );
      }
      const savedWorkspaceItemId = workspaceItemResult.workspaceItemId;
      if (!savedWorkspaceItemId) {
        throw new Error("Failed to save uploaded file");
      }
      workspaceItemId = savedWorkspaceItemId;

      toast("Transcribing…");
      const form = new FormData();
      form.append("file", file, file.name);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: form,
      });
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(
          result.message || `Transcription failed (${res.status})`,
        );

      const transcriptText = result.data.transcriptions.text;
      const transcriptResult = await saveWorkspaceItemTranscriptAction({
        workspaceItemId: savedWorkspaceItemId,
        transcript: transcriptText,
      });
      if (!transcriptResult.success) {
        throw new Error(
          transcriptResult.message || "Failed to save transcript",
        );
      }

      setTranscript(transcriptText);
      transcriptionCompleted = true;

      if (isMounted.current) setIsProcessing(false);
      toast.success("Transcript ready! Redirecting…");
      router.push(`/videos/${savedWorkspaceItemId}`);
    } catch (err: unknown) {
      console.error(err);
      if (workspaceItemId && !transcriptionCompleted) {
        await markWorkspaceItemFailedAction({
          workspaceItemId,
          stage: "transcription",
        });
      }
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      if (isMounted.current) setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    if (isProcessing) return;
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <section
        className={isCompact ? "w-full" : "w-full px-4 py-8 sm:px-6 md:py-12"}
      >
        <div
          className={
            isCompact
              ? "mx-auto flex w-full flex-col items-center"
              : "mx-auto flex w-full max-w-4xl flex-col items-center"
          }
        >
          {!isCompact && (
            <div className="mb-7 max-w-2xl text-center">
              <h1 className="mb-3 font-heading text-3xl font-bold tracking-tight text-[#064e3b] sm:text-4xl lg:text-[40px]">
                Turn your video into clear insights
              </h1>
              <p className="text-base leading-[160%] text-[#5f6368]">
                Upload an audio or video file and get a transcript, summary, and
                actionable insights in minutes.
              </p>
            </div>
          )}
          <div
            className={`w-full rounded-xl border border-[#dee1e6] bg-white shadow-sm ${
              isCompact ? "p-4 sm:p-6" : "p-4 sm:p-8"
            }`}
          >
            <form onSubmit={handleTranscribe} aria-busy={isProcessing}>
              <p className="sr-only" role="status" aria-live="polite">
                {isProcessing
                  ? `Processing ${fileName}. Please wait.`
                  : fileName
                    ? `Selected file: ${fileName}. Ready.`
                    : ""}
              </p>
              <div
                className={`group flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#10b981] bg-[#ecfdf5] transition-all duration-300 hover:bg-[#e6fbf2] hover:shadow-sm focus-within:ring-2 focus-within:ring-[#064e3b] focus-within:ring-offset-2 ${
                  isCompact ? "p-5 sm:p-6" : "p-6 sm:p-10"
                }`}
              >
                <label
                  htmlFor="file"
                  aria-label="Choose an audio or video file"
                  className={`flex cursor-pointer items-center justify-center rounded-full border border-[#d1fae5] bg-white text-[#10b981] shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md hover:border-[#10b981] ${
                    isCompact ? "mb-3 h-10 w-10" : "mb-4 h-12 w-12"
                  }`}
                >
                  <Upload
                    aria-hidden="true"
                    className={isCompact ? "h-5 w-5" : "h-6 w-6"}
                  />
                </label>
                <h2
                  id="upload-form-heading"
                  className={`text-center font-heading font-bold text-[#064e3b] ${
                    isCompact ? "mb-1.5 text-base" : "mb-2 text-lg"
                  }`}
                >
                  Upload your audio or video
                </h2>
                <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-[#5f6368]">
                  <span>Drag and drop a file here, or</span>
                  <label
                    htmlFor="file"
                    className="inline-flex cursor-pointer items-center rounded-lg border border-[#dee1e6] bg-white px-2.5 py-1.5 font-medium text-[#064e3b] shadow-sm transition-colors hover:border-[#10b981]"
                  >
                    Browse files
                  </label>
                  <span>from your computer</span>
                </div>
                <p
                  id="upload-form-help"
                  className={`mt-1 text-center text-[#5f6368] ${
                    isCompact ? "text-xs" : "text-sm"
                  }`}
                >
                  Audio or video files up to 20MB
                </p>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="audio/*,video/*"
                  required
                  disabled={isProcessing}
                  ref={fileInputRef}
                  aria-labelledby="upload-form-heading"
                  aria-describedby="upload-form-help"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  className="sr-only"
                />
                {fileName && (
                  <div
                    className={`flex w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-[#dee1e6] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md ${
                      isCompact
                        ? "mt-4 flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
                        : "mt-6 items-center justify-between p-3.5 sm:p-4"
                    }`}
                  >
                    <div
                      className={`flex min-w-0 items-center ${
                        isCompact ? "gap-3" : "space-x-3 sm:space-x-4"
                      }`}
                    >
                      <div
                        className={`flex shrink-0 items-center justify-center rounded-lg bg-[#064e3b] text-white ${
                          isCompact ? "h-9 w-9" : "h-10 w-10"
                        }`}
                      >
                        <Video
                          aria-hidden="true"
                          className="h-5 w-5 text-[#10b981]"
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <p
                          className="truncate font-semibold text-[#064e3b]"
                          title={fileName}
                        >
                          {fileName}
                        </p>
                        <p className="text-xs text-[#5f6368]">
                          {isCompact
                            ? "Selected file"
                            : "Selected audio or video file"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-md border border-[#a7f3d0] bg-[#ecfdf5] px-2.5 py-1 text-xs font-medium text-[#064e3b]">
                        {isProcessing ? (
                          <Loader2
                            aria-hidden="true"
                            className="mr-1 h-3.5 w-3.5 animate-spin text-[#10b981]"
                          />
                        ) : (
                          <Check
                            aria-hidden="true"
                            className="mr-1 h-3.5 w-3.5 text-[#10b981]"
                          />
                        )}
                        {isProcessing ? "Processing" : "Ready"}
                      </span>
                      <button
                        aria-label="Remove file"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-[#979797] transition-colors hover:border-[#dee1e6] hover:text-[#5f6368] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        disabled={isProcessing}
                        onClick={handleRemoveFile}
                      >
                        <X aria-hidden="true" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {!isCompact && (
                <div className="mt-6 grid grid-cols-1 gap-3.5 md:grid-cols-3">
                  <div className="rounded-lg border border-[#dee1e6] bg-white p-3.5">
                    <div className="mb-3 flex items-center space-x-2 font-heading text-xs font-semibold text-[#064e3b]">
                      <FileText
                        aria-hidden="true"
                        className="h-4 w-4 text-[#5f6368]"
                      />
                      <span>Transcript</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1.5 w-full rounded-full bg-[#f1f3f5]" />
                      <div className="h-1.5 w-2/3 rounded-full bg-[#f1f3f5]" />
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#dee1e6] bg-white p-3.5">
                    <div className="mb-3 flex items-center space-x-2 font-heading text-xs font-semibold text-[#064e3b]">
                      <Menu
                        aria-hidden="true"
                        className="h-4 w-4 text-[#5f6368]"
                      />
                      <span>AI Summary</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1.5 w-full rounded-full bg-[#f1f3f5]" />
                      <div className="h-1.5 w-2/3 rounded-full bg-[#f1f3f5]" />
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#dee1e6] bg-white p-3.5">
                    <div className="mb-3 flex items-center space-x-2 font-heading text-xs font-semibold text-[#064e3b]">
                      <Lightbulb
                        aria-hidden="true"
                        className="h-4 w-4 text-[#5f6368]"
                      />
                      <span>Actionable Takeaways</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1.5 w-full rounded-full bg-[#f1f3f5]" />
                      <div className="h-1.5 w-2/3 rounded-full bg-[#f1f3f5]" />
                    </div>
                  </div>
                </div>
              )}
              <div
                className={`flex flex-col items-center justify-center ${
                  isCompact ? "mt-5" : "mt-7"
                }`}
              >
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className={`flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#064e3b] px-6 font-heading font-bold text-white shadow-sm transition-colors hover:bg-[#04382b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${
                    isCompact
                      ? "h-10 text-sm"
                      : "h-11 text-sm sm:text-base sm:px-7"
                  }`}
                >
                  {isProcessing ? (
                    <Loader2
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin text-[#10b981]"
                    />
                  ) : (
                    <Sparkles
                      aria-hidden="true"
                      className="h-4 w-4 text-[#10b981]"
                    />
                  )}
                  <span>
                    {isProcessing
                      ? "Processing…"
                      : "Upload and Generate Insights"}
                  </span>
                </Button>
                <div
                  className={`flex items-center gap-1.5 text-xs text-[#5f6368] ${
                    isCompact ? "mt-2" : "mt-3"
                  }`}
                >
                  <Lock
                    aria-hidden="true"
                    className="h-3.5 w-3.5 flex-shrink-0"
                  />
                  <span>
                    Your file stays private. Processing starts on click.
                  </span>
                </div>
              </div>
            </form>
          </div>
          {transcript && (
            <section className="mt-6 w-full rounded-xl border border-[#dee1e6] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-3 font-heading text-lg font-bold text-[#064e3b]">
                Full Transcription
              </h2>
              <div className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg bg-[#f8faf9] p-4 text-sm leading-7 text-[#3c4043]">
                {transcript}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
