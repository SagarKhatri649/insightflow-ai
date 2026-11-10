import { currentUser } from "@clerk/nextjs/server";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileVideo,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  if (status === "completed") {
    return "border-[#bbf7d0] bg-[#ecfdf5] text-[#064e3b]";
  }

  if (status === "failed") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "processing") {
    return "border-[#dee1e6] bg-white text-[#5f6368]";
  }

  if (status === "transcribed") {
    return "border-[#a7f3d0] bg-[#ecfdf5] text-[#064e3b]";
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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#064e3b]">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#064e3b] sm:text-4xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f6368] sm:text-base">
            Turn your videos into clear summaries and actionable insights.
            Upload a file to get started.
          </p>
        </div>
        <Button
          asChild
          className="w-full bg-[#064e3b] text-white hover:bg-[#04382b] sm:w-auto"
        >
          <Link href="/upload">
            <Upload className="h-4 w-4" />
            Upload video
          </Link>
        </Button>
      </section>

      <section aria-labelledby="recent-videos-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            id="recent-videos-heading"
            className="text-xl font-bold tracking-tight text-[#064e3b]"
          >
            Recent videos
          </h2>
          <Link
            href="/posts"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#064e3b] hover:text-[#04382b]"
          >
            View library
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {workspaceError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Your recent videos are temporarily unavailable. Please try again
            later.
          </div>
        ) : workspaceItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#dee1e6] bg-white p-8 text-center shadow-sm">
            <FileVideo className="mx-auto h-10 w-10 text-[#10b981]" />
            <h3 className="mt-4 text-lg font-bold text-[#064e3b]">
              No videos yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5f6368]">
              Upload your first video to create a transcript and summary.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-5 border-[#dee1e6] text-[#064e3b] hover:bg-[#ecfdf5]"
            >
              <Link href="/upload">Upload your first video</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#dee1e6] bg-white shadow-sm">
            <div className="hidden grid-cols-[minmax(0,1fr)_9rem_8rem_5rem] gap-4 border-b border-[#dee1e6] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#5f6368] sm:grid">
              <span>Video name</span>
              <span>Uploaded</span>
              <span>Status</span>
              <span className="text-right">Action</span>
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

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 px-4 py-4 sm:grid sm:grid-cols-[minmax(0,1fr)_9rem_8rem_5rem] sm:items-center sm:gap-4 sm:px-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#064e3b]">
                        <StatusIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 truncate text-sm font-semibold text-[#202124]">
                        {item.file_name}
                      </span>
                    </div>
                    <span className="text-xs text-[#5f6368] sm:text-sm">
                      <span className="mr-2 font-semibold text-[#5f6368] sm:hidden">
                        Uploaded:
                      </span>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <Badge
                      variant="outline"
                      className={`w-fit ${getStatusClasses(item.status)}`}
                    >
                      {statusLabel}
                    </Badge>
                    <div className="sm:text-right">
                      {resultHref ? (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-[#dee1e6] text-[#064e3b] hover:bg-[#ecfdf5]"
                        >
                          <Link href={resultHref}>Open</Link>
                        </Button>
                      ) : (
                        <span className="text-xs text-[#979797]">
                          Not ready
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
