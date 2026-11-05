 
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

  return (
    <main className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-0">
      <h2 className="text-3xl font-bold text-white my-6">Your Summary</h2>

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
