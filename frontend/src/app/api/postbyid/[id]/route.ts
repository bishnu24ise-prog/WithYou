import { NextResponse } from 'next/server';
import { getPostById } from '@/lib/mockPosts';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-post/${id}`,
        { next: { revalidate: 0 } }
      );
      if (response.ok) {
        const post = await response.json();
        return NextResponse.json(post);
      }
    } catch {
      console.warn('Backend unavailable, using local post store');
    }
  }

  const post = getPostById(id);
  if (post) {
    return NextResponse.json(post);
  }

  return NextResponse.json({ error: 'Post not found' }, { status: 404 });
}
