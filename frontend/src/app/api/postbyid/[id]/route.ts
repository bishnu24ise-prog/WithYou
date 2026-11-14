import { NextResponse } from 'next/server';
import { getPostById } from '@/lib/mockPosts';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  const cleanTargetId = String(id).trim().toLowerCase();

  // 1. Try backend API if URL is configured
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-post/${encodeURIComponent(id)}`,
        { next: { revalidate: 0 }, signal: AbortSignal.timeout(3000) }
      );
      if (response.ok) {
        const post = await response.json();
        // Ensure backend actually returned the requested post and not an error object
        if (
          post &&
          !post.detail &&
          String(post._id || '').trim().toLowerCase() === cleanTargetId
        ) {
          return NextResponse.json(post);
        }
      }
    } catch {
      console.warn('Backend unavailable, using local post store');
    }
  }

  // 2. Look up post from stored/mock records strictly matching ID
  const post = getPostById(id);
  if (post && String(post._id || '').trim().toLowerCase() === cleanTargetId) {
    return NextResponse.json(post);
  }

  // 3. Return 404 if not found (Never return a mismatched record)
  return NextResponse.json({ error: 'Post not found', id }, { status: 404 });
}
