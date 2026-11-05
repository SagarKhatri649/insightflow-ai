 
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import getDbConnection from '@/lib/db';
import ContentEditor from '@/components/content/content-editor';

export default async function PostPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
    return null;
  }

  const sql = await getDbConnection();
  const posts = await sql`
    SELECT * FROM posts
    WHERE user_id = ${user.id} AND id = ${id}
  `;

  if (!posts?.length) {
    return (
      <div className="text-center text-white mt-28">
        <p>No post found.</p>
      </div>
    );
  }

  // Cast to the shape ContentEditor expects
  const post = posts[0] as { id: string; title: string; content: string };

  return (
    <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-0 mb-12 mt-28">
      <ContentEditor post={post} />
    </div>
  );
}
