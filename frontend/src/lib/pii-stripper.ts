/**
 * Privacy & Safety Shield: PII Stripper (Client & Server TypeScript)
 * Strips sensitive survivor personal data before any outbound call is made to TinyFish Search, Fetch, or Web Agent.
 */

const PHONE_REGEX = /(?:(?:\+|00)91[\s.-]?)?(?:[6-9]\d{4}[\s.-]?\d{5}|[6-9]\d{9}|\b\d{3,5}[-\s]?\d{6,8}\b)/gi;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi;
const AADHAAR_REGEX = /\b\d{4}[\s-]\d{4}[\s-]\d{4}\b|\b\d{12}\b/g;
const COORDINATE_REGEX = /[-+]?\b[0-8]?\d\.\d{3,8},\s*[-+]?(?:1[0-7]\d|[0-9]?\d)\.\d{3,8}\b/g;
const STREET_ADDRESS_REGEX = /\b(?:flat\s*(?:no\.?|#)?\s*\w+|house\s*(?:no\.?|#)?\s*\w+|h\.?\s*no\.?\s*\w+|plot\s*no\.?\s*\w+|room\s*no\.?\s*\w+|gali\s*no\.?\s*\w+|block\s*[-A-Z0-9]+|sector\s*\d+|street\s*\d+|floor\s*\d+)\b[^,\n]*/gi;
const NAME_PREFIX_REGEX = /\b(?:my name is|i am|complainant is|victim is|survivor is|calling on behalf of)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/gi;

const PRESERVED_HELPLINES = new Set(['112', '1091', '181', '1930', '1090', '100', '101', '102']);

export function stripPiiFromText(text: string): string {
  if (!text || typeof text !== 'string') return text;

  let sanitized = text;

  // 1. Remove Email addresses
  sanitized = sanitized.replace(EMAIL_REGEX, '[CONFIDENTIAL_EMAIL]');

  // 2. Remove Indian Phone numbers while keeping short emergency helplines
  sanitized = sanitized.replace(PHONE_REGEX, (match) => {
    const cleaned = match.replace(/[\s\+\-\.]/g, '');
    if (PRESERVED_HELPLINES.has(cleaned)) {
      return match;
    }
    return '[PROTECTED_PHONE]';
  });

  // 3. Remove Aadhaar
  sanitized = sanitized.replace(AADHAAR_REGEX, '[GOVT_ID_REDACTED]');

  // 4. Remove precise GPS coordinates
  sanitized = sanitized.replace(COORDINATE_REGEX, '[APPROX_DISTRICT_ZONE]');

  // 5. Remove street/flat level addresses
  sanitized = sanitized.replace(STREET_ADDRESS_REGEX, '[LOCAL_AREA]');

  // 6. Neutralize explicit name introductions
  sanitized = sanitized.replace(NAME_PREFIX_REGEX, 'complainant is [PROTECTED_CITIZEN]');

  return sanitized;
}

export function sanitizeTinyFishPayload<T>(payload: T): T {
  if (typeof payload === 'string') {
    return stripPiiFromText(payload) as unknown as T;
  }
  if (Array.isArray(payload)) {
    return payload.map(sanitizeTinyFishPayload) as unknown as T;
  }
  if (payload !== null && typeof payload === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(payload)) {
      const lowerKey = key.toLowerCase();
      if (['lat', 'lng', 'latitude', 'longitude', 'aadhaar', 'phone', 'mobile'].includes(lowerKey)) {
        continue;
      }
      if (['name', 'fullname', 'username'].includes(lowerKey)) {
        cleaned[key] = '[CITIZEN_REDACTED]';
      } else {
        cleaned[key] = sanitizeTinyFishPayload(val);
      }
    }
    return cleaned as T;
  }
  return payload;
}
