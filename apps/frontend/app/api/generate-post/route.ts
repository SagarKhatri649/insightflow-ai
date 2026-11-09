import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { generateBlogPostAction } from "@/actions/upload-actions";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 },
    );
  }

  const { transcriptions, workspaceItemId } = await request.json();
  const result = await generateBlogPostAction({
    transcriptions,
    workspaceItemId,
  });

  return NextResponse.json(result);
}
