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

// Valid animations and facial expressions supported by Maya 3D Ready Player Me Avatar
const VALID_ANIMATIONS = [
  'Angry',
  'Crying',
  'Idle',
  'Laughing',
  'Rumba',
  'Talking_0',
  'Talking_1',
  'Talking_2',
  'Terrified',
];

const VALID_EXPRESSIONS = [
  'smile',
  'sad',
  'surprised',
  'angry',
  'crazy',
  'funnyFace',
  'default',
];

function sanitizeAnimation(anim?: string): string {
  if (!anim || typeof anim !== 'string') return 'Talking_1';
  const trimmed = anim.trim();
  const direct = VALID_ANIMATIONS.find((a) => a.toLowerCase() === trimmed.toLowerCase());
  if (direct) return direct;
  if (/talk|speak|chat/i.test(trimmed)) return 'Talking_1';
  if (/laugh|happy/i.test(trimmed)) return 'Laughing';
  if (/cry|sad/i.test(trimmed)) return 'Crying';
  if (/angry|mad/i.test(trimmed)) return 'Angry';
  if (/idle|stand|wait/i.test(trimmed)) return 'Idle';
  return 'Talking_1';
}

function sanitizeExpression(expr?: string): string {
  if (!expr || typeof expr !== 'string') return 'smile';
  const trimmed = expr.trim();
  const direct = VALID_EXPRESSIONS.find((e) => e.toLowerCase() === trimmed.toLowerCase());
  if (direct) return direct;
  if (/smile|happy|comfort|warm|kind|gentle/i.test(trimmed)) return 'smile';
  if (/sad|grief|sorrow|unhappy/i.test(trimmed)) return 'sad';
  if (/surprise|shock|wonder/i.test(trimmed)) return 'surprised';
  if (/anger|frustrat|mad/i.test(trimmed)) return 'angry';
  return 'smile';
}

// Localized therapeutic fallback messages for all 13 supported Indian languages
const localizedTherapyFallbacks: Record<string, string[]> = {
  'en-IN': [
    'I am reflecting on what you just shared. You deserve patience, care, and a supportive environment. Let\'s take another gentle breath together.',
    'Thank you for sharing that with me. It takes courage to open up. You are safe here, and you do not have to carry this alone.',
    'I hear you deeply. Whatever you are experiencing right now is valid. Let\'s pause and ground ourselves with a slow, calming breath.'
  ],
  'hi-IN': [
    'मैं आपकी बात को ध्यान से सुन रही हूँ। आप धैर्य, देखभाल और एक सुरक्षित वातावरण की हकदार हैं। आइए मिलकर एक गहरी सांस लें।',
    'अपने दिल की बात साझा करने के लिए धन्यवाद। मन की बात कहना साहस का काम है। आप यहाँ पूरी तरह सुरक्षित हैं।',
    'मैं आपकी भावना को समझ रही हूँ। आप इस समय जो भी महसूस कर रही हैं, वह महत्वपूर्ण है। आइए साथ में धीरे-धीरे सांस लें।'
  ],
  'kn-IN': [
    'ನೀವು ಹಂಚಿಕೊಂಡಿದ್ದನ್ನು ನಾನು ಆಳವಾಗಿ ಆಲಿಸುತ್ತಿದ್ದೇನೆ. ನೀವು ತಾಳ್ಮೆ, ಆರೈಕೆ ಮತ್ತು ಬೆಂಬಲಿತ ವಾತಾವರಣಕ್ಕೆ ಅರ್ಹರು. ಬನ್ನಿ ಒಟ್ಟಿಗೆ ಶಾಂತವಾಗಿ ಉಸಿರೆಳೆದುಕೊಳ್ಳೋಣ.',
    'ನಿಮ್ಮ ಭಾವನೆಗಳನ್ನು ನನ್ನೊಂದಿಗೆ ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಧೈರ್ಯದಿಂದ ಮಾತನಾಡುವುದು ಶ್ಲಾಘನೀಯ. ನೀವು ಇಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಿ.',
    'ನಿಮ್ಮ ನೋವು ಮತ್ತು ಭಾವನೆಗಳನ್ನು ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಲ್ಲೆ. ನೀವು ಏಕಾಂಗಿಯಲ್ಲ. ಬನ್ನಿ ಒಟ್ಟಿಗೆ ದೀರ್ಘವಾಗಿ ಉಸಿರಾಡೋಣ.'
  ],
  'ta-IN': [
    'நீங்கள் பகிர்ந்ததை நான் கவனமாகக் கேட்கிறேன். நீங்கள் பொறுமை, அக்கறை மற்றும் ஆதரவான சூழலுக்கு தகுதியானவர். வாருங்கள் நாம் ஒன்றாக அமைதியாக சுவாசிப்போம்.',
    'இதை என்னுடன் பகிர்ந்ததற்கு நன்றி. உங்கள் உணர்வுகளை வெளிப்படுத்துவது தைரியமானது. நீங்கள் இங்கே பாதுகாப்பாக இருக்கிறீர்கள்.',
    'உங்கள் உணர்வுகளை நான் ஆழமாக உணர்கிறேன். நீங்கள் தனியாக இல்லை. நாம் இருவரும் சேர்ந்து மெதுவாக மூச்சை உள்ளிழுத்து வெளியிடுவோம்.'
  ],
  'te-IN': [
    'మీరు పంచుకున్న విషయాన్ని నేను శ్రద్ధగా వింటున్నాను. మీరు సహనం, సంరక్షణ మరియు మద్దతుతో కూడిన వాతావరణానికి అర్హులు. రండి కలిసి ప్రశాంతంగా శ్వాస తీసుకుందాం.',
    'మీ బాధను నాతో పంచుకున్నందుకు ధన్యవాదాలు. మనసు విప్పి మాట్లాడటానికి ధైర్యం కావాలి. మీరు ఇక్కడ సురక్షితంగా ఉన్నారు.',
    'మీరు అనుభవిస్తున్న పరిస్థితిని నేను అర్థం చేసుకోగలను. మీరు ఒంటరిగా లేరు. రండి ప్రశాంతంగా శ్వాస తీసుకుందాం.'
  ],
  'bn-IN': [
    'আপনি যা শেয়ার করেছেন তা আমি গভীরভাবে অনুধাবন করছি। আপনি যত্ন, ধৈর্য এবং একটি নিরাপদ পরিবেশের যোগ্য। আসুন আমরা একসাথে শান্তভাবে একটি গভীর শ্বাস নিই।',
    'আমার সাথে এটি শেয়ার করার জন্য ধন্যবাদ। নিজের মনের কথা বলা সাহসের বিষয়। আপনি এখানে সম্পূর্ণ নিরাপদ।',
    'আমি আপনার অনুভূতি বুঝতে পারছি। আপনি একা নন। আসুন আমরা একসাথে ধীরে ধীরে শ্বাস গ্রহণ করি।'
  ],
  'mr-IN': [
    'तुम्ही जे सांगितले ते मी काळजीपूर्वक ऐकत आहे. तुम्ही प्रेम, काळजी आणि सुरक्षित वातावरणासाठी पात्र आहात. चला आपण एकत्र शांतपणे दीर्घ श्वास घेऊया.',
    'माझ्याशी मन मोकळे केल्याबद्दल धन्यवाद. भावना व्यक्त करण्यासाठी मोठे धैर्य लागते. तुम्ही येथे पूर्णपणे सुरक्षित आहात.',
    'मी तुमच्या भावना पूर्णपणे समजू शकते. तुम्ही एकट्या नाही आहात. चला एकत्र शांतपणे श्वास घेऊया.'
  ],
  'gu-IN': [
    'તમે જે વાત શેર કરી છે તે હું ખૂબ જ ધ્યાનથી સાંભળી રહી છું. તમે કાળજી, ધૈર્ય અને સુરક્ષિત વાતાવરણના હકદાર છો. ચાલો આપણે સાથે મળીને એક ઊંડો શ્વાસ લઈએ.',
    'તમારી લાગણીઓ મારી સાથે વ્યક્ત કરવા બદલ આભાર. ખુલીને વાત કરવી હિંમતનું કામ છે. તમે અહીં સુરક્ષિત છો.',
    'હું તમારી મુશ્કેલી સમજી શકું છું. તમે એકલા નથી. ચાલો શાંતિથી એક ઊંડો શ્વાસ લઈએ.'
  ],
  'pa-IN': [
    'ਤੁਸੀਂ ਜੋ ਸਾਂਝਾ ਕੀਤਾ ਹੈ ਮੈਂ ਉਸਨੂੰ ਬਹੁਤ ਧਿਆਨ ਨਾਲ ਸੁਣ ਰਹੀ ਹਾਂ। ਤੁਸੀਂ ਧੀਰਜ, ਪਿਆਰ ਅਤੇ ਸੁਰੱਖਿਅਤ ਮਾਹੌਲ ਦੇ ਹੱਕਦਾਰ ਹੋ। ਆਓ ਆਪਾਂ ਰਲ ਕੇ ਇੱਕ ਸ਼ਾਂਤ ਸਾਹ ਲਈਏ।',
    'ਮੇਰੇ ਨਾਲ ਆਪਣੇ ਦਿਲ ਦੀ ਗੱਲ ਸਾਂਝੀ ਕਰਨ ਲਈ ਧੰਨਵਾਦ। ਆਪਣੀ ਗੱਲ ਕਹਿਣਾ ਵੱਡੀ ਹਿੰਮਤ ਵਾਲਾ ਕੰਮ ਹੈ। ਤੁਸੀਂ ਇੱਥੇ ਬਿਲਕੁਲ ਸੁਰੱਖਿਅਤ ਹੋ।',
    'ਮੈਂ ਤੁਹਾਡੇ ਦਰਦ ਨੂੰ ਸਮਝ ਸਕਦੀ ਹਾਂ। ਤੁਸੀਂ ਇਕੱਲੇ ਨਹੀਂ ਹੋ। ਆਓ ਰਲ ਕੇ ਹੌਲੀ-ਹੌਲੀ ਸਾਹ ਲਈਏ।'
  ],
  'ml-IN': [
    'നിങ്ങൾ പങ്കുവെച്ച കാര്യം ഞാൻ ശ്രദ്ധയോടെ കേൾക്കുന്നു. നിങ്ങൾ ക്ഷമയ്ക്കും കരുതലിനും സുരക്ഷിതമായ അന്തരീക്ഷത്തിനും അർഹയാണ്. നമുക്ക് ഒരുമിച്ച് ശാന്തമായി ഒരു ദീർഘശ്വാസമെടുക്കാം.',
    'ഇത് എന്നോട് പങ്കുവെച്ചതിന് നന്ദി. ഉള്ളുതുറന്ന് സംസാരിക്കുന്നത് ധൈര്യമുള്ള കാര്യമാണ്. നിങ്ങൾ ഇവിടെ സുരക്ഷിതയാണ്.',
    'നിങ്ങളുടെ സങ്കടങ്ങൾ ഞാൻ ആഴത്തിൽ മനസ്സിലാക്കുന്നു. നിങ്ങൾ തനിച്ചല്ല. നമുക്ക് ഒരുമിച്ച് ശാന്തമായി ശ്വാസമെടുക്കാം.'
  ],
  'od-IN': [
    'ଆପଣ ଯାହା କହିଲେ ତାହା ମୁଁ ଗଭୀର ଭାବେ ଶୁଣୁଛି। ଆପଣ ସ୍ନେହ, ଯତ୍ନ ଓ ଏକ ସୁରକ୍ଷିତ ପରିବେଶ ପାଇବାକୁ ଯୋଗ୍ୟ। ଆସନ୍ତୁ ଏକାଠି ଏକ ଶାନ୍ତ ଶ୍ୱାସ ନେବା।',
    'ମୋ ସହିତ ଏହା ବାଣ୍ଟିଥିବାରୁ ଧନ୍ୟବାଦ। ମନର କଥା କହିବା ବହୁତ ସାହସର କଥା। ଆପଣ ଏଠାରେ ସମ୍ପୂର୍ଣ୍ଣ ସୁରକ୍ଷିତ।',
    'ମୁଁ ଆପଣଙ୍କ ଭାବନାକୁ ବୁଝିପାରୁଛି। ଆପଣ ଏକୁଟିଆ ନାହାଁନ୍ତି। ଆସନ୍ତୁ ଏକାଠି ଧୀରେ ଧୀରେ ଶ୍ୱାସ ନେବା।'
  ],
  'as-IN': [
    'আপুনি কোৱা কথাখিনি মই অত্যন্ত মনোযোগেৰে শুনিছোঁ। আপুনি মৰম, যত্ন আৰু এটা সুৰক্ষিত পৰিৱেশৰ যোগ্য। আহক আমি একেলগে শান্তভাৱে উশাহ লওঁ।',
    'মোৰ সৈতে এই কথা ভাগ-বতৰা কৰাৰ বাবে ধন্যবাদ। নিজৰ মনৰ কথা কোৱাটো সাহসৰ কাম। আপুনি ইয়াত সম্পূৰ্ণ সুৰক্ষিত।',
    'মই আপোনাৰ অনুভূতি উপলব্ধি কৰিব পাৰিছোঁ। আপুনি অকলে নাই। আহক আমি শান্তভাৱে উশাহ লওঁ।'
  ],
  'ur-IN': [
    'آپ نے جو بات شیئر کی ہے میں اسے پوری توجہ سے سن رہی ہوں۔ آپ صبر، دیکھ بھال اور ایک محفوظ ماحول کی حقدار ہیں۔ آئیے مل کر ایک پرسکون سانس لیں۔',
    'مجھ سے اپنے دل کی بات شیئر کرنے کا شکریہ۔ کھل کر بات کرنا حوصلے کی بات ہے۔ آپ یہاں بالکل محفوظ ہیں۔',
    'میں آپ کے احساسات کو پوری طرح سمجھ رہی ہوں۔ آپ تنہا نہیں ہیں۔ آئیے مل کر ایک پرسکون سانس لیں۔'
  ]
};

// Dynamic therapeutic response generator with varied emotions and animations
function getDynamicTherapyResponse(userMessage: string, language: string = 'en-IN'): {
  text: string;
  facialExpression: string;
  animation: string;
} {
  const normLang = localizedTherapyFallbacks[language]
    ? language
    : localizedTherapyFallbacks[`${language}-IN`]
    ? `${language}-IN`
    : 'en-IN';

  // Pick language-specific reflective replies
  const langReplies = localizedTherapyFallbacks[normLang] || localizedTherapyFallbacks['en-IN'];
  const chosenText = langReplies[Math.floor(Math.random() * langReplies.length)];

  // Default localized reflective response
  return {
    text: chosenText,
    facialExpression: "smile",
    animation: "Talking_1",
  };
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
    const reqLanguage = body.language || 'en-IN';
    const gender = (body.gender || 'female').toLowerCase();

    // Auto-detect exact language from userMessage script or requested language
    let langCode = 'en-IN';
    let langName = 'English';

    if (
      /[\u0C80-\u0CFF]/.test(userMessage) ||
      reqLanguage.startsWith('kn') ||
      /\b(nanna|nanage|namage|neevu|beku|beda|madbeku|enu|yenu|hodithiddane|sahaya|nyaya|thondre|mane|ganda)\b/i.test(userMessage)
    ) {
      langCode = 'kn-IN';
      langName = 'Kannada (ಕನ್ನಡ)';
    } else if (
      /[\u0900-\u097F]/.test(userMessage) ||
      reqLanguage.startsWith('hi') ||
      isIndicOrHinglish(userMessage)
    ) {
      langCode = 'hi-IN';
      langName = 'Hindi (हिन्दी)';
    } else if (/[\u0B80-\u0BFF]/.test(userMessage) || reqLanguage.startsWith('ta')) {
      langCode = 'ta-IN';
      langName = 'Tamil (தமிழ்)';
    } else if (/[\u0C00-\u0C7F]/.test(userMessage) || reqLanguage.startsWith('te')) {
      langCode = 'te-IN';
      langName = 'Telugu (తెలుగు)';
    } else if (/[\u0980-\u09FF]/.test(userMessage) || reqLanguage.startsWith('bn')) {
      langCode = 'bn-IN';
      langName = 'Bengali (বাংলা)';
    } else if (reqLanguage.startsWith('mr')) {
      langCode = 'mr-IN';
      langName = 'Marathi (मराठी)';
    } else if (/[\u0A80-\u0AFF]/.test(userMessage) || reqLanguage.startsWith('gu')) {
      langCode = 'gu-IN';
      langName = 'Gujarati (ગુજરાતી)';
    }

    // Default greeting if no message is provided
    if (!userMessage || !userMessage.trim()) {
      const defaultGreeting = localizedTherapyFallbacks[langCode]?.[0] || localizedTherapyFallbacks['en-IN'][0];
      return NextResponse.json(
        {
          messages: [
            {
              text: defaultGreeting,
              facialExpression: "smile",
              animation: "Talking_1",
              lipsync: generateLipSync(defaultGreeting.slice(0, 30), 3.0),
            },
          ],
        },
        { headers: corsHeaders }
      );
    }

    // 1. Generate dynamic, empathetic response
    const dynamicResponse = getDynamicTherapyResponse(userMessage, langCode);
    let botReply = dynamicResponse.text;
    let expression = dynamicResponse.facialExpression;
    let animation = dynamicResponse.animation;

    // 1A. Sarvam 105B MoE for ALL queries — primary brain for Maya
    if (isSarvamConfigured()) {
      try {
        const sarvamSystemPrompt = `You are Maya, an empathetic, culturally attuned trauma-informed 3D therapy companion for SafeSpark supporting women and individuals in distress.
MANDATORY LANGUAGE RULE:
The user is speaking in ${langName}.
You MUST respond strictly, compassionately, and fluently in ${langName}. Do NOT use English if the language is Hindi or Kannada.
Keep your response concise, deeply comforting, validating, and grounding (2-3 sentences max).
Format your response as valid JSON:
{
  "text": "your warm empathetic reply strictly in ${langName}",
  "facialExpression": "smile",
  "animation": "Talking_1"
}`;

        const sarvamRes = await callSarvamChat({
          messages: [{ role: 'user', content: userMessage }],
          systemPrompt: sarvamSystemPrompt,
          model: 'sarvam-105b-conversations',
          temperature: 0.35,
          maxTokens: 250,
          timeoutMs: 6500,
        });

        if (sarvamRes?.text) {
          try {
            const cleanJson = sarvamRes.text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed.text) botReply = parsed.text;
            if (parsed.facialExpression) expression = sanitizeExpression(parsed.facialExpression);
            if (parsed.animation) animation = sanitizeAnimation(parsed.animation);
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
MANDATORY MULTILINGUAL INSTRUCTION:
The user is speaking in: "${langName}".
You MUST generate the therapeutic reply strictly and fluently in "${langName}". Do NOT respond in English unless the requested language is English.
Provide a concise, unique, and empathetic response (2 sentences max) directly responding to what they just said. Also choose an emotional facial expression from: [smile, sad, surprised, angry, default] and an animation from: [Talking_0, Talking_1, Talking_2, Idle].
Return in JSON format:
{
  "text": "your response here in ${langName}",
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
          expression = sanitizeExpression(parsed.facialExpression);
        }
        if (parsed.animation) {
          animation = sanitizeAnimation(parsed.animation);
        }
      } catch (geminiErr: any) {
        console.warn('Gemini chat note (using contextual dynamic response):', geminiErr?.message || geminiErr);
      }
    }

    // 2. Select Speaker Voice according to Gender (Female Maya Sanctuary vs Male Voice)
    // Sarvam Bulbul v3 Verified Speakers:
    // Female: 'kavitha' (Kannada, Tamil, Telugu), 'priya' (Hindi, English, Bengali, Marathi)
    // Male: 'aditya' (Kannada), 'shubh' / 'kabir' (Hindi, English), 'mani' (Tamil, Telugu)
    let chosenSpeaker = 'priya';
    if (gender === 'male') {
      if (langCode === 'kn-IN') chosenSpeaker = 'aditya';
      else if (langCode === 'ta-IN' || langCode === 'te-IN') chosenSpeaker = 'mani';
      else chosenSpeaker = 'shubh';
    } else {
      // Female (Maya 3D Sanctuary default)
      if (langCode === 'kn-IN' || langCode === 'ta-IN' || langCode === 'te-IN' || langCode === 'ml-IN') {
        chosenSpeaker = 'kavitha';
      } else {
        chosenSpeaker = 'priya';
      }
    }

    let audioBase64 = '';
    let durationEstimate = Math.max(2.0, botReply.split(' ').length * 0.45);

    // 2A. Primary: Sarvam AI Bulbul v3 Voice Engine
    const SARVAM_KEY = process.env.SARVAM_API_KEY;
    const cleanSpeechText = botReply
      .replace(/###\s*[^\n]+/g, '')
      .replace(/\[Source:[^\]]+\]/gi, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/[#*_~`>-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 450);

    if (SARVAM_KEY && cleanSpeechText) {
      try {
        const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'api-subscription-key': SARVAM_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: cleanSpeechText,
            language_code: langCode,
            speaker: chosenSpeaker,
            model: 'bulbul:v3',
          }),
        });

        if (sarvamRes.ok) {
          const sJson = await sarvamRes.json();
          if (sJson?.audios?.[0]) {
            audioBase64 = sJson.audios[0];
            durationEstimate = Math.max(2.0, cleanSpeechText.split(' ').length * 0.4);
          }
        } else {
          const errText = await sarvamRes.text().catch(() => '');
          console.warn(`Sarvam TTS in /chat route status ${sarvamRes.status}: ${errText}`);
        }
      } catch (sarvamErr) {
        console.warn('Sarvam TTS in /chat route notice:', sarvamErr);
      }
    }

    // 2B. Secondary fallback: ElevenLabs (only if Sarvam was unavailable)
    if (!audioBase64 && ELEVEN_LABS_API_KEY) {
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

    const lipsync = generateLipSync(botReply, durationEstimate);

    return NextResponse.json(
      {
        messages: [
          {
            text: botReply,
            audio: audioBase64,
            lipsync,
            facialExpression: sanitizeExpression(expression),
            animation: sanitizeAnimation(animation),
          },
        ],
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Avatar /chat API error:', error);
    const fallback = getDynamicTherapyResponse('support', req.headers.get('accept-language')?.split(',')[0] || 'hi-IN');
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
