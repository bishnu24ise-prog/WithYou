import { NextResponse } from 'next/server';
import { tinyfishFetch, getDomainFromUrl } from '@/lib/tinyfish';
import { WATCH_TARGETS, INITIAL_WATCH_ALERTS, WatchAlert, WatchTarget } from '@/data/watch';
import crypto from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

// In-memory cache for watch baselines
let storedAlerts: WatchAlert[] = [...INITIAL_WATCH_ALERTS];
const knownHashes = new Map<string, string>();

export async function GET() {
  return NextResponse.json({
    targets: WATCH_TARGETS,
    alerts: storedAlerts,
    lastChecked: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  try {
    const urls = WATCH_TARGETS.map((t) => t.url);
    const fetchResponse = await tinyfishFetch(urls, 'markdown', 3600);
    const results = fetchResponse?.results || [];

    const nowIso = new Date().toISOString();
    const newAlerts: WatchAlert[] = [];

    for (const result of results) {
      if (!result.text) continue;

      const currentHash = crypto.createHash('sha256').update(result.text).digest('hex').slice(0, 16);
      const target = WATCH_TARGETS.find((t) => t.url === result.url || t.url === result.final_url);
      const prevHash = knownHashes.get(result.url);

      // Check for content drift or initial baseline
      if (prevHash && prevHash !== currentHash) {
        let oneLineSummary = 'Official statutory text updated on government portal with verified regulatory modifications.';

        if (GEMINI_API_KEY) {
          try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const prompt = `Summarize in exactly ONE concise sentence (max 20 words) the legal or helpline significance of this official government portal update:
Title: ${result.title}
Text snippet: ${result.text.slice(0, 800)}`;

            const res = await model.generateContent(prompt);
            oneLineSummary = res.response.text().trim();
          } catch (e) {
            console.warn('Gemini diff summary notice:', e);
          }
        }

        const alert: WatchAlert = {
          id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          targetId: target?.id || 'portal',
          portalName: target?.name || result.title || getDomainFromUrl(result.url),
          url: result.url,
          type: 'STATUTE_AMENDMENT',
          diffSummary: oneLineSummary,
          detectedAt: nowIso,
          severity: 'medium',
        };

        newAlerts.push(alert);
      }

      knownHashes.set(result.url, currentHash);
    }

    if (newAlerts.length > 0) {
      storedAlerts = [...newAlerts, ...storedAlerts].slice(0, 15);
    }

    return NextResponse.json({
      status: 'success',
      checkedCount: results.length,
      newAlertsCount: newAlerts.length,
      alerts: storedAlerts,
      checkedAt: nowIso,
    });
  } catch (error: any) {
    console.error('Watch check error:', error);
    return NextResponse.json(
      {
        error: 'Failed to run law and helpline watch check',
        alerts: storedAlerts,
      },
      { status: 500 }
    );
  }
}

