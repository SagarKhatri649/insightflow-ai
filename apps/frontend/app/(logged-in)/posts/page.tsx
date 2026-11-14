import { currentUser } from "@clerk/nextjs/server";
import {
  AlertTriangle,
  ChevronDown,
  Clock3,
  FileVideo,
  Loader2,
  Play,
  Search,
  // Upload,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import getDbConnection from "@/lib/db";

type WorkspaceItem = {
  id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | string | null;
  status: string;
  error_message: string | null;
  post_id: string | null;
  transcript: string | null;
  created_at: Date | string;
};

const statusLabels: Record<string, string> = {
  uploaded: "Uploaded",
  processing: "Processing",
  transcribed: "Transcribed",
  completed: "Completed",
  failed: "Failed",
};

const postIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

export default async function VideoLibraryPage(props: {
  searchParams?: Promise<{ q?: string; status?: string; sort?: string }>;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const rawSearchParams = props.searchParams
    ? await props.searchParams
    : undefined;
  const searchQuery = rawSearchParams?.q?.trim().toLowerCase() ?? "";
  const statusFilter = rawSearchParams?.status?.toLowerCase() ?? "all";
  const sortOrder = rawSearchParams?.sort?.toLowerCase() ?? "newest";

  let workspaceItems: WorkspaceItem[] = [];
  let workspaceError = false;

  try {
    const sql = await getDbConnection();
    workspaceItems = (await sql`
      SELECT id, file_name, file_type, file_size, status, error_message, post_id, transcript, created_at
      FROM workspace_items
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `) as WorkspaceItem[];
  } catch (error) {
    console.error("Failed to load video library workspace items:", error);
    workspaceError = true;
  }

  // Filter and sort items based on search parameters
  let filteredItems = [...workspaceItems];

  if (searchQuery) {
    filteredItems = filteredItems.filter((item) =>
      item.file_name.toLowerCase().includes(searchQuery),
    );
  }

  if (statusFilter === "completed") {
    filteredItems = filteredItems.filter(
      (item) => item.status === "completed" || item.status === "transcribed",
    );
  } else if (statusFilter === "processing") {
    filteredItems = filteredItems.filter(
      (item) => item.status === "processing" || item.status === "uploaded",
    );
  } else if (statusFilter === "failed") {
    filteredItems = filteredItems.filter((item) => item.status === "failed");
  }

  if (sortOrder === "oldest") {
    filteredItems.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  } else {
    filteredItems.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  const isFilteringActive =
    Boolean(searchQuery) || statusFilter !== "all" || sortOrder !== "newest";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Header Section */}
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#064e3b] sm:text-3xl">
            Video Library
          </h1>
          <p className="mt-1 text-xs text-[#5f6368] sm:text-sm">
            Browse, search, and manage all your uploaded videos, transcripts,
            and insights.
          </p>
        </div>
        {/* <Button
          asChild
          className="w-full bg-[#064e3b] text-white hover:bg-[#04382b] sm:w-auto"
        >
          <Link href="/upload">
            <Upload className="h-4 w-4" />
            Upload Video
          </Link>
        </Button> */}
      </section>

      {/* Search and Filter Controls Toolbar */}
      <section className="mb-6">
        <form
          method="GET"
          action="/posts"
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6368]" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search your videos..."
              className="h-10 w-full rounded-lg border border-[#dee1e6] bg-white pl-10 pr-4 text-xs text-[#202124] placeholder:text-[#979797] focus:border-[#064e3b] focus:outline-none focus:ring-1 focus:ring-[#064e3b] sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
            <div className="relative">
              <select
                name="status"
                defaultValue={statusFilter}
                className="h-10 cursor-pointer appearance-none rounded-lg border border-[#dee1e6] bg-white py-2 pl-3.5 pr-8 text-xs font-semibold text-[#202124] focus:border-[#064e3b] focus:outline-none focus:ring-1 focus:ring-[#064e3b]"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5f6368]" />
            </div>

            <div className="relative">
              <select
                name="sort"
                defaultValue={sortOrder}
                className="h-10 cursor-pointer appearance-none rounded-lg border border-[#dee1e6] bg-white py-2 pl-3.5 pr-8 text-xs font-semibold text-[#202124] focus:border-[#064e3b] focus:outline-none focus:ring-1 focus:ring-[#064e3b]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5f6368]" />
            </div>

            <Button
              type="submit"
              variant="outline"
              className="h-10 border-[#dee1e6] bg-white px-3.5 text-xs font-semibold text-[#064e3b] shadow-2xs hover:border-[#064e3b] hover:bg-[#ecfdf5]"
            >
              Filter
            </Button>

            {isFilteringActive && (
              <Button
                asChild
                variant="ghost"
                className="h-10 px-2.5 text-xs font-semibold text-[#5f6368] hover:text-[#064e3b]"
              >
                <Link href="/posts">Reset</Link>
              </Button>
            )}
          </div>
        </form>
      </section>

      {/* Main Content Area */}
      {workspaceError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Your video library is temporarily unavailable. Please try again later.
        </div>
      ) : workspaceItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 text-center shadow-xs sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf5] text-[#064e3b]">
            <FileVideo className="h-6 w-6 text-[#10b981]" />
          </div>
          <h2 className="mt-4 text-base font-bold text-[#064e3b]">
            No videos in your library yet
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-xs text-[#5f6368]">
            Upload your first video or audio file to start generating
            transcripts and summaries.
          </p>
          <Button
            asChild
            size="sm"
            className="mt-4 bg-[#064e3b] text-white hover:bg-[#04382b]"
          >
            <Link href="/upload">Upload your first video</Link>
          </Button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 text-center shadow-xs sm:p-12">
          <p className="text-sm font-semibold text-[#202124]">
            No videos matched your filter
          </p>
          <p className="mt-1 text-xs text-[#5f6368]">
            Try adjusting your search terms or clearing your status filter.
          </p>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-4 border-[#dee1e6] text-[#064e3b] hover:bg-[#ecfdf5]"
          >
            <Link href="/posts">Reset filters</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredItems.map((item) => {
            const statusLabel = statusLabels[item.status] ?? "Unknown status";
            const isValidPostId =
              typeof item.post_id === "string" &&
              postIdPattern.test(item.post_id);

            // Determine workspace navigation target
            const resultHref =
              item.status === "completed" && isValidPostId && item.post_id
                ? `/posts/${item.post_id}`
                : item.status === "transcribed" || Boolean(item.transcript)
                  ? `/videos/${item.id}`
                  : null;

            const isCompleted =
              item.status === "completed" || item.status === "transcribed";
            const isProcessing =
              item.status === "processing" || item.status === "uploaded";
            const isFailed = item.status === "failed";

            const fileSize = formatFileSize(item.file_size);
            const fileType = formatFileType(item.file_type, item.file_name);
            const uploadDate = new Date(item.created_at).toLocaleDateString();
            const metaParts = [uploadDate, fileType, fileSize].filter(Boolean);

            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-xs transition-colors sm:flex-row sm:items-center sm:p-5 ${
                  isFailed
                    ? "border-red-200 bg-red-50/20"
                    : "border-[#dee1e6] bg-white hover:border-[#064e3b]/30 hover:bg-[#fbfdfc] hover:shadow-sm"
                }`}
              >
                {/* Left: Thumbnail Icon & Information */}
                <div className="flex min-w-0 items-start gap-4">
                  {/* Thumbnail / Status Icon Box */}
                  <div
                    className={`flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border sm:h-20 sm:w-28 ${
                      isCompleted
                        ? "border-[#a7f3d0] bg-[#ecfdf5] text-[#064e3b]"
                        : isProcessing
                          ? "border-[#dee1e6] bg-[#fbfdfc] text-[#064e3b]"
                          : isFailed
                            ? "border-red-200 bg-red-50 text-red-600"
                            : "border-[#dee1e6] bg-[#f8faf9] text-[#5f6368]"
                    }`}
                  >
                    {isCompleted ? (
                      <Play className="h-6 w-6 fill-[#064e3b] text-[#064e3b]" />
                    ) : isProcessing ? (
                      <Loader2 className="h-6 w-6 animate-spin text-[#064e3b]" />
                    ) : isFailed ? (
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    ) : (
                      <Clock3 className="h-6 w-6 text-[#5f6368]" />
                    )}
                  </div>

                  {/* Title, Metadata, and Error Description */}
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-bold text-[#202124] sm:text-base">
                      {item.file_name}
                    </h2>

                    <p className="mt-1 text-xs text-[#5f6368]">
                      {metaParts.join(" • ")}
                    </p>

                    {isFailed && item.error_message && (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {item.error_message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Status Badge & Action Controls */}
                <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center sm:gap-2.5">
                  <Badge
                    variant="outline"
                    className={`w-fit text-[11px] font-semibold ${getStatusClasses(item.status)}`}
                  >
                    {statusLabel}
                  </Badge>

                  <div>
                    {resultHref ? (
                      <Button
                        asChild
                        size="sm"
                        className="h-8 bg-[#064e3b] px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#04382b]"
                      >
                        <Link href={resultHref}>Open Workspace</Link>
                      </Button>
                    ) : isProcessing ? (
                      <button
                        disabled
                        type="button"
                        className="h-8 cursor-not-allowed rounded-md border border-[#dee1e6] bg-[#f8faf9] px-3.5 text-xs font-medium text-[#979797]"
                      >
                        Wait
                      </button>
                    ) : isFailed ? (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 border-red-200 bg-white px-3.5 text-xs font-semibold text-red-700 shadow-2xs hover:bg-red-50"
                      >
                        <Link href="/upload">Upload again</Link>
                      </Button>
                    ) : (
                      <button
                        disabled
                        type="button"
                        className="h-8 cursor-not-allowed rounded-md border border-[#dee1e6] bg-[#f8faf9] px-3.5 text-xs font-medium text-[#979797]"
                      >
                        Not ready
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer Bar */}
      {!workspaceError && workspaceItems.length > 0 && (
        <section className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#dee1e6] pt-5 text-xs text-[#5f6368] sm:flex-row">
          <p>
            Showing {filteredItems.length} of {workspaceItems.length}{" "}
            {workspaceItems.length === 1 ? "video" : "videos"}
          </p>
          <p className="text-[11px] text-[#979797]">
            © {new Date().getFullYear()} InsightFlow. All rights reserved.
          </p>
        </section>
      )}
    </div>
  );
}
