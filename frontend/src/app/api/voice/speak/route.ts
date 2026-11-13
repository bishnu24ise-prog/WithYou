import { NextRequest, NextResponse } from 'next/server';
import { synthesizeSpeechWithGnani } from '@/lib/gnani';

const FALLBACK_GNANI_KEY =
  'vach_1ytE2CY5X2Ou0P0yPaoQaijATV9H6AC2vDsQtS8dgXk6mUiO7nosR3zooCkBJT8SN5B5fkX50nyMP5eYFaAnn4ot8qELeVUd_463065025f61f6385cdda8592c2c37b4';
const GNANI_API_KEY = process.env.GNANI_API_KEY || process.env.NEXT_PUBLIC_GNANI_API_KEY || FALLBACK_GNANI_KEY;
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = 'en-IN', speaker } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text cannot be empty' }, { status: 400 });
    }

    // 1. Try Gnani AI Timbre v2.5 (Primary Indian Voice Engine)
    if (GNANI_API_KEY) {
      try {
        const cleanText = text.slice(0, 400).trim();
        const arrayBuffer = await synthesizeSpeechWithGnani(
          cleanText,
          language,
          speaker || 'Nalini',
          1.0
        );
        const base64 = Buffer.from(arrayBuffer).toString('base64');

        return NextResponse.json({
          audio_base64: base64,
          format: 'wav',
          language,
          provider: 'gnani',
          supported: true,
        });
      } catch (gnaniErr) {
        console.warn('Gnani TTS notice, trying fallback:', gnaniErr);
      }
    }

    // 2. Try forwarding to FastAPI backend with 1.5s timeout
    try {
      const res = await fetch(`${BACKEND_URL}/api/voice/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language, speaker }),
        signal: AbortSignal.timeout(1500),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (backendErr) {
      // Backend offline or timed out; continue
    }

    // 3. ElevenLabs fallback if available
    if (ELEVEN_LABS_API_KEY) {
      try {
        const elevenRes = await fetch('https://api.elevenlabs.io/v1/text-to-speech/cgSgspJ2msm6clMCkdW9', {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVEN_LABS_API_KEY,
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
          },
          body: JSON.stringify({
            text: text.slice(0, 500),
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.5, similarity_boost: 0.8 },
          }),
        });

        if (elevenRes.ok) {
          const arrayBuffer = await elevenRes.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          return NextResponse.json({
            audio_base64: base64,
            format: 'mp3',
            language,
            provider: 'elevenlabs',
            supported: true,
          });
        }
      } catch (elevenErr) {
        console.warn('ElevenLabs notice:', elevenErr);
      }
    }

    // Browser Web Speech fallback signal
    return NextResponse.json({
      supported: false,
      use_browser_speech: true,
      text,
      language,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'TTS Error' }, { status: 500 });
  }
}
