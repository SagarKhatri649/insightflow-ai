import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, Clock3 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TranscriptPanel from "@/components/videos/transcript-panel";
import SummarySection from "@/components/videos/summary-section";
import ChatPanel from "@/components/videos/chat-panel";
import DownloadPdfButton from "@/components/videos/download-pdf-button";
import getDbConnection from "@/lib/db";

type WorkspaceItem = {
  id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | string | null;
  status: string;
  transcript: string | null;
  summary: string | null;
  error_message: string | null;
  created_at: Date | string;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const statusLabels: Record<string, string> = {
  uploaded: "Uploaded",
  processing: "Processing",
  transcribed: "Transcribed",
  completed: "Completed",
  failed: "Failed",
};

function formatFileSize(fileSize: WorkspaceItem["file_size"]) {
  if (fileSize === null || fileSize === undefined) return null;
  const bytes = Number(fileSize);
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatFileType(fileType: string | null | undefined, fileName: string) {
  if (fileType) {
    const lower = fileType.toLowerCase();
    if (lower.includes("mp4")) return "MP4";
    if (lower.includes("quicktime") || lower.includes("mov")) return "MOV";
    if (lower.includes("webm")) return "WEBM";
    if (lower.includes("matroska") || lower.includes("mkv")) return "MKV";
    if (lower.includes("mpeg") || lower.includes("mp3")) return "MP3";
    if (lower.includes("wav")) return "WAV";
    const sub = lower.split("/")[1];
    if (sub) return sub.toUpperCase();
  }
  const ext = fileName.split(".").pop();
  return ext ? ext.toUpperCase() : null;
}

function getStatusClasses(status: string) {
  if (status === "completed" || status === "transcribed") {
    return "border-[#E5E7EB] bg-[#F4F4F5] text-[#111111]";
  }

  if (status === "failed") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "processing" || status === "uploaded") {
    return "border-[#dee1e6] bg-white text-[#5f6368]";
  }

  return "border-[#dee1e6] bg-[#f1f3f5] text-[#5f6368]";
}

function StatusMessage({ item }: { item: WorkspaceItem }) {
  if (item.transcript?.trim()) {
    return (
      <TranscriptPanel transcript={item.transcript} fileName={item.file_name} />
    );
  }

  if (item.status === "failed") {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm"
      >
        <h2 className="mb-1 font-heading text-base font-bold sm:text-lg">
          Transcription Failed
        </h2>
        <p>
          {item.error_message ||
            "Processing failed. Please try again by uploading the file."}
        </p>
        <div className="mt-4">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-9 rounded-lg border-red-300 bg-white px-3.5 font-heading text-xs font-semibold text-red-700 shadow-2xs hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            <Link href="/upload">Upload again</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 text-center shadow-sm sm:p-12"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F5] text-[#111111]">
        <Clock3 aria-hidden="true" className="h-6 w-6 text-[#111111]" />
      </div>
      <h2 className="mt-4 font-heading text-base font-bold text-[#111111]">
        Transcript in progress
      </h2>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#5f6368]">
        This video is currently{" "}
        {statusLabels[item.status]?.toLowerCase() ?? "being processed"}. Check
        back once transcription is complete.
      </p>
    </div>
  );
}

export default async function VideoWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!uuidPattern.test(id)) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6">
        <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold text-[#202124]">
            Video not found
          </p>
          <p className="mt-1 text-sm text-[#5f6368]">
            The requested video workspace does not exist or you do not have
            permission to view it.
          </p>
          <Button
            asChild
            size="sm"
            className="mt-4 h-9 rounded-lg bg-[#111111] px-4 font-heading text-xs font-semibold text-white shadow-sm hover:bg-[#27272A] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
          >
            <Link href="/posts">Back to video library</Link>
          </Button>
        </div>
      </div>
    );
  }

  let item: WorkspaceItem | null = null;
  let databaseError = false;

  try {
    const sql = await getDbConnection();
    const [workspaceItem] = await sql`
      SELECT id, file_name, file_type, file_size, status, transcript,
             summary, error_message, created_at
      FROM public.workspace_items
      WHERE id = ${id}
        AND user_id = ${user.id}
    `;
    item = (workspaceItem as WorkspaceItem | undefined) ?? null;
  } catch (error) {
    console.error("Failed to load video workspace item:", error);
    databaseError = true;
  }

  if (databaseError) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm"
        >
          This video workspace is temporarily unavailable. Please try again
          later.
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6">
        <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold text-[#202124]">
            Video not found
          </p>
          <p className="mt-1 text-sm text-[#5f6368]">
            The requested video workspace does not exist or you do not have
            permission to view it.
          </p>
          <Button
            asChild
            size="sm"
            className="mt-4 h-9 rounded-lg bg-[#111111] px-4 font-heading text-xs font-semibold text-white shadow-sm hover:bg-[#27272A] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
          >
            <Link href="/posts">Back to video library</Link>
          </Button>
        </div>
      </div>
    );
  }

  const fileSize = formatFileSize(item.file_size);
  const fileType = formatFileType(item.file_type, item.file_name);
  const uploadDate = new Date(item.created_at).toLocaleDateString();
  const metadataParts = [uploadDate, fileType, fileSize].filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Top Navigation */}
      <Link
        href="/posts"
        className="group mb-5 inline-flex min-h-9 items-center gap-2 rounded-lg px-1 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#F4F4F5] hover:text-[#27272A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
      >
        <ArrowLeft
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
        />
        Back to video library
      </Link>

      {/* Header Section */}
      <header className="mb-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 lg:flex-1">
            <h1
              title={item.file_name}
              className="break-words font-heading text-xl font-bold tracking-tight text-[#111111] sm:text-2xl xl:truncate xl:text-3xl"
            >
              {item.file_name}
            </h1>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <DownloadPdfButton
              workspaceItemId={item.id}
              fileName={item.file_name}
              hasSummary={Boolean(item.summary?.trim())}
            />
            <Badge
              variant="outline"
              className={`w-fit shrink-0 text-xs font-semibold ${getStatusClasses(item.status)}`}
            >
              {statusLabels[item.status] ?? "Unknown status"}
            </Badge>
          </div>
        </div>

        {metadataParts.length > 0 && (
          <p className="mt-2 text-sm leading-6 text-[#5f6368]">
            {metadataParts.join(" • ")}
          </p>
        )}
      </header>

      {/* Responsive Split Workspace: 1 col below xl (when sidebar is visible), 2 cols on xl+ */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start">
        <div className="flex min-w-0 flex-col gap-6 xl:col-span-7">
          <SummarySection
            workspaceItemId={item.id}
            initialSummary={item.summary}
            hasTranscript={Boolean(item.transcript?.trim())}
          />
          <StatusMessage item={item} />
        </div>
        <div className="min-w-0 xl:sticky xl:top-[88px] xl:col-span-5">
          <ChatPanel
            workspaceItemId={item.id}
            hasTranscript={Boolean(item.transcript?.trim())}
          />
        </div>
      </div>
    </div>
  );
}
