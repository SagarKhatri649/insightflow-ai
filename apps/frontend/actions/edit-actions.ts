"use server";

import { currentUser } from "@clerk/nextjs/server";
import getDbConnection from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updatePostActions(data: {
  postId: string;
  content: string;
}) {
  const { postId, content } = data;

  console.log({ content });
  const user = await currentUser();
  if (!user) {
    return {
      success: false,
    };
  }

  try {
    const sql = await getDbConnection();

    const [title, ...contentParts] = content?.split("\n\n") || [];

    console.log({ title });
    const updatedTitle = title.split("#")[1].trim();
    console.log(updatedTitle);

    const updatedPosts = await sql`
      UPDATE posts
      SET content = ${content}, title = ${updatedTitle}
      WHERE id = ${postId} AND user_id = ${user.id}
      RETURNING id
    `;

    if (updatedPosts.length === 0) {
      return {
        success: false,
      };
    }
  } catch (error) {
    console.error("Error occurred in updating the post", postId);

    return {
      success: false,
    };
  }

  revalidatePath(`/posts/${postId}`);

  return {
    success: true,
  };
}
