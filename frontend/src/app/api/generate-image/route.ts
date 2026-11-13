import { NextResponse } from 'next/server';
import axios from 'axios';

interface GenerateImageRequestData {
  generatedText: string;
  imagePrompt: string;
}

const DEFAULT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80', // Vibrant flowers
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Peaceful beach landscape
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80', // Forest greenery
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80', // Floral bouquet
];

export async function POST(req: Request) {
  try {
    const data: GenerateImageRequestData = await req.json();

    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-image`,
          { prompt: data.imagePrompt },
          { timeout: 3000 }
        );
        if (res.data?.image_urls && res.data.image_urls.length > 0) {
          return NextResponse.json({ images: res.data.image_urls }, { status: 200 });
        }
      } catch (backendErr) {
        console.warn('Backend unavailable, using default steganography covers');
      }
    }

    return NextResponse.json({ images: DEFAULT_COVER_IMAGES }, { status: 200 });
  } catch (error) {
    console.error('Image generation failed:', error);
    return NextResponse.json({ images: DEFAULT_COVER_IMAGES }, { status: 200 });
  }
}
