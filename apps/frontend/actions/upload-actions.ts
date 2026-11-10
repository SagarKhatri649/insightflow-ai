// upload-actions.ts
"use server";

import { currentUser } from "@clerk/nextjs/server";
import openai from "@/lib/openai";
import getDbConnection from "@/lib/db";

export async function saveWorkspaceItemAction({
  fileName,
  fileUrl,
  fileType,
  fileSize,
}: {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}) {
  const user = await currentUser();
  if (!user) {
    return { success: false, message: "Authentication required" };
  }

  if (
    typeof fileName !== "string" ||
    typeof fileUrl !== "string" ||
    typeof fileType !== "string" ||
    typeof fileSize !== "number"
  ) {
    return { success: false, message: "Invalid uploaded file metadata" };
  }

  const trimmedFileName = fileName.trim();
  const trimmedFileUrl = fileUrl.trim();
  const trimmedFileType = fileType.trim();
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmedFileUrl);
  } catch {
    return { success: false, message: "Invalid uploaded file URL" };
  }

  if (
    !trimmedFileName ||
    !trimmedFileType ||
    !trimmedFileUrl ||
    !Number.isInteger(fileSize) ||
    fileSize <= 0 ||
    (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:")
  ) {
    return { success: false, message: "Invalid uploaded file metadata" };
  }

  try {
    const sql = await getDbConnection();
    const [workspaceItem] = await sql`
      INSERT INTO workspace_items (
        user_id,
        file_name,
        file_url,
        file_type,
        file_size
      )
      VALUES (
        ${user.id},
        ${trimmedFileName},
        ${trimmedFileUrl},
        ${trimmedFileType},
        ${fileSize}
      )
      RETURNING id
    `;

    if (!workspaceItem?.id) {
      return { success: false, message: "Failed to save uploaded file" };
    }

    return { success: true, workspaceItemId: workspaceItem.id };
  } catch (error) {
    console.error("Failed to save workspace item:", error);
    return { success: false, message: "Failed to save uploaded file" };
  }
}

export async function markWorkspaceItemFailedAction({
  workspaceItemId,
  stage,
}: {
  workspaceItemId: string;
  stage: "transcription" | "post_generation";
}) {
  const user = await currentUser();
  if (!user || typeof workspaceItemId !== "string") {
    return { success: false };
  }

  const errorMessage =
    stage === "transcription"
      ? "Transcription failed. Please try again."
      : "Insight generation failed. Please try again.";

  try {
    const sql = await getDbConnection();
    const [updatedWorkspaceItem] = await sql`
      UPDATE workspace_items
      SET status = CASE
            WHEN ${stage} = 'post_generation' AND transcript IS NOT NULL
              THEN 'transcribed'
            ELSE 'failed'
          END,
          error_message = ${errorMessage},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${workspaceItemId}
        AND user_id = ${user.id}
      RETURNING id
    `;

    return { success: Boolean(updatedWorkspaceItem?.id) };
  } catch (error) {
    console.error("Failed to update workspace item status:", error);
    return { success: false };
  }
}

export async function saveWorkspaceItemTranscriptAction({
  workspaceItemId,
  transcript,
}: {
  workspaceItemId: string;
  transcript: string;
}) {
  const user = await currentUser();
  if (!user) {
    return { success: false, message: "Authentication required" };
  }

  if (
    typeof workspaceItemId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      workspaceItemId,
    )
  ) {
    return { success: false, message: "Invalid workspace item" };
  }

  if (typeof transcript !== "string" || !transcript.trim()) {
    return { success: false, message: "Transcript cannot be empty" };
  }

  if (transcript.length > 1_000_000) {
    return { success: false, message: "Transcript is too long to save" };
  }

  try {
    const sql = await getDbConnection();
    const [updatedWorkspaceItem] = await sql`
      UPDATE workspace_items
      SET transcript = ${transcript},
          status = 'transcribed',
          error_message = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${workspaceItemId}
        AND user_id = ${user.id}
      RETURNING id
    `;

    if (!updatedWorkspaceItem?.id) {
      return { success: false, message: "Workspace item not found" };
    }

    return { success: true, workspaceItemId: updatedWorkspaceItem.id };
  } catch (error) {
    console.error("Failed to save workspace item transcript:", error);
    return { success: false, message: "Failed to save transcript" };
  }
}

/**
 * Fetches the file from UploadThing, sends it to Whisper for transcription,
 * and returns the raw transcript text.
 */
export async function transcribeUploadedFile({
  ufsUrl,
  fileName,
  userId,
}: {
  ufsUrl: string;
  fileName: string;
  userId: string;
}) {
  if (!ufsUrl || !fileName || !userId) {
    return {
      success: false,
      message: "Missing parameters",
      data: { transcriptions: null, userId },
    };
  }
  try {
    const resp = await fetch(ufsUrl);
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
    const arrayBuffer = await resp.arrayBuffer();
    const blob = new Blob([arrayBuffer], {
      type: resp.headers.get("content-type")!,
    });
    // Previous OpenAI transcription:
    // const transcription = await openai.audio.transcriptions.create({
    //   model: 'whisper-1',
    //   file: blob,
    //   filename: fileName,
    // });

    // Previous Groq request included an unsupported filename parameter:
    // const transcription = await openai.audio.transcriptions.create({
    //   model: 'whisper-large-v3-turbo',
    //   file: blob,
    //   filename: fileName,
    // });

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-large-v3-turbo",
      file: blob,
    });
    if (!transcription.text) throw new Error("Empty transcript");
    return {
      success: true,
      message: "Transcribed",
      data: { transcriptions: { text: transcription.text }, userId },
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
      data: { transcriptions: null, userId },
    };
  }
}

/**
 * Calls GPT to produce a 25%-length summary and 5–10 key points
 * under Markdown headings, given the raw transcript.
 */
async function analyzeTranscript(transcript: string): Promise<string> {
  // Previous OpenAI summary generation:
  // const completion = await openai.chat.completions.create({
  //   model: 'gpt-4o-mini',
  //   temperature: 0.7,
  //   max_tokens: 1500,
  //   messages,
  // });

  const completion = await openai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    max_tokens: 1500,
    messages: [
      {
        role: "system",
        content: `You are an AI assistant. Given a transcript, generate a GitHub-Flavored Markdown document wrapped in a <div class="text-xl"> container (150% font size). Structure the output with one blank line between each section:

## Summary

<Insert a concise summary here, approximately 25% of the transcript's word count>

## Key Points

• <First meaningful key point as a full sentence>

• <Second key point as a full sentence>

... continue up to 5–10 bullet points, each separated by one blank line. Only output valid Markdown.`,
      },
      {
        role: "user",
        content: `Transcript:
${transcript}`,
      },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}

/**
 * Server action: save the transcript summary into the posts table.
 * Uses the authenticated user and transcript to save the generated insight.
 */
export async function generateBlogPostAction({
  transcriptions,
  workspaceItemId,
}: {
  transcriptions: { text: string };
  workspaceItemId: string;
}) {
  const user = await currentUser();
  if (!user) {
    return { success: false, message: "Authentication required" };
  }

  try {
    if (
      typeof workspaceItemId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        workspaceItemId,
      )
    ) {
      return { success: false, message: "Invalid workspace item" };
    }

    const sql = await getDbConnection();
    const [workspaceItem] = await sql`
      SELECT id
      FROM workspace_items
      WHERE id = ${workspaceItemId}
        AND user_id = ${user.id}
    `;
    if (!workspaceItem?.id) {
      return { success: false, message: "Workspace item not found" };
    }

    const transcriptText = transcriptions?.text?.trim();
    if (!transcriptText) throw new Error("No transcription text provided");

    // 1) Analyze via GPT for summary + key points
    const analysisMd = await analyzeTranscript(transcriptText);
    if (!analysisMd) throw new Error("GPT summary returned empty content");

    // 2) Derive title from first non-empty line of summary
    const firstLine =
      analysisMd.split("\n").find((line) => line.trim().length > 0) ??
      "Transcript Overview";
    const title = firstLine.replace(/^#+\s*/, "").slice(0, 100);

    // 3) Insert analysisMarkdown into DB
    const [inserted] = await sql`
      INSERT INTO posts (user_id, title, content)
      VALUES (${user.id}, ${title}, ${analysisMd})
      RETURNING id
    `;
    const postId = inserted?.id;
    if (!postId) throw new Error("Failed to insert post");

    const [linkedWorkspaceItem] = await sql`
      UPDATE workspace_items
      SET post_id = ${postId},
          status = 'completed',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${workspaceItemId}
        AND user_id = ${user.id}
      RETURNING id
    `;
    if (!linkedWorkspaceItem?.id) {
      await sql`
        DELETE FROM posts
        WHERE id = ${postId}
          AND user_id = ${user.id}
      `;
      return { success: false, message: "Failed to link workspace item" };
    }

    return { success: true, postId };
  } catch (err: any) {
    await markWorkspaceItemFailedAction({
      workspaceItemId,
      stage: "post_generation",
    });
    return { success: false, message: err.message };
  }
}
