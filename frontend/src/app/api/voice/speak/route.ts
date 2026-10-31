import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = 'en-IN', speaker } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text cannot be empty' }, { status: 400 });
    }

    // Try forwarding to FastAPI backend with Sarvam Bulbul v3
    try {
      const res = await fetch(`${BACKEND_URL}/api/voice/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language, speaker }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (backendErr) {
      console.warn('Backend TTS proxy notice:', backendErr);
    }

    // ElevenLabs fallback if available
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
        console.warn('ElevenLabs TTS fallback notice:', elevenErr);
      }
    }

    // Return unsupported flag so frontend can use browser SpeechSynthesis
    return NextResponse.json({
      audio_base64: null,
      format: null,
      language,
      provider: 'browser',
      supported: false,
      message: 'Use browser SpeechSynthesis fallback.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'TTS error' }, { status: 500 });
  }
}

