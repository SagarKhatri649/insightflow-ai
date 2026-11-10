import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import getDbConnection from "@/lib/db";
import Link from "next/link";

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const sql = await getDbConnection();
  const posts = await sql`SELECT * FROM posts WHERE user_id = ${user.id}`;
  let workspaceItems: Array<{
    id: string;
    file_name: string;
    status: string;
    error_message: string | null;
    post_id: string | null;
    transcript: string | null;
    created_at: Date | string;
  }> = [];
  let workspaceError = false;

  try {
    workspaceItems = (await sql`
      SELECT id, file_name, status, error_message, post_id, transcript, created_at
      FROM workspace_items
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `) as typeof workspaceItems;
  } catch (error) {
    console.error("Failed to load workspace items:", error);
    workspaceError = true;
  }

  return (
    <main className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-0">
      <h2 className="text-3xl font-bold text-white my-6">Your Summary</h2>

      <section className="mb-10">
        <h3 className="mb-4 text-2xl font-bold text-white">Your uploads</h3>
        {workspaceError ? (
          <p className="text-gray-400">
            Uploads are temporarily unavailable. Please try again later.
          </p>
        ) : workspaceItems.length === 0 ? (
          <p className="text-gray-400">
            You have no uploads yet. Upload a video or audio to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {workspaceItems.map((item) => {
              const statusLabels: Record<string, string> = {
                uploaded: "Uploaded",
                processing: "Processing",
                transcribed: "Transcribed",
                completed: "Completed",
                failed: "Failed",
              };
              const statusLabel = statusLabels[item.status] ?? "Unknown status";
              const statusClass =
                item.status === "failed"
                  ? "bg-red-50 text-red-700"
                  : item.status === "transcribed"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-gray-100 text-gray-700";
              const isValidPostId =
                typeof item.post_id === "string" &&
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                  item.post_id,
                );
              const isCompleted = item.status === "completed" && isValidPostId;
              const transcriptHref =
                item.status === "transcribed" ||
                (item.status === "failed" && Boolean(item.transcript))
                  ? `/videos/${item.id}`
                  : null;
              const itemContent = (
                <>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-800">
                      {item.file_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    {item.status === "failed" && item.error_message && (
                      <p className="mt-1 text-sm text-red-600">
                        {item.error_message}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm capitalize ${statusClass}`}
                  >
                    {statusLabel}
                  </span>
                </>
              );

              return isCompleted && item.post_id ? (
                <Link
                  key={item.id}
                  href={`/posts/${item.post_id}`}
                  className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg"
                >
                  {itemContent}
                </Link>
              ) : transcriptHref ? (
                <Link
                  key={item.id}
                  href={transcriptHref}
                  className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg"
                >
                  {itemContent}
                </Link>
              ) : (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-md"
                >
                  {itemContent}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {posts.length === 0 && (
        <div>
          <p className="text-gray-400 text-lg lg:text-xl mb-4">
            You have no posts yet. Upload a video or audio to get started.
          </p>
          <Link
            href={`/dashboard`}
            className="text-purple-400 hover:text-purple-600 font-medium flex gap-2 items-center"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
              {post.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {post.content?.split("\n").slice(1).join("\n")}
            </p>

            <Link
              href={`/posts/${post.id}`}
              className="text-purple-600 hover:text-purple-800 font-medium flex gap-2 items-center"
            >
              Read more <ArrowRight className="w-4 h-5" />
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
