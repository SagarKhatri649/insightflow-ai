// transcript.ts
// Dependency-free helpers for splitting long transcripts and selecting the
// parts of one that are relevant to a question. Pure functions only: no I/O,
// no model calls, no provider SDKs.

export type TranscriptChunk = {
  /** Zero-based position in document order. */
  index: number;
  /** Inclusive start offset in the original string. */
  start: number;
  /** Exclusive end offset in the original string. */
  end: number;
  text: string;
};

export type SplitTranscriptOptions = {
  /** Maximum characters per chunk. Must be positive. */
  maxChars: number;
  /** Characters repeated at the start of the next chunk. Defaults to 0. */
  overlapChars?: number;
};

/** Small English stopword set; only applied to plain ASCII word tokens. */
const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "can",
  "did",
  "do",
  "does",
  "for",
  "from",
  "had",
  "has",
  "have",
  "he",
  "her",
  "his",
  "how",
  "i",
  "if",
  "in",
  "is",
  "it",
  "its",
  "me",
  "my",
  "of",
  "on",
  "or",
  "our",
  "she",
  "so",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "to",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "will",
  "with",
  "you",
  "your",
]);

const BROAD_QUESTION_PATTERN =
  /\b(summar(?:y|ize|ise|ized|ised|izing|ising)|overview|main (?:points?|ideas?|takeaways?)|key (?:points?|takeaways?|ideas?)|what is (?:this|the) (?:video|transcript|recording|talk) about|tl;?dr)\b/i;

/** Matches characters that need special handling when choosing chunk ends. */
function isHighSurrogate(code: number): boolean {
  return code >= 0xd800 && code <= 0xdbff;
}

/**
 * Clamps overlap so it can never prevent forward progress or dominate a chunk.
 */
function clampOverlap(maxChars: number, overlapChars: number): number {
  const requested = Number.isFinite(overlapChars)
    ? Math.floor(overlapChars)
    : 0;
  return Math.min(Math.max(requested, 0), Math.floor(maxChars / 4));
}

/**
 * Chooses where a chunk should end: the last paragraph, line, sentence or
 * whitespace boundary inside the final 40% of the proposed window. Falls back
 * to the hard limit so no text is ever dropped.
 */
function findChunkEnd(
  text: string,
  start: number,
  proposedEnd: number,
): number {
  if (proposedEnd >= text.length) {
    return text.length;
  }

  const minEnd = start + Math.floor((proposedEnd - start) * 0.6);
  const window = text.slice(minEnd, proposedEnd);

  // Preference order: paragraph break, line break, CJK sentence end, English
  // sentence end, any whitespace. CJK text often has no spaces, so its
  // punctuation is checked without requiring trailing whitespace.
  const patterns = [
    /\n[ \t]*\n/g,
    /\n/g,
    /[。！？；]/g,
    /[.!?;]["')\]]?\s/g,
    /\s+/g,
  ];

  for (const pattern of patterns) {
    let boundary = -1;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(window)) !== null) {
      boundary = match.index + match[0].length;
    }
    if (boundary > 0) {
      return minEnd + boundary;
    }
  }

  return proposedEnd;
}

/**
 * Moves an exclusive end offset back by one position when it would split a
 * surrogate pair, so an emoji is never torn into replacement characters.
 */
function avoidSplitSurrogate(text: string, start: number, end: number): number {
  if (end <= start + 1 || end >= text.length) {
    return end;
  }
  return isHighSurrogate(text.charCodeAt(end - 1)) ? end - 1 : end;
}

/**
 * Splits text into ordered chunks of at most `maxChars` characters. Chunk
 * boundaries follow paragraph, line, sentence or word breaks where possible.
 * Consecutive chunks overlap by `overlapChars`, so the union of all chunks
 * always covers the whole input (no text is omitted).
 */
export function splitTranscript(
  text: string,
  options: SplitTranscriptOptions,
): TranscriptChunk[] {
  if (typeof text !== "string" || text.length === 0) {
    return [];
  }

  const limit = Math.max(1, Math.floor(options.maxChars));
  const overlap = clampOverlap(limit, options.overlapChars ?? 0);
  const chunks: TranscriptChunk[] = [];

  let start = 0;
  while (start < text.length) {
    const proposedEnd = Math.min(start + limit, text.length);
    let end = findChunkEnd(text, start, proposedEnd);
    end = avoidSplitSurrogate(text, start, end);
    if (end <= start) {
      end = Math.min(start + limit, text.length);
    }

    chunks.push({
      index: chunks.length,
      start,
      end,
      text: text.slice(start, end),
    });

    if (end >= text.length) {
      break;
    }

    // Overlap the next chunk, but always make forward progress.
    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}

/** Normalizes case and compatibility forms for comparison only. */
function normalize(value: string): string {
  return value.normalize("NFKC").toLowerCase();
}

/**
 * Extracts comparable terms. Splits on any run of non-letter/number
 * characters, drops English stopwords and single ASCII letters, and adds
 * bigrams for CJK-style runs so text without spaces can still match.
 */
function tokenize(value: string): string[] {
  const terms: string[] = [];

  for (const token of normalize(value).split(/[^\p{L}\p{N}]+/u)) {
    if (!token) {
      continue;
    }

    if (/^[a-z]+$/.test(token)) {
      if (token.length >= 2 && !STOPWORDS.has(token)) {
        terms.push(token);
      }
      continue;
    }

    if (token.length >= 2 || /[^\x00-\x7f]/.test(token)) {
      terms.push(token);
    }

    if (
      token.length > 2 &&
      /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(token)
    ) {
      for (let index = 0; index < token.length - 1; index += 1) {
        terms.push(token.slice(index, index + 2));
      }
    }
  }

  return terms;
}

/** Returns true when a question asks for a whole-transcript overview. */
export function isBroadQuestion(question: string): boolean {
  return BROAD_QUESTION_PATTERN.test(question);
}

/**
 * Scores every chunk against the question using lexical overlap. Scores are
 * relative (used for ranking only), not normalized. A question with no usable
 * terms scores every chunk at zero.
 */
export function scoreChunks(
  chunks: TranscriptChunk[],
  question: string,
): Array<{ chunk: TranscriptChunk; score: number }> {
  const terms = [...new Set(tokenize(question))];
  const normalizedQuestion = normalize(question).trim();

  return chunks.map((chunk) => {
    if (terms.length === 0) {
      return { chunk, score: 0 };
    }

    const haystack = normalize(chunk.text);
    let score = 0;

    for (const term of terms) {
      if (haystack.includes(term)) {
        score += 1;
      }
    }

    if (normalizedQuestion && haystack.includes(normalizedQuestion)) {
      score += 4;
    }

    return { chunk, score };
  });
}

/**
 * Picks up to `maxChunks` chunks spread evenly across the document. Used for
 * broad questions and as the fallback when a question has no lexical matches.
 */
export function sampleChunks(
  chunks: TranscriptChunk[],
  maxChunks: number,
): TranscriptChunk[] {
  if (maxChunks <= 0 || chunks.length === 0) {
    return [];
  }
  if (chunks.length <= maxChunks) {
    return [...chunks];
  }
  if (maxChunks === 1) {
    return [chunks[0]];
  }

  const selected: TranscriptChunk[] = [];
  const seen = new Set<number>();

  for (let slot = 0; slot < maxChunks; slot += 1) {
    const index = Math.round((slot * (chunks.length - 1)) / (maxChunks - 1));
    if (!seen.has(index)) {
      seen.add(index);
      selected.push(chunks[index]);
    }
  }

  return selected;
}

export type ChunkSelection = {
  /** Selected chunks in document order. */
  chunks: TranscriptChunk[];
  /** False when no chunk matched any question term (even sample fallback). */
  matched: boolean;
};

/**
 * Returns the best-matching chunks in document order. When nothing matches,
 * falls back to evenly sampled chunks so the model still receives some
 * transcript context; `matched` tells the caller coverage is weaker.
 */
export function selectRelevantChunks(
  chunks: TranscriptChunk[],
  question: string,
  maxChunks: number,
): ChunkSelection {
  if (maxChunks <= 0 || chunks.length === 0) {
    return { chunks: [], matched: false };
  }

  const matched = scoreChunks(chunks, question)
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks)
    .map((entry) => entry.chunk)
    .sort((a, b) => a.index - b.index);

  if (matched.length === 0) {
    return { chunks: sampleChunks(chunks, maxChunks), matched: false };
  }

  return { chunks: matched, matched: true };
}
