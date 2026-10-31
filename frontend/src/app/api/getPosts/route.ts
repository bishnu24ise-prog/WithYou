import axios from 'axios';
import { NextResponse } from 'next/server';
import { getStoredPosts } from '@/lib/mockPosts';

export async function GET() {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-admin-posts`,
        { timeout: 3000 }
      );
      if (response.status === 200 && response.data) {
        return NextResponse.json(response.data, { status: 200 });
      }
    } catch (backendErr) {
      console.warn('Backend unavailable, using local posts store');
    }
  }

  // Fallback to local posts store
  return NextResponse.json(getStoredPosts(), { status: 200 });
}
