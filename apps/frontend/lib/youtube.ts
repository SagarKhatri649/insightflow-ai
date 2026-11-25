// youtube.ts

const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const SHORT_HOSTS = new Set(["youtu.be", "www.youtu.be"]);

const LONG_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
]);

const VIDEO_PATH_PREFIXES = new Set(["shorts", "embed", "live"]);

export type ParsedYouTubeUrl = {
  videoId: string;
  canonicalUrl: string;
};

function extractVideoId(url: URL): string | null {
  const segments = url.pathname.split("/").filter(Boolean);

  if (SHORT_HOSTS.has(url.hostname)) {
    return segments.length === 1 ? segments[0] : null;
  }

  if (segments.length === 1 && segments[0] === "watch") {
    return url.searchParams.get("v");
  }

  if (segments.length === 2 && VIDEO_PATH_PREFIXES.has(segments[0])) {
    return segments[1];
  }

  return null;
}

export function parseYouTubeUrl(input: string): ParsedYouTubeUrl | null {
  if (typeof input !== "string") {
    return null;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  let url: URL;

  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const hostname = url.hostname.toLowerCase();

  if (!SHORT_HOSTS.has(hostname) && !LONG_HOSTS.has(hostname)) {
    return null;
  }

  if (url.protocol !== "https:") {
    return null;
  }

  if (url.username || url.password || url.port) {
    return null;
  }

  const videoId = extractVideoId(url);

  if (!videoId || !YOUTUBE_VIDEO_ID_PATTERN.test(videoId)) {
    return null;
  }

  return {
    videoId,
    canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}
