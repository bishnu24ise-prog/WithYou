import { NextRequest, NextResponse } from 'next/server';
import { synthesizeSpeechWithGnani } from '@/lib/gnani';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = 'hi-IN', voice = 'Nalini', speed = 1.0 } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Text is required for speech synthesis.' },
        { status: 400 }
      );
    }

    // Limit text length to prevent timeout on long responses (first 400 chars)
    const cleanText = text.slice(0, 400).trim();

    const audioArrayBuffer = await synthesizeSpeechWithGnani(
      cleanText,
      language,
      voice,
      speed
    );

    return new NextResponse(audioArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'inline; filename="speech.wav"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/gnani/tts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Speech synthesis failed.',
      },
      { status: 500 }
    );
  }
}

