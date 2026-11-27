"use server";

// youtube-actions.ts

import { currentUser } from "@clerk/nextjs/server";
import getDbConnection from "@/lib/db";
import { parseYouTubeUrl } from "@/lib/youtube";

const SUPADATA_TRANSCRIPT_ENDPOINT = "https://api.supadata.ai/v1/transcript";
const SUPADATA_TRANSCRIPT_MODE = "auto";
// Supadata documents AI generation taking up to ~100s synchronously and async
// jobs for long videos. This budget assumes the deployed function can run for
// roughly 250s or more (the Vercel fluid-compute default is 300s). Confirm the
// project's function limit before relying on it; lower the budget if needed.
const SUPADATA_INITIAL_TIMEOUT_MS = 110_000;
const SUPADATA_POLL_TIMEOUT_MS = 10_000;
const SUPADATA_TOTAL_BUDGET_MS = 240_000;
const SUPADATA_POLL_INTERVAL_MS = 1_000;
const SUPADATA_MAX_POLLS = 240;
const OEMBED_TIMEOUT_MS = 5_000;
const MAX_TRANSCRIPT_CHARS = 1_000_000;
const MAX_FILE_NAME_CHARS = 200;

export type YouTubeImportResult =
  | { success: true; workspaceItemId: string }
  | { success: false; message: string };

type NormalizedTranscript =
  | { kind: "transcript"; text: string }
  | { kind: "empty" }
  | { kind: "malformed" };

type FetchedTranscript = {
  transcript: string;
  source: "sync" | "job";
};

type ProviderFailure = {
  message: string;
  code: string;
};

/**
 * A terminal transcript error whose message is safe to show to the user.
 * Provider response bodies are never surfaced here.
 */
class TranscriptRequestError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = "TranscriptRequestError";
  }
}

function unavailableMessage() {
  return "No transcript could be produced for this video.";
}

function noSpeechMessage() {
  return "No speech was detected in this video, so there's no transcript to import.";
}

function malformedTranscriptMessage() {
  return "We couldn't read a transcript for that video. Please try again.";
}

function timeoutMessage() {
  return "Transcription is taking longer than expected. Please try again in a few minutes.";
}

function providerFailureMessage() {
  return "Could not retrieve a transcript right now. Please try again in a moment.";
}

/**
 * Accepts either plain text (text=true) or the documented chunk array shape.
 * A successful but empty result means no speech was detected.
 */
function normalizeTranscriptContent(content: unknown): NormalizedTranscript {
  if (typeof content === "string") {
    const text = content.trim();
    return text ? { kind: "transcript", text } : { kind: "empty" };
  }

  if (Array.isArray(content)) {
    if (content.length === 0) {
      return { kind: "empty" };
    }

    const parts: string[] = [];

    for (const item of content) {
      if (typeof item !== "object" || item === null) {
        return { kind: "malformed" };
      }

      const text = (item as { text?: unknown }).text;

      if (typeof text !== "string") {
        return { kind: "malformed" };
      }

      const trimmed = text.trim();

      if (trimmed) {
        parts.push(trimmed);
      }
    }

    return parts.length > 0
      ? { kind: "transcript", text: parts.join("\n") }
      : { kind: "empty" };
  }

  return { kind: "malformed" };
}

function validateTranscriptContent(content: unknown): string {
  const normalized = normalizeTranscriptContent(content);

  if (normalized.kind === "malformed") {
    throw new TranscriptRequestError(
      malformedTranscriptMessage(),
      "malformed-transcript",
    );
  }

  if (normalized.kind === "empty") {
    throw new TranscriptRequestError(noSpeechMessage(), "empty-transcript");
  }

  if (normalized.text.length > MAX_TRANSCRIPT_CHARS) {
    throw new TranscriptRequestError(
      "That transcript is too long to import.",
      "transcript-too-long",
    );
  }

  return normalized.text;
}

function readProviderError(data: unknown): {
  code: string | null;
  details: string | null;
} {
  if (typeof data !== "object" || data === null) {
    return { code: null, details: null };
  }

  const error = (data as { error?: unknown }).error;
  const details = (data as { details?: unknown }).details;

  if (typeof error === "string") {
    return {
      code: error,
      details: typeof details === "string" ? details : null,
    };
  }

  // A failed async job carries an Error object rather than a code string.
  if (typeof error === "object" && error !== null) {
    const nestedCode = (error as { error?: unknown }).error;
    const nestedDetails = (error as { details?: unknown }).details;

    return {
      code: typeof nestedCode === "string" ? nestedCode : null,
      details:
        typeof nestedDetails === "string"
          ? nestedDetails
          : typeof details === "string"
            ? details
            : null,
    };
  }

  return { code: null, details: typeof details === "string" ? details : null };
}

function codeForStatus(status: number): string | null {
  switch (status) {
    case 400:
      return "invalid-request";
    case 401:
      return "unauthorized";
    case 402:
      return "upgrade-required";
    case 403:
      return "forbidden";
    case 404:
      return "not-found";
    case 429:
      return "limit-exceeded";
    case 206:
      return "transcript-unavailable";
    default:
      return status >= 500 ? "internal-error" : null;
  }
}

function providerFailureFromCode(
  code: string | null,
  details: string | null,
): ProviderFailure {
  switch (code) {
    case "invalid-request":
      return {
        code,
        message:
          "That video can't be transcribed. It may be a live stream or an unsupported link.",
      };
    case "unauthorized":
      return {
        code,
        message:
          "YouTube import is temporarily unavailable. Please try again later.",
      };
    case "upgrade-required":
      return {
        code,
        message:
          "AI transcription isn't available right now. Please try again later.",
      };
    case "forbidden":
      return {
        code,
        message:
          "That video is private or restricted, so its transcript can't be retrieved.",
      };
    case "not-found":
      return {
        code,
        message:
          "That YouTube video could not be found. Check the link and try again.",
      };
    case "limit-exceeded": {
      const limitReached =
        typeof details === "string" && /usage|quota/i.test(details);

      return {
        code,
        message: limitReached
          ? "YouTube import has reached its current limit. Please try again later."
          : "Too many imports right now. Please wait a moment and try again.",
      };
    }
    case "transcript-unavailable":
      return { code, message: unavailableMessage() };
    case "internal-error":
      return {
        code,
        message:
          "The transcription service is temporarily unavailable. Please try again in a moment.",
      };
    case "job-failed":
      return {
        code,
        message: "The transcription job failed. Please try again.",
      };
    default:
      return {
        code: code ?? "provider-error",
        message: providerFailureMessage(),
      };
  }
}

function providerFailureFromStatus(
  status: number,
  error: { code: string | null; details: string | null },
): ProviderFailure {
  return providerFailureFromCode(
    error.code ?? codeForStatus(status),
    error.details,
  );
}

function readContent(data: unknown): unknown {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }

  return (data as { content?: unknown }).content;
}

function readJobId(data: unknown): string | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const jobId = (data as { jobId?: unknown }).jobId;

  return typeof jobId === "string" && jobId.trim() ? jobId : null;
}

function readJobStatus(data: unknown): string | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const status = (data as { status?: unknown }).status;

  return typeof status === "string" ? status : null;
}

function readBillableRequests(response: Response): number | null {
  const raw = response.headers.get("x-billable-requests");

  if (!raw) {
    return null;
  }

  const value = Number(raw);

  return Number.isFinite(value) ? value : null;
}

async function readJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function supadataFetch(
  endpoint: URL,
  apiKey: string,
  deadline: number,
  preferredTimeoutMs: number,
): Promise<Response> {
  const remaining = deadline - Date.now();

  if (remaining <= 0) {
    throw new TranscriptRequestError(timeoutMessage(), "timeout");
  }

  const timeoutMs = Math.max(1, Math.min(preferredTimeoutMs, remaining));

  try {
    return await fetch(endpoint, {
      headers: { "x-api-key": apiKey },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (isTimeoutError(error) || Date.now() >= deadline) {
      throw new TranscriptRequestError(timeoutMessage(), "timeout");
    }

    throw new TranscriptRequestError(providerFailureMessage(), "network-error");
  }
}

async function pollTranscriptJob(
  jobId: string,
  apiKey: string,
  deadline: number,
): Promise<string> {
  const jobEndpoint = new URL(
    `${SUPADATA_TRANSCRIPT_ENDPOINT}/${encodeURIComponent(jobId)}`,
  );

  for (let poll = 1; poll <= SUPADATA_MAX_POLLS; poll += 1) {
    const remaining = deadline - Date.now();

    if (remaining <= 0) {
      throw new TranscriptRequestError(timeoutMessage(), "timeout");
    }

    await sleep(Math.min(SUPADATA_POLL_INTERVAL_MS, remaining));

    if (Date.now() >= deadline) {
      throw new TranscriptRequestError(timeoutMessage(), "timeout");
    }

    const response = await supadataFetch(
      jobEndpoint,
      apiKey,
      deadline,
      SUPADATA_POLL_TIMEOUT_MS,
    );
    const data = await readJson(response);

    if (response.status === 404) {
      throw new TranscriptRequestError(
        "The transcription result expired. Please try again.",
        "job-not-found",
      );
    }

    if (response.status !== 200) {
      const failure = providerFailureFromStatus(
        response.status,
        readProviderError(data),
      );
      throw new TranscriptRequestError(failure.message, failure.code);
    }

    const status = readJobStatus(data);

    console.info("[youtube-import] supadata:job", {
      status: status ?? "unknown",
      poll,
    });

    if (status === "completed") {
      return validateTranscriptContent(readContent(data));
    }

    if (status === "failed") {
      const error = readProviderError(data);
      const failure = providerFailureFromCode(
        error.code ?? "job-failed",
        error.details,
      );
      throw new TranscriptRequestError(failure.message, failure.code);
    }

    if (status !== "queued" && status !== "active") {
      throw new TranscriptRequestError(
        malformedTranscriptMessage(),
        "malformed-job",
      );
    }
  }

  throw new TranscriptRequestError(timeoutMessage(), "timeout");
}

/**
 * One logical Supadata attempt: a synchronous 200, or a 202 job followed by
 * bounded polling. No request is retried.
 */
async function fetchSupadataTranscript(
  canonicalUrl: string,
  apiKey: string,
): Promise<FetchedTranscript> {
  const deadline = Date.now() + SUPADATA_TOTAL_BUDGET_MS;
  const endpoint = new URL(SUPADATA_TRANSCRIPT_ENDPOINT);
  endpoint.searchParams.set("url", canonicalUrl);
  endpoint.searchParams.set("text", "true");
  endpoint.searchParams.set("mode", SUPADATA_TRANSCRIPT_MODE);

  console.info("[youtube-import] supadata:request", {
    mode: SUPADATA_TRANSCRIPT_MODE,
  });

  const supadataStartedAt = Date.now();
  const response = await supadataFetch(
    endpoint,
    apiKey,
    deadline,
    SUPADATA_INITIAL_TIMEOUT_MS,
  );
  const data = await readJson(response);

  console.info("[youtube-import] supadata:response", {
    status: response.status,
    durationMs: Date.now() - supadataStartedAt,
    billableRequests: readBillableRequests(response),
  });

  if (response.status === 200) {
    return {
      transcript: validateTranscriptContent(readContent(data)),
      source: "sync",
    };
  }

  if (response.status === 202) {
    const jobId = readJobId(data);

    if (!jobId) {
      throw new TranscriptRequestError(
        providerFailureMessage(),
        "invalid-job-id",
      );
    }

    console.info("[youtube-import] supadata:job-created");

    return {
      transcript: await pollTranscriptJob(jobId, apiKey, deadline),
      source: "job",
    };
  }

  const failure = providerFailureFromStatus(
    response.status,
    readProviderError(data),
  );
  throw new TranscriptRequestError(failure.message, failure.code);
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
 * Uses captions when available and Supadata's AI generation as a fallback.
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
    const { transcript, source } = await fetchSupadataTranscript(
      parsed.canonicalUrl,
      apiKey,
    );

    console.info("[youtube-import] transcript:validated", {
      characters: transcript.length,
      source,
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
    if (error instanceof TranscriptRequestError) {
      console.error("[youtube-import] failed", { code: error.code });
      return { success: false, message: error.message };
    }

    console.error("Failed to import YouTube transcript:", error);
    return { success: false, message: providerFailureMessage() };
  }
}
