 


export const runtime = 'nodejs'; 
import { NextRequest, NextResponse } from 'next/server';
// import openai from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    const userId = form.get('userId');

    if (!(file instanceof Blob) || typeof userId !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid form data' }, { status: 400 });
    }
 

    const groqForm = new FormData();
    groqForm.append(
      'file',
      file,
      file instanceof File ? file.name : 'upload'
    );
    groqForm.append('model', 'whisper-large-v3-turbo');

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: groqForm,
      }
    );

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq transcription error:', errorText);
      return NextResponse.json(
        { success: false, message: 'Groq transcription failed' },
        { status: 502 }
      );
    }

    const transcription = await groqResponse.json() as { text?: string };
    if (!transcription.text) {
      return NextResponse.json(
        { success: false, message: 'Groq returned an empty transcript' },
        { status: 502 }
      );
    }

    console.log('Full transcription:', transcription.text);

    return NextResponse.json({
      success: true,
      data: { transcriptions: { text: transcription.text }, userId },
    });
  } catch (err: any) {
    console.error('/api/transcribe error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
