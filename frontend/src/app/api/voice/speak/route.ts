import { NextRequest, NextResponse } from 'next/server';
import { synthesizeSpeechWithGnani } from '@/lib/gnani';

const FALLBACK_GNANI_KEY =
  'vach_1ytE2CY5X2Ou0P0yPaoQaijATV9H6AC2vDsQtS8dgXk6mUiO7nosR3zooCkBJT8SN5B5fkX50nyMP5eYFaAnn4ot8qELeVUd_463065025f61f6385cdda8592c2c37b4';
const GNANI_API_KEY = process.env.GNANI_API_KEY || process.env.NEXT_PUBLIC_GNANI_API_KEY || FALLBACK_GNANI_KEY;
const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

function cleanTextForSpeech(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/###\s*[^\n]+/g, '') // remove markdown headings
    .replace(/\[Source:[^\]]+\]/gi, '') // remove source tags
    .replace(/https?:\/\/\S+/g, '') // remove URLs
    .replace(/\*\*([^*]+)\*\*/g, '$1') // unbold
    .replace(/\*([^*]+)\*/g, '$1') // unitalic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // markdown links
    .replace(/[#*_~`>-]/g, ' ') // markdown chars
    .replace(/\s+/g, ' ')
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = 'en-IN', speaker } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text cannot be empty' }, { status: 400 });
    }

    const cleanedText = cleanTextForSpeech(text).slice(0, 450);

    // 1. Primary for Indic: Sarvam AI Bulbul v3 (Native Kannada, Hindi, Tamil, Telugu, etc.)
    if (SARVAM_API_KEY && cleanedText) {
      try {
        let langCode = 'en-IN';
        let defaultSpeaker = 'priya';

        if (/[\u0C80-\u0CFF]/.test(text) || language.startsWith('kn')) {
          langCode = 'kn-IN';
          defaultSpeaker = 'kavitha';
        } else if (/[\u0900-\u097F]/.test(text) || language.startsWith('hi')) {
          langCode = 'hi-IN';
          defaultSpeaker = 'priya';
        } else if (/[\u0B80-\u0BFF]/.test(text) || language.startsWith('ta')) {
          langCode = 'ta-IN';
          defaultSpeaker = 'kavitha';
        } else if (/[\u0C00-\u0C7F]/.test(text) || language.startsWith('te')) {
          langCode = 'te-IN';
          defaultSpeaker = 'kavitha';
        } else if (/[\u0980-\u09FF]/.test(text) || language.startsWith('bn')) {
          langCode = 'bn-IN';
          defaultSpeaker = 'priya';
        } else if (language.startsWith('mr')) {
          langCode = 'mr-IN';
          defaultSpeaker = 'priya';
        } else if (/[\u0A80-\u0AFF]/.test(text) || language.startsWith('gu')) {
          langCode = 'gu-IN';
          defaultSpeaker = 'priya';
        } else if (/[\u0D00-\u0D7F]/.test(text) || language.startsWith('ml')) {
          langCode = 'ml-IN';
          defaultSpeaker = 'kavitha';
        } else if (/[\u0A00-\u0A7F]/.test(text) || language.startsWith('pa')) {
          langCode = 'pa-IN';
          defaultSpeaker = 'priya';
        } else if (/[\u0B00-\u0B7F]/.test(text) || language.startsWith('od')) {
          langCode = 'od-IN';
          defaultSpeaker = 'priya';
        }

        const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'api-subscription-key': SARVAM_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: cleanedText,
            language_code: langCode,
            speaker: speaker || defaultSpeaker,
            model: 'bulbul:v3',
          }),
        });

        if (sarvamRes.ok) {
          const sJson = await sarvamRes.json();
          if (sJson?.audios?.[0]) {
            return NextResponse.json({
              audio_base64: sJson.audios[0],
              format: 'wav',
              language: langCode,
              provider: 'sarvam-bulbul-v3',
              supported: true,
            });
          }
        } else {
          const errText = await sarvamRes.text().catch(() => '');
          console.warn(`Sarvam TTS status ${sarvamRes.status}: ${errText}`);
        }
      } catch (sarvamTtsErr) {
        console.warn('Sarvam TTS notice, falling back:', sarvamTtsErr);
      }
    }

    // 2. Secondary: Gnani AI Timbre v2.5
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
