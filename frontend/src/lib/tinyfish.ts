/**
 * SafeSpark TinyFish Client (TypeScript / Next.js Server-Side)
 * Strictly server-side only: uses process.env.TINYFISH_API_KEY
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
 * Perform privacy-preserving legal search via TinyFish
 */
export async function tinyfishSearch(
  query: string,
  location: string = 'IN',
  maxResults: number = 5
): Promise<TinyFishSearchResult[]> {
  const apiKey = getApiKey();
  const cleanQuery = stripPiiFromText(query).trim();
  const legalQuery = cleanQuery.toLowerCase().includes('india')
    ? cleanQuery
    : `${cleanQuery} India law legal provisions`;

  const cacheKey = `search:${legalQuery}:${location}`;
  const cached = getCached<TinyFishSearchResult[]>(cacheKey);
  if (cached) return cached;

  if (!apiKey) {
    return [
      {
        title: 'National Legal Services Authority (NALSA) - Free Legal Aid',
        url: 'https://nalsa.gov.in/womens-assistance/',
        snippet: 'Statutory mandate under Legal Services Authorities Act 1987 providing free legal counsel.',
        site_name: 'nalsa.gov.in',
      },
      {
        title: 'National Commission for Women (NCW)',
        url: 'https://ncw.nic.in/',
        snippet: 'Statutory body investigating complaints and advising on constitutional women safeguards.',
        site_name: 'ncw.nic.in',
      },
    ];
  }

  try {
    const url = new URL(TINYFISH_SEARCH_URL);
    url.searchParams.set('query', legalQuery);
    url.searchParams.set('location', location);
    url.searchParams.set('language', 'en');

    const res = await fetch(url.toString(), {
      headers: {
        'X-API-Key': apiKey,
        'User-Agent': 'SafeSpark-NextApp/1.0',
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      console.warn(`TinyFish Search returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const rawResults = Array.isArray(data) ? data : data?.results || [];
    const formatted: TinyFishSearchResult[] = rawResults.slice(0, maxResults);
    setCached(cacheKey, formatted, 1800); // 30 min cache
    return formatted;
  } catch (err) {
    console.error('TinyFish Search exception:', err);
    return [];
  }
}

/**
 * Batch-fetch up to 10 URLs in parallel with TinyFish
 */
export async function tinyfishFetch(
  urls: string[],
  format: 'markdown' | 'html' = 'markdown',
  ttl: number = 3600
): Promise<{ results: TinyFishFetchItem[]; errors: any[] }> {
  const apiKey = getApiKey();
  const batch = urls.slice(0, 10);
  if (batch.length === 0) return { results: [], errors: [] };

  const cacheKey = `fetch:${batch.sort().join('|')}:${format}`;
  const cached = getCached<{ results: TinyFishFetchItem[]; errors: any[] }>(cacheKey);
  if (cached) return cached;

  if (!apiKey) {
    const mock = {
      results: batch.map((u) => ({
        url: u,
        final_url: u,
        title: 'Official Legal Aid / Crisis Sanctuary Resource',
        text: 'Statutory provisions, emergency numbers (112, 1091, 181), and legal filing procedures.',
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
      signal: AbortSignal.timeout(45000),
    });

    if (!res.ok) {
      console.warn(`TinyFish Fetch returned status ${res.status}`);
      return { results: [], errors: [{ status: res.status }] };
    }

    const data = await res.json();
    setCached(cacheKey, data, ttl);
    return data;
  } catch (err) {
    console.error('TinyFish Fetch exception:', err);
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

