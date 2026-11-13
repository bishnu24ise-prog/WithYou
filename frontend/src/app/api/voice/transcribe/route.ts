import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudioWithGnani } from '@/lib/gnani';

const GNANI_API_KEY = process.env.GNANI_API_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') || formData.get('audio') || formData.get('audio_file');
    const language = formData.get('language') || 'indic-auto';
    const mode = formData.get('mode') || 'transcribe';

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // 1. Try Gnani AI Prisma v3.0 STT
    if (GNANI_API_KEY) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = (file as any).name || 'audio.wav';
        const contentType = file.type || 'audio/wav';

        const result = await transcribeAudioWithGnani(
          buffer,
          filename,
          contentType,
          language.toString()
        );

        if (result.success !== false) {
          return NextResponse.json({
            text: result.transcript || '',
            language: result.detectedLanguage || language.toString(),
            confidence: 0.95,
            provider: 'gnani',
            success: true,
          });
        }
      } catch (gnaniErr) {
        console.warn('Gnani STT notice, trying fallback:', gnaniErr);
      }
    }

    // 2. Try forwarding to FastAPI backend
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
      message: 'STT server unavailable; use browser Web Speech API.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Transcription error' }, { status: 500 });
  }
}
