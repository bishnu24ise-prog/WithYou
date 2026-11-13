/**
 * SafeSpark TinyFish Client (TypeScript / Next.js Server-Side)
 * Optimized for high-speed sub-10s response time with privacy-preserving statutory research
 */

import { stripPiiFromText } from './pii-stripper';

const TINYFISH_SEARCH_URL = 'https://api.search.tinyfish.ai';
const TINYFISH_FETCH_URL = 'https://api.fetch.tinyfish.ai';
const TINYFISH_AGENT_SSE_URL = 'https://agent.tinyfish.ai/v1/automation/run-sse';

export interface TinyFishSearchResult {
  title: string;
  url: string;
  snippet?: string;
  site_name?: string;
  position?: number;
}

export interface TinyFishFetchItem {
  url: string;
  final_url?: string;
  title?: string;
  description?: string;
  text?: string;
  format?: string;
  latency_ms?: number;
}

export interface CitedSource {
  title: string;
  url: string;
  domain: string;
  fetchedAt: string;
  snippet?: string;
}

// In-memory server cache
const memoryCache = new Map<string, { data: any; expiresAt: number }>();

function getCached<T>(key: string): T | null {
  const item = memoryCache.get(key);
  if (item && item.expiresAt > Date.now()) {
    return item.data as T;
  }
  return null;
}

function setCached(key: string, data: any, ttlSeconds: number) {
  memoryCache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
}

function getApiKey(): string | undefined {
  return process.env.TINYFISH_API_KEY;
}

/**
 * Returns instant, topic-specialized statutory sources
 */
export function getPreIndexedLegalSources(query: string): TinyFishSearchResult[] {
  const q = query.toLowerCase();

  if (q.includes('workplace') || q.includes('posh') || q.includes('harass') || q.includes('office') || q.includes('colleague')) {
    return [
      {
        title: 'Ministry of Women & Child Development - SHe-Box Portal (POSH Act)',
        url: 'https://shebox.wcd.gov.in/',
        snippet: 'Central electronic complaint mechanism under Sexual Harassment of Women at Workplace Act 2013.',
        site_name: 'shebox.wcd.gov.in',
      },
      {
        title: 'National Commission for Women (NCW) - Workplace Complaints Cell',
        url: 'https://ncw.nic.in/',
        snippet: 'Statutory mandate for non-retaliation, Internal Complaints Committee (ICC) compliance, and inquiry assistance.',
        site_name: 'ncw.nic.in',
      },
      {
        title: 'National Legal Services Authority (NALSA) - Free Legal Counsel',
        url: 'https://nalsa.gov.in/womens-assistance/',
        snippet: 'Free legal representation for women under Section 12 of Legal Services Authorities Act.',
        site_name: 'nalsa.gov.in',
      },
    ];
  }

  if (q.includes('cyber') || q.includes('online') || q.includes('stalk') || q.includes('photo') || q.includes('video') || q.includes('blackmail')) {
    return [
      {
        title: 'National Cyber Crime Reporting Portal (1930 Helpline)',
        url: 'https://cybercrime.gov.in/',
        snippet: 'Official Ministry of Home Affairs portal for anonymous reporting of women/child cyber crimes and non-consensual imagery.',
        site_name: 'cybercrime.gov.in',
      },
      {
        title: 'StopNCII.org - Non-Consensual Intimate Imagery Prevention',
        url: 'https://stopncii.org/',
        snippet: 'Device-level cryptographic hashing preventing sharing of private photos across Meta, Instagram, and web platforms.',
        site_name: 'stopncii.org',
      },
      {
        title: 'National Commission for Women - Cyber Crime Cell',
        url: 'https://ncw.nic.in/',
        snippet: 'Intervention cell for cyber stalking, impersonation, and digital harassment under IT Act 2000.',
        site_name: 'ncw.nic.in',
      },
    ];
  }

  if (q.includes('police') || q.includes('fir') || q.includes('complaint') || q.includes('arrest') || q.includes('station')) {
    return [
      {
        title: 'National Legal Services Authority (NALSA) - Legal Aid & Zero FIR Rights',
        url: 'https://nalsa.gov.in/womens-assistance/',
        snippet: 'Free counsel for lodging Zero FIRs and legal safeguards for women under BNSS/CrPC.',
        site_name: 'nalsa.gov.in',
      },
      {
        title: 'Ministry of Home Affairs - Emergency Response Support System (112)',
        url: 'https://112.gov.in/',
        snippet: 'Nationwide single emergency number 112 with GPS dispatch and women safety integration.',
        site_name: '112.gov.in',
      },
    ];
  }

  // Domestic Violence / General
  return [
    {
      title: 'Protection of Women from Domestic Violence Act (PWDVA 2005) - Statutory Reliefs',
      url: 'https://wcd.nic.in/act/protection-women-domestic-violence-act-2005',
      snippet: 'Statutory emergency protection orders (Sec 18), residence orders (Sec 19), and maintenance (Sec 20).',
      site_name: 'wcd.nic.in',
    },
    {
      title: 'National Legal Services Authority (NALSA) - Free Legal Aid for Women',
      url: 'https://nalsa.gov.in/womens-assistance/',
      snippet: 'Mandatory free legal counsel and court representation for women under Article 39A and NALSA Act.',
      site_name: 'nalsa.gov.in',
    },
    {
      title: 'National Commission for Women (NCW) - 24/7 Redressal Helpline (7827170170)',
      url: 'https://ncw.nic.in/',
      snippet: 'Constitutional safeguards, emergency domestic distress cell, and legal advisory.',
      site_name: 'ncw.nic.in',
    },
  ];
}

/**
 * Perform privacy-preserving legal search via TinyFish with strict 2.5s fast timeout
 */
export async function tinyfishSearch(
  query: string,
  location: string = 'IN',
  maxResults: number = 4
): Promise<TinyFishSearchResult[]> {
  const cleanQuery = stripPiiFromText(query).trim();
  const legalQuery = cleanQuery.toLowerCase().includes('india')
    ? cleanQuery
    : `${cleanQuery} India law legal provisions`;

  const cacheKey = `search:${legalQuery}:${location}`;
  const cached = getCached<TinyFishSearchResult[]>(cacheKey);
  if (cached) return cached;

  const apiKey = getApiKey();
  if (!apiKey) {
    const instantFallback = getPreIndexedLegalSources(cleanQuery).slice(0, maxResults);
    setCached(cacheKey, instantFallback, 3600);
    return instantFallback;
  }

  try {
    const url = new URL(TINYFISH_SEARCH_URL);
    url.searchParams.set('query', legalQuery);
    url.searchParams.set('location', location);
    url.searchParams.set('language', 'en');

    // Fast 2.5s timeout prevents LawBot from ever hanging
    const res = await fetch(url.toString(), {
      headers: {
        'X-API-Key': apiKey,
        'User-Agent': 'SafeSpark-NextApp/1.0',
      },
      signal: AbortSignal.timeout(2500),
    });

    if (!res.ok) {
      console.warn(`TinyFish Search status ${res.status}, using instant statutory index.`);
      return getPreIndexedLegalSources(cleanQuery).slice(0, maxResults);
    }

    const data = await res.json();
    const rawResults = Array.isArray(data) ? data : data?.results || [];
    const formatted: TinyFishSearchResult[] =
      rawResults.length > 0
        ? rawResults.slice(0, maxResults)
        : getPreIndexedLegalSources(cleanQuery).slice(0, maxResults);

    setCached(cacheKey, formatted, 1800);
    return formatted;
  } catch (err) {
    // Return pre-indexed statutory sources instantly on timeout or network error
    return getPreIndexedLegalSources(cleanQuery).slice(0, maxResults);
  }
}

/**
 * Fast Batch-fetch with 2.5s timeout
 */
export async function tinyfishFetch(
  urls: string[],
  format: 'markdown' | 'html' = 'markdown',
  ttl: number = 3600
): Promise<{ results: TinyFishFetchItem[]; errors: any[] }> {
  const batch = urls.slice(0, 3); // Top 3 URLs max for speed
  if (batch.length === 0) return { results: [], errors: [] };

  const cacheKey = `fetch:${batch.sort().join('|')}:${format}`;
  const cached = getCached<{ results: TinyFishFetchItem[]; errors: any[] }>(cacheKey);
  if (cached) return cached;

  const apiKey = getApiKey();
  if (!apiKey) {
    const mock = {
      results: batch.map((u) => ({
        url: u,
        final_url: u,
        title: 'Official Legal Aid / Statutory Resource',
        text: 'Statutory provisions, emergency numbers (112, 1091, 181, 1930), and legal filing procedures.',
        format,
      })),
      errors: [],
    };
    return mock;
  }

  try {
    const res = await fetch(TINYFISH_FETCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({ urls: batch, format, ttl }),
      signal: AbortSignal.timeout(2500), // Fast 2.5s timeout
    });

    if (!res.ok) {
      return { results: [], errors: [{ status: res.status }] };
    }

    const data = await res.json();
    setCached(cacheKey, data, ttl);
    return data;
  } catch (err) {
    return { results: [], errors: [{ error: String(err) }] };
  }
}

/**
 * Formats a domain name cleanly from a URL
 */
export function getDomainFromUrl(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'gov.in';
  }
}
