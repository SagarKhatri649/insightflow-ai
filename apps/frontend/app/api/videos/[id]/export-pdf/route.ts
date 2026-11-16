// export-pdf/route.ts
// Secure PDF export of a workspace item's saved summary and transcript.
// All content comes from the database, scoped to the authenticated user —
// nothing is ever accepted from the client.

import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import getDbConnection from "@/lib/db";
import {
  buildContentDisposition,
  buildVideoPdfDocument,
} from "@/lib/pdf-export";

// PDF generation uses Node streams; the Edge runtime is not supported.
export const runtime = "nodejs";

// Same validation convention as the existing server actions: UUID versions
// 1-5 with the RFC variant bits set.
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type WorkspaceExportRow = {
  file_name: string | null;
  summary: string | null;
  transcript: string | null;
};

function errorResponse(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    return errorResponse("Authentication required", 401);
  }

  if (!uuidPattern.test(id)) {
    return errorResponse("Invalid video id", 400);
  }

  try {
    const sql = await getDbConnection();
    const [item] = await sql`
      SELECT file_name, summary, transcript
      FROM public.workspace_items
      WHERE id = ${id}
        AND user_id = ${user.id}
    `;

    if (!item) {
      return errorResponse(
        "Video not found or you do not have permission to access it.",
        404,
      );
    }

    const transcript = (item as WorkspaceExportRow).transcript?.trim() ?? "";
    if (!transcript) {
      return errorResponse(
        "No transcript available yet. Transcribe the video before exporting a PDF.",
        409,
      );
    }

    const fileName = (item as WorkspaceExportRow).file_name ?? "video";
    const summary = (item as WorkspaceExportRow).summary?.trim() || null;

    // Layout helper writes the full report (header, summary when present,
    // complete transcript, page numbers) without accumulating the PDF in a
    // large buffer; the caller streams the result.
    const doc = buildVideoPdfDocument({
      title: fileName,
      generatedAt: new Date(),
      summary,
      transcript,
    });

    doc.end();

    const stream = Readable.toWeb(doc) as unknown as ReadableStream<Uint8Array>;

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": buildContentDisposition(fileName),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    // Database or PDF-generation failures are logged server-side and
    // surfaced as a generic message — never stack traces or DB details.
    console.error("Failed to generate PDF export:", error);
    return errorResponse(
      "Failed to generate the PDF report. Please try again.",
      500,
    );
  }
}
