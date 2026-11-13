import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudioWithGnani } from '@/lib/gnani';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioEntry = formData.get('audio') || formData.get('audio_file');
    const languageCode = (formData.get('language_code') as string) || 'indic-auto';

    if (!audioEntry || !(audioEntry instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: 'No valid audio file provided.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await audioEntry.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = audioEntry.type || 'audio/wav';
    const filename = (audioEntry as any).name || 'recording.wav';

    const result = await transcribeAudioWithGnani(
      buffer,
      filename,
      contentType,
      languageCode
    );

    return NextResponse.json({
      success: true,
      transcript: result.transcript,
      detectedLanguage: result.detectedLanguage,
    });
  } catch (error: any) {
    console.error('Error in /api/gnani/stt:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Speech-to-text transcription failed.',
      },
      { status: 500 }
    );
  }
}

