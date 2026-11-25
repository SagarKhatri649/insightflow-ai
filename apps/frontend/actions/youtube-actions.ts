"use server";

// youtube-actions.ts

import { currentUser } from "@clerk/nextjs/server";
import getDbConnection from "@/lib/db";
import { parseYouTubeUrl } from "@/lib/youtube";

const SUPADATA_TRANSCRIPT_ENDPOINT = "https://api.supadata.ai/v1/transcript";
const SUPADATA_TIMEOUT_MS = 20_000;
const OEMBED_TIMEOUT_MS = 5_000;
const MAX_TRANSCRIPT_CHARS = 1_000_000;
const MAX_FILE_NAME_CHARS = 200;

export type YouTubeImportResult =
  | { success: true; workspaceItemId: string }
  | { success: false; message: string };

/**
 * Supadata's `content` is a plain string when requested with `text=true`, but a
 * malformed or unexpected payload must never reach the database.
 */
function extractTranscriptContent(data: unknown): string | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const content = (data as { content?: unknown }).content;

  return typeof content === "string" ? content : null;
}

function readErrorCode(data: unknown): string | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const error = (data as { error?: unknown }).error;

  return typeof error === "string" ? error : null;
}

function unavailableMessage() {
  return "No transcript is available for this video. Only videos with captions can be imported.";
}

function providerFailureMessage() {
  return "Could not retrieve a transcript right now. Please try again in a moment.";
}

async function fetchVideoTitle(canonicalUrl: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        canonicalUrl,
      )}&format=json`,
      { signal: AbortSignal.timeout(OEMBED_TIMEOUT_MS) },
    );

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();

    if (typeof data !== "object" || data === null) {
      return null;
    }

    const title = (data as { title?: unknown }).title;

    if (typeof title !== "string") {
      return null;
    }

    return title.trim() || null;
  } catch {
    return null;
  }
}

/**
 * Server action: import a YouTube transcript into the workspace.
 *
 * The workspace item is only inserted once a non-empty transcript has been
 * retrieved and validated, so a failed import never leaves a library entry.
 */
export async function importYouTubeTranscriptAction({
  url,
}: {
  url: string;
}): Promise<YouTubeImportResult> {
  const user = await currentUser();
  if (!user) {
    return { success: false, message: "Authentication required" };
  }

  if (typeof url !== "string") {
    return { success: false, message: "Enter a valid YouTube link" };
  }

  const parsed = parseYouTubeUrl(url);
  if (!parsed) {
    return { success: false, message: "Enter a valid YouTube link" };
  }

  console.info("[youtube-import] start");

  const apiKey = process.env.SUPADATA_API_KEY;
  if (!apiKey) {
    console.error("SUPADATA_API_KEY is not defined");
    return {
      success: false,
      message: "YouTube import is not available right now.",
    };
  }

  let sql: Awaited<ReturnType<typeof getDbConnection>>;

  try {
    sql = await getDbConnection();
  } catch {
    console.error("Failed to connect to the database");
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }

  try {
    const [existingItem] = await sql`
      SELECT id
      FROM workspace_items
      WHERE user_id = ${user.id}
        AND file_url = ${parsed.canonicalUrl}
        AND status <> 'failed'
      ORDER BY created_at DESC
      LIMIT 1
    `;

    console.info("[youtube-import] dedupe", {
      hit: Boolean(existingItem?.id),
    });

    if (existingItem?.id) {
      return { success: true, workspaceItemId: existingItem.id };
    }
  } catch (error) {
    console.error("Failed to look up existing workspace item:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }

  const titlePromise = fetchVideoTitle(parsed.canonicalUrl);

  try {
    const endpoint = new URL(SUPADATA_TRANSCRIPT_ENDPOINT);
    endpoint.searchParams.set("url", parsed.canonicalUrl);
    endpoint.searchParams.set("text", "true");
    endpoint.searchParams.set("mode", "native");

    console.info("[youtube-import] supadata:request");

    const supadataStartedAt = Date.now();

    const response = await fetch(endpoint, {
      headers: { "x-api-key": apiKey },
      signal: AbortSignal.timeout(SUPADATA_TIMEOUT_MS),
    });

    console.info("[youtube-import] supadata:response", {
      status: response.status,
      durationMs: Date.now() - supadataStartedAt,
    });

    const data: unknown = await response.json().catch(() => null);

    if (response.status === 206) {
      return { success: false, message: unavailableMessage() };
    }

    if (response.status !== 200) {
      console.error("Supadata transcript request failed:", {
        status: response.status,
        error: readErrorCode(data),
      });

      if (response.status === 404 || response.status === 400) {
        return {
          success: false,
          message:
            "That YouTube video could not be found. Check the link and try again.",
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          message:
            "That video is private or restricted, so its transcript can't be retrieved.",
        };
      }

      return { success: false, message: providerFailureMessage() };
    }

    const content = extractTranscriptContent(data);
    const transcript = content?.trim() ?? "";

    if (!transcript) {
      return { success: false, message: unavailableMessage() };
    }

    if (transcript.length > MAX_TRANSCRIPT_CHARS) {
      return {
        success: false,
        message: "That transcript is too long to import.",
      };
    }

    console.info("[youtube-import] transcript:validated", {
      characters: transcript.length,
    });

    const title = (await titlePromise)?.slice(0, MAX_FILE_NAME_CHARS).trim();
    const fileName = title || `YouTube video ${parsed.videoId}`;

    let workspaceItemId: string | undefined;

    try {
      const [workspaceItem] = await sql`
        INSERT INTO workspace_items (
          user_id,
          file_name,
          file_url,
          file_type,
          transcript,
          status
        )
        VALUES (
          ${user.id},
          ${fileName},
          ${parsed.canonicalUrl},
          'video/youtube',
          ${transcript},
          'transcribed'
        )
        RETURNING id
      `;

      workspaceItemId = workspaceItem?.id;
    } catch (error) {
      console.error("Failed to save imported workspace item:", error);
      return { success: false, message: "Failed to save the imported video" };
    }

    if (!workspaceItemId) {
      return { success: false, message: "Failed to save the imported video" };
    }

    console.info("[youtube-import] insert:ok", { created: true });

    return { success: true, workspaceItemId };
  } catch (error) {
    console.error("Failed to import YouTube transcript:", error);
    return { success: false, message: providerFailureMessage() };
  }
}
