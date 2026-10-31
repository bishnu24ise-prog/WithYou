import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const { command, language = 'en-IN' } = await req.json();

    if (!command || !command.trim()) {
      return NextResponse.json({ intent: 'DICTATION', target_language: null, is_destructive: false });
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/voice/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, language }),
      });

      if (res.ok) {
        return NextResponse.json(await res.json());
      }
    } catch (e) {
      console.warn('Backend intent proxy notice:', e);
    }

    // Heuristic command classification
    const lower = command.toLowerCase().trim();
    if (lower.includes('quick exit') || lower.includes('emergency exit') || lower.includes('bahar')) {
      return NextResponse.json({ intent: 'QUICK_EXIT', target_language: null, is_destructive: false });
    }
    if (lower.includes('law') || lower.includes('kanoon') || lower.includes('vakil')) {
      return NextResponse.json({ intent: 'GOTO_LAWBOT', target_language: null, is_destructive: false });
    }
    if (lower.includes('therapy') || lower.includes('companion') || lower.includes('maya')) {
      return NextResponse.json({ intent: 'GOTO_THERAPY', target_language: null, is_destructive: false });
    }
    if (lower.includes('next') || lower.includes('agla') || lower.includes('aage')) {
      return NextResponse.json({ intent: 'NEXT', target_language: null, is_destructive: false });
    }
    if (lower.includes('back') || lower.includes('peeche') || lower.includes('wapas')) {
      return NextResponse.json({ intent: 'BACK', target_language: null, is_destructive: false });
    }

    return NextResponse.json({ intent: 'DICTATION', target_language: null, is_destructive: false });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Intent error' }, { status: 500 });
  }
}

