import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudioWithGnani } from '@/lib/gnani';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const FALLBACK_GNANI_KEY =
  'vach_1ytE2CY5X2Ou0P0yPaoQaijATV9H6AC2vDsQtS8dgXk6mUiO7nosR3zooCkBJT8SN5B5fkX50nyMP5eYFaAnn4ot8qELeVUd_463065025f61f6385cdda8592c2c37b4';
const GNANI_API_KEY = process.env.GNANI_API_KEY || process.env.NEXT_PUBLIC_GNANI_API_KEY || FALLBACK_GNANI_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') || formData.get('audio') || formData.get('audio_file');
    const language = (formData.get('language') || 'unknown').toString();
    const mode = formData.get('mode') || 'transcribe';

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // 1. Primary: Sarvam AI Saarika v2.5 Indic Speech-to-Text (Native support for Kannada, Hindi, Tamil, etc.)
    if (SARVAM_API_KEY) {
      try {
        const sarvamForm = new FormData();
        sarvamForm.append('file', file, 'speech.wav');
        sarvamForm.append('model', 'saarika:v2.5');

        // Map language code to Sarvam convention
        let langCode = 'unknown';
        if (language.startsWith('kn')) langCode = 'kn-IN';
        else if (language.startsWith('hi')) langCode = 'hi-IN';
        else if (language.startsWith('ta')) langCode = 'ta-IN';
        else if (language.startsWith('te')) langCode = 'te-IN';
        else if (language.startsWith('bn')) langCode = 'bn-IN';
        else if (language.startsWith('mr')) langCode = 'mr-IN';
        else if (language.startsWith('gu')) langCode = 'gu-IN';
        else if (language.startsWith('ml')) langCode = 'ml-IN';
        else if (language.startsWith('pa')) langCode = 'pa-IN';
        else if (language.startsWith('od')) langCode = 'od-IN';
        else if (language.startsWith('en')) langCode = 'en-IN';
        sarvamForm.append('language_code', langCode);

        const sRes = await fetch('https://api.sarvam.ai/speech-to-text', {
          method: 'POST',
          headers: {
            'api-subscription-key': SARVAM_API_KEY,
          },
          body: sarvamForm,
        });

        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData?.transcript && sData.transcript.trim()) {
            return NextResponse.json({
              text: sData.transcript.trim(),
              language: sData.language_code || langCode,
              confidence: sData.language_probability || 0.98,
              provider: 'sarvam-saarika-v2.5',
              success: true,
            });
          }
        } else {
          const errText = await sRes.text().catch(() => '');
          console.warn(`Sarvam STT returned status ${sRes.status}: ${errText}`);
        }
      } catch (sarvamErr) {
        console.warn('Sarvam STT notice, falling back:', sarvamErr);
      }
    }

    // 2. Secondary: Gnani AI Prisma v3.0 STT
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
