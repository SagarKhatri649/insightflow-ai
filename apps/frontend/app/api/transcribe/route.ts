// // app/api/transcribe/route.ts

// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const { ufsUrl, fileName, userId } = await request.json();

//     if (!ufsUrl || !fileName || !userId) {
//       return NextResponse.json(
//         { success: false, message: 'Missing parameters' },
//         { status: 400 }
//       );
//     }

//     // 1) Download the file from UploadThing on the server
//     const resp = await fetch(ufsUrl);
//     if (!resp.ok) {
//       return NextResponse.json(
//         { success: false, message: 'Failed to fetch file' },
//         { status: 502 }
//       );
//     }
//     const arrayBuffer = await resp.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // 2) Build a multipart form for OpenAI
//     const formData = new FormData();
//     formData.append(
//       'file',
//       new Blob([buffer], { type: resp.headers.get('content-type') || 'application/octet-stream' }),
//       fileName
//     );
//     formData.append('model', 'whisper-1');

//     // 3) Call OpenAI’s REST endpoint directly
//     const openaiRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: formData,
//     });

//     if (!openaiRes.ok) {
//       const err = await openaiRes.text();
//       console.error('OpenAI API error:', err);
//       return NextResponse.json(
//         { success: false, message: 'OpenAI transcription failed' },
//         { status: 502 }
//       );
//     }

//     const transcription = await openaiRes.json(); // { text: "..." }

//     // 4) Return exactly the shape your client expects
//     return NextResponse.json({
//       success: true,
//       data: {
//         transcriptions: { text: transcription.text },
//         userId,
//       },
//     });
//   } catch (error: any) {
//     console.error('❌ /api/transcribe error:', error);
//     return NextResponse.json(
//       { success: false, message: error.message || 'Server error' },
//       { status: 500 }
//     );
//   }
// }

// app/api/transcribe/route.ts
// export const runtime = 'nodejs';

// import { NextRequest, NextResponse } from 'next/server';
// import openai from '@/lib/openai';

// export async function POST(request: NextRequest) {
//   try {
//     const form = await request.formData();
//     const file = form.get('file');
//     const userId = form.get('userId');

//     if (!(file instanceof Blob) || typeof userId !== 'string') {
//       return NextResponse.json({ success: false, message: 'Invalid form data' }, { status: 400 });
//     }

//     // Send to Whisper
//     const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
//       method: 'POST',
//       headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
//       body: (() => {
//         const fd = new FormData();
//         fd.append('file', file as Blob, (file as File).name);
//         fd.append('model', 'whisper-1');
//         return fd;
//       })(),
//     });

//     if (!whisperRes.ok) {
//       const txt = await whisperRes.text().catch(() => '');
//       return NextResponse.json(
//         { success: false, message: `Whisper error ${whisperRes.status}: ${txt}` },
//         { status: 502 }
//       );
//     }

//     const { text } = await whisperRes.json();
//     return NextResponse.json({
//       success: true,
//       data: { transcriptions: { text }, userId },
//     });
//   } catch (err: any) {
//     console.error('/api/transcribe error:', err);
//     return NextResponse.json({ success: false, message: err.message }, { status: 500 });
//   }
// }


export const runtime = 'nodejs'; 
import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    const userId = form.get('userId');

    if (!(file instanceof Blob) || typeof userId !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid form data' }, { status: 400 });
    }

    // Send directly to Whisper
    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: file as Blob,
      filename: (file as File).name,
    });

    return NextResponse.json({
      success: true,
      data: { transcriptions: { text: transcription.text }, userId },
    });
  } catch (err: any) {
    console.error('/api/transcribe error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
