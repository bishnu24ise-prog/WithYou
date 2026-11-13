import axios from 'axios';
import { NextResponse } from 'next/server';
import { addStoredPost } from '@/lib/mockPosts';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    addStoredPost(data);

    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/save-extracted-data`,
          data,
          { timeout: 3000 }
        );
        return NextResponse.json({ data: res.data?.status || 'saved' }, { status: 200 });
      } catch (backendErr) {
        console.warn('Backend unavailable, saved locally');
      }
    }

    return NextResponse.json({ data: 'Data saved successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Save failed:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save data' },
      { status: 500 }
    );
  }
}
