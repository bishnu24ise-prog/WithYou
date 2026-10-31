import { NextResponse } from 'next/server';

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const VOICE_ID = 'cgSgspJ2msm6clMCkdW9'; // Friendly female assistant voice

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text parameter' }, { status: 400, headers: corsHeaders });
    }

    if (!ELEVEN_LABS_API_KEY) {
      return NextResponse.json({ error: 'Missing ELEVEN_LABS_API_KEY' }, { status: 500, headers: corsHeaders });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', err);
      return NextResponse.json({ error: err }, { status: response.status, headers: corsHeaders });
    }

    const audioArrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioArrayBuffer).toString('base64');

    return NextResponse.json({ audio: `data:audio/mp3;base64,${base64Audio}` }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
