import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { callSarvamChat, isIndicOrHinglish, isSarvamConfigured } from '@/lib/sarvam';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const VOICE_ID = 'cgSgspJ2msm6clMCkdW9'; // Compassionate female voice

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Helper to generate natural mouth cues for 3D avatar lipsync
function generateLipSync(text: string, durationSeconds: number) {
  const cues: { start: number; end: number; value: string }[] = [];
  const phonemes = ['B', 'C', 'D', 'E', 'F', 'X'];
  let current = 0;

  cues.push({ start: 0, end: 0.05, value: 'X' });
  current = 0.05;

  while (current < durationSeconds - 0.1) {
    const nextVal = phonemes[Math.floor(Math.random() * phonemes.length)];
    const len = 0.08 + Math.random() * 0.1;
    const end = Math.min(current + len, durationSeconds - 0.05);
    cues.push({
      start: Number(current.toFixed(2)),
      end: Number(end.toFixed(2)),
      value: nextVal,
    });
    current = end;
  }

  cues.push({
    start: Number(current.toFixed(2)),
    end: Number(durationSeconds.toFixed(2)),
    value: 'X',
  });

  return {
    metadata: { duration: Number(durationSeconds.toFixed(2)) },
    mouthCues: cues,
  };
}

// Dynamic therapeutic response generator with varied emotions and animations
function getDynamicTherapyResponse(userMessage: string): {
  text: string;
  facialExpression: string;
  animation: string;
} {
  const q = userMessage.toLowerCase().trim();

  // 1. Greetings & Introductions
  if (q.match(/\b(hi|hello|hey|greetings|morning|evening|maya|who are you|what can you do)\b/)) {
    const greetings = [
      {
        text: "Hello there! I am Maya, your 3D Therapy Assistant. Whatever is weighing on your mind, I am here with an open heart to listen and support you.",
        facialExpression: "smile",
        animation: "Talking_1",
      },
      {
        text: "Hi, I am so glad you reached out today. Take a gentle, deep breath, and know that you are in a safe, confidential space with me.",
        facialExpression: "smile",
        animation: "Talking_0",
      },
      {
        text: "Hello! Welcome to our sanctuary. You don't have to carry anything alone here. How can I support your well-being right now?",
        facialExpression: "smile",
        animation: "Talking_2",
      },
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // 2. Anxiety, Fear & Panic
  if (q.match(/\b(anxious|anxiety|scared|fear|panic|shaking|nervous|terrified|heart racing|freaking)\b/)) {
    const anxietyReplies = [
      {
        text: "I hear how intense the anxiety feels right now. Place one hand gently over your chest, feel your feet on the ground, and remember this feeling will pass.",
        facialExpression: "smile",
        animation: "Talking_0",
      },
      {
        text: "Anxiety can feel overwhelming, but you are physically safe right here with me. Let's slow down together and take three long, calming breaths.",
        facialExpression: "smile",
        animation: "Talking_1",
      },
      {
        text: "Your body is responding to fear, but you are strong and you are not alone. Focus gently on the sound of my voice as we find your center.",
        facialExpression: "smile",
        animation: "Talking_2",
      },
    ];
    return anxietyReplies[Math.floor(Math.random() * anxietyReplies.length)];
  }

  // 3. Breathing & Grounding
  if (q.match(/\b(breath|breathe|breathing|ground|grounding|calm|exercise|relax|meditate)\b/)) {
    const breathReplies = [
      {
        text: "Let's breathe together. Breathe in deeply through your nose for 4 counts, hold gently for 4, and release slowly through your mouth for 6 counts.",
        facialExpression: "smile",
        animation: "Talking_1",
      },
      {
        text: "Let's try a quick grounding sensory check: notice 3 things you can see around you, and feel the solid surface beneath your hands. You are right here, safe.",
        facialExpression: "smile",
        animation: "Talking_0",
      },
      {
        text: "Release any tension in your forehead and let your shoulders drop away from your ears. Take a soft, natural breath and allow your body to relax.",
        facialExpression: "smile",
        animation: "Talking_2",
      },
    ];
    return breathReplies[Math.floor(Math.random() * breathReplies.length)];
  }

  // 4. Sadness, Loneliness & Depression
  if (q.match(/\b(sad|crying|cry|tears|depressed|depression|alone|lonely|hopeless|hurting|empty|broken)\b/)) {
    const sadReplies = [
      {
        text: "I hear the deep sadness in your words, and it is completely okay to cry. Your emotions are valid, and you deserve gentleness and understanding.",
        facialExpression: "sad",
        animation: "Talking_0",
      },
      {
        text: "Even when things feel dark and lonely, please know that you are not forgotten. I am right here with you, holding this safe space for your heart.",
        facialExpression: "smile",
        animation: "Talking_1",
      },
      {
        text: "It takes tremendous strength to feel this deeply. Please be patient with yourself today, and remember that brighter moments will come.",
        facialExpression: "smile",
        animation: "Talking_2",
      },
    ];
    return sadReplies[Math.floor(Math.random() * sadReplies.length)];
  }

  // 5. Overwhelmed & Burnout
  if (q.match(/\b(overwhelmed|stressed|stress|too much|pressure|burnout|tired|exhausted|give up|can't take)\b/)) {
    const stressReplies = [
      {
        text: "It sounds like you have been carrying far too much weight on your shoulders. Give yourself permission to pause and lay that burden down for a while.",
        facialExpression: "smile",
        animation: "Talking_1",
      },
      {
        text: "When everything feels like too much, we don't have to solve it all today. Just focus on this single moment and taking one small step at a time.",
        facialExpression: "smile",
        animation: "Talking_0",
      },
      {
        text: "You are allowed to rest without feeling guilty. What is the one thing causing the most pressure right now? We can unpack it together.",
        facialExpression: "smile",
        animation: "Talking_2",
      },
    ];
    return stressReplies[Math.floor(Math.random() * stressReplies.length)];
  }

  // 6. Danger, Violence & Emergency
  if (q.match(/\b(danger|hit|hurt|abuse|abused|violence|threat|threatened|unsafe|locked|police|emergency|kill|weapon)\b/)) {
    return {
      text: "Your physical safety is the highest priority. If you are in immediate danger, please dial 112 or the Women Helpline at 1091 right away so emergency responders can assist you.",
      facialExpression: "surprised",
      animation: "Talking_1",
    };
  }

  // 7. Legal Rights & Guidance
  if (q.match(/\b(law|legal|rights|court|fir|complaint|posh|harassment|husband|in-laws|divorce)\b/)) {
    const legalReplies = [
      {
        text: "You are fully protected under laws like the Protection of Women from Domestic Violence Act and POSH regulations. You also have the right to free legal aid through NALSA.",
        facialExpression: "smile",
        animation: "Talking_1",
      },
      {
        text: "Remember that you can file a Zero FIR at any police station regardless of jurisdiction. You are legally entitled to receive a copy of your complaint immediately.",
        facialExpression: "smile",
        animation: "Talking_0",
      },
    ];
    return legalReplies[Math.floor(Math.random() * legalReplies.length)];
  }

  // 8. General & Reflective Conversations
  const generalReplies = [
    {
      text: `I hear what you are saying about "${userMessage.substring(0, 40)}". You are expressing yourself clearly, and I am listening with complete attention.`,
      facialExpression: "smile",
      animation: "Talking_0",
    },
    {
      text: "Thank you for sharing that with me. It takes courage to open up. Tell me more about how you are feeling in your body as you talk about this.",
      facialExpression: "smile",
      animation: "Talking_1",
    },
    {
      text: "I am reflecting on what you just shared. You deserve patience, care, and a supportive environment. Let's take another gentle breath together.",
      facialExpression: "smile",
      animation: "Talking_2",
    },
  ];
  return generalReplies[Math.floor(Math.random() * generalReplies.length)];
}

export async function GET() {
  return NextResponse.json(
    {
      messages: [
        {
          text: "Hello, I am Maya, your 3D Therapy Assistant. How can I support your well-being today?",
          facialExpression: "smile",
          animation: "Talking_1",
          lipsync: generateLipSync("Hello, I am Maya", 3.0),
        },
      ],
    },
    { headers: corsHeaders }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userMessage = body.message;
    const language = body.language || 'en-IN';

    // Default greeting if no message is provided
    if (!userMessage || !userMessage.trim()) {
      return NextResponse.json(
        {
          messages: [
            {
              text: "Hello! I am Maya, your 3D Therapy Assistant. Take a deep, gentle breath, and tell me how you are feeling.",
              facialExpression: "smile",
              animation: "Talking_1",
              lipsync: generateLipSync("Hello, I am Maya", 3.0),
            },
          ],
        },
        { headers: corsHeaders }
      );
    }

    // 1. Generate dynamic, empathetic response
    // First, compute an intelligent contextual response based on user input
    const dynamicResponse = getDynamicTherapyResponse(userMessage);
    let botReply = dynamicResponse.text;
    let expression = dynamicResponse.facialExpression;
    let animation = dynamicResponse.animation;

    // 1A. Sarvam 105B MoE for ALL queries — primary brain for Maya
    if (isSarvamConfigured()) {
      try {
        const sarvamSystemPrompt = `You are Maya, an empathetic, trauma-informed 3D therapy companion for SafeSpark supporting women in distress.
Respond directly to the user in their language (${isIndicOrHinglish(userMessage) ? 'warm conversational Hindi/Hinglish' : 'warm empathetic English'}).
Keep your response concise, compassionate, and validating (2-3 sentences max).
Format your response as valid JSON:
{
  "text": "your warm empathetic reply here",
  "facialExpression": "smile",
  "animation": "Talking_1"
}`;

        const sarvamRes = await callSarvamChat({
          messages: [{ role: 'user', content: userMessage }],
          systemPrompt: sarvamSystemPrompt,
          model: 'sarvam-105b-conversations',
          temperature: 0.4,
          maxTokens: 250,
          timeoutMs: 5000,
        });

        if (sarvamRes?.text) {
          try {
            const cleanJson = sarvamRes.text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed.text) botReply = parsed.text;
            if (parsed.facialExpression) expression = parsed.facialExpression;
            if (parsed.animation) animation = parsed.animation;
          } catch {
            botReply = sarvamRes.text;
            expression = 'smile';
            animation = 'Talking_1';
          }
        }
      } catch (sarvamErr: any) {
        console.warn('Sarvam Maya chat notice:', sarvamErr?.message || sarvamErr);
      }
    }

    // 1B. If Gemini API is available and Sarvam didn't run or query is English
    if (botReply === dynamicResponse.text && GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `You are Maya, a compassionate, trauma-informed 3D therapy avatar providing emotional support and safety guidance to women in distress. The user says: "${userMessage}".
Provide a concise, unique, and empathetic response (2 sentences max) directly responding to what they just said. Also choose an emotional facial expression from: [smile, sad, surprised, angry, default] and an animation from: [Talking_0, Talking_1, Talking_2, Idle].
Return in JSON format:
{
  "text": "your response here",
  "facialExpression": "smile",
  "animation": "Talking_1"
}`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        });

        const parsed = JSON.parse(result.response.text());
        if (parsed.text && parsed.text.trim()) {
          botReply = parsed.text;
        }
        if (parsed.facialExpression) {
          expression = parsed.facialExpression;
        }
        if (parsed.animation) {
          animation = parsed.animation;
        }
      } catch (geminiErr: any) {
        console.warn('Gemini chat note (using contextual dynamic response):', geminiErr?.message || geminiErr);
      }
    }

    // 2. Generate Voice with ElevenLabs
    let audioBase64 = '';
    let durationEstimate = Math.max(2.0, botReply.split(' ').length * 0.45);

    if (ELEVEN_LABS_API_KEY) {
      try {
        const voiceRes = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': ELEVEN_LABS_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: botReply,
              model_id: 'eleven_multilingual_v2',
            }),
          }
        );

        if (voiceRes.ok) {
          const buffer = await voiceRes.arrayBuffer();
          audioBase64 = Buffer.from(buffer).toString('base64');
          durationEstimate = Math.max(1.5, buffer.byteLength / 16000);
        }
      } catch (voiceErr) {
        console.warn('Avatar voice error:', voiceErr);
      }
    }

    // 2b. Sarvam AI Text-to-Speech (Bulbul v3 for Indic Languages)
    const SARVAM_KEY = process.env.SARVAM_API_KEY;
    if (!audioBase64 && SARVAM_KEY) {
      try {
        const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'api-subscription-key': SARVAM_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: botReply.slice(0, 500),
            language_code: language || 'en-IN',
            model: process.env.SARVAM_TTS_MODEL || 'bulbul:v3',
            speaker: 'shubh',
            audio_format: 'mp3',
          }),
        });
        if (sarvamRes.ok) {
          const sJson = await sarvamRes.json();
          if (sJson?.audios?.[0]) {
            audioBase64 = sJson.audios[0];
            durationEstimate = Math.max(2.0, botReply.split(' ').length * 0.4);
          }
        }
      } catch (sarvamErr) {
        console.warn('Sarvam TTS in /chat route notice:', sarvamErr);
      }
    }

    const lipsync = generateLipSync(botReply, durationEstimate);

    return NextResponse.json(
      {
        messages: [
          {
            text: botReply,
            audio: audioBase64,
            lipsync,
            facialExpression: expression,
            animation,
          },
        ],
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Avatar /chat API error:', error);
    const fallback = getDynamicTherapyResponse('support');
    return NextResponse.json(
      {
        messages: [
          {
            text: fallback.text,
            facialExpression: fallback.facialExpression,
            animation: fallback.animation,
            lipsync: generateLipSync(fallback.text, 3.0),
          },
        ],
      },
      { status: 200, headers: corsHeaders }
    );
  }
}
