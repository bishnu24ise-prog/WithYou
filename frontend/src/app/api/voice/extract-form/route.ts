import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callSarvamChat, isIndicOrHinglish, isSarvamConfigured } from '@/lib/sarvam';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const FORM_EXTRACTION_SYSTEM = `
You are an expert, trauma-informed assistant for SafeSpark. A woman in domestic distress has spoken freely about her situation.
Extract the structured fields from her words into the exact JSON format below.

Output JSON Schema:
{
  "name": "string (Victim name or pseudonym, or empty string)",
  "phone": "string (Phone number if mentioned, or empty string)",
  "location": {
    "city": "string (City or area mentioned)",
    "address": "string (Specific address or locality)",
    "lat": 28.6139,
    "lng": 77.2090
  },
  "duration_of_abuse": "string (e.g. '2 years', '6 months', or empty string)",
  "frequency_of_incidents": "string (e.g. 'Daily', 'Weekly', 'Ongoing', or empty string)",
  "visible_injuries": "Yes" | "No",
  "preferred_contact": ["Phone" | "Email" | "Text message" | "In-person"],
  "current_situation": "string (Clear summary of what is happening and any threats)",
  "culprit_description": "string (Relationship, appearance, behavior of the perpetrator)",
  "missing_required_fields": ["array of field names that are critical and missing, e.g. 'name', 'current_situation'"],
  "follow_up_question": "string (A single, gentle, comforting question in the user's language asking for the most critical missing info, or empty string if complete)"
}
`;

export async function POST(req: NextRequest) {
  try {
    const { transcript, language = 'en-IN' } = await req.json();

    if (!transcript || !transcript.trim()) {
      return NextResponse.json({ error: 'Transcript cannot be empty' }, { status: 400 });
    }

    // 1. Prioritize Sarvam 105B Indic Extraction for Indian speech / Hinglish
    if (isSarvamConfigured() && isIndicOrHinglish(transcript, language)) {
      try {
        const sarvamPrompt = `Extract the structured complaint data from this spoken distress statement in ${language}:
"${transcript}"

Format strictly as JSON according to the schema provided.`;

        const sarvamRes = await callSarvamChat({
          messages: [{ role: 'user', content: sarvamPrompt }],
          systemPrompt: FORM_EXTRACTION_SYSTEM,
          model: 'sarvam-105b-conversations',
          temperature: 0.2,
          timeoutMs: 6500,
        });

        if (sarvamRes?.text) {
          const cleanJson = sarvamRes.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (parsed && typeof parsed === 'object') {
            return NextResponse.json({
              ...parsed,
              _extractedBy: 'Sarvam 105B Indic MoE',
            });
          }
        }
      } catch (sarvamErr: any) {
        console.warn('Sarvam form extraction notice (falling back):', sarvamErr?.message || sarvamErr);
      }
    }

    // 2. Try forwarding to FastAPI backend
    try {
      const res = await fetch(`${BACKEND_URL}/api/voice/extract-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, language }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (backendErr) {
      console.warn('Backend extract-form proxy notice:', backendErr);
    }

    // 3. Local Gemini extraction fallback
    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
          systemInstruction: FORM_EXTRACTION_SYSTEM,
        });

        const prompt = `Spoken transcript (${language}):\n${transcript}`;
        const result = await model.generateContent(prompt);
        const parsed = JSON.parse(result.response.text());
        return NextResponse.json(parsed);
      } catch (geminiErr) {
        console.warn('Local Gemini extraction notice:', geminiErr);
      }
    }

    // Heuristic fallback
    return NextResponse.json({
      name: '',
      phone: '',
      location: { city: '', address: '', lat: 28.6139, lng: 77.2090 },
      duration_of_abuse: 'Ongoing',
      frequency_of_incidents: 'Frequent',
      visible_injuries: 'No',
      preferred_contact: ['Phone'],
      current_situation: transcript,
      culprit_description: '',
      missing_required_fields: ['name', 'culprit_description'],
      follow_up_question: 'Could you please share your name or what name you prefer to use?',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Extraction error' }, { status: 500 });
  }
}

