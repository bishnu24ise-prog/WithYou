/**
 * SafeSpark Sarvam AI Client
 * India's Sovereign 105B Indic LLM Integration for LawBot, Maya 3D Avatar, and SOS Voice Extraction
 */

export interface SarvamMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SarvamChatOptions {
  messages: SarvamMessage[];
  systemPrompt?: string;
  model?: 'sarvam-105b-conversations' | 'sarvam-105b';
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface SarvamChatResult {
  text: string;
  model: string;
  latencyMs: number;
}

export function isSarvamConfigured(): boolean {
  return Boolean(process.env.SARVAM_API_KEY);
}

/**
 * Detects whether the text contains Indian script characters, Hinglish vocabulary,
 * or the active locale is an Indic regional language.
 */
export function isIndicOrHinglish(text: string, locale?: string): boolean {
  if (locale && locale !== 'en-IN' && locale !== 'en') {
    return true;
  }

  if (!text) return false;

  // Unicode check for Indian scripts:
  // Devanagari, Bengali, Gurmukhi, Gujarati, Odia, Tamil, Telugu, Kannada, Malayalam, Urdu
  const indicScriptRegex =
    /[\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0600-\u06FF]/;
  if (indicScriptRegex.test(text)) {
    return true;
  }

  // Common colloquial Hinglish, Kanglish (Kannada), and Indic distress & legal keywords
  const indicWordsRegex =
    /\b(kya|mujhe|mera|meri|mere|hai|hain|nahi|nhi|raha|rahi|police|shikayat|pati|saas|dahej|bachao|madad|peet|mara|marte|ghar|dhamki|batao|karna|chahiye|kanoon|dhara|hinsa|shoshan|darr|dar|bacha|madat|nanna|nanage|namage|neevu|beku|beda|madbeku|madabeku|enu|yenu|yellaru|hodithiddane|hodithare|sahaya|nyaya|thondre|mane|ganda|madadi|kodi|hege|kanoonu|dourjanya|rakshane|shikayathu)\b/i;
  return indicWordsRegex.test(text);
}

/**
 * Executes a Chat Completion request to Sarvam AI 105B
 */
export async function callSarvamChat(options: SarvamChatOptions): Promise<SarvamChatResult | null> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    return null;
  }

  const startTime = Date.now();
  const model = options.model || 'sarvam-105b-conversations';
  const timeoutMs = options.timeoutMs || 8000;

  const messagesPayload: SarvamMessage[] = [];
  if (options.systemPrompt) {
    messagesPayload.push({
      role: 'system',
      content: options.systemPrompt,
    });
  }
  messagesPayload.push(...options.messages);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        model,
        messages: messagesPayload,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 2048,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`Sarvam AI API responded with status ${res.status}: ${errText}`);
      return null;
    }

    const data = await res.json();
    const replyText = data?.choices?.[0]?.message?.content;

    if (!replyText || typeof replyText !== 'string' || !replyText.trim()) {
      return null;
    }

    return {
      text: replyText.trim(),
      model,
      latencyMs: Date.now() - startTime,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn('Sarvam AI invocation notice:', err?.message || err);
    return null;
  }
}

