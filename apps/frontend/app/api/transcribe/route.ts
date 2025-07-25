import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to find the venv’s python
function getPythonBinary() {
  const root = process.cwd(); // should be apps/frontend
  if (process.platform === "win32") {
    // Windows: .venv\Scripts\python.exe
    return path.join(root, ".venv", "Scripts", "python.exe");
  } else {
    // macOS/Linux: .venv/bin/python
    return path.join(root, ".venv", "bin", "python");
  }
}

export async function POST(request: Request) {
  // 1. Parse input
  const { ufsUrl, fileName } = (await request.json()) as {
    ufsUrl: string;
    fileName: string;
  };

  // 2. Download the file
  const resp = await fetch(ufsUrl);
  if (!resp.ok) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch file" },
      { status: 500 }
    );
  }
  const buffer = Buffer.from(await resp.arrayBuffer());

  // 3. Write it to the OS temp directory
  const tmpDir = os.tmpdir();
  const tempPath = path.join(tmpDir, fileName);
  await fs.writeFile(tempPath, buffer);

  // 4. Locate your whisper script
  const scriptPath = path.join(__dirname, "../../../scripts/transcribe.py");

  // 5. Choose the venv’s python binary
  const pythonBin = getPythonBinary();
  console.log("🔧 Spawning:", pythonBin, scriptPath, tempPath);

  // 6. Spawn the process
  const proc = spawn(pythonBin, [scriptPath, tempPath], {
    cwd: path.resolve(process.cwd()),
  });

  // 7. Capture stdout & stderr
  let transcript = "";
  let stderr = "";
  proc.stdout.on("data", (chunk) => (transcript += chunk.toString()));
  proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));

  // 8. Wait for exit
  const code = await new Promise<number>((resolve) =>
    proc.on("close", resolve)
  );
  if (code !== 0) {
    console.error("❌ Whisper error:", stderr);
    return NextResponse.json(
      { success: false, message: stderr || `Exited with code ${code}` },
      { status: 500 }
    );
  }

  console.log("🗒️ Transcript from Whisper:", transcript);
  // 9. Return the transcript
  return NextResponse.json({
    success: true,
    data: { transcriptions: { text: transcript } },
  });
}
