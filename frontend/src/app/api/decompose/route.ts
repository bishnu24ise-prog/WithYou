import axios from 'axios';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

function extractStructuredDetails(text: string, rawData?: any) {
  let name = rawData?.name || rawData?.Name || '';
  let severity = 'High';
  let issue = 'Domestic Violence Incident';
  let contact = rawData?.phone || rawData?.Contact || '+91 Confidential';
  const situation = rawData?.currentSituation || rawData?.current_situation || text || 'Emergency distress message encoded.';
  let culprit = rawData?.culprit || rawData?.culprit_description || 'Details recorded';

  // 1. Extract Name if not already provided
  if (!name || name === 'Survivor Report' || name === 'Anonymous') {
    const nameMatch = 
      text.match(/Report for\s+([A-Za-z\s]+?):/i) ||
      text.match(/help from\s+([A-Za-z\s]+?)\./i) ||
      text.match(/Name:\s*([A-Za-z\s]+?)(?:\n|,|$)/i) ||
      text.match(/I am\s+([A-Za-z\s]+?),/i);

    if (nameMatch && nameMatch[1]?.trim()) {
      const extracted = nameMatch[1].trim();
      if (extracted.length < 35 && !extracted.toLowerCase().includes('survivor')) {
        name = extracted;
      }
    }
  }

  if (!name) {
    name = 'Survivor Report';
  }

  // 2. Extract Severity
  if (text.match(/severe|critical|assault|confinement|weapon|threat to life|very high/i)) {
    severity = 'Very High';
  } else if (text.match(/moderate|harassment|verbal|medium/i)) {
    severity = 'Medium';
  } else {
    severity = 'High';
  }

  // 3. Extract Culprit
  if (!rawData?.culprit) {
    const culpritMatch = text.match(/(?:involving|culprit|by)\s+([^.\n]+)/i);
    if (culpritMatch && culpritMatch[1]?.trim()) {
      culprit = culpritMatch[1].trim();
    }
  }

  // 4. Extract Contact
  if (!rawData?.phone) {
    const contactMatch = text.match(/(?:phone|contact|mobile|tel):\s*([\d\s+-]+)/i);
    if (contactMatch && contactMatch[1]?.trim()) {
      contact = contactMatch[1].trim();
    }
  }

  // 5. Extract Nature / Issue
  if (text.match(/physical|assault|beating|hit/i)) {
    issue = 'Physical Assault & Domestic Violence';
  } else if (text.match(/harass|workplace|posh|stalk/i)) {
    issue = 'Harassment & Safety Threat';
  } else if (text.match(/eviction|landlord|electricity/i)) {
    issue = 'Threat of Eviction & Intimidation';
  }

  let locationStr = '28.6139, 77.2090';
  const state = rawData?.state || 'Emergency SOS Location';
  if (rawData?.location) {
    if (typeof rawData.location === 'object' && (rawData.location.lat || rawData.location.lng)) {
      locationStr = `${rawData.location.lat}, ${rawData.location.lng}`;
    } else if (typeof rawData.location === 'string') {
      locationStr = rawData.location;
    }
  }

  return {
    Name: name,
    'Severity of domestic violence': severity,
    'Nature of domestic violence': issue,
    'Contact': contact,
    'Current Situation': situation,
    'Culprit Description': culprit,
    Location: locationStr,
    state: state,
    status: 'pending',
  };
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. If called with resImage (encoding step in Share.tsx)
    if (data.resImage) {
      return NextResponse.json({
        encodedImage: data.resImage,
      });
    }

    // 2. If called with resText (decomposition step)
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/text-decomposition`,
          { text: data.resText },
          { timeout: 2000 }
        );
        if (res.data?.extracted_data) {
          const extracted = res.data.extracted_data;
          // Ensure exact name if provided in rawData
          if (data.name && (!extracted.Name || extracted.Name === 'Survivor Report')) {
            extracted.Name = data.name;
          }
          return NextResponse.json(
            { decomposed: extracted },
            { status: 200 }
          );
        }
      } catch (backendErr) {
        console.warn('Backend unavailable, parsing locally');
      }
    }

    // Direct Gemini parsing fallback
    if (GEMINI_API_KEY && data.resText) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `Extract structured case details from this distress plea: "${data.resText}".
Return a JSON object with:
- "Name": (string, extract the person's real name if mentioned)
- "Severity of domestic violence": ("Very High", "High", "Medium", or "Low")
- "Nature of domestic violence": (short phrase)
- "Contact": (phone number or contact info)
- "Current Situation": (summary)
- "Culprit Description": (culprit details)`;

        const res = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        });

        const parsed = JSON.parse(res.response.text());
        if (data.name && (!parsed.Name || parsed.Name === 'Survivor Report')) {
          parsed.Name = data.name;
        }
        return NextResponse.json({ decomposed: parsed }, { status: 200 });
      } catch (geminiErr) {
        console.warn('Gemini parse note (using structured extraction):', geminiErr);
      }
    }

    // Deterministic extraction ensuring user's actual entered name is preserved
    const decomposed = extractStructuredDetails(data.resText || '', data);

    return NextResponse.json(
      { decomposed },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Decompose failed:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to decompose data' },
      { status: 500 }
    );
  }
}
