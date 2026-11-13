import { NextRequest, NextResponse } from 'next/server';
import { synthesizeSpeechWithGnani } from '@/lib/gnani';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_GUIDES: Record<string, Record<string, string>> = {
  '/create-post': {
    'hi-IN': 'इस पेज पर आप अपनी गुप्त संकट सूचना तैयार कर सकती हैं। अपनी स्थिति और हमलावर का विवरण लिखें। यह जानकारी साधारण फोटो के पिक्सेल में छिप जाएगी ताकि कोई देख न सके। 112 या 1091 पर भी संपर्क कर सकती हैं।',
    'en-IN': 'On this page, you can create a covert distress alert. Describe your situation and culprit. This will be encoded invisibly inside an ordinary picture. You can also dial 112 or 1091 anytime.',
    'ta-IN': 'இந்த பக்கத்தில் உங்கள் அவசர எச்சரிக்கையை உருவாக்கலாம். உங்கள் நிலை மற்றும் தாக்குபவர் விவரங்களை எழுதவும். இது சாதாரண புகைப்படத்தின் பிக்சல்களில் கண்ணுக்கு தெரியாமல் மறைக்கப்படும்.',
    'te-IN': 'ఈ పేజీలో మీరు మీ రహస్య అత్యవసర హెచ్చరికను సృష్టించవచ్చు. మీ పరిస్థితిని వివరించండి. ఇది సాధారణ ఫోటోలో దాచబడుతుంది.',
    'kn-IN': 'ಈ ಪುಟದಲ್ಲಿ ನೀವು ರಹಸ್ಯ ತುರ್ತು ಸಂದೇಶವನ್ನು ಸಿದ್ಧಪಡಿಸಬಹುದು. ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ. ಇದು ಸಾಮಾನ್ಯ ಫೋಟೋದೊಳಗೆ ರಹಸ್ಯವಾಗಿ ಅಡಗುತ್ತದೆ.',
    'bn-IN': 'এই পৃষ্ঠায় আপনি আপনার গোপন জরুরি সতর্কতা তৈরি করতে পারেন। আপনার পরিস্থিতি লিখুন। এটি একটি ছবির পিক্সেলের মধ্যে নিরাপদে লুকিয়ে থাকবে।',
    'mr-IN': 'या पानावर तुम्ही तुमची गुप्त आणीबाणी सूचना तयार करू शकता. तुमची परिस्थिती लिहा. ही माहिती सामान्य फोटोमध्ये अदृश्यपणे लपवली जाईल.',
  },
  '/lawbot': {
    'hi-IN': 'यहाँ आप घरेलू हिंसा अधिनियम 2005 और नए भारतीय न्याय संहिता के तहत अपने कानूनी अधिकार पूछ सकती हैं। पुलिस यदि एफआईआर न लिखे तो क्या करें, संरक्षण आदेश कैसे प्राप्त करें, यह सब आप जान सकती हैं।',
    'en-IN': 'Here you can ask about your legal rights under PWDVA 2005 and Bharatiya Nyaya Sanhita. Learn how to secure protection orders, residence rights, or action if police refuse an FIR.',
    'ta-IN': 'இங்கு குடும்ப வன்முறை சட்டம் 2005 மற்றும் பாரதீய நியாய சன்ஹிதா கீழ் உங்கள் சட்ட உரிமைகளை கேட்கலாம். பாதுகாப்பு ஆணைகள் பெறுவது பற்றி அறிந்து கொள்ளலாம்.',
    'te-IN': 'ఇక్కడ మీరు గృహ హింస చట్టం 2005 ప్రకారం మీ చట్టపరమైన హక్కులను అడగవచ్చు. రక్షణ ఉత్తర్వులు ఎలా పొందాలో తెలుసుకోండి.',
    'kn-IN': 'ಇಲ್ಲಿ ನೀವು ಕೌಟುಂಬಿಕ ಹಿಂಸಾಚಾರ ಕಾಯ್ದೆ 2005 ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಕಾನೂನು ಹಕ್ಕುಗಳನ್ನು ಕೇಳಬಹುದು.',
    'bn-IN': 'এখানে আপনি গার্হস্থ্য হিংসা আইন ২০০৫ এর অধীনে আপনার আইনি অধিকার সম্পর্কে জানতে পারেন।',
    'mr-IN': 'येथे तुम्ही कौटुंबिक हिंसाचार कायदा २००५ अंतर्गत तुमचे कायदेशीर हक्क विचारू शकता.',
  },
  '/directory': {
    'hi-IN': 'यह हेल्प डायरेक्टरी है। यहाँ भारत भर के वन स्टॉप सखी सेंटर, आश्रय गृह और मुफ्त कानूनी सहायता क्लीनिक सूचीबद्ध हैं। आप सीधे फोन मिला सकती हैं या सेल्फ-हील बटन दबाकर लाइव नंबर सत्यापित कर सकती हैं।',
    'en-IN': 'This is the verified Crisis Help Directory. Browse One-Stop Sakhi Centres, shelter homes, and free legal aid clinics across India. Tap any helpline to call directly.',
    'ta-IN': 'இது உதவி அடைவு. இந்தியா முழுவதும் உள்ள ஒன் ஸ்டாப் சகி மையங்கள் மற்றும் தங்குமிடங்களை இங்கே பார்க்கலாம். நேரடியாக அழைக்க தட்டவும்.',
    'te-IN': 'ఇది హెల్ప్ డైరెక్టరీ. భారతదేశం అంతటా ఉన్న వన్-స్టాప్ సఖి కేంద్రాలు మరియు ఆశ్రయాలను ఇక్కడ కనుగొనవచ్చు.',
    'kn-IN': 'ಇದು ಸಹಾಯ ಡೈರೆಕ್ಟರಿ. ಭಾರತದಾದ್ಯಂತ ಇರುವ ಸಖಿ ಕೇಂದ್ರಗಳು ಮತ್ತು ಆಶ್ರಯ ಮನೆಗಳನ್ನು ಇಲ್ಲಿ ಹುಡುಕಿ.',
    'bn-IN': 'এটি সাহায্য ডিরেক্টরি। ভারতজুড়ে ওয়ান-স্টপ সখী কেন্দ্র এবং আশ্রয় কেন্দ্রগুলি এখানে পাওয়া যাবে।',
    'mr-IN': 'ही हेल्प डिरेक्टरी आहे. संपूर्ण भारतातील वन स्टॉप सखी केंद्र आणि निवारा गृहे येथे उपलब्ध आहेत.',
  },
  '/assist': {
    'hi-IN': 'यह कम्प्लेंट असिस्ट पेज है। हमारा वेब एजेंट आपकी शिकायत का फॉर्म भर देगा। सुरक्षा के लिए, यह एजेंट अपने आप कभी सबमिट नहीं करेगा—अंतिम समीक्षा और पुष्टि आप स्वयं करेंगी।',
    'en-IN': 'This is Complaint Assist. Our web agent safely pre-fills your grievance draft. For safety, the agent will never submit automatically—you retain complete control to review and submit.',
    'ta-IN': 'இது புகார் உதவி பக்கம். எங்கள் வெப் ஏஜென்ட் உங்கள் புகார் படிவத்தை பாதுகாப்பாக நிரப்பும். நீங்கள் சரிபார்த்த பின்னரே சமர்ப்பிக்கப்படும்.',
    'te-IN': 'ఇది ఫిర్యాదు సహాయ పేజీ. మా వెబ్ ఏజెంట్ మీ ఫిర్యాదు ఫారమ్‌ను ముందే నింపుతుంది.',
    'kn-IN': 'ಇದು ದೂರು ಸಹಾಯ ಪುಟ. ನಮ್ಮ ವೆಬ್ ಏಜೆಂಟ್ ನಿಮ್ಮ ದೂರನ್ನು ಸಿದ್ಧಪಡಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    'bn-IN': 'এটি অভিযোগ সহায়তা পৃষ্ঠা। আমাদের ওয়েব এজেন্ট আপনার অভিযোগ খসড়া পূরণ করতে সহায়তা করবে।',
    'mr-IN': 'हे तक्रार सहाय्य पान आहे. आमचा वेब एजंट तुमचा तक्रार अर्ज भरण्यास मदत करेल.',
  },
  '/dashboard': {
    'hi-IN': 'यह अथॉरिटी कमांड डैशबोर्ड है। यहाँ प्राप्त गुप्त संकट संदेशों को डीकोड किया जाता है, आपातकालीन स्थिति जांची जाती है और लाइव कानूनी अपडेट्स देखे जा सकते हैं।',
    'en-IN': 'This is the Authority Incident Command Dashboard. Decoded distress dossiers, GPS coordinates, and real-time helpline watch alerts appear here.',
    'ta-IN': 'இது அதிகார கட்டளை டாஷ்போர்டு. பெறப்பட்ட அவசர எச்சரிக்கைகள் மற்றும் நேரடி சட்ட விழிப்பூட்டல்கள் இங்கு கண்காணிக்கப்படுகின்றன.',
    'te-IN': 'ఇది అధారిటీ కమాండ్ డాష్‌బోర్డ్. డీకోడ్ చేసిన అత్యవసర హెచ్చరికలను ఇక్కడ చూడవచ్చు.',
    'kn-IN': 'ಇದು ಕಮಾಂಡ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್. ರಹಸ್ಯ ತುರ್ತು ಸಂದೇಶಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
    'bn-IN': 'এটি কমান্ড ড্যাশবোর্ড। ডিকোড করা জরুরি সতর্কতাগুলি এখানে প্রদর্শিত হয়।',
    'mr-IN': 'हे कमांड डॅशबोर्ड आहे. डीकोड केलेल्या आणीबाणी सूचना येथे पाहता येतील.',
  },
};

export async function POST(req: NextRequest) {
  try {
    const { command = '', page = '/create-post', language = 'hi-IN' } = await req.json();

    // Normalize page path
    const matchedPath = Object.keys(PAGE_GUIDES).find((p) => page.includes(p)) || '/create-post';
    const pageGuideMap = PAGE_GUIDES[matchedPath] || PAGE_GUIDES['/create-post'];
    let guidanceText = pageGuideMap[language] || pageGuideMap['en-IN'] || pageGuideMap['hi-IN'];

    // If user asked a specific question in command
    const lowerCmd = (command || '').toLowerCase();
    if (lowerCmd.includes('112') || lowerCmd.includes('police') || lowerCmd.includes('पुलिस') || lowerCmd.includes('emergency')) {
      const emergencyResponses: Record<string, string> = {
        'hi-IN': 'आपातकाल में तुरंत 112 डायल करें। महिला हेल्पलाइन 1091 और घरेलू हिंसा सहायता 181 पर 24 घंटे उपलब्ध है।',
        'en-IN': 'In an emergency, dial 112 immediately. National Women Helpline is 1091, and Domestic Violence Crisis line is 181.',
        'ta-IN': 'அவசரத்திற்கு உடனடியாக 112 அழைக்கவும். பெண்கள் உதவி எண் 1091, குடும்ப வன்முறைக்கு 181.',
        'te-IN': 'అత్యవసర పరిస్థితిలో వెంటనే 112 డయల్ చేయండి. మహిళా హెల్ప్‌లైన్ 1091, గృహ హింస కోసం 181.',
        'kn-IN': 'ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ತಕ್ಷಣ 112 ಗೆ ಕರೆ ಮಾಡಿ. ಮಹಿಳಾ ಸಹಾಯವಾಣಿ 1091.',
        'bn-IN': 'জরুরি অবস্থায় অবিলম্বে 112 নম্বরে ডায়াল করুন। নারী হেল্পলাইন 1091।',
        'mr-IN': 'तातडीच्या प्रसंगी त्वरित 112 डायल करा. महिला हेल्पलाइन 1091 आणि कौटुंबिक मदतीसाठी 181.',
      };
      guidanceText = emergencyResponses[language] || emergencyResponses['en-IN'];
    }

    // Synthesize audio using Gnani AI TTS
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

