 

import { NextResponse } from "next/server";
import { generateBlogPostAction } from "@/actions/upload-actions";

export async function POST(request: Request) {
  const { transcriptions, userId } = await request.json();
   console.log("[/api/generate] Received:", transcriptions, userId);
  const result = await generateBlogPostAction({ transcriptions, userId });

  return NextResponse.json(result);
}
