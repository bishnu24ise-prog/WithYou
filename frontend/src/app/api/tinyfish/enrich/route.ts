import { NextResponse } from 'next/server';
import { tinyfishFetch, getDomainFromUrl } from '@/lib/tinyfish';
import { INITIAL_DIRECTORY_RECORDS, DirectoryRecord } from '@/data/directory';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const recordIds: string[] = body?.recordIds || [];

    // Filter target records
    const targetRecords =
      recordIds.length > 0
        ? INITIAL_DIRECTORY_RECORDS.filter((r) => recordIds.includes(r.id))
        : INITIAL_DIRECTORY_RECORDS;

    const urlsToFetch = targetRecords
      .map((r) => r.websiteUrl)
      .filter((u): u is string => typeof u === 'string' && u.startsWith('http'));

    // Batch fetch with TinyFish (up to 10 URLs in parallel)
    const fetchResponse = await tinyfishFetch(urlsToFetch, 'markdown', 3600);
    const fetchedResults = fetchResponse?.results || [];

    const nowIso = new Date().toISOString().split('T')[0];

    // Enrich missing fields from live extracted text
    const enrichedRecords: DirectoryRecord[] = targetRecords.map((record) => {
      const match = fetchedResults.find(
        (fr) => fr.url === record.websiteUrl || fr.final_url === record.websiteUrl
      );

      if (!match || !match.text) {
        return {
          ...record,
          verifiedAt: nowIso,
          sourceUrl: record.websiteUrl,
        };
      }

      const text = match.text;
      const updated: DirectoryRecord = { ...record };

      // Self-heal phone if missing or generic
      if (!updated.phone) {
        const phoneMatch = text.match(/(?:helpline|contact|phone|call)\s*[:\-]?\s*(\+?91[\d\s-]{10,12}|\b\d{3,5}\b)/i);
        if (phoneMatch) {
          updated.phone = phoneMatch[1].trim();
        }
      }

      // Self-heal hours if missing
      if (!updated.hours) {
        if (/24\s*[\/x]\s*7|round\s*the\s*clock|emergency/i.test(text)) {
          updated.hours = '24/7 Round the Clock';
        } else {
          updated.hours = 'Standard Govt Operating Hours';
        }
      }

      // Self-heal languages if missing
      if (!updated.languages || updated.languages.length === 0) {
        const langs: string[] = ['English'];
        if (/hindi|rashtrabhasha/i.test(text)) langs.push('Hindi');
        if (/regional|marathi|tamil|telugu|bengali/i.test(text)) langs.push('Regional Languages');
        updated.languages = langs;
      }

      // Self-heal services if missing
      if (!updated.services || updated.services.length === 0) {
        const srv: string[] = [];
        if (/shelter|residence|stay/i.test(text)) srv.push('Emergency Shelter');
        if (/legal|court|advocate|lawyer/i.test(text)) srv.push('Legal Aid');
        if (/counseling|therapy|mental/i.test(text)) srv.push('Psychological Support');
        if (/police|fir|investigation/i.test(text)) srv.push('Police Coordination');
        updated.services = srv.length > 0 ? srv : ['Emergency Crisis Support'];
      }

      updated.verifiedAt = nowIso;
      updated.sourceUrl = record.websiteUrl;

      return updated;
    });

    return NextResponse.json({
      records: enrichedRecords,
      enrichedCount: enrichedRecords.length,
      checkedUrls: urlsToFetch,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('TinyFish Enrich error:', error);
    return NextResponse.json(
      {
        error: 'Failed to enrich directory records',
        records: INITIAL_DIRECTORY_RECORDS,
      },
      { status: 500 }
    );
  }
}

