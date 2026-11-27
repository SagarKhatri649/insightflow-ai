"use client";

import { z } from "zod";
import { useState, useRef, useEffect, useId } from "react";
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
  Info,
  Lightbulb,
  Loader2,
  Lock,
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

const uploadSteps = [
  {
    title: "Upload your file",
    description: "Choose an audio or video file from your device.",
  },
  {
    title: "AI transcribes it",
    description: "We convert your recording into a complete transcript.",
  },
  {
    title: "Review and generate insights",
    description: "Open the workspace to create a summary and key takeaways.",
  },
];

const examplePreview = [
  {
    title: "Transcript",
    description: "A complete, readable transcript of your recording.",
    icon: FileText,
  },
  {
    title: "AI Summary",
    description: "A concise overview of the main discussion.",
    icon: Sparkles,
  },
  {
    title: "Key Takeaways",
    description: "The key points and action items worth remembering.",
    icon: Lightbulb,
  },
];

type UploadFormVariant = "full" | "compact";

export default function UploadForm({
  variant = "full",
}: {
  variant?: UploadFormVariant;
}) {
  const isCompact = variant === "compact";
  const formId = useId();
  const fileInputId = `${formId}-file`;
  const headingId = `${formId}-heading`;
  const helpId = `${formId}-help`;
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  const [fileName, setFileName] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isProcessing) return;
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const nextTarget = e.relatedTarget;
    if (nextTarget instanceof Node && e.currentTarget.contains(nextTarget)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const transfer = new DataTransfer();
    transfer.items.add(file);
    if (fileInputRef.current) {
      fileInputRef.current.files = transfer.files;
    }
    setFileName(file.name);
  };

  return (
    <>
      <section
        className={isCompact ? "w-full" : "w-full px-4 py-6 sm:px-6 md:py-8"}
      >
        <div
          className={
            isCompact
              ? "mx-auto flex w-full flex-col items-center"
              : "mx-auto flex w-full max-w-4xl flex-col items-center"
          }
        >
          {!isCompact && (
            <>
              <div className="mb-6 max-w-2xl text-center">
                <p className="mb-2 font-mono text-xs font-medium tracking-widest text-[#71717A] uppercase">
                  Upload &amp; Transcribe
                </p>
                <h1 className="mb-2.5 font-heading text-2xl font-semibold tracking-[-0.03em] text-[#111111] sm:text-3xl lg:text-[38px]">
                  Turn your recordings into clear transcripts.
                </h1>
                <p className="text-sm leading-relaxed text-[#6B7280] sm:text-base">
                  Upload an audio or video file to create a transcript. Once it
                  is ready, you can generate a summary and key takeaways in your
                  workspace.
                </p>
              </div>

              <ol className="mb-6 grid w-full grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
                {uploadSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 transition-colors hover:bg-white"
                  >
                    <span className="mb-2 font-mono text-xs font-semibold tracking-wider text-[#71717A]">
                      0{index + 1}
                    </span>
                    <p className="font-heading text-sm font-semibold text-[#111111]">
                      {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </>
          )}
          <div
            className={`w-full ${
              isCompact
                ? ""
                : "rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs sm:p-6"
            }`}
          >
            <form
              onSubmit={handleTranscribe}
              aria-busy={isProcessing}
              className={
                isCompact
                  ? "relative flex w-full flex-col gap-3 lg:flex-row lg:items-center"
                  : "relative"
              }
            >
              <p className="sr-only" role="status" aria-live="polite">
                {isProcessing
                  ? `Processing ${fileName}. Please wait.`
                  : fileName
                    ? `Selected file: ${fileName}. Ready.`
                    : ""}
              </p>
              <div
                className={`group relative flex w-full flex-col rounded-2xl border border-dashed border-[#D4D4D8] bg-[#FAFAFA] transition-all duration-300 hover:border-[#111111]/40 hover:bg-[#F4F4F5] focus-within:ring-2 focus-within:ring-[#111111] focus-within:ring-offset-2 ${
                  isCompact
                    ? "min-w-0 flex-1 justify-center gap-2 p-3"
                    : "items-center justify-center p-5 sm:p-8"
                } ${
                  isDragging
                    ? "border-[#111111] bg-[#F4F4F5] shadow-sm ring-2 ring-[#111111] ring-offset-2"
                    : ""
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div
                  className={
                    isCompact
                      ? "flex w-full min-w-0 items-center gap-3"
                      : "contents"
                  }
                >
                  <label
                    htmlFor={fileInputId}
                    aria-label="Choose an audio or video file"
                    className={`flex cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111111] shadow-2xs transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-sm hover:border-[#111111] ${
                      isCompact ? "h-9 w-9 shrink-0" : "mb-4 h-12 w-12"
                    }`}
                  >
                    <Upload
                      aria-hidden="true"
                      className={isCompact ? "h-4 w-4" : "h-5 w-5"}
                    />
                  </label>
                  <div
                    className={
                      isCompact ? "min-w-0 flex-1 text-left" : "contents"
                    }
                  >
                    <h2
                      id={headingId}
                      className={`font-heading font-semibold tracking-tight text-[#111111] ${
                        isCompact ? "text-sm" : "mb-2 text-center text-lg"
                      }`}
                    >
                      {isCompact
                        ? "Drop a video or browse files"
                        : "Upload your audio or video"}
                    </h2>
                    <div
                      className={
                        isCompact
                          ? "mt-1 flex flex-wrap items-center gap-1.5 text-sm text-[#6B7280]"
                          : "mb-2 flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-[#6B7280]"
                      }
                    >
                      {!isCompact && <span>Drag and drop a file here, or</span>}
                      <label
                        htmlFor={fileInputId}
                        className="inline-flex cursor-pointer items-center rounded-full border border-[#E5E7EB] bg-white px-3.5 py-1 text-xs font-semibold text-[#111111] shadow-2xs transition-colors hover:border-[#111111]"
                      >
                        Browse files
                      </label>
                      {!isCompact && <span>from your computer</span>}
                    </div>
                    <p
                      id={helpId}
                      className={`mt-1 text-[#71717A] ${
                        isCompact ? "text-xs" : "text-center text-sm"
                      }`}
                    >
                      Audio or video files up to 20 MB
                    </p>
                  </div>
                </div>
                <Input
                  id={fileInputId}
                  name="file"
                  type="file"
                  accept="audio/*,video/*"
                  required
                  disabled={isProcessing}
                  ref={fileInputRef}
                  aria-labelledby={headingId}
                  aria-describedby={helpId}
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  className="sr-only"
                />
                {fileName && (
                  <div
                    className={`flex w-full animate-in fade-in slide-in-from-bottom-2 flex-col items-stretch justify-between gap-3 border border-[#E5E7EB] bg-white transition-shadow duration-200 sm:flex-row sm:items-center ${
                      isCompact
                        ? "mt-0 gap-2 rounded-xl p-2"
                        : "mt-6 max-w-xl rounded-2xl p-3.5 shadow-2xs hover:shadow-sm sm:p-4"
                    }`}
                  >
                    <div
                      className={`flex min-w-0 items-center ${
                        isCompact ? "gap-2" : "space-x-3 sm:space-x-4"
                      }`}
                    >
                      <div
                        className={`flex shrink-0 items-center justify-center rounded-xl bg-[#111111] text-white ${
                          isCompact ? "h-8 w-8" : "h-10 w-10"
                        }`}
                      >
                        <Video
                          aria-hidden="true"
                          className={`text-white ${
                            isCompact ? "h-4 w-4" : "h-5 w-5"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <p
                          className="truncate font-semibold text-[#111111]"
                          title={fileName}
                        >
                          {fileName}
                        </p>
                        {!isCompact && (
                          <p className="text-xs text-[#6B7280]">
                            Selected audio or video file
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={
                        isCompact
                          ? "flex shrink-0 items-center gap-2"
                          : "flex flex-wrap items-center gap-2"
                      }
                    >
                      <span
                        className={`inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#F4F4F5] text-xs font-medium text-[#111111] ${
                          isCompact ? "px-2 py-0.5" : "px-2.5 py-1"
                        }`}
                      >
                        {isProcessing ? (
                          <Loader2
                            aria-hidden="true"
                            className="mr-1 h-3.5 w-3.5 animate-spin text-[#111111]"
                          />
                        ) : (
                          <Check
                            aria-hidden="true"
                            className="mr-1 h-3.5 w-3.5 text-[#111111]"
                          />
                        )}
                        {isProcessing ? "Processing" : "Ready"}
                      </span>
                      <button
                        aria-label="Remove file"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-[#71717A] transition-colors hover:border-[#E5E7EB] hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              <div
                className={
                  isCompact
                    ? "flex w-full shrink-0 sm:w-auto"
                    : "mt-7 flex flex-col items-center justify-center"
                }
              >
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className={`flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#111111] px-6 font-heading font-semibold text-white shadow-xs transition-colors hover:bg-[#27272A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${
                    isCompact
                      ? "h-10 text-sm"
                      : "h-11 text-sm sm:px-7 sm:text-base"
                  }`}
                >
                  {isProcessing ? (
                    <Loader2
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin text-white"
                    />
                  ) : isCompact ? null : (
                    <Upload aria-hidden="true" className="h-4 w-4 text-white" />
                  )}
                  <span>
                    {isProcessing
                      ? "Processing…"
                      : isCompact
                        ? "Upload"
                        : "Upload and transcribe"}
                  </span>
                </Button>
                {!isCompact && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <Lock
                      aria-hidden="true"
                      className="h-3.5 w-3.5 flex-shrink-0"
                    />
                    <span>
                      Your file stays private. Processing starts on click.
                    </span>
                  </div>
                )}
              </div>
            </form>
          </div>
          {transcript && (
            <section className="mt-6 w-full rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs sm:p-6">
              <h2 className="mb-3 font-heading text-lg font-semibold text-[#111111]">
                Full Transcription
              </h2>
              <div className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl bg-[#FAFAFA] p-4 text-sm leading-7 text-[#3F3F46]">
                {transcript}
              </div>
            </section>
          )}
          {!isCompact && (
            <section
              aria-labelledby="example-preview-heading"
              className="mt-10 w-full"
            >
              <h2
                id="example-preview-heading"
                className="font-heading text-lg font-semibold tracking-tight text-[#111111]"
              >
                Example preview
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6B7280]">
                A sample of the transcript and insights you can create after
                uploading.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {examplePreview.map(({ title, description, icon: Icon }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs"
                  >
                    <div className="mb-3 flex items-center gap-2.5 font-heading text-sm font-semibold text-[#111111]">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAFAFA]">
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4 text-[#111111]"
                        />
                      </span>
                      <span>{title}</span>
                    </div>
                    <p className="text-xs leading-5 text-[#6B7280]">
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-3.5 flex items-start gap-1.5 text-xs leading-5 text-[#71717A]">
                <Info
                  aria-hidden="true"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#111111]"
                />
                <span>
                  This preview is illustrative only. Your transcript, summary,
                  and key takeaways are generated from the file you upload.
                </span>
              </p>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
