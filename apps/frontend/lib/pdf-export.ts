// pdf-export.ts
// Server-side PDF report generation for a single workspace item.
// Pure layout logic lives here so the API route stays focused on
// authentication, data access and HTTP responses.

import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

/**
 * InsightFlow emerald palette, kept in sync with the web UI.
 */
const COLOR_HEADING = "#064e3b";
const COLOR_ACCENT = "#10b981";
const COLOR_BODY = "#3c4043";
const COLOR_MUTED = "#5f6368";
const COLOR_RULE = "#dee1e6";

/**
 * Unicode-capable fonts. The repository ships no TTF assets, so this uses the
 * DejaVu Sans family from the `dejavu-fonts-ttf` npm package (Bitstream Vera
 * derivatives). Their license (included in the package as LICENSE) permits
 * redistribution and use, including in server-rendered documents. The fonts
 * support curly quotes, accented characters and the • bullet character.
 * PDFKit's built-in standard fonts are WinAnsi-only and would mojibake those,
 * so body text must always use these registered fonts.
 */
const FONT_PATHS = {
  regular: path.join(
    process.cwd(),
    "node_modules",
    "dejavu-fonts-ttf",
    "ttf",
    "DejaVuSans.ttf",
  ),
  bold: path.join(
    process.cwd(),
    "node_modules",
    "dejavu-fonts-ttf",
    "ttf",
    "DejaVuSans-Bold.ttf",
  ),
};

const FONT_FAMILY = "DejaVuSans";

export type VideoReportData = {
  title: string;
  generatedAt: Date;
  summary: string | null;
  transcript: string;
};

/**
 * Registers the embedded fonts once per document. Returns false when the font
 * files are missing so the caller can fail cleanly instead of producing a
 * WinAnsi-only PDF that mangles Unicode.
 */
function registerFonts(doc: PDFKit.PDFDocument): boolean {
  try {
    if (!fs.existsSync(FONT_PATHS.regular) || !fs.existsSync(FONT_PATHS.bold)) {
      return false;
    }
    doc.registerFont(`${FONT_FAMILY}`, FONT_PATHS.regular);
    doc.registerFont(`${FONT_FAMILY}-Bold`, FONT_PATHS.bold);
    return true;
  } catch {
    return false;
  }
}

function font(doc: PDFKit.PDFDocument, weight: "regular" | "bold" = "regular") {
  return weight === "bold" ? `${FONT_FAMILY}-Bold` : FONT_FAMILY;
}

/**
 * Draws the report header: brand band, video title, generation date and a
 * separating rule.
 */
function drawHeader(doc: PDFKit.PDFDocument, data: VideoReportData): void {
  const left = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // Brand band
  doc
    .font(font(doc, "bold"))
    .fontSize(10)
    .fillColor(COLOR_HEADING)
    .text("InsightFlow", left, doc.page.margins.top);
  doc
    .font(font(doc))
    .fontSize(9)
    .fillColor(COLOR_MUTED)
    .text("Video Insight Report", left, doc.page.margins.top + 14);

  doc
    .moveTo(left, doc.page.margins.top + 34)
    .lineTo(left + width, doc.page.margins.top + 34)
    .lineWidth(1)
    .strokeColor(COLOR_RULE)
    .stroke();

  // Title
  doc
    .font(font(doc, "bold"))
    .fontSize(21)
    .fillColor(COLOR_HEADING)
    .text(data.title, left, doc.page.margins.top + 46, {
      width,
      lineGap: 3,
    });

  // Generation date
  doc
    .font(font(doc))
    .fontSize(9)
    .fillColor(COLOR_MUTED)
    .text(
      `Generated on ${data.generatedAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      left,
      doc.y + 4,
    );

  doc.moveDown(1);
}

/**
 * Draws an emerald section heading with a soft accent chip and rule, then
 * returns the cursor at a clean text baseline.
 */
function drawSectionHeading(doc: PDFKit.PDFDocument, heading: string): void {
  const left = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // Start a fresh page when the remaining space cannot fit a heading block.
  if (doc.y + 60 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }

  doc.moveDown(0.75);

  const chipTop = doc.y + 3;
  doc.roundedRect(left, chipTop, 4, 16, 2).fillColor(COLOR_ACCENT).fill();

  doc
    .font(font(doc, "bold"))
    .fontSize(15)
    .fillColor(COLOR_HEADING)
    .text(heading, left + 14, chipTop - 1, { width: width - 14 });

  doc
    .moveTo(left, doc.y + 8)
    .lineTo(left + width, doc.y + 8)
    .lineWidth(0.75)
    .strokeColor(COLOR_RULE)
    .stroke();

  doc.moveDown(1);
}

type SummaryBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "bullet"; text: string }
  | { kind: "ordered"; number: number; text: string };

/**
 * Splits text into regular/bold segments at Markdown **bold** markers so they
 * can be drawn with real bold glyphs instead of literal asterisks. Unmatched
 * asterisks are left untouched.
 */
export function splitInlineBold(
  text: string,
): Array<{ text: string; bold: boolean }> {
  const parts: Array<{ text: string; bold: boolean }> = [];

  for (const [index, segment] of text.split(/\*\*(.+?)\*\*/g).entries()) {
    if (!segment) continue;
    parts.push({ text: segment, bold: index % 2 === 1 });
  }

  return parts.length > 0 ? parts : [{ text, bold: false }];
}

/**
 * Parses the limited Markdown shape the summary model is prompted to emit
 * (## headings, plain paragraphs and • bullets) — the same contract as the
 * in-app renderer in summary-section.tsx.
 */
export function parseSummaryMarkdown(summary: string): SummaryBlock[] {
  const blocks: SummaryBlock[] = [];

  for (const rawLine of summary.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("##")) {
      blocks.push({ kind: "heading", text: line.replace(/^#+\s*/, "") });
      continue;
    }

    if (/^[•\-*]\s+/.test(line)) {
      blocks.push({ kind: "bullet", text: line.replace(/^[•\-*]\s+/, "") });
      continue;
    }

    const orderedMatch = /^(\d+)[.)]\s+(.*)$/.exec(line);
    if (orderedMatch) {
      blocks.push({
        kind: "ordered",
        number: Number.parseInt(orderedMatch[1], 10),
        text: orderedMatch[2],
      });
      continue;
    }

    blocks.push({ kind: "paragraph", text: line });
  }

  return blocks;
}

/**
 * Draws text with real bold segments at Markdown **bold** markers, using
 * PDFKit's continued-text flow. Non-empty segments only; the final segment
 * closes the line so paragraphGap applies.
 */
function drawInlineText(
  doc: PDFKit.PDFDocument,
  text: string,
  options: { x: number; width: number; lineGap: number; paragraphGap: number },
): void {
  const parts = splitInlineBold(text);

  parts.forEach((part, index) => {
    const isLast = index === parts.length - 1;
    doc
      .font(font(doc, part.bold ? "bold" : "regular"))
      .fontSize(11)
      .fillColor(COLOR_BODY)
      .text(part.text, options.x, doc.y, {
        width: options.width,
        lineGap: options.lineGap,
        paragraphGap: options.paragraphGap,
        continued: !isLast,
      });
  });
}

/**
 * Renders the saved summary. Markdown markers become formatted content —
 * never raw "##" or "•" literals. Falls back to plain text when the content
 * matches none of the known Markdown shapes.
 */
function drawSummary(doc: PDFKit.PDFDocument, summary: string): void {
  const left = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  drawSectionHeading(doc, "AI Summary");

  const blocks = parseSummaryMarkdown(summary);

  for (const block of blocks) {
    // Keep block-level content from being split awkwardly across pages.
    if (doc.y + 48 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }

    if (block.kind === "heading") {
      doc.moveDown(0.5);
      doc
        .font(font(doc, "bold"))
        .fontSize(12)
        .fillColor(COLOR_HEADING)
        .text(block.text, left, doc.y, { width, lineGap: 3 });
      doc.moveDown(0.25);
      continue;
    }

    if (block.kind === "bullet") {
      const bulletTop = doc.y + 2;
      doc
        .circle(left + 3, bulletTop + 5, 1.7)
        .fillColor(COLOR_ACCENT)
        .fill();
      drawInlineText(doc, block.text, {
        x: left + 18,
        width: width - 18,
        lineGap: 3,
        paragraphGap: 6,
      });
      continue;
    }

    if (block.kind === "ordered") {
      const numberTop = doc.y + 1;
      doc
        .font(font(doc))
        .fontSize(11)
        .fillColor(COLOR_MUTED)
        .text(`${block.number}.`, left, numberTop, {
          width: 24,
          lineGap: 3,
          lineBreak: false,
        });
      drawInlineText(doc, block.text, {
        x: left + 24,
        width: width - 24,
        lineGap: 3,
        paragraphGap: 6,
      });
      continue;
    }

    drawInlineText(doc, block.text, {
      x: left,
      width,
      lineGap: 3,
      paragraphGap: 9,
    });
  }

  doc.moveDown(1);
}

/**
 * Renders the complete transcript. PDFKit wraps and paginates automatically,
 * and no character limit is imposed here — the full stored transcript is
 * always emitted.
 */
function drawTranscript(doc: PDFKit.PDFDocument, transcript: string): void {
  const left = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  drawSectionHeading(doc, "Full Transcript");

  doc
    .font(font(doc))
    .fontSize(11)
    .fillColor(COLOR_BODY)
    .text(transcript, left, doc.y, {
      width,
      lineGap: 3.5,
      paragraphGap: 8,
    });
}

/**
 * Stamps footer branding and "Page x of y" on every buffered page, including
 * the final one. Requires the document to be created with `bufferPages`.
 *
 * Root-cause note: PDFKit's text section overflow check (pdfkit.js:4010,
 * `document.y > this.maxY -> nextSection() -> addPage()`) fires even for
 * `lineBreak: false` text. The footer sits inside the bottom margin band,
 * below maxY, so stamping it would otherwise append a blank page per stamped
 * page. While stamping we temporarily shrink the page's bottom margin, which
 * raises maxY above the footer baseline and makes the check a no-op; the
 * margin is restored immediately so content pagination is untouched.
 */
function drawPageNumbers(doc: PDFKit.PDFDocument): void {
  const pageRange = doc.bufferedPageRange();
  const originalBottomMargin = doc.page.margins.bottom;
  const footerTop = doc.page.height - originalBottomMargin + 24;

  for (let i = pageRange.start; i < pageRange.start + pageRange.count; i++) {
    doc.switchToPage(i);

    // Raise maxY above the footer baseline while stamping this page only.
    doc.page.margins.bottom = 36;

    doc
      .font(font(doc))
      .fontSize(9)
      .fillColor(COLOR_MUTED)
      .text(
        "InsightFlow — Video Insight Report",
        doc.page.margins.left,
        footerTop,
        {
          width: doc.page.width / 2 - doc.page.margins.left,
          lineBreak: false,
        },
      );

    doc
      .font(font(doc))
      .fontSize(9)
      .fillColor(COLOR_MUTED)
      .text(
        `Page ${i - pageRange.start + 1} of ${pageRange.count}`,
        doc.page.width / 2,
        footerTop,
        {
          width: doc.page.width / 2 - doc.page.margins.right,
          align: "right",
          lineBreak: false,
        },
      );

    doc.page.margins.bottom = originalBottomMargin;
  }
}

/**
 * Builds the complete PDF document for a workspace item. The document is
 * returned open and unsealed; the caller is responsible for calling
 * `doc.end()` and piping/streaming the output.
 */
export function buildVideoPdfDocument(
  data: VideoReportData,
): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 64, bottom: 72, left: 56, right: 56 },
    bufferPages: true,
    info: {
      Title: `${data.title} — InsightFlow Video Insight Report`,
      Creator: "InsightFlow",
      Producer: "InsightFlow",
    },
  });

  if (!registerFonts(doc)) {
    throw new Error(
      "Embedded Unicode fonts are unavailable; refusing to generate a PDF that would mangle text.",
    );
  }

  // Body content must use the registered Unicode fonts from the first byte.
  doc.font(font(doc));

  drawHeader(doc, data);

  if (data.summary?.trim()) {
    drawSummary(doc, data.summary);
    // Clear visual separation between the summary and the transcript.
    doc.moveDown(1);
  }

  drawTranscript(doc, data.transcript);

  drawPageNumbers(doc);

  return doc;
}

/**
 * Sanitizes a workspace filename into a safe PDF download filename. Strips
 * path separators, control characters and quotes, then appends the
 * InsightFlow report suffix. Always yields a non-empty, header-safe name.
 */
export function buildPdfFileName(fileName: string): string {
  const base = (fileName || "video")
    .split(/[\\/]/)
    .pop()
    ?.replace(/\.[^.]*$/, "")
    .replace(/["'\\/:*?<>|\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  const safeBase = base && base.length > 0 ? base.slice(0, 80) : "video";
  return `${safeBase}-insightflow-report.pdf`;
}

/**
 * Builds the Content-Disposition header value with both an ASCII fallback
 * filename and an RFC 5987 UTF-8 form for international names.
 */
export function buildContentDisposition(fileName: string): string {
  const ascii = buildPdfFileName(fileName).replace(/[^\x20-\x7e]/g, "-");
  const encoded = encodeURIComponent(buildPdfFileName(fileName));
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}
