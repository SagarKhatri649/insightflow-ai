import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
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
  if (!Number.isFinite(bytes) || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StatusMessage({ item }: { item: WorkspaceItem }) {
  if (item.transcript?.trim()) {
    return (
      <div className="rounded-xl border border-[#dee1e6] bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-4 text-xl font-bold text-[#064e3b]">Transcript</h2>
        <div className="max-h-[min(70vh,48rem)] overflow-y-auto whitespace-pre-wrap break-words rounded-lg bg-[#f8faf9] p-5 text-sm leading-7 text-[#3c4043] sm:p-6">
          {item.transcript}
        </div>
      </div>
    );
  }

  if (item.status === "failed") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {item.error_message || "Processing failed. Please try again."}
      </div>
    );
  }

  if (!item.transcript) {
    return (
      <div className="rounded-xl border border-[#dee1e6] bg-white p-8 text-center shadow-sm">
        <FileText className="mx-auto h-10 w-10 text-[#10b981]" />
        <h2 className="mt-4 text-lg font-bold text-[#064e3b]">
          Transcript not available yet
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5f6368]">
          This video is currently{" "}
          {statusLabels[item.status] ?? "being processed"}. Check back once
          transcription is complete.
        </p>
      </div>
    );
  }
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
        <p className="text-sm text-[#5f6368]">Video not found.</p>
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
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          This video workspace is temporarily unavailable. Please try again
          later.
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6">
        <p className="text-sm text-[#5f6368]">Video not found.</p>
        <Link
          href="/posts"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#064e3b] hover:text-[#04382b]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to video library
        </Link>
      </div>
    );
  }

  const fileSize = formatFileSize(item.file_size);
  const metadata = [item.file_type, fileSize].filter(Boolean).join(" • ");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      <Link
        href="/posts"
        className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#064e3b] hover:text-[#04382b]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to video library
      </Link>

      <header className="mb-7">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#064e3b]">
          Video Workspace
        </p>
        <h1 className="break-words text-2xl font-bold tracking-tight text-[#064e3b] sm:text-3xl">
          {item.file_name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#5f6368]">
          <span>{statusLabels[item.status] ?? "Unknown status"}</span>
          <span aria-hidden="true">•</span>
          <span>{new Date(item.created_at).toLocaleDateString()}</span>
          {metadata && (
            <>
              <span aria-hidden="true">•</span>
              <span>{metadata}</span>
            </>
          )}
        </div>
      </header>

      <StatusMessage item={item} />
    </div>
  );
}
