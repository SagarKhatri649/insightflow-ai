
// upload-actions.ts
'use server';

import openai from '@/lib/openai';
import getDbConnection from '@/lib/db';

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
    return { success: false, message: 'Missing parameters', data: { transcriptions: null, userId } };
  }
  try {
    const resp = await fetch(ufsUrl);
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
    const arrayBuffer = await resp.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: resp.headers.get('content-type')! });
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
      model: 'whisper-large-v3-turbo',
      file: blob,
    });
    if (!transcription.text) throw new Error('Empty transcript');
    return {
      success: true,
      message: 'Transcribed',
      data: { transcriptions: { text: transcription.text }, userId },
    };
  } catch (err: any) {
    return { success: false, message: err.message, data: { transcriptions: null, userId } };
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
    model: 'llama-3.1-8b-instant',
    temperature: 0.7,
    max_tokens: 1500,
    messages: [
      {
        role: 'system',
        content: `You are an AI assistant. Given a transcript, generate a GitHub-Flavored Markdown document wrapped in a <div class="text-xl"> container (150% font size). Structure the output with one blank line between each section:

## Summary

<Insert a concise summary here, approximately 25% of the transcript's word count>

## Key Points

• <First meaningful key point as a full sentence>

• <Second key point as a full sentence>

... continue up to 5–10 bullet points, each separated by one blank line. Only output valid Markdown.`,
      },
      {
        role: 'user',
        content: `Transcript:
${transcript}`,
      },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() ?? '';
}

/**
 * Server action: save the transcript summary into the posts table.
 * Only uses transcript and userId; no fileName needed.
 */
export async function generateBlogPostAction({
  transcriptions,
  userId,
}: {
  transcriptions: { text: string };
  userId: string;
}) {
  try {
    const transcriptText = transcriptions.text;
    if (!transcriptText) throw new Error('No transcription text provided');

    // 1) Analyze via GPT for summary + key points
    const analysisMd = await analyzeTranscript(transcriptText);
    if (!analysisMd) throw new Error('GPT summary returned empty content');

    // 2) Derive title from first non-empty line of summary
    const firstLine = analysisMd.split('\n').find(line => line.trim().length > 0) ?? 'Transcript Overview';
    const title = firstLine.replace(/^#+\s*/, '').slice(0, 100);

    // 3) Insert analysisMarkdown into DB
    const sql = await getDbConnection();
    const [inserted] = await sql`
      INSERT INTO posts (user_id, title, content)
      VALUES (${userId}, ${title}, ${analysisMd})
      RETURNING id
    `;
    const postId = inserted?.id;
    if (!postId) throw new Error('Failed to insert post');

    return { success: true, postId };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
