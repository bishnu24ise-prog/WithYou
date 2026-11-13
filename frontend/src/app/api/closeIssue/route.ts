import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { updatePostStatus } from '@/lib/mockPosts';

interface CloseIssueRequest {
  issueId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { issueId } = (await request.json()) as CloseIssueRequest;

    const updated = updatePostStatus(issueId, 'closed');

    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/close-issue/${issueId}`,
          {},
          { timeout: 2000 }
        );
        return NextResponse.json(response.data, { status: 200 });
      } catch {
        console.warn('Backend unavailable, status updated locally');
      }
    }

    return NextResponse.json(
      { status: 'closed', message: 'Issue marked as closed', post: updated },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to close issue' },
      { status: 500 }
    );
  }
}
