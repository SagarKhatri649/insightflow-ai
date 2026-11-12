import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, Clock3 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TranscriptPanel from "@/components/videos/transcript-panel";
import getDbConnection from "@/lib/db";

type WorkspaceItem = {
  id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | string | null;
  status: string;
  transcript: string | null;
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
    return "border-[#a7f3d0] bg-[#ecfdf5] text-[#064e3b]";
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
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-xs">
        <h2 className="mb-1 font-bold">Transcription Failed</h2>
        <p>
          {item.error_message ||
            "Processing failed. Please try again by uploading the file."}
        </p>
        <div className="mt-4">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-red-300 bg-white text-xs font-semibold text-red-700 shadow-2xs hover:bg-red-50"
          >
            <Link href="/upload">Upload again</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 text-center shadow-xs sm:p-12">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf5] text-[#064e3b]">
        <Clock3 className="h-6 w-6 text-[#10b981]" />
      </div>
      <h2 className="mt-4 text-base font-bold text-[#064e3b]">
        Transcript in progress
      </h2>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-[#5f6368]">
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
        <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 shadow-xs sm:p-12">
          <p className="text-sm font-semibold text-[#202124]">
            Video not found
          </p>
          <p className="mt-1 text-xs text-[#5f6368]">
            The requested video workspace does not exist or you do not have
            permission to view it.
          </p>
          <Button
            asChild
            size="sm"
            className="mt-4 bg-[#064e3b] text-white hover:bg-[#04382b]"
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
             error_message, created_at
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
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-xs">
          This video workspace is temporarily unavailable. Please try again
          later.
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6">
        <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 shadow-xs sm:p-12">
          <p className="text-sm font-semibold text-[#202124]">
            Video not found
          </p>
          <p className="mt-1 text-xs text-[#5f6368]">
            The requested video workspace does not exist or you do not have
            permission to view it.
          </p>
          <Button
            asChild
            size="sm"
            className="mt-4 bg-[#064e3b] text-white hover:bg-[#04382b]"
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
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      {/* Top Navigation */}
      <Link
        href="/posts"
        className="group mb-6 inline-flex items-center gap-2 text-xs font-semibold text-[#064e3b] transition-colors hover:text-[#04382b] sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to video library
      </Link>

      {/* Header Section */}
      <header className="mb-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="break-words text-2xl font-extrabold tracking-tight text-[#064e3b] sm:text-3xl">
            {item.file_name}
          </h1>
          <Badge
            variant="outline"
            className={`w-fit text-[11px] font-semibold ${getStatusClasses(item.status)}`}
          >
            {statusLabels[item.status] ?? "Unknown status"}
          </Badge>
        </div>

        {metadataParts.length > 0 && (
          <p className="mt-2 text-xs text-[#5f6368] sm:text-sm">
            {metadataParts.join(" • ")}
          </p>
        )}
      </header>

      {/* Main Status / Full Transcript Section */}
      <StatusMessage item={item} />
    </div>
  );
}
