// import { NextResponse } from "next/server";
// import { generateBlogPostAction } from "@/actions/upload-actions";

// export async function POST(request: Request) {
//   // 1. Parse transcript + userId from the client
//   const { transcriptions, userId } = (await request.json()) as {
//     transcriptions: { text: string };
//     userId: string;
//   };

//   // 2. Call your server action to generate the Markdown post
//   const result = await generateBlogPostAction({ transcriptions, userId });

//   // 3. Return the result as JSON
//   return NextResponse.json(result);
// }

import { NextResponse } from "next/server";
import { generateBlogPostAction } from "@/actions/upload-actions";

export async function POST(request: Request) {
  const { transcriptions, userId } = await request.json();
   console.log("[/api/generate] Received:", transcriptions, userId);
  const result = await generateBlogPostAction({ transcriptions, userId });

  return NextResponse.json(result);
}
