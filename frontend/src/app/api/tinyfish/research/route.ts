import { NextResponse } from 'next/server';
import { tinyfishSearch, tinyfishFetch, getDomainFromUrl, CitedSource } from '@/lib/tinyfish';
import { stripPiiFromText } from '@/lib/pii-stripper';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawQuestion = body?.question || body?.userInput || '';

    if (!rawQuestion || typeof rawQuestion !== 'string' || !rawQuestion.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // 1. Strip PII before ANY outbound processing
    const cleanQuestion = stripPiiFromText(rawQuestion);

    // 2. Search TinyFish for official statutory / NGO / legal sources
    const searchResults = await tinyfishSearch(cleanQuestion, 'IN', 4);

    let sources: CitedSource[] = [];
    let extractedContext = '';

    if (searchResults && searchResults.length > 0) {
      const urlsToFetch = searchResults.map((r) => r.url).filter(Boolean);

      // 3. Parallel Batch Fetch top URLs (up to 4)
      const fetchResponse = await tinyfishFetch(urlsToFetch, 'markdown', 3600);
      const fetchedResults = fetchResponse?.results || [];

      // Build citations array
      sources = searchResults.map((sr) => {
        const matchingFetch = fetchedResults.find((f) => f.url === sr.url || f.final_url === sr.url);
        return {
          title: matchingFetch?.title || sr.title || 'Official Legal Source',
          url: sr.url,
          domain: getDomainFromUrl(sr.url),
          fetchedAt: new Date().toISOString(),
          snippet: sr.snippet,
        };
      });

      // Prepare context for LLM
      extractedContext = fetchedResults
        .filter((fr) => fr.text && fr.text.trim().length > 50)
        .slice(0, 3)
        .map((fr, idx) => `[Source ${idx + 1} - ${fr.title || fr.url}]:\n${fr.text?.slice(0, 1500)}`)
        .join('\n\n---\n\n');
    }

    // Default emergency fallback sources if search returned empty
    if (sources.length === 0) {
      sources = [
        {
          title: 'National Legal Services Authority (NALSA) - Free Legal Aid for Women',
          url: 'https://nalsa.gov.in/womens-assistance/',
          domain: 'nalsa.gov.in',
          fetchedAt: new Date().toISOString(),
          snippet: 'Mandatory free legal counsel and protection for women under Article 39A and NALSA Act.',
        },
        {
          title: 'Protection of Women from Domestic Violence Act (PWDVA) Guidelines',
          url: 'https://wcd.nic.in/act/protection-women-domestic-violence-act-2005',
          domain: 'wcd.nic.in',
          fetchedAt: new Date().toISOString(),
          snippet: 'Statutory emergency relief, shelter rights, maintenance, and protection orders.',
        },
      ];
    }

    // 4. Ground Answer with LLM
    let answer = '';

    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction: `You are SafeSpark LawBot, an empathetic, highly knowledgeable legal and crisis advisor for women, survivors, and citizens in distress in India.
Ground your response in the provided live legal sources and statutory frameworks (e.g. PWDVA 2005, IPC/BNS, POSH Act, IT Act, NALSA).
CRITICAL RULES:
1. Provide actionable legal rights, remedies (e.g. Protection Orders, Residence Orders, Zero FIR, Interim Relief), and contact numbers (112, 1091, 181, 1930).
2. Explicitly cite the sources provided in brackets, linking claims to official procedures.
3. Keep the tone compassionate, clear, dignified, and structured with Markdown headers and bullet points.
4. Include emergency helpline numbers at the end.`,
        });

        const prompt = `User Legal Query: "${cleanQuestion}"

${
  extractedContext
    ? `Live Verified Web Sources Fetched by TinyFish:\n${extractedContext}\n`
    : `Refer to official Indian statutory frameworks (PWDVA 2005, NALSA Free Legal Aid, IPC/BNS).`
}

Please provide an authoritative, cited, and empathetic legal answer based on these sources:`;

        const response = await model.generateContent(prompt);
        answer = response.response.text();
      } catch (geminiErr) {
        console.warn('Gemini invocation error in research route:', geminiErr);
      }
    }

    // Fallback if LLM unavailable
    if (!answer) {
      answer = `### Verified Legal Guidance & Statutory Rights

Based on verified statutory sources and legal precedents:

1. **Immediate Protection & Shelter:**
   - Under the **Protection of Women from Domestic Violence Act (PWDVA 2005)**, you have the enforceable right to remain in your shared household (Section 19 Residence Order).
   - Protection Officers are obligated to assist you with free medical aid, safe shelter home accommodation, and emergency orders without court delays.

2. **Zero FIR Rights:**
   - If you need police assistance, a **Zero FIR** can be lodged at *any* police station regardless of jurisdiction.
   - Statements from women must be recorded by or in the presence of a woman police officer.

3. **Free Legal Representation:**
   - Under **Section 12 of the Legal Services Authorities Act**, all women in India are legally entitled to **free and competent legal aid** regardless of financial status. You can dial NALSA helpline **15100**.

4. **24/7 National Emergency Helplines:**
   - **National Emergency Dispatch:** **112**
   - **Women Police Helpline:** **1091**
   - **Domestic Distress Helpline (Sakhi):** **181**
   - **National Cybercrime Helpline:** **1930**`;
    }

    return NextResponse.json({
      answer,
      sources,
      pagesRead: sources.length,
      disclaimer:
        'This information is provided for distress guidance and educational awareness under Indian legal frameworks. It does not constitute formal attorney-client advice.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('TinyFish Research API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to complete cited research',
        fallback: true,
      },
      { status: 500 }
    );
  }
}

