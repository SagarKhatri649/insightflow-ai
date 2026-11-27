import { currentUser } from "@clerk/nextjs/server";
import {
  AlertTriangle,
  ChevronDown,
  Clock3,
  FileVideo,
  Loader2,
  Play,
  Search,
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

function getStatusTileClasses(status: string) {
  if (status === "completed" || status === "transcribed") {
    return "border border-[#E5E7EB] bg-[#F4F4F5] text-[#111111]";
  }

  if (status === "failed") {
    return "border border-red-200 bg-red-50 text-red-600";
  }

  if (status === "processing" || status === "uploaded") {
    return "border border-[#dee1e6] bg-[#FAFAFA] text-[#111111]";
  }

  return "border border-[#dee1e6] bg-[#f1f3f5] text-[#5f6368]";
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
  const rawSearchQuery = rawSearchParams?.q?.trim() ?? "";
  const searchQuery = rawSearchQuery.toLowerCase();
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
      <header className="max-w-2xl">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
          Video Library
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#5f6368] sm:text-base">
          Browse, search, and manage all your uploaded videos, transcripts, and
          insights.
        </p>
      </header>

      {/* Search and Filter Controls Toolbar */}
      <section className="mt-6 sm:mt-8">
        <form
          role="search"
          method="GET"
          action="/posts"
          className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="relative w-full lg:flex-1">
            <label htmlFor="video-search" className="sr-only">
              Search videos
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6368]"
            />
            <input
              id="video-search"
              type="text"
              name="q"
              defaultValue={rawSearchQuery}
              placeholder="Search your videos..."
              className="h-10 w-full rounded-lg border border-[#dee1e6] bg-white pl-10 pr-4 text-sm text-[#202124] placeholder:text-[#979797] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 lg:flex-nowrap">
            <div className="relative">
              <label htmlFor="status-filter" className="sr-only">
                Filter by status
              </label>
              <select
                id="status-filter"
                name="status"
                defaultValue={statusFilter}
                className="h-10 cursor-pointer appearance-none rounded-lg border border-[#dee1e6] bg-white py-2 pl-3.5 pr-8 text-sm font-medium text-[#202124] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5f6368]"
              />
            </div>

            <div className="relative">
              <label htmlFor="sort-order" className="sr-only">
                Sort videos
              </label>
              <select
                id="sort-order"
                name="sort"
                defaultValue={sortOrder}
                className="h-10 cursor-pointer appearance-none rounded-lg border border-[#dee1e6] bg-white py-2 pl-3.5 pr-8 text-sm font-medium text-[#202124] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5f6368]"
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              className="h-10 rounded-lg border-[#dee1e6] bg-white px-4 font-heading text-sm font-semibold text-[#111111] shadow-2xs hover:border-[#111111] hover:bg-[#F4F4F5] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
            >
              Filter
            </Button>

            {isFilteringActive && (
              <Button
                asChild
                variant="ghost"
                className="h-10 rounded-lg px-3 font-heading text-sm font-semibold text-[#5f6368] hover:bg-[#FAFAFA] hover:text-[#111111] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
              >
                <Link href="/posts">Reset</Link>
              </Button>
            )}
          </div>
        </form>
      </section>

      {/* Main Content Area */}
      <section className="mt-6 sm:mt-8">
        {workspaceError ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm sm:p-6"
          >
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0"
            />
            <div>
              <h2 className="font-heading text-base font-bold text-red-700">
                Unable to load your video library
              </h2>
              <p className="mt-1 text-sm text-red-700">
                Your video library is temporarily unavailable. Please try again
                later.
              </p>
              <Link
                href="/posts"
                className="mt-3 inline-flex items-center rounded-md font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
              >
                Try again
              </Link>
            </div>
          </div>
        ) : workspaceItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F5] text-[#111111]">
              <FileVideo
                aria-hidden="true"
                className="h-6 w-6 text-[#111111]"
              />
            </div>
            <h2 className="mt-4 font-heading text-base font-bold text-[#111111]">
              No videos in your library yet
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[#5f6368]">
              Upload your first video or audio file to start generating
              transcripts and summaries.
            </p>
            <Button
              asChild
              className="mt-5 h-9 rounded-lg bg-[#111111] px-4 font-heading text-sm font-semibold text-white shadow-sm hover:bg-[#27272A] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
            >
              <Link href="/upload">Upload your first video</Link>
            </Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F5] text-[#111111]">
              <Search aria-hidden="true" className="h-6 w-6 text-[#111111]" />
            </div>
            <h2 className="mt-4 font-heading text-base font-bold text-[#111111]">
              No videos matched your filter
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[#5f6368]">
              Try adjusting your search terms or clearing your status filter.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-5 h-9 rounded-lg border-[#dee1e6] bg-white px-4 font-heading text-sm font-semibold text-[#111111] shadow-2xs hover:border-[#111111] hover:bg-[#F4F4F5] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
            >
              <Link href="/posts">Reset filters</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#dee1e6] bg-white shadow-sm">
            <div
              aria-hidden="true"
              className="hidden border-b border-[#dee1e6] bg-[#FAFAFA] px-6 py-3 text-xs font-semibold text-[#5f6368] lg:flex lg:items-center lg:gap-4"
            >
              <span className="min-w-0 flex-1">Video Name</span>
              <span className="w-32 shrink-0 text-center">Status</span>
              <span className="w-32 shrink-0 text-right">Action</span>
            </div>
            <ul className="divide-y divide-[#dee1e6]">
              {filteredItems.map((item) => {
                const statusLabel =
                  statusLabels[item.status] ?? "Unknown status";
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
                const uploadDate = new Date(
                  item.created_at,
                ).toLocaleDateString();
                const metaParts = [uploadDate, fileType, fileSize].filter(
                  Boolean,
                );

                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-[#FAFAFA] focus-within:bg-[#FAFAFA] sm:px-6 lg:flex-row lg:items-center lg:gap-4"
                  >
                    {/* Status Icon, Title, Metadata, and Error Description */}
                    <div className="flex min-w-0 flex-1 items-start gap-3.5">
                      <div
                        aria-hidden="true"
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getStatusTileClasses(
                          item.status,
                        )}`}
                      >
                        {isCompleted ? (
                          <Play className="ml-0.5 h-4 w-4 fill-[#111111] text-[#111111]" />
                        ) : isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isFailed ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <Clock3 className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span
                          className="block truncate text-sm font-semibold text-[#202124]"
                          title={item.file_name}
                        >
                          {item.file_name}
                        </span>

                        <p className="mt-0.5 text-xs text-[#5f6368]">
                          {metaParts.join(" • ")}
                        </p>

                        {isFailed && item.error_message && (
                          <p className="mt-1 text-xs font-medium text-red-600">
                            {item.error_message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status Badge & Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-nowrap lg:gap-4">
                      <div className="flex lg:w-32 lg:shrink-0 lg:justify-center">
                        <Badge
                          variant="outline"
                          className={`w-fit text-xs font-semibold ${getStatusClasses(
                            item.status,
                          )}`}
                        >
                          {statusLabel}
                        </Badge>
                      </div>

                      <div className="flex lg:w-32 lg:shrink-0 lg:justify-end">
                        {resultHref ? (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-lg border-[#dee1e6] bg-white px-3.5 font-heading text-xs font-semibold text-[#111111] shadow-2xs hover:border-[#111111] hover:bg-[#F4F4F5] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
                          >
                            <Link
                              href={resultHref}
                              aria-label={`Open workspace for ${item.file_name}`}
                            >
                              Open Workspace
                            </Link>
                          </Button>
                        ) : isProcessing ? (
                          <button
                            disabled
                            type="button"
                            className="h-9 cursor-not-allowed rounded-lg border border-[#dee1e6] bg-[#FAFAFA] px-3.5 font-heading text-xs font-medium text-[#979797]"
                          >
                            Wait
                          </button>
                        ) : isFailed ? (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-lg border-red-200 bg-white px-3.5 font-heading text-xs font-semibold text-red-700 shadow-2xs hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                          >
                            <Link href="/upload">Upload again</Link>
                          </Button>
                        ) : (
                          <button
                            disabled
                            type="button"
                            className="h-9 cursor-not-allowed rounded-lg border border-[#dee1e6] bg-[#FAFAFA] px-3.5 font-heading text-xs font-medium text-[#979797]"
                          >
                            Not ready
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Summary Footer Bar */}
      {!workspaceError && workspaceItems.length > 0 && (
        <div className="mt-6 border-t border-[#dee1e6] pt-4 text-xs text-[#5f6368]">
          <p>
            Showing {filteredItems.length} of {workspaceItems.length}{" "}
            {workspaceItems.length === 1 ? "video" : "videos"}
          </p>
        </div>
      )}
    </div>
  );
}
