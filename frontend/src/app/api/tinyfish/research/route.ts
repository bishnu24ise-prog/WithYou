import { NextResponse } from 'next/server';
import { tinyfishSearch, tinyfishFetch, getDomainFromUrl, CitedSource } from '@/lib/tinyfish';
import { stripPiiFromText } from '@/lib/pii-stripper';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDetailedLegalResponse } from '@/lib/legal-knowledge';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const body = await req.json().catch(() => ({}));
    const rawQuestion = body?.question || body?.userInput || body?.message || '';

    if (!rawQuestion || typeof rawQuestion !== 'string' || !rawQuestion.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // 1. Strip PII before ANY outbound processing
    const cleanQuestion = stripPiiFromText(rawQuestion);

    // 2. Search TinyFish for official statutory / NGO / legal sources (max 2.5s)
    const searchResults = await tinyfishSearch(cleanQuestion, 'IN', 3);

    let sources: CitedSource[] = [];
    let extractedContext = '';

    if (searchResults && searchResults.length > 0) {
      const urlsToFetch = searchResults.map((r) => r.url).filter(Boolean);

      // Fast parallel fetch race (max 1.5s timeout)
      let fetchedResults: any[] = [];
      try {
        const fetchPromise = tinyfishFetch(urlsToFetch, 'markdown', 3600);
        const timeoutFetch = new Promise<{ results: any[] }>((resolve) =>
          setTimeout(() => resolve({ results: [] }), 1500)
        );
        const fetchResponse = await Promise.race([fetchPromise, timeoutFetch]);
        fetchedResults = fetchResponse?.results || [];
      } catch {
        // Fall back to snippets on timeout
      }

      // Build citations array
      sources = searchResults.map((sr) => {
        const matchingFetch = fetchedResults.find((f) => f.url === sr.url || f.final_url === sr.url);
        return {
          title: matchingFetch?.title || sr.title || 'Official Legal Source',
          url: sr.url,
          domain: getDomainFromUrl(sr.url),
          fetchedAt: new Date().toISOString(),
          snippet: matchingFetch?.description || sr.snippet,
        };
      });

      // Prepare context for LLM
      const contextItems = fetchedResults.filter((fr) => fr.text && fr.text.trim().length > 50);
      if (contextItems.length > 0) {
        extractedContext = contextItems
          .slice(0, 2)
          .map((fr, idx) => `[Source ${idx + 1} - ${fr.title || fr.url}]:\n${fr.text?.slice(0, 1000)}`)
          .join('\n\n---\n\n');
      } else {
        extractedContext = searchResults
          .map((sr, idx) => `[Source ${idx + 1} - ${sr.title} (${sr.site_name || 'gov.in'})]:\n${sr.snippet || sr.title}`)
          .join('\n\n---\n\n');
      }
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
        {
          title: 'National Commission for Women (NCW)',
          url: 'https://ncw.nic.in/',
          domain: 'ncw.nic.in',
          fetchedAt: new Date().toISOString(),
          snippet: 'Constitutional safeguards, complaints cell, and legal advisory.',
        },
      ];
    }

    // 3. Ground Answer with LLM (Race with 6.5s timeout)
    let answer = '';

    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction: `You are SafeSpark LawBot, an elite, trauma-informed legal advocate specializing in Indian constitutional, statutory, and criminal law protecting women, survivors, and citizens in distress.
You are powered by the TinyFish Legal Web Research Agent.

CRITICAL INSTRUCTION: Provide an EXHAUSTIVE, DEEPLY DETAILED, LONG-FORM legal advisory.
Do NOT give short, brief, or superficial summaries. The user needs comprehensive, step-by-step clarity to protect themselves legally and physically.

Format your response using structured Markdown:
1. ### ⚖️ Applicable Statutory Provisions & Exact Sections (Detail exact Acts: PWDVA 2005, Bharatiya Nyaya Sanhita (BNS) 2023 / IPC, POSH Act 2013, IT Act 2000, BNSS / CrPC, Legal Services Authorities Act 1987). Explain each section and its legal penalty clearly.
2. ### 📋 Step-by-Step Action Plan & Legal Procedures (What to do immediately in Hours 0-24, how to file a Zero FIR, how to approach Protection Officers for Form I / Domestic Incident Report, how to approach the Magistrate).
3. ### 🛡️ Protection Orders & Court Remedies (Detail Section 18 Protection Orders, Section 19 Residence Orders in shared household, Section 20 Maintenance, Section 21 Custody, and Section 23 Ex-Parte Interim Orders on affidavit).
4. ### 🔍 Evidence Collection & Documentation Checklist (Digital forensics, medical certificates/MLC, messages, financial records).
5. ### 🏛️ Free Legal Aid & Government Support Schemes (NALSA 15100 free advocate representation, Sakhi One Stop Centres 181, NCW 7827170170).
6. ### 📞 24/7 Verified Helplines & Emergency Contacts (112, 1091, 181, 1930).

Explicitly cite the TinyFish verified web sources in brackets [Source: domain.gov.in]. Keep the tone dignified, authoritative, and empowering.`,
        });

        const prompt = `User Legal Query: "${cleanQuestion}"

${
  extractedContext
    ? `Live Verified Web Sources Fetched by TinyFish Agent:\n${extractedContext}\n`
    : `Refer to official Indian statutory frameworks (PWDVA 2005, POSH Act 2013, BNS 2023 / IPC 498A, BNSS / CrPC Zero FIR, NALSA Free Legal Aid).`
}

Please provide an exhaustive, multi-section, and deeply detailed legal response based on these statutory frameworks and TinyFish live findings:`;

        const geminiPromise = model.generateContent(prompt);
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini generation timeout (6500ms exceeded)')), 6500)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const text = response?.response?.text();
        if (text && text.trim().length > 100) {
          answer = text;
        }
      } catch (geminiErr) {
        console.warn('Gemini fast timeout in research route (using high-depth statutory engine):', geminiErr);
      }
    }

    // Fallback if LLM unavailable or timed out
    if (!answer || answer.trim().length < 100) {
      answer = getDetailedLegalResponse(cleanQuestion, sources);
    }

    return NextResponse.json({
      answer,
      reply: answer,
      sources,
      pagesRead: sources.length,
      disclaimer:
        'This information is provided for distress guidance and educational awareness under Indian legal frameworks. It does not constitute formal attorney-client advice.',
      timestamp: new Date().toISOString(),
      agent: 'TinyFish Legal Web Research Agent',
      latency_ms: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error('TinyFish Research API error:', error);
    const fallback = getDetailedLegalResponse('emergency help');
    return NextResponse.json(
      {
        answer: fallback,
        reply: fallback,
        sources: [
          {
            title: 'National Legal Services Authority (NALSA) - Free Legal Aid for Women',
            url: 'https://nalsa.gov.in/womens-assistance/',
            domain: 'nalsa.gov.in',
            fetchedAt: new Date().toISOString(),
            snippet: 'Statutory mandate under Legal Services Authorities Act 1987 providing free legal counsel.',
          },
        ],
        pagesRead: 1,
        fallback: true,
        latency_ms: Date.now() - startTime,
      },
      { status: 200 }
    );
  }
}
