import { currentUser } from "@clerk/nextjs/server";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileVideo,
  Info,
  Loader2,
  Play,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UploadForm from "@/components/upload/upload-form";
import getDbConnection from "@/lib/db";

type WorkspaceItem = {
  id: string;
  file_name: string;
  status: string;
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

function getStatusClasses(status: string) {
  if (status === "completed" || status === "transcribed") {
    return "border-[#a7f3d0] bg-[#ecfdf5] text-[#064e3b]";
  }

  if (status === "failed") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "processing") {
    return "border-[#dee1e6] bg-white text-[#5f6368]";
  }

  return "border-[#dee1e6] bg-[#f1f3f5] text-[#5f6368]";
}

function getStatusTileClasses(status: string) {
  if (status === "completed" || status === "transcribed") {
    return "border border-[#a7f3d0] bg-[#ecfdf5] text-[#064e3b]";
  }

  if (status === "failed") {
    return "border border-red-200 bg-red-50 text-red-700";
  }

  if (status === "processing" || status === "uploaded") {
    return "border border-[#dee1e6] bg-[#f8faf9] text-[#064e3b]";
  }

  return "border border-[#dee1e6] bg-[#f1f3f5] text-[#5f6368]";
}

function getStatusIcon(status: string) {
  if (status === "completed") return CheckCircle2;
  if (status === "processing") return Clock3;
  if (status === "failed") return AlertTriangle;
  return FileVideo;
}

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  let workspaceItems: WorkspaceItem[] = [];
  let workspaceError = false;

  try {
    const sql = await getDbConnection();
    workspaceItems = (await sql`
      SELECT id, file_name, status, post_id, transcript, created_at
      FROM workspace_items
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT 5
    `) as WorkspaceItem[];
  } catch (error) {
    console.error("Failed to load dashboard workspace items:", error);
    workspaceError = true;
  }

  const displayName = user.firstName ?? user.fullName ?? "there";
  const readyCount = workspaceItems.filter(
    (item) => item.status === "completed" || item.status === "transcribed",
  ).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Welcome Section */}
      <section>
        <div className="max-w-2xl">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-[#064e3b] sm:text-3xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#5f6368] sm:text-base">
            Ready to turn your videos into actionable insights? Upload a file to
            create a transcript, summary, and key points.
          </p>
        </div>
      </section>

      {/* Quick Upload */}
      <section aria-label="Quick upload" className="mt-6 sm:mt-8">
        <UploadForm variant="compact" />
      </section>

      {/* Workspace Summary */}
      <section
        aria-labelledby="workspace-summary-heading"
        className="mt-6 rounded-xl border border-[#dee1e6] bg-white p-6 shadow-sm sm:mt-8"
      >
        <div className="flex flex-col gap-3 border-b border-[#dee1e6] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              id="workspace-summary-heading"
              className="font-heading text-xs font-bold tracking-wider text-[#064e3b] uppercase"
            >
              Workspace Summary
            </h2>
            <p className="mt-1 text-sm text-[#5f6368]">
              {workspaceError
                ? "Summary is temporarily unavailable."
                : "Based on your 5 most recent items."}
            </p>
          </div>
          <span
            className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              workspaceError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-[#a7f3d0] bg-[#ecfdf5] text-[#064e3b]"
            }`}
          >
            {workspaceError ? "Unavailable" : "Latest 5"}
          </span>
        </div>

        <div className="grid gap-4 pt-5 sm:grid-cols-2">
          <div className="rounded-lg border border-[#dee1e6] bg-[#f8faf9] p-5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-[#202124]">
                Recent uploads
              </span>
              <span className="font-heading text-3xl font-bold text-[#064e3b]">
                {workspaceError ? (
                  <>
                    <span aria-hidden="true">—</span>
                    <span className="sr-only">Unavailable</span>
                  </>
                ) : (
                  workspaceItems.length
                )}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#5f6368]">
              Files shown in this view
            </p>
          </div>

          <div className="rounded-lg border border-[#dee1e6] bg-[#f8faf9] p-5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-[#202124]">
                Transcripts ready
              </span>
              <span className="font-heading text-3xl font-bold text-[#064e3b]">
                {workspaceError ? (
                  <>
                    <span aria-hidden="true">—</span>
                    <span className="sr-only">Unavailable</span>
                  </>
                ) : (
                  readyCount
                )}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#5f6368]">
              Available for review and export
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-1.5 border-t border-[#dee1e6] pt-4 text-xs text-[#5f6368]">
          <Info
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 text-[#064e3b]"
          />
          <span>Fast AI transcription powered by Groq</span>
        </div>
      </section>

      {/* Recent Videos Section */}
      <section aria-labelledby="recent-videos-heading" className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="recent-videos-heading"
            className="font-heading text-lg font-bold text-[#064e3b]"
          >
            Recent Videos
          </h2>
          <Link
            href="/posts"
            className="group inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-[#064e3b] transition-colors hover:bg-[#ecfdf5] hover:text-[#04382b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
          >
            <span>View library</span>
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {workspaceError ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm sm:p-6"
          >
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0"
            />
            <p>
              Your recent videos are temporarily unavailable. Please try again
              later.
            </p>
          </div>
        ) : workspaceItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf5] text-[#064e3b]">
              <FileVideo
                aria-hidden="true"
                className="h-6 w-6 text-[#10b981]"
              />
            </div>
            <h3 className="mt-4 font-heading text-base font-bold text-[#064e3b]">
              No videos yet
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[#5f6368]">
              Upload your first video to create a transcript and summary.
            </p>
            <Button
              asChild
              className="mt-5 h-9 rounded-lg bg-[#064e3b] px-4 font-heading text-sm font-semibold text-white shadow-sm hover:bg-[#04382b] focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
            >
              <Link href="/upload">Upload your first video</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#dee1e6] bg-white shadow-sm">
            <div
              aria-hidden="true"
              className="hidden border-b border-[#dee1e6] bg-[#f8faf9] px-6 py-3 text-xs font-semibold text-[#5f6368] lg:flex lg:items-center lg:gap-4"
            >
              <span className="min-w-0 flex-1">Video Name</span>
              <span className="w-32 shrink-0">Upload Date</span>
              <span className="w-32 shrink-0 text-center">Status</span>
              <span className="w-24 shrink-0 text-right">Action</span>
            </div>
            <ul className="divide-y divide-[#dee1e6]">
              {workspaceItems.map((item) => {
                const statusLabel =
                  statusLabels[item.status] ?? "Unknown status";
                const StatusIcon = getStatusIcon(item.status);
                const isValidPostId =
                  typeof item.post_id === "string" &&
                  postIdPattern.test(item.post_id);
                const resultHref =
                  item.status === "completed" && isValidPostId && item.post_id
                    ? `/posts/${item.post_id}`
                    : item.status === "transcribed" ||
                        (item.status === "failed" &&
                          Boolean(item.transcript)) ||
                        (item.status === "completed" &&
                          Boolean(item.transcript))
                      ? `/videos/${item.id}`
                      : null;
                const isCompleted =
                  item.status === "completed" || item.status === "transcribed";
                const isProcessing =
                  item.status === "processing" || item.status === "uploaded";

                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-[#f8faf9] focus-within:bg-[#f8faf9] sm:px-6 lg:flex-row lg:items-center lg:gap-4"
                  >
                    {/* Video Name with status icon tile */}
                    <div className="flex min-w-0 flex-1 items-center gap-3.5">
                      <div
                        aria-hidden="true"
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getStatusTileClasses(item.status)}`}
                      >
                        {isCompleted ? (
                          <Play className="ml-0.5 h-4 w-4 fill-[#064e3b] text-[#064e3b]" />
                        ) : isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <StatusIcon className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className="truncate text-sm font-semibold text-[#202124]"
                        title={item.file_name}
                      >
                        {item.file_name}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-nowrap lg:gap-4">
                      {/* Upload Date */}
                      <div className="text-xs text-[#5f6368] lg:w-32 lg:shrink-0">
                        <span className="mr-2 font-semibold lg:sr-only">
                          Uploaded:
                        </span>
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>

                      {/* Status Badge */}
                      <div className="flex lg:w-32 lg:shrink-0 lg:justify-center">
                        <Badge
                          variant="outline"
                          className={`w-fit text-xs font-semibold ${getStatusClasses(item.status)}`}
                        >
                          {statusLabel}
                        </Badge>
                      </div>

                      {/* Action */}
                      <div className="flex lg:w-24 lg:shrink-0 lg:justify-end">
                        {resultHref ? (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-lg border-[#dee1e6] bg-white px-3.5 font-heading text-xs font-semibold text-[#064e3b] shadow-2xs hover:border-[#064e3b] hover:bg-[#ecfdf5] focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
                          >
                            <Link
                              href={resultHref}
                              aria-label={`Open ${item.file_name}`}
                            >
                              Open
                            </Link>
                          </Button>
                        ) : (
                          <button
                            disabled
                            type="button"
                            aria-label={
                              item.status === "failed"
                                ? `Failed: ${item.file_name}`
                                : `Waiting for ${item.file_name}`
                            }
                            className="h-9 cursor-not-allowed rounded-lg border border-[#dee1e6] bg-[#f8faf9] px-3.5 font-heading text-xs font-medium text-[#979797]"
                          >
                            {item.status === "failed" ? "Failed" : "Wait"}
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
    </div>
  );
}
