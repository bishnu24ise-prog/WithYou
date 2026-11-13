/**
 * Gnani AI Voice Platform Client (Vachana Speech STT & TTS)
 * Powered by Prisma v3.0 (STT) and Timbre v2.5 (TTS)
 */

export interface GnaniLanguage {
  code: string;
  name: string;
  nativeName: string;
  defaultVoice: string;
}

export const GNANI_LANGUAGES: GnaniLanguage[] = [
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', defaultVoice: 'Nalini' },
  { code: 'en-IN', name: 'English (India)', nativeName: 'English', defaultVoice: 'Nalini' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', defaultVoice: 'Nalini' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', defaultVoice: 'Nalini' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', defaultVoice: 'Nalini' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', defaultVoice: 'Nalini' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', defaultVoice: 'Nalini' },
];

const GNANI_API_BASE = 'https://api.vachana.ai';
const FALLBACK_GNANI_API_KEY =
  'vach_1ytE2CY5X2Ou0P0yPaoQaijATV9H6AC2vDsQtS8dgXk6mUiO7nosR3zooCkBJT8SN5B5fkX50nyMP5eYFaAnn4ot8qELeVUd_463065025f61f6385cdda8592c2c37b4';

export function getGnaniApiKey(): string {
  const key = process.env.GNANI_API_KEY || process.env.NEXT_PUBLIC_GNANI_API_KEY || FALLBACK_GNANI_API_KEY;
  if (!key) {
    throw new Error('GNANI_API_KEY is not configured in environment variables.');
  }
  return key;
}

/**
 * Transcribe audio using Gnani AI Prisma v3.0
 */
export async function transcribeAudioWithGnani(
  audioBuffer: Buffer,
  filename = 'audio.wav',
  contentType = 'audio/wav',
  languageCode = 'indic-auto'
): Promise<{ success: boolean; transcript: string; detectedLanguage?: string; raw?: any }> {
  const apiKey = getGnaniApiKey();

  // Correct format by magic bytes
  let detectedMime = contentType;
  let detectedFilename = filename;
  if (audioBuffer.length >= 4 && audioBuffer.toString('ascii', 0, 4) === 'RIFF') {
    detectedMime = 'audio/wav';
    detectedFilename = 'audio.wav';
  } else if (audioBuffer.length >= 4 && audioBuffer.toString('ascii', 0, 4) === 'OggS') {
    detectedMime = 'audio/ogg';
    detectedFilename = 'audio.ogg';
  } else if (
    (audioBuffer.length >= 3 && audioBuffer.toString('ascii', 0, 3) === 'ID3') ||
    (audioBuffer.length >= 2 && audioBuffer[0] === 0xff && (audioBuffer[1] & 0xe0) === 0xe0)
  ) {
    detectedMime = 'audio/mpeg';
    detectedFilename = 'audio.mp3';
  }

  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: detectedMime });
  formData.append('audio_file', blob, detectedFilename);
  formData.append('model', 'prisma-v3.0');
  formData.append('language_code', languageCode);

  const res = await fetch(`${GNANI_API_BASE}/stt/v3`, {
    method: 'POST',
    headers: {
      'X-API-Key-ID': apiKey,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Gnani STT error:', res.status, errorText);
    throw new Error(`Gnani STT failed with status ${res.status}: ${errorText}`);
  }

  const json = await res.json();
  return {
    success: Boolean(json.success),
    transcript: json.transcript || '',
    detectedLanguage: json.detected_language_code || languageCode,
    raw: json,
  };
}

/**
 * Synthesize speech from text using Gnani AI Timbre v2.5
 */
export async function synthesizeSpeechWithGnani(
  text: string,
  languageCode = 'hi-IN',
  voice = 'Nalini',
  speed = 1.0
): Promise<ArrayBuffer> {
  const apiKey = getGnaniApiKey();

  const payload = {
    text,
    voice,
    model: 'timbre-v2.5',
    language: languageCode,
    speed,
    audio_config: {
      sample_rate: 24000,
      num_channels: 1,
      sample_width: 2,
      encoding: 'linear_pcm',
      container: 'wav',
    },
  };

  const res = await fetch(`${GNANI_API_BASE}/api/v1/tts/inference`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key-ID': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Gnani TTS error:', res.status, errorText);
    throw new Error(`Gnani TTS failed with status ${res.status}: ${errorText}`);
  }

  return await res.arrayBuffer();
}

