import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const language = formData.get('language') || 'en-IN';
    const mode = formData.get('mode') || 'transcribe';

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Try forwarding to FastAPI backend
    try {
      const backendForm = new FormData();
      backendForm.append('file', file);
      backendForm.append('language', language.toString());
      backendForm.append('mode', mode.toString());

      const res = await fetch(`${BACKEND_URL}/api/voice/transcribe`, {
        method: 'POST',
        body: backendForm,
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (backendErr) {
      console.warn('Backend STT proxy notice:', backendErr);
    }

    // Graceful fallback response
    return NextResponse.json({
      text: '',
      language: language.toString(),
      confidence: 0.0,
      fallback: true,
      message: 'Backend STT unavailable; use browser Web Speech API.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Transcription error' }, { status: 500 });
  }
}

