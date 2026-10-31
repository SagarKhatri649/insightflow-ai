import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

export const runtime = "nodejs";
// Export routes for Next App Router
 
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
////////////////////////////////////////////////////////////////////////////////////
// import { NextResponse } from "next/server";
// import { spawn } from "child_process";
// import fs from "fs/promises";
// import path from "path";

// export async function POST(request: Request) {
//   const { ufsUrl, fileName } = await request.json() as { ufsUrl: string; fileName: string };

//   // 1) Download the file to disk
//   const resp = await fetch(ufsUrl);
//   if (!resp.ok) {
//     return NextResponse.json({ success: false, message: "Failed to fetch file" }, { status: 500 });
//   }
//   const buffer = Buffer.from(await resp.arrayBuffer());
//   const tempPath = path.join("/tmp", fileName);
//   await fs.writeFile(tempPath, buffer);

//   // 2) Run your local whisper script
//   const whisperProc = spawn("python3", ["scripts/transcribe.py", tempPath]);
//   let transcript = "";
//   for await (const chunk of whisperProc.stdout) {
//     transcript += chunk.toString();
//   }
//   const exitCode = await new Promise<number>(resolve =>
//     whisperProc.on("close", resolve)
//   );
//   if (exitCode !== 0) {
//     return NextResponse.json(
//       { success: false, message: `Whisper exited with code ${exitCode}` },
//       { status: 500 }
//     );
//   }

//   return NextResponse.json({
//     success: true,
//     data: { transcriptions: { text: transcript } },
//   });
// }
