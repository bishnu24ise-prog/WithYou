import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

function getFallbackLegalOrTherapyResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('harass') || q.includes('workplace') || q.includes('posh') || q.includes('office')) {
    return `### Protection Against Workplace Harassment (POSH Act, 2013)

**Your Rights & Key Protections:**
1. **Internal Complaints Committee (ICC):** Every organization with 10 or more employees must have an ICC headed by a senior woman employee.
2. **Filing a Complaint:** You can file a written complaint to the ICC within 3 months of the incident (extendable by another 3 months upon reasonable grounds).
3. **Interim Relief:** While the inquiry is pending, you have the right to request a transfer, 3 months of paid leave (in addition to normal leave), or restraint on the respondent.
4. **Strict Confidentiality:** Section 16 of the POSH Act strictly forbids disclosing the identity of the complainant or witnesses.
5. **National Cyber Crime & Police Helpline:** Dial **1091** (Women Helpline) or **112** for emergency assistance.`;
  }

  if (q.includes('domestic') || q.includes('violence') || q.includes('abuse') || q.includes('husband') || q.includes('in-law')) {
    return `### Domestic Violence Protections (DV Act, 2005 & IPC 498A)

**Immediate Protections Available:**
1. **Protection Orders (Section 18):** Courts can prohibit the abuser from entering your workplace, communicating with you, or committing any form of violence.
2. **Residence Orders (Section 19):** You cannot be evicted from your shared household, regardless of whether you have legal ownership rights.
3. **Monetary Relief & Maintenance (Section 20 & Section 125 CrPC):** You and your children are entitled to financial support for medical expenses, loss of earnings, and maintenance.
4. **Emergency Contacts:**
   - **Women Helpline:** **1091** or **181**
   - **National Commission for Women (NCW):** **7827170170**
   - **Police Emergency:** **112**`;
  }

  if (q.includes('fir') || q.includes('police') || q.includes('complaint') || q.includes('station')) {
    return `### Zero FIR & Police Complaint Guidelines

**Essential Legal Rights for Women:**
1. **Zero FIR:** You can lodge an FIR at *any* police station regardless of jurisdictional boundaries; the police are mandated by law to register it and transfer it later.
2. **Female Officer Presence:** A woman cannot be called to a police station between sunset and sunrise. Statements must be recorded in the presence of a female officer or magistrate.
3. **Free Copy of FIR:** You have a legal right to receive a signed copy of the FIR free of cost immediately.
4. **Free Legal Aid:** Under Article 39A and the Legal Services Authorities Act (NALSA), women are entitled to free legal assistance. Dial **15100** for NALSA help.`;
  }

  if (q.includes('cyber') || q.includes('blackmail') || q.includes('stalk') || q.includes('photo') || q.includes('online')) {
    return `### Cyber Safety & Online Harassment

**Steps to Take Immediately:**
1. **Preserve Evidence:** Take full screenshots including URLs, phone numbers, handles, timestamps, and chat transcripts. Do not delete the messages.
2. **National Cybercrime Portal:** Report directly at **https://cybercrime.gov.in** or call **1930**.
3. **Relevant Laws:**
   - **Section 354D IPC:** Stalking (physical or digital monitoring) carries up to 3 years imprisonment.
   - **Section 66E / 67 IT Act:** Violation of bodily privacy and transmitting non-consensual imagery (up to 3–5 years imprisonment).`;
  }

  if (q.includes('anxious') || q.includes('panic') || q.includes('breathe') || q.includes('ground') || q.includes('fear') || q.includes('scared') || q.includes('stress')) {
    return `### You Are Safe Here — Grounding & Calming Guide

Take a slow, deep breath in through your nose for 4 seconds, hold gently for 4 seconds, and exhale slowly through your mouth for 6 seconds.

**5-4-3-2-1 Sensory Grounding Technique:**
- 👁️ **5 things you can see** around you right now
- ✋ **4 things you can physically touch** (your clothes, the table, your phone)
- 👂 **3 things you can hear**
- 👃 **2 things you can smell**
- 👅 **1 thing you can taste**

You are not alone, and your feelings are completely valid. When you are ready, share what is happening.`;
  }

  return `### SafeSpark Legal & Crisis Assistance

Thank you for reaching out. We are here to support your safety, dignity, and rights:

1. **Free Legal Assistance:** Every woman is entitled to free legal counsel under the Legal Services Authorities Act. You can contact NALSA at **15100**.
2. **Emergency Numbers:**
   - **Emergency Response Support System:** **112**
   - **Women in Distress Helpline:** **1091** or **181**
   - **Mental Health Helpline (KIRAN):** **1800-599-0019**
3. **Document Your Case:** Keep dated records, communication screenshots, medical reports, and identity documents in a secure digital space.

Please let me know if you would like specific steps regarding filing an FIR, workplace remedies, or finding local shelter and counseling support.`;
}

export async function POST(req: Request) {
  try {
    const { userInput } = await req.json();

    if (!userInput || !userInput.trim()) {
      return NextResponse.json({ reply: 'Please enter a message to receive support.' });
    }

    // Attempt Gemini 2.5 Flash
    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction:
            'You are LawBot & Therapy Assistant for SupportSafe, a legal and emotional support AI assisting women and survivors in distress. Provide empathetic, accurate, and actionable legal guidance based on Indian & international legal frameworks, and practical safety advice. Keep responses clear, compassionate, and structured in Markdown.',
        });

        const result = await model.generateContent(userInput);
        const text = result?.response?.text();
        if (text && text.trim()) {
          return NextResponse.json({ reply: text });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API notice (falling back gracefully):', geminiError?.message || geminiError);
      }
    }

    // Smart fallback ensures user never experiences a 500 error or blank screen
    const fallback = getFallbackLegalOrTherapyResponse(userInput);
    return NextResponse.json({ reply: fallback });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    const fallback = getFallbackLegalOrTherapyResponse('help');
    return NextResponse.json({ reply: fallback });
  }
}
