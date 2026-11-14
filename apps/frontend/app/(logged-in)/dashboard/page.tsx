import { currentUser } from "@clerk/nextjs/server";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileVideo,
  Info,
  Loader2,
  Play,
  // Upload,
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

function getStatusIcon(status: string) {
  if (status === "completed") return CheckCircle2;
  if (status === "processing") return Clock3;
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
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#064e3b] sm:text-3xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-1 text-xs text-[#5f6368] sm:text-sm">
            Ready to turn your videos into actionable insights? Start by
            uploading a file below.
          </p>
        </div>
      </section>

      {/* Top Cards: Quick Upload & Workspace Summary */}
      <section className="my-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 sm:my-8">
        {/* Quick Upload Card */}
        <div className="lg:col-span-8">
          <UploadForm variant="compact" />
        </div>

        {/* Workspace Summary Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#dee1e6] bg-white p-6 shadow-xs lg:col-span-4">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-[#064e3b]/80 uppercase">
                Workspace Summary
              </span>
              <span className="inline-flex items-center rounded-full border border-[#a7f3d0] bg-[#ecfdf5] px-2 py-0.5 text-[10px] font-semibold text-[#064e3b]">
                Active
              </span>
            </div>

            <div className="mb-4">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-xs font-semibold text-[#202124]">
                  Recent Uploads
                </span>
                <span className="text-lg font-extrabold text-[#064e3b]">
                  {workspaceItems.length}
                </span>
              </div>
              <p className="text-[11px] text-[#5f6368]">
                Recorded in your active dashboard
              </p>
            </div>

            <div className="mb-2">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-xs font-semibold text-[#202124]">
                  Transcripts Ready
                </span>
                <span className="text-lg font-extrabold text-[#064e3b]">
                  {readyCount}
                </span>
              </div>
              <p className="text-[11px] text-[#5f6368]">
                Available for instant review and export
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 border-t border-[#dee1e6] pt-3 text-[11px] text-[#5f6368]">
            <Info className="h-3.5 w-3.5 shrink-0 text-[#064e3b]" />
            <span>Fast AI transcription powered by Groq</span>
          </div>
        </div>
      </section>

      {/* Recent Videos Section */}
      <section aria-labelledby="recent-videos-heading" className="pt-2">
        <div className="mb-3.5 flex items-center justify-between">
          <h2
            id="recent-videos-heading"
            className="text-base font-bold text-[#064e3b] sm:text-lg"
          >
            Recent Videos
          </h2>
          <Link
            href="/posts"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#064e3b] transition-colors hover:text-[#04382b]"
          >
            <span>View library</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {workspaceError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Your recent videos are temporarily unavailable. Please try again
            later.
          </div>
        ) : workspaceItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 text-center shadow-xs sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf5] text-[#064e3b]">
              <FileVideo className="h-6 w-6 text-[#10b981]" />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#064e3b]">
              No videos yet
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-[#5f6368]">
              Upload your first video to create a transcript and summary.
            </p>
            <Button
              asChild
              size="sm"
              className="mt-4 bg-[#064e3b] text-white hover:bg-[#04382b]"
            >
              <Link href="/upload">Upload your first video</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#dee1e6] bg-white shadow-xs">
            <div className="hidden grid-cols-12 border-b border-[#dee1e6] bg-[#fbfdfc] px-6 py-3 text-xs font-semibold text-[#5f6368] sm:grid">
              <span className="col-span-5 sm:col-span-6">Video Name</span>
              <span className="col-span-3 sm:col-span-3">Upload Date</span>
              <span className="col-span-2 text-center sm:col-span-2">
                Status
              </span>
              <span className="col-span-2 text-right sm:col-span-1">
                Action
              </span>
            </div>
            <div className="divide-y divide-[#dee1e6]">
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
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-[#fbfdfc] sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:px-6"
                  >
                    {/* Video Name with mint icon box */}
                    <div className="flex min-w-0 items-center gap-3.5 sm:col-span-6">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#064e3b]">
                        {isCompleted ? (
                          <Play className="ml-0.5 h-3.5 w-3.5 fill-[#064e3b] text-[#064e3b]" />
                        ) : isProcessing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#064e3b]" />
                        ) : (
                          <StatusIcon className="h-3.5 w-3.5 text-[#064e3b]" />
                        )}
                      </div>
                      <span className="truncate text-xs font-semibold text-[#202124]">
                        {item.file_name}
                      </span>
                    </div>

                    {/* Upload Date */}
                    <div className="text-xs text-[#5f6368] sm:col-span-3">
                      <span className="mr-2 font-semibold text-[#5f6368] sm:hidden">
                        Uploaded:
                      </span>
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>

                    {/* Status Badge */}
                    <div className="flex sm:col-span-2 sm:justify-center">
                      <Badge
                        variant="outline"
                        className={`w-fit text-[11px] font-semibold ${getStatusClasses(item.status)}`}
                      >
                        {statusLabel}
                      </Badge>
                    </div>

                    {/* Action */}
                    <div className="text-left sm:col-span-1 sm:text-right">
                      {resultHref ? (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-7 border-[#dee1e6] bg-white px-3 text-xs font-semibold text-[#064e3b] shadow-2xs hover:border-[#064e3b] hover:bg-[#ecfdf5]"
                        >
                          <Link href={resultHref}>Open</Link>
                        </Button>
                      ) : (
                        <button
                          disabled
                          type="button"
                          className="h-7 cursor-not-allowed rounded-md border border-[#dee1e6] bg-[#f8faf9] px-3 text-xs font-medium text-[#979797]"
                        >
                          Wait
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Minimal Bottom Boundary */}
      <footer className="pt-8 pb-4 text-center">
        <p className="text-[11px] text-[#979797]">
          © {new Date().getFullYear()} InsightFlow. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
