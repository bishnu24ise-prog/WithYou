import { NextRequest, NextResponse } from 'next/server';
import { synthesizeSpeechWithGnani } from '@/lib/gnani';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_GUIDES: Record<string, Record<string, string>> = {
  '/': {
    'hi-IN': 'सेफस्पार्क में आपका स्वागत है। यह महिलाओं की सुरक्षा और आपातकालीन सहायता के लिए आपका सुरक्षित मंच है। यहाँ से आप गुप्त संकट संदेश भेज सकती हैं, कानूनी अधिकार जान सकती हैं, या पास के पुलिस स्टेशन और वन स्टॉप सखी सेंटर ढूंढ सकती हैं।',
    'en-IN': 'Welcome to SafeSpark. This is your secure platform for women safety and emergency support. From here, you can create covert distress alerts, consult our AI legal advisor, or find nearby police stations and One-Stop Sakhi Centres.',
    'ta-IN': 'SafeSpark-க்கு வரவேற்கிறோம். இது பெண்கள் பாதுகாப்பு மற்றும் அவசர உதவிக்கான பாதுகாப்பான தளமாகும். இங்கிருந்து நீங்கள் ரகசிய அவசர எச்சரிக்கைகளை அனுப்பலாம், சட்ட உரிமைகளை அறியலாம், அல்லது அருகிலுள்ள உதவி மையங்களை கண்டறியலாம்.',
    'te-IN': 'SafeSpark కు స్వాగతం. ఇది మహిళల భద్రత మరియు అత్యవసర సహాయం కోసం మీ సురక్షిత వేదిక. ఇక్కడ నుండి మీరు అత్యవసర హెచ్చరికలను పంపవచ్చు మరియు సమీపంలోని రక్షణ కేంద్రాలను కనుగొనవచ్చు.',
    'kn-IN': 'SafeSpark ಗೆ ಸುಸ್ವಾಗತ. ಇದು ಮಹಿಳೆಯರ ಸುರಕ್ಷತೆ ಮತ್ತು ತುರ್ತು ನೆರವಿಗಾಗಿ ನಿಮ್ಮ ರಕ್ಷಾ ಕವಚವಾಗಿದೆ. ಇಲ್ಲಿ ನೀವು ತುರ್ತು ಸಂದೇಶ ಕಳುಹಿಸಬಹುದು ಮತ್ತು ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆಗಳನ್ನು ಹುಡುಕಬಹುದು.',
    'bn-IN': 'SafeSpark-এ আপনাকে স্বাগতম। এটি নারী নিরাপত্তা ও জরুরি সহায়তার একটি বিশ্বস্ত প্ল্যাটফর্ম। এখান থেকে আপনি গোপন সতর্কতা পাঠাতে পারেন এবং নিকটস্থ সাহায্য কেন্দ্র খুঁজে পেতে পারেন।',
    'mr-IN': 'SafeSpark मध्ये आपले स्वागत आहे. हे महिलांच्या सुरक्षेसाठी आणि आणीबाणीच्या मदतीसाठी सुरक्षित व्यासपीठ आहे. येथून तुम्ही गुप्त संकट संदेश पाठवू शकता आणि जवळची मदत केंद्रे शोधू शकता.',
    'gu-IN': 'સેફસ્પાર્કમાં તમારું સ્વાગત છે. આ મહિલા સુરક્ષા અને કટોકટી સહાય માટેનું તમારું વિશ્વસનીય મંચ છે. અહીંથી તમે ગુપ્ત કટોકટી સંદેશ મોકલી શકો છો અને નજીકના મદદ કેન્દ્રો શોધી શકો છો.',
    'pa-IN': 'ਸੇਫ਼ਸਪਾਰਕ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਇਹ ਔਰਤਾਂ ਦੀ ਸੁਰੱਖਿਆ ਅਤੇ ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ ਲਈ ਭਰੋਸੇਯੋਗ ਪਲੇਟਫਾਰਮ ਹੈ। ਇੱਥੋਂ ਤੁਸੀਂ ਗੁਪਤ ਐਮਰਜੈਂਸੀ ਅਲਰਟ ਭੇਜ ਸਕਦੇ ਹੋ ਅਤੇ ਨੇੜਲੇ ਮਦਦ ਕੇਂਦਰ ਲੱਭ ਸਕਦੇ ਹੋ।',
    'ml-IN': 'സേഫ്സ്പാർക്കിലേക്ക് സ്വാഗതം. ഇത് സ്ത്രീ സുരക്ഷയ്ക്കും അടിയന്തര സഹായത്തിനുമുള്ള സുരക്ഷിത പ്ലാറ്റ്‌ഫോമാണ്. ഇവിടെ നിന്ന് നിങ്ങൾക്ക് രഹസ്യ അടിയന്തര മുന്നറിയിപ്പുകൾ നൽകാം.',
    'od-IN': 'SafeSpark କୁ ସ୍ୱାଗତ। ଏହା ମହିଳା ସୁରକ୍ଷା ଓ ଜରୁରୀ ସହାୟତା ପାଇଁ ଆପଣଙ୍କ ବିଶ୍ୱସ୍ତ ମଞ୍ଚ। ଏଠାରୁ ଆପଣ ଗୁପ୍ତ ସତର୍କତା ବାର୍ତ୍ତା ପଠାଇ ପାରିବେ।',
    'as-IN': 'SafeSpark লৈ স্বাগতম। এইটো মহিলাৰ সুৰক্ষা আৰু জৰুৰীকালীন সহায়ৰ বাবে আপোনাৰ নিৰ্ভৰযোগ্য মঞ্চ। ইয়াৰ পৰা আপুনি গোপন জৰুৰী সংকেত প্ৰেৰণ কৰিব পাৰে।',
    'ur-IN': 'سیف سپارک میں خوش آمدید۔ یہ خواتین کے تحفظ اور ہنگامی مدد کا محفوظ پلیٹ فارم ہے۔ یہاں سے آپ خفیہ ہنگامی الرٹ بھیج سکتے ہیں اور قریبی مراکز تلاش کر سکتے ہیں۔',
  },
  '/create-post': {
    'hi-IN': 'इस पेज पर आप अपनी गुप्त संकट सूचना तैयार कर सकती हैं। अपनी स्थिति और हमलावर का विवरण लिखें। यह जानकारी साधारण फोटो के पिक्सेल में छिप जाएगी ताकि कोई देख न सके। 112 या 1091 पर भी तुरंत कॉल कर सकती हैं।',
    'en-IN': 'On this page, you can create a covert distress alert. Describe your situation and culprit. This will be encoded invisibly inside an ordinary picture so no one can detect it. You can also dial 112 or 1091 anytime.',
    'ta-IN': 'இந்த பக்கத்தில் உங்கள் அவசர எச்சரிக்கையை உருவாக்கலாம். உங்கள் நிலை மற்றும் தாக்குபவர் விவரங்களை எழுதவும். இது சாதாரண புகைப்படத்தின் பிக்சல்களில் கண்ணுக்கு தெரியாமல் மறைக்கப்படும்.',
    'te-IN': 'ఈ పేజీలో మీరు మీ రహస్య అత్యవసర హెచ్చరికను సృಷ್ಟించవచ్చు. మీ పరిస్థితిని వివరించండి. ఇది సాధారణ ఫోటోలో దాచబడుతుంది.',
    'kn-IN': 'ಈ ಪುಟದಲ್ಲಿ ನೀವು ರಹಸ್ಯ ತುರ್ತು ಸಂದೇಶವನ್ನು ಸಿದ್ಧಪಡಿಸಬಹುದು. ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ. ಇದು ಸಾಮಾನ್ಯ ಫೋಟೋದೊಳಗೆ ರಹಸ್ಯವಾಗಿ ಅಡಗುತ್ತದೆ.',
    'bn-IN': 'এই পৃষ্ঠায় আপনি আপনার গোপন জরুরি সতর্কতা তৈরি করতে পারেন। আপনার পরিস্থিতি লিখুন। এটি একটি ছবির পিক্সেলের মধ্যে নিরাপদে লুকিয়ে থাকবে।',
    'mr-IN': 'या पानावर तुम्ही तुमची गुप्त आणीबाणी सूचना तयार करू शकता. तुमची परिस्थिती लिहा. ही माहिती सामान्य फोटोमध्ये अदृश्यपणे लपवली जाईल.',
  },
  '/lawbot': {
    'hi-IN': 'यहाँ आप घरेलू हिंसा अधिनियम 2005 और नए भारतीय न्याय संहिता के तहत अपने कानूनी अधिकार पूछ सकती हैं। पुलिस यदि एफआईआर न लिखे तो क्या करें, संरक्षण आदेश कैसे प्राप्त करें, यह सब आप अपनी भाषा में जान सकती हैं।',
    'en-IN': 'Here you can ask about your legal rights under PWDVA 2005 and Bharatiya Nyaya Sanhita. Learn how to secure court protection orders, residence rights, or legal steps if police refuse an FIR.',
    'ta-IN': 'இங்கு குடும்ப வன்முறை சட்டம் 2005 மற்றும் பாரதீய நியாய சன்ஹிதா கீழ் உங்கள் சட்ட உரிமைகளை கேட்கலாம். பாதுகாப்பு ஆணைகள் பெறுவது பற்றி அறிந்து கொள்ளலாம்.',
    'te-IN': 'ఇక్కడ మీరు గృహ హింస చట్టం 2005 ప్రకారం మీ చట్టపరమైన హక్కులను అడగవచ్చు. రక్షణ ఉత్తర్వులు ఎలా పొందాలో తెలుసుకోండి.',
    'kn-IN': 'ಇಲ್ಲಿ ನೀವು ಕೌಟುಂಬಿಕ ಹಿಂಸಾಚಾರ ಕಾಯ್ದೆ 2005 ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಕಾನೂನು ಹಕ್ಕುಗಳನ್ನು ಕೇಳಬಹುದು.',
    'bn-IN': 'এখানে আপনি গার্হস্থ্য হিংসা আইন ২০০৫ এর অধীনে আপনার আইনি অধিকার সম্পর্কে জানতে পারেন।',
    'mr-IN': 'येथे तुम्ही कौटुंबिक हिंसाचार कायदा २००५ अंतर्गत तुमचे कायदेशीर हक्क विचारू शकता.',
  },
  '/directory': {
    'hi-IN': 'यह हेल्प डायरेक्टरी है। यहाँ आपके निकटतम वन स्टॉप सखी सेंटर, महिला पुलिस थाने, आश्रय गृह और मुफ्त कानूनी सहायता केंद्र लाइव दूरी और दिशा के साथ उपलब्ध हैं। आप सीधे फोन मिला सकती हैं या मैप्स पर रास्ता देख सकती हैं।',
    'en-IN': 'This is the verified Crisis Help Directory. Find your nearest One-Stop Sakhi Centres, women police stations, shelters, and free legal aid clinics with live distance calculations and direct Google Maps directions.',
    'ta-IN': 'இது உதவி அடைவு. இந்தியா முழுவதும் உள்ள ஒன் ஸ்டாப் சகி மையங்கள், காவல் நிலையங்கள் மற்றும் தங்குமிடங்களை தூரத்துடன் இங்கே பார்க்கலாம். நேரடியாக அழைக்க தட்டவும்.',
    'te-IN': 'ఇది హెల్ప్ డైరెక్టరీ. భారతదేశం అంతటా ఉన్న వన్-స్టాప్ సఖి కేంద్రాలు, పోలీస్ స్టేషన్లు మరియు ఆశ్రయాలను ఇక్కడ కనుగొనవచ్చు.',
    'kn-IN': 'ಇದು ಸಹಾಯ ಡೈರೆಕ್ಟರಿ. ಭಾರತದಾದ್ಯಂತ ಇರುವ ಸಖಿ ಕೇಂದ್ರಗಳು, ಪೊಲೀಸ್ ಠಾಣೆಗಳು ಮತ್ತು ಆಶ್ರಯ ಮನೆಗಳನ್ನು ಇಲ್ಲಿ ಹುಡುಕಿ.',
    'bn-IN': 'এটি সাহায্য ডিরেক্টরি। আপনার কাছাকাছি ওয়ান-স্টপ সখী কেন্দ্র, থানা এবং আশ্রয় কেন্দ্রগুলি এখানে পাওয়া যাবে।',
    'mr-IN': 'ही हेल्प डिरेक्टरी आहे. संपूर्ण भारतातील वन स्टॉप सखी केंद्र, पोलीस ठाणे आणि निवारा गृहे येथे उपलब्ध आहेत.',
  },
  '/assist': {
    'hi-IN': 'यह कम्प्लेंट असिस्ट पेज है। हमारा वेब एजेंट राष्ट्रीय महिला आयोग या राज्य पोर्टल के लिए आपकी शिकायत का फॉर्म सुरक्षित रूप से तैयार कर देगा। अंतिम पुष्टि और समीक्षा हमेशा आप स्वयं करेंगी।',
    'en-IN': 'This is Complaint Assist. Our autonomous web agent safely pre-fills your grievance draft for portals like NCW. For safety, the agent will never submit without your explicit review and confirmation.',
    'ta-IN': 'இது புகார் உதவி பக்கம். எங்கள் வெப் ஏஜென்ட் உங்கள் புகார் படிவத்தை பாதுகாப்பாக நிரப்பும். நீங்கள் சரிபார்த்த பின்னரே சமர்ப்பிக்கப்படும்.',
    'te-IN': 'ఇది ఫిర్యాదు సహాయ పేజీ. మా వెబ్ ఏజెంట్ మీ ఫిర్యాదు ఫారమ్‌ను ముందే నింపుతుంది. మీ ధృవీకరణ తర్వాతే సమర్పించబడుతుంది.',
    'kn-IN': 'ಇದು ದೂರು ಸಹಾಯ ಪುಟ. ನಮ್ಮ ವೆಬ್ ಏಜೆಂಟ್ ನಿಮ್ಮ ದೂರನ್ನು ಸಿದ್ಧಪಡಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    'bn-IN': 'এটি অভিযোগ সহায়তা পৃষ্ঠা। আমাদের ওয়েব এজেন্ট আপনার অভিযোগ খসড়া পূরণ করতে সহায়তা করবে।',
    'mr-IN': 'हे तक्रार सहाय्य पान आहे. आमचा वेब एजंट तुमचा तक्रार अर्ज भरण्यास मदत करेल.',
  },
  '/therapybot': {
    'hi-IN': 'यह सेंक्चुअरी थेरेपी कंपेनियन पेज है। यहाँ 3D एआई साथी माया आपकी बात सुनने, तनाव कम करने और गहरी साँस 4-7-8 तकनीक लेने में आपका मार्गदर्शन करने के लिए तैयार है।',
    'en-IN': 'This is the Sanctuary Therapy Companion. Here, our 3D AI companion Maya is ready to listen without judgment, guide you through calming 4-7-8 breathwork, and help you de-escalate anxiety in real time.',
    'ta-IN': 'இது அமைதியான சிகிச்சை துணை பக்கம். இங்கு 3D AI தோழி மாயா உங்கள் உணர்வுகளைக் கேட்கவும், பதற்றத்தைக் குறைக்கவும் தயாராக உள்ளார்.',
    'te-IN': 'ఇది శాంక్చువరీ థెరపీ పేజీ. ఇక్కడ 3D AI సహచరి మాయ మీ భావాలను వినడానికి మరియు ఒత్తిడిని తగ్గించడానికి సిద్ధంగా ఉంది.',
    'kn-IN': 'ಇದು ಸಾಂಕ್ಚುರಿ ಥೆರಪಿ ಪುಟ. ಇಲ್ಲಿ 3D AI ಒಡನಾಡಿ ಮಾಯಾ ನಿಮ್ಮ ಆತಂಕವನ್ನು ಶಮನಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    'bn-IN': 'এটি স্যাঙ্কচুয়ারি থেরাপি সঙ্গী পৃষ্ঠা। এখানে 3D এআই মায়া আপনার কথা শুনতে এবং মানসিক চাপ কমাতে সহায়তা করবে।',
    'mr-IN': 'हे सँक्चुअरी थेरपी कंपेनियन पेज आहे. येथे 3D AI साथीदार माया तुमचे ऐकण्यासाठी आणि मानसिक ताण कमी करण्यासाठी उपस्थित आहे.',
  },
  '/dashboard': {
    'hi-IN': 'यह अथॉरिटी कमांड डैशबोर्ड है। यहाँ प्राप्त गुप्त संकट संदेशों को डीकोड किया जाता है, आपातकालीन स्थिति जांची जाती है और लाइव कानूनी अपडेट्स देखे जा सकते हैं।',
    'en-IN': 'This is the Authority Incident Command Dashboard. Decoded distress dossiers, GPS coordinates, and real-time helpline watch alerts appear here.',
    'ta-IN': 'இது அதிகார கட்டளை டாஷ்போர்டு. பெறப்பட்ட அவசர எச்சரிக்கைகள் மற்றும் நேரடி சட்ட விழிப்பூட்டல்கள் இங்கு கண்காணிக்கப்படுகின்றன.',
    'te-IN': 'ఇది అధారిటీ కమాండ్ డాష్‌బోర్డ్. డీకోడ్ చేసిన అత్యవసర హెచ్చరికలను ఇక్కడ చూడవచ్చు.',
    'kn-IN': 'ಇದು ಕಮಾಂಡ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್. ರಹಸ್ಯ ತುರ್ತು ಸಂದೇಶಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
    'bn-IN': 'এটি কমান্ড ড্যাশবোর্ড। ডিকোড করা জরুরি সতর্কতাগুলি এখানে প্রদর্শित হয়।',
    'mr-IN': 'हे कमांड डॅशबोर्ड आहे. डीकोड केलेल्या आणीबाणी सूचना येथे पाहता येतील.',
  },
};

export async function POST(req: NextRequest) {
  try {
    const { command = '', page = '/', language = 'hi-IN' } = await req.json();

    // Normalize page path: strip locale prefix like /hi-IN or /en-IN
    const cleanedPage = page.replace(/^\/[a-z]{2}-[A-Z]{2}/, '') || '/';

    // Find best match in PAGE_GUIDES
    let matchedPath = '/';
    if (cleanedPage.includes('/create-post')) matchedPath = '/create-post';
    else if (cleanedPage.includes('/lawbot')) matchedPath = '/lawbot';
    else if (cleanedPage.includes('/directory')) matchedPath = '/directory';
    else if (cleanedPage.includes('/assist')) matchedPath = '/assist';
    else if (cleanedPage.includes('/therapybot')) matchedPath = '/therapybot';
    else if (cleanedPage.includes('/dashboard')) matchedPath = '/dashboard';
    else matchedPath = '/';

    const pageGuideMap = PAGE_GUIDES[matchedPath] || PAGE_GUIDES['/'];
    let guidanceText = pageGuideMap[language] || pageGuideMap['en-IN'] || pageGuideMap['hi-IN'];

    // Check if user asked a specific question in command
    const lowerCmd = (command || '').toLowerCase();
    if (
      lowerCmd.includes('112') ||
      lowerCmd.includes('police') ||
      lowerCmd.includes('पुलिस') ||
      lowerCmd.includes('emergency') ||
      lowerCmd.includes('danger') ||
      lowerCmd.includes('खतरा')
    ) {
      const emergencyResponses: Record<string, string> = {
        'hi-IN': 'आपातकाल में तुरंत 112 डायल करें। राष्ट्रीय महिला हेल्पलाइन 1091 और घरेलू हिंसा सहायता 181 पर चौबीसों घंटे मुफ्त उपलब्ध है।',
        'en-IN': 'In an emergency, dial 112 immediately. National Women Helpline is 1091, and Domestic Violence Crisis line is 181 available 24/7.',
        'ta-IN': 'அவசரத்திற்கு உடனடியாக 112 அழைக்கவும். பெண்கள் உதவி எண் 1091, குடும்ப வன்முறைக்கு 181.',
        'te-IN': 'అత్యవసర పరిస్థితిలో వెంటనే 112 డయల్ చేయండి. మహిళా హెల్ప్‌లైన్ 1091, గృహ హింస కోసం 181.',
        'kn-IN': 'ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ತಕ್ಷಣ 112 ಗೆ ಕರೆ ಮಾಡಿ. ಮಹಿಳಾ ಸಹಾಯವಾಣಿ 1091.',
        'bn-IN': 'জরুরি অবস্থায় অবিলম্বে 112 নম্বরে ডায়াল করুন। নারী হেল্পলাইন 1091।',
        'mr-IN': 'तातडीच्या प्रसंगी त्वरित 112 डायल करा. महिला हेल्पलाइन 1091 आणि कौटुंबिक मदतीसाठी 181.',
      };
      guidanceText = emergencyResponses[language] || emergencyResponses['en-IN'];
    } else if (
      lowerCmd.includes('hide') ||
      lowerCmd.includes('photo') ||
      lowerCmd.includes('steganography') ||
      lowerCmd.includes('गुप्त') ||
      lowerCmd.includes('छुपा')
    ) {
      const covertResponses: Record<string, string> = {
        'hi-IN': 'क्रिएट पोस्ट पेज पर जाकर आप अपनी गुप्त सूचना को किसी भी आम तस्वीर के अंदर छुपा सकती हैं। यह स्टेग्नोग्राफी तकनीक से पूरी तरह सुरक्षित रहता है।',
        'en-IN': 'Visit the Create Post page to hide your distress message securely inside an ordinary image using steganography. It remains completely invisible to intruders.',
        'ta-IN': 'கிரியேட் போஸ்ட் பக்கத்திற்குச் சென்று உங்கள் செய்தியை புகைப்படத்தில் மறைக்கலாம்.',
        'te-IN': 'క్రియేట్ పోస్ట్ పేజీకి వెళ్లి మీ సందేశాన్ని ఫోటోలో భద్రంగా దాచవచ్చు.',
        'kn-IN': 'ಕ್ರಿಯೇಟ್ ಪೋಸ್ಟ್ ಪುಟಕ್ಕೆ ಹೋಗಿ ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಫೋಟೋದಲ್ಲಿ ಮರೆಮಾಡಬಹುದು.',
        'bn-IN': 'ক্রিয়েট পোস্ট পৃষ্ঠায় গিয়ে আপনি একটি ছবির মধ্যে আপনার বার্তা গোপন করতে পারেন।',
        'mr-IN': 'क्रिएट पोस्ट पानावर जाऊन तुम्ही तुमचा संदेश फोटोमध्ये सुरक्षितपणे लपवू शकता.',
      };
      guidanceText = covertResponses[language] || covertResponses['en-IN'];
    }

    // Synthesize audio using Gnani AI Timbre v2.5 TTS
    let audioBase64: string | null = null;
    try {
      const audioBuffer = await synthesizeSpeechWithGnani(guidanceText, language, 'Nalini', 1.0);
      audioBase64 = Buffer.from(audioBuffer).toString('base64');
    } catch (ttsErr) {
      console.warn('Gnani TTS synthesis failed, returning text guidance:', ttsErr);
    }

    return NextResponse.json({
      success: true,
      guidanceText,
      language,
      page: matchedPath,
      audioBase64,
    });
  } catch (error: any) {
    console.error('Error in /api/gnani/guide:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate voice guidance.',
      },
      { status: 500 }
    );
  }
}
