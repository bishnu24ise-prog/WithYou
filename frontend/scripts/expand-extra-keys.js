const fs = require('fs');
const path = require('path');

const locales = [
  'en-IN', 'hi-IN', 'bn-IN', 'ta-IN', 'te-IN', 'kn-IN',
  'ml-IN', 'mr-IN', 'gu-IN', 'pa-IN', 'od-IN', 'as-IN', 'ur-IN'
];

const langsDir = path.join(__dirname, 'langs');

const newTranslations = {
  'en-IN': {
    auth: {
      quickLogin: 'Instant 1-Click Login',
    },
    lawbot: {
      defaultLegalReply: 'Under Indian statutory frameworks (PWDVA 2005 and BNS), you have immediate rights to protection orders, safe shelter, and free legal aid. Emergency: dial 112 or 1091.',
    },
    assist: {
      step1Init: 'Initializing TinyFish Web Agent in stealth browser sandbox...',
      step2Analyze: 'Analyzing portal DOM: Women & Children Grievance reporting form found.',
      step3PreFill: 'Pre-filling incident draft from LawBot summary (PII scrubbed)...',
      step4SafetyHalt: '🛡️ SAFETY HALT ACTIVATED: Agent paused before final submission / CAPTCHA. Never submits.',
      step5Complete: 'Draft pre-filled successfully! Handing over full control to human complainant.',
      toastDraftReady: 'Complaint Assist draft ready for your review! 🛡️',
      stepUserStopped: 'Agent stopped by user command.',
      toastHalted: 'Agent automation halted.',
    },
    therapy: {
      quickGroundingPrompt: 'Can you guide me through a 2-minute calming breath exercise?',
      quickUrgentPrompt: 'I feel in danger right now. What safety steps should I follow immediately?',
    },
    voiceGuide: {
      tapToListenAloud: '🔊 Tap Here to Listen Aloud in {lang}',
      qHowToUse: 'How to use this page?',
      diagnosticChecking: 'Verifying api.vachana.ai Timbre v2.5 voice synthesis...',
      diagnosticOperational: 'Gnani AI Operational ({ms}ms)',
    },
    directory: {
      hrsRoundTheClock: '24/7 Round the Clock',
      hrsOfficeHours: '10:00 AM - 5:00 PM (Helpline 24/7)',
      addrMalviya: 'Malviya Nagar, New Delhi 110017',
      addrConnaught: 'Parliament Street, Connaught Place, New Delhi 110001',
      addrSafdarjung: 'Safdarjung Hospital Campus, Ring Road, New Delhi 110029',
      addrPatialaHouse: 'Central Office, Patiala House Courts Complex, New Delhi 110001',
      addrSgmh: 'SGM Hospital Premises, Mangolpuri, New Delhi 110083',
      addrMumbaiCrawford: 'Mumbai Police Commissionerate, Crawford Market, Mumbai 400001',
      addrMumbaiBkc: 'BKC Police Station Complex, Bandra East, Mumbai 400051',
      addrMumbaiKem: 'King Edward Memorial Hospital Campus, Parel, Mumbai 400012',
      addrMumbaiDharavi: 'Urban Health Centre, 60 Feet Road, Dharavi, Mumbai 400017',
      addrMumbaiFort: 'High Court Annex, Fort, Mumbai 400032',
      addrBengaluruInfantry: 'Police Commissioner Office, Infantry Road, Bengaluru 560001',
      addrBengaluruBowring: 'Bowring Hospital Premises, Shivaji Nagar, Bengaluru 560001',
      addrBengaluruHalasuru: 'Halasuru Gate Police Station Complex, Bengaluru 560002',
      addrBengaluruSiddaiah: 'Nyaya Degula, 1st Floor, Siddaiah Road, Bengaluru 560027',
      addrHyderabadPurani: 'Near Old Commissioner Office, Purani Haveli, Hyderabad 500004',
      addrHyderabadOsmania: 'Osmania Hospital Campus, Afzal Gunj, Hyderabad 500012',
      addrHyderabadBegumpet: 'Police Lines, Begumpet, Hyderabad 500016',
      addrChennaiGreams: 'Greams Road, Thousand Lights, Chennai 600006',
      addrChennaiTriplicane: 'Government Kasturba Gandhi Hospital, Triplicane, Chennai 600005',
      addrKolkataLalbazar: 'Lalbazar Police HQ, 18 Lalbazar Street, Kolkata 700001',
      addrKolkataCollege: '88 College Street, College Square, Kolkata 700073',
      addrPuneCamp: 'Pune Police Commissioner Office, Camp, Pune 411001',
      addrJaipurGandhinagar: 'Police Lines, Gandhinagar, Jaipur 302015',
      addrLucknowHazratganj: 'Hazratganj Police Station Complex, Lucknow 226001',
      addrJasola: 'Plot 21, Jasola Institutional Area, New Delhi 110025',
      addrJamnagar: 'Jamnagar House, Shahjahan Road, New Delhi 110011',
    },
    marquee: {
      tapToFlip: 'Click to flip',
      source: 'Source',
      howSafeSparkResponds: 'SafeSpark Response',
      flipBack: 'Flip back',
    }
  },
  'hi-IN': {
    marquee: {
      tapToFlip: 'पलटने के लिए क्लिक करें',
      source: 'स्रोत',
      howSafeSparkResponds: 'SafeSpark समाधान',
      flipBack: 'वापस पलटें',
    },
    auth: {
      quickLogin: 'तुरंत 1-क्लिक लॉगिन',
    },
    lawbot: {
      defaultLegalReply: 'भारतीय कानूनों (घरेलू हिंसा अधिनियम 2005 एवं बीएनएस) के तहत, आपको अदालत से संरक्षण आदेश, सुरक्षित आश्रय और मुफ़्त कानूनी सहायता का तत्काल अधिकार है। आपातकाल: 112 या 1091 डायल करें।',
    },
    assist: {
      step1Init: 'सुरक्षित ब्राउज़र सैंडबॉक्स में टाइनीफिश वेब एजेंट प्रारंभ हो रहा है...',
      step2Analyze: 'पोर्टल संरचना का विश्लेषण: महिला व बाल शिकायत प्रपत्र मिला।',
      step3PreFill: 'लॉबॉट सारांश से शिकायत प्रारूप भरा जा रहा है (गोपनीयता सुरक्षित)...',
      step4SafetyHalt: '🛡️ सुरक्षा रोक सक्रिय: अंतिम सबमिशन / कैप्चा से पहले एजेंट रुका। कभी स्वतः सबमिट नहीं करता।',
      step5Complete: 'प्रारूप सफलतापूर्वक तैयार! मानवीय सत्यापन हेतु पूर्ण नियंत्रण सौंपा गया।',
      toastDraftReady: 'समीक्षा के लिए शिकायत सहायता प्रारूप तैयार है! 🛡️',
      stepUserStopped: 'उपयोगकर्ता के आदेश पर एजेंट रोक दिया गया।',
      toastHalted: 'एजेंट स्वचालन रोक दिया गया।',
    },
    therapy: {
      quickGroundingPrompt: 'क्या आप मुझे 2 मिनट के शांत श्वास व्यायाम में मार्गदर्शन कर सकती हैं?',
      quickUrgentPrompt: 'मुझे अभी ख़तरा महसूस हो रहा है। मुझे तुरंत क्या सुरक्षा कदम उठाने चाहिए?',
    },
    voiceGuide: {
      tapToListenAloud: '🔊 {lang} में आवाज़ सुनने के लिए यहाँ टैप करें',
      qHowToUse: 'इस पेज का उपयोग कैसे करें?',
      diagnosticChecking: 'api.vachana.ai Timbre v2.5 आवाज़ सेवा जांची जा रही है...',
      diagnosticOperational: 'Gnani AI पूर्णतः सक्रिय ({ms}ms)',
    },
    directory: {
      hrsRoundTheClock: '24/7 राउंड द क्लॉक सेवा',
      hrsOfficeHours: 'सुबह 10:00 - शाम 5:00 (हेल्पलाइन 24/7)',
      addrMalviya: 'मालवीय नगर, नई दिल्ली 110017',
      addrConnaught: 'संसद मार्ग, कनॉट प्लेस, नई दिल्ली 110001',
      addrSafdarjung: 'सफदरजंग अस्पताल परिसर, रिंग रोड, नई दिल्ली 110029',
      addrPatialaHouse: 'केंद्रीय कार्यालय, पटियाला हाउस कोर्ट्स, नई दिल्ली 110001',
      addrSgmh: 'एसजीएम अस्पताल परिसर, मंगोलपुरी, नई दिल्ली 110083',
      addrMumbaiCrawford: 'मुंबई पुलिस आयुक्तालय, क्रॉफर्ड मार्केट, मुंबई 400001',
      addrMumbaiBkc: 'बीकेसी पुलिस थाना परिसर, बांद्रा पूर्व, मुंबई 400051',
      addrMumbaiKem: 'केईएम अस्पताल परिसर, परेल, मुंबई 400012',
      addrMumbaiDharavi: 'शहरी स्वास्थ्य केंद्र, 60 फीट रोड, धारावी, मुंबई 400017',
      addrMumbaiFort: 'उच्च न्यायालय एनेक्सी, फोर्ट, मुंबई 400032',
      addrBengaluruInfantry: 'पुलिस आयुक्त कार्यालय, इन्फैंट्री रोड, बेंगलुरु 560001',
      addrBengaluruBowring: 'बोवरिंग अस्पताल परिसर, शिवाजी नगर, बेंगलुरु 560001',
      addrBengaluruHalasuru: 'हलसूरु गेट पुलिस थाना परिसर, बेंगलुरु 560002',
      addrBengaluruSiddaiah: 'न्याय देगुला, पहली मंजिल, सिद्धैया रोड, बेंगलुरु 560027',
      addrHyderabadPurani: 'पुराने कमिश्नर कार्यालय के पास, पुरानी हवेली, हैदराबाद 500004',
      addrHyderabadOsmania: 'उस्मानिया अस्पताल परिसर, अफजल गंज, हैदराबाद 500012',
      addrHyderabadBegumpet: 'पुलिस लाइंस, बेगमपेट, हैदराबाद 500016',
      addrChennaiGreams: 'ग्रीम्स रोड, थाउजेंड लाइट्स, चेन्नई 600006',
      addrChennaiTriplicane: 'सरकारी कस्तूरबा गांधी अस्पताल, ट्रिप्लिकेन, चेन्नई 600005',
      addrKolkataLalbazar: 'लालबाजार पुलिस मुख्यालय, 18 लालबाजार स्ट्रीट, कोलकाता 700001',
      addrKolkataCollege: '88 कॉलेज स्ट्रीट, कॉलेज स्क्वायर, कोलकाता 700073',
      addrPuneCamp: 'पुणे पुलिस आयुक्त कार्यालय, कैंप, पुणे 411001',
      addrJaipurGandhinagar: 'पुलिस लाइंस, गांधीनगर, जयपुर 302015',
      addrLucknowHazratganj: 'हजरतगंज पुलिस थाना परिसर, लखनऊ 226001',
      addrJasola: 'प्लॉट 21, जसोला संस्थागत क्षेत्र, नई दिल्ली 110025',
      addrJamnagar: 'जामनगर हाउस, शाहजहां रोड, नई दिल्ली 110011',
    }
  },
  'kn-IN': {
    auth: {
      quickLogin: 'ತ್ವರಿತ 1-ಕ್ಲಿಕ್ ಲಾಗಿನ್',
    },
    lawbot: {
      defaultLegalReply: 'ಭಾರತೀಯ ಶಾಸನಬದ್ಧ ಚೌಕಟ್ಟುಗಳ ಅಡಿಯಲ್ಲಿ (ಕೌಟುಂಬಿಕ ಹಿಂಸಾಚಾರ ತಡೆ ಕಾಯ್ದೆ 2005 ಮತ್ತು ಬಿಎನ್‌ಎಸ್), ನೀವು ರಕ್ಷಣಾ ಆದೇಶಗಳು, ಸುರಕ್ಷಿತ ಆಶ್ರಯ ಮತ್ತು ಉಚಿತ ಕಾನೂನು ನೆರವು ಪಡೆಯುವ ಹಕ್ಕನ್ನು ಹೊಂದಿದ್ದೀರಿ. ತುರ್ತು ಕರೆ: 112 ಅಥವಾ 1091.',
    },
    assist: {
      step1Init: 'ಸುರಕ್ಷಿತ ಬ್ರೌಸರ್ ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್‌ನಲ್ಲಿ TinyFish ವೆಬ್ ಏಜೆಂಟ್ ಆರಂಭವಾಗುತ್ತಿದೆ...',
      step2Analyze: 'ಪೋರ್ಟಲ್ ವಿಶ್ಲೇಷಣೆ: ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಕುಂದುಕೊರತೆ ಅರ್ಜಿ ನಮೂನೆ ಪತ್ತೆಯಾಗಿದೆ.',
      step3PreFill: 'LawBot ಸಾರಾಂಶದಿಂದ ದೂರಿನ ಕರಡನ್ನು ಭರ್ತಿ ಮಾಡಲಾಗುತ್ತಿದೆ (ಖಾಸಗಿತನ ಸಂರಕ್ಷಿತ)...',
      step4SafetyHalt: '🛡️ ಸುರಕ್ಷತಾ ತಡೆ ಸಕ್ರಿಯ: ಅಂತಿಮ ಸಲ್ಲಿಕೆ / ಕ್ಯಾಪ್ಚಾಗೆ ಮುನ್ನ ಏಜೆಂಟ್ ನಿಂತಿದೆ. ಎಂದಿಗೂ ತಾನಾಗಿಯೇ ಸಲ್ಲಿಸುವುದಿಲ್ಲ.',
      step5Complete: 'ದೂರು ಕರಡು ಯಶಸ್ವಿಯಾಗಿ ಸಿದ್ಧವಾಗಿದೆ! ಪರಿಶೀಲನೆಗಾಗಿ ಸಂಪೂರ್ಣ ನಿಯಂತ್ರಣ ನಿಮಗೆ ಹಸ್ತಾಂತರಿಸಲಾಗಿದೆ.',
      toastDraftReady: 'ಪರಿಶೀಲನೆಗಾಗಿ ದೂರು ನೆರವು ಕರಡು ಸಿದ್ಧವಾಗಿದೆ! 🛡️',
      stepUserStopped: 'ಬಳಕೆದಾರರ ಆದೇಶದಂತೆ ಏಜೆಂಟ್ ನಿಲ್ಲಿಸಲಾಗಿದೆ.',
      toastHalted: 'ಏಜೆಂಟ್ ಸ್ವಯಂಚಾಲನೆ ಸ್ಥಗಿತಗೊಂಡಿದೆ.',
    },
    therapy: {
      quickGroundingPrompt: 'ನನಗೆ 2 ನಿಮಿಷಗಳ ಶಾಂತ ಉಸಿರಾಟದ ವ್ಯಾಯಾಮದಲ್ಲಿ ಮಾರ್ಗದರ್ಶನ ನೀಡಬಲ್ಲಿರಾ?',
      quickUrgentPrompt: 'ನನಗೆ ಈಗ ಅಪಾಯದ ಭಯವಾಗುತ್ತಿದೆ. ನಾನು ತಕ್ಷಣ ಯಾವ ಸುರಕ್ಷತಾ ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಬೇಕು?',
    },
    voiceGuide: {
      tapToListenAloud: '🔊 {lang} ನಲ್ಲಿ ಆಲಿಸಲು ಇಲ್ಲಿ ಸ್ಪರ್ಶಿಸಿ',
      qHowToUse: 'ಈ ಪುಟವನ್ನು ಬಳಸುವುದು ಹೇಗೆ?',
      diagnosticChecking: 'ಧ್ವನಿ ಸಂಶ್ಲೇಷಣಾ ಸೇವೆಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
      diagnosticOperational: 'Gnani AI ಸಂಪೂರ್ಣ ಸಕ್ರಿಯವಾಗಿದೆ ({ms}ms)',
    },
    directory: {
      hrsRoundTheClock: '24/7 ನಿರಂತರ ಸೇವೆ',
      hrsOfficeHours: 'ಬೆಳಗ್ಗೆ 10:00 - ಸಂಜೆ 5:00 (ಸಹಾಯವಾಣಿ 24/7)',
      addrMalviya: 'ಮಾಳವೀಯ ನಗರ, ಹೊಸದೆಹಲಿ 110017',
      addrConnaught: 'ಸಂಸತ್ ರಸ್ತೆ, ಕನ್ನಾಟ್ ಪ್ಲೇಸ್, ಹೊಸದೆಹಲಿ 110001',
      addrSafdarjung: 'ಸಫ್ದರ್ಜಂಗ್ ಆಸ್ಪತ್ರೆ ಆವರಣ, ರಿಂಗ್ ರಸ್ತೆ, ಹೊಸದೆಹಲಿ 110029',
      addrPatialaHouse: 'ಕೇಂದ್ರ ಕಚೇರಿ, ಪಟಿಯಾಲಾ ಹೌಸ್ ಕೋರ್ಟ್ ಆವರಣ, ಹೊಸದೆಹಲಿ 110001',
      addrSgmh: 'ಎಸ್‌ಜಿಎಂ ಆಸ್ಪತ್ರೆ ಆವರಣ, ಮಂಗೋಲ್‌ಪುರಿ, ಹೊಸದೆಹಲಿ 110083',
      addrMumbaiCrawford: 'ಮುಂಬೈ ಪೊಲೀಸ್ ಕಮಿಷನರೇಟ್, ಕ್ರಾಫರ್ಡ್ ಮಾರ್ಕೆಟ್, ಮುಂಬೈ 400001',
      addrMumbaiBkc: 'ಬಿಕೆಸಿ ಪೊಲೀಸ್ ಠಾಣೆ ಸಂಕೀರ್ಣ, ಬಾಂದ್ರಾ ಪೂರ್ವ, ಮುಂಬೈ 400051',
      addrMumbaiKem: 'ಕೆಇಎಂ ಆಸ್ಪತ್ರೆ ಆವರಣ, ಪರೇಲ್, ಮುಂಬೈ 400012',
      addrMumbaiDharavi: 'ನಗರ ಆರೋಗ್ಯ ಕೇಂದ್ರ, 60 ಅಡಿ ರಸ್ತೆ, ಧಾರಾವಿ, ಮುಂಬೈ 400017',
      addrMumbaiFort: 'ಹೈಕೋರ್ಟ್ ಅನೆಕ್ಸ್, ಫೋರ್ಟ್, ಮುಂಬೈ 400032',
      addrBengaluruInfantry: 'ಪೊಲೀಸ್ ಕಮಿಷನರ್ ಕಚೇರಿ, ಇನ್‌ಫೆಂಟ್ರಿ ರಸ್ತೆ, ಬೆಂಗಳೂರು 560001',
      addrBengaluruBowring: 'ಬೌರಿಂಗ್ ಆಸ್ಪತ್ರೆ ಆವರಣ, ಶಿವಾಜಿ ನಗರ, ಬೆಂಗಳೂರು 560001',
      addrBengaluruHalasuru: 'ಹಲಸೂರು ಗೇಟ್ ಪೊಲೀಸ್ ಠಾಣೆ ಸಂಕೀರ್ಣ, ಬೆಂಗಳೂರು 560002',
      addrBengaluruSiddaiah: 'ನ್ಯಾಯ ದೇಗುಲ, 1ನೇ ಮಹಡಿ, ಸಿದ್ದಯ್ಯ ರಸ್ತೆ, ಬೆಂಗಳೂರು 560027',
      addrHyderabadPurani: 'ಹಳೆಯ ಕಮಿಷನರ್ ಕಚೇರಿ ಹತ್ತಿರ, ಪುರಾನಿ ಹವೇಲಿ, ಹೈದರಾಬಾದ್ 500004',
      addrHyderabadOsmania: 'ಉಸ್ಮಾನಿಯಾ ಆಸ್ಪತ್ರೆ ಆವರಣ, ಅಫ್ಜಲ್ ಗಂಜ್, ಹೈದರಾಬಾದ್ 500012',
      addrHyderabadBegumpet: 'ಪೊಲೀಸ್ ಲೈನ್ಸ್, ಬೇಗಂಪೇಟೆ, ಹೈದರಾಬಾದ್ 500016',
      addrChennaiGreams: 'ಗ್ರೀಮ್ಸ್ ರಸ್ತೆ, ಥೌಸಂಡ್ ಲೈಟ್ಸ್, ಚೆನ್ನೈ 600006',
      addrChennaiTriplicane: 'ಸರ್ಕಾರಿ ಕಸ್ತೂರಬಾ ಗಾಂಧಿ ಆಸ್ಪತ್ರೆ, ಟ್ರಿಪ್ಲಿಕೇನ್, ಚೆನ್ನೈ 600005',
      addrKolkataLalbazar: 'ಲಾಲ್ಬಜಾರ್ ಪೊಲೀಸ್ ಪ್ರಧಾನ ಕಚೇರಿ, ಕೋಲ್ಕತ್ತಾ 700001',
      addrKolkataCollege: '88 ಕಾಲೇಜು ರಸ್ತೆ, ಕಾಲೇಜು ಸ್ಕ್ವೇರ್, ಕೋಲ್ಕತ್ತಾ 700073',
      addrPuneCamp: 'ಪುಣೆ ಪೊಲೀಸ್ ಕಮಿಷನರ್ ಕಚೇರಿ, ಕ್ಯಾಂಪ್, ಪುಣೆ 411001',
      addrJaipurGandhinagar: 'ಪೊಲೀಸ್ ಲೈನ್ಸ್, ಗಾಂಧಿನಗರ, ಜೈಪುರ 302015',
      addrLucknowHazratganj: 'ಹಜರತ್‌ಗಂಜ್ ಪೊಲೀಸ್ ಠಾಣೆ ಸಂಕೀರ್ಣ, ಲಖನೌ 226001',
      addrJasola: 'ಪ್ಲಾಟ್ 21, ಜಸೋಲಾ ಸಂಸ್ಥಾಗತ ಪ್ರದೇಶ, ಹೊಸದೆಹಲಿ 110025',
      addrJamnagar: 'ಜಾಮ್ನಗರ ಹೌಸ್, ಷಹಜಹಾನ್ ರಸ್ತೆ, ಹೊಸದೆಹಲಿ 110011',
    },
    marquee: {
      tapToFlip: 'ತಿರುಗಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
      source: 'ಮೂಲ',
      howSafeSparkResponds: 'SafeSpark ಪರಿಹಾರ',
      flipBack: 'ಹಿಂದಕ್ಕೆ ತಿರುಗಿಸಿ',
    }
  },
  'ta-IN': {
    auth: { quickLogin: 'உடனடி 1-கிளிக் உள்நுழைவு' },
    marquee: {
      tapToFlip: 'திருப்ப கிளிக் செய்யவும்',
      source: 'மூலம்',
      howSafeSparkResponds: 'SafeSpark தீர்வு',
      flipBack: 'மீண்டும் திருப்பவும்',
    },
    lawbot: { defaultLegalReply: 'குடும்ப வன்முறை சட்டம் 2005 மற்றும் பிஎன்எஸ் கீழ், பாதுகாப்பு ஆணைகள், இலவச சட்ட உதவி பெற உங்களுக்கு முழு உரிமை உண்டு. அவசர அழைப்பு: 112 அல்லது 1091.' },
    assist: {
      step1Init: 'பாதுகாப்பான உலாவியில் TinyFish வலை முகவர் தொடங்குகிறது...',
      step2Analyze: 'வலைத்தள படிவம் கண்டறியப்பட்டது.',
      step3PreFill: 'LawBot சுருக்கத்திலிருந்து புகார் வரைவு நிரப்பப்படுகிறது...',
      step4SafetyHalt: '🛡️ பாதுகாப்பு நிறுத்தம்: இறுதி சமர்ப்பிப்பிற்கு முன் முகவர் நிறுத்தப்பட்டது.',
      step5Complete: 'புகார் வரைவு வெற்றிகரமாக தயாராக உள்ளது!',
      toastDraftReady: 'உங்கள் மதிப்பாய்வுக்கு புகார் வரைவு தயார்! 🛡️',
      stepUserStopped: 'பயனரால் முகவர் நிறுத்தப்பட்டது.',
      toastHalted: 'தானியங்கி செயல்பாடு நிறுத்தப்பட்டது.',
    },
    therapy: {
      quickGroundingPrompt: '2 நிமிட அமைதியான சுவாசப் பயிற்சியை எனக்குக் கற்பிக்க முடியுமா?',
      quickUrgentPrompt: 'எனக்கு ஆபத்து இருப்பதாக உணர்கிறேன். உடனடியாக என்ன செய்ய வேண்டும்?',
    },
    voiceGuide: {
      tapToListenAloud: '🔊 {lang} மொழியில் கேட்க இங்கே தட்டவும்',
      qHowToUse: 'இந்தப் பக்கத்தை எவ்வாறு பயன்படுத்துவது?',
      diagnosticChecking: 'குரல் சேவை சரிபார்க்கப்படுகிறது...',
      diagnosticOperational: 'Gnani AI செயல்பாட்டில் உள்ளது ({ms}ms)',
    },
    directory: {
      hrsRoundTheClock: '24/7 முழு நேர சேவை',
      hrsOfficeHours: 'காலை 10:00 - மாலை 5:00 (உதவி எண் 24/7)',
      addrMalviya: 'மால்வியா நகர், புது தில்லி 110017',
      addrConnaught: 'கன்னாட் பிளேஸ், புது தில்லி 110001',
      addrSafdarjung: 'சப்தர்ஜங் மருத்துவமனை, புது தில்லி 110029',
      addrPatialaHouse: 'பாட்டியாலா ஹவுஸ் நீதிமன்ற வளாகம், புது தில்லி 110001',
      addrSgmh: 'எஸ்ஜிஎம் மருத்துவமனை, மங்கோல்பூரி, புது தில்லி 110083',
      addrMumbaiCrawford: 'கிராஃபோர்ட் மார்க்கெட், மும்பை 400001',
      addrMumbaiBkc: 'பிகேசி, பாந்த்ரா கிழக்கு, மும்பை 400051',
      addrMumbaiKem: 'கேஇஎம் மருத்துவமனை, பரேல், மும்பை 400012',
      addrMumbaiDharavi: 'தாராவா, மும்பை 400017',
      addrMumbaiFort: 'உயர் நீதிமன்ற வளாகம், கோட்டை, மும்பை 400032',
      addrBengaluruInfantry: 'இன்பன்ட்ரி சாலை, பெங்களூரு 560001',
      addrBengaluruBowring: 'பவுரிங் மருத்துவமனை, சிவாஜி நகர், பெங்களூரு 560001',
      addrBengaluruHalasuru: 'ஹலசூரு கேட், பெங்களூரு 560002',
      addrBengaluruSiddaiah: 'சித்தையா சாலை, பெங்களூரு 560027',
      addrHyderabadPurani: 'புராணி ஹவேலி, ஹைதராபாத் 500004',
      addrHyderabadOsmania: 'உஸ்மானியா மருத்துவமனை, ஹைதராபாத் 500012',
      addrHyderabadBegumpet: 'பேகம்பேட்டை, ஹைதராபாத் 500016',
      addrChennaiGreams: 'கிரீம்ஸ் சாலை, ஆயிரம் விளக்குகள், சென்னை 600006',
      addrChennaiTriplicane: 'கஸ்தூரிபா காந்தி மருத்துவமனை, திருவல்லிக்கேணி, சென்னை 600005',
      addrKolkataLalbazar: 'லால்பஜார் காவல் தலைமையகம், கொல்கத்தா 700001',
      addrKolkataCollege: '88 கல்லூரி தெரு, கொல்கத்தா 700073',
      addrPuneCamp: 'கேம்ப், புனே 411001',
      addrJaipurGandhinagar: 'காந்திநகர், ஜெய்ப்பூர் 302015',
      addrLucknowHazratganj: 'ஹசரத்கஞ்ச், லக்னோ 226001',
      addrJasola: 'ஜசோலா, புது தில்லி 110025',
      addrJamnagar: 'ஜாಮ್நகர் ஹவுஸ், ஷாஜகான் சாலை, புது தில்லி 110011',
    }
  },
  'te-IN': {
    auth: { quickLogin: 'తక్షణ 1-క్లిక్ లాగిన్' },
    lawbot: { defaultLegalReply: 'గృహ హింస చట్టం 2005 మరియు బిఎన్ఎస్ ప్రకారం, మీకు రక్షణ ఉత్తర్వులు, సురక్షిత ఆశ్రయం మరియు ఉచిత న్యాయ సహాయం పొందే హక్కు ఉంది. అత్యవసరం: 112 లేదా 1091 కి డయల్ చేయండి.' },
    assist: {
      step1Init: 'సురక్షిత బ్రౌజర్‌లో TinyFish వెబ్ ఏజెంట్ ప్రారంభమవుతోంది...',
      step2Analyze: 'పోర్టల్ నిర్మాణం విశ్లేషించబడింది.',
      step3PreFill: 'LawBot సారాంశం నుండి ఫిర్యాదు ముసాయిదా నింపబడుతోంది...',
      step4SafetyHalt: '🛡️ భద్రతా విరామం: సమర్పణకు ముందు ఏజెంట్ ఆగిపోయింది.',
      step5Complete: 'ముసాయిదా విజయవంతంగా సిద్ధమైంది!',
      toastDraftReady: 'సమీక్ష కోసం ఫిర్యాదు ముసాయిదా సిద్ధంగా ఉంది! 🛡️',
      stepUserStopped: 'వినియోగదారు ఆదేశంతో ఏజెంట్ ఆగిపోయింది.',
      toastHalted: 'ఏజెంట్ నిలిపివేయబడింది.',
    },
    therapy: {
      quickGroundingPrompt: '2 నిమిషాల ప్రశాంత శ్వాస వ్యాయామంలో నాకు మార్గదర్శనం చేయగలరా?',
      quickUrgentPrompt: 'నాకు ఇప్పుడు ప్రమాదం అనిపిస్తోంది. తక్షణమే ఏ భద్రతా చర్యలు తీసుకోవాలి?',
    },
    voiceGuide: {
      tapToListenAloud: '🔊 {lang} లో వినడానికి ఇక్కడ నొక్కండి',
      qHowToUse: 'ఈ పేజీని ఎలా ఉపయోగించాలి?',
      diagnosticChecking: 'వాయిస్ సేవ తనిఖీ చేయబడుతోంది...',
      diagnosticOperational: 'Gnani AI పనిచేస్తోంది ({ms}ms)',
    },
    directory: {
      hrsRoundTheClock: '24/7 రౌండ్ ది క్లాక్ సేవ',
      hrsOfficeHours: 'ఉదయం 10:00 - సాయంత్రం 5:00 (హెల్ప్‌లైన్ 24/7)',
      addrMalviya: 'మాలవ్య నగర్, న్యూఢిల్లీ 110017',
      addrConnaught: 'కన్నాట్ ప్లేస్, న్యూఢిల్లీ 110001',
      addrSafdarjung: 'సఫ్దర్‌జంగ్ ఆసుపత్రి, న్యూఢిల్లీ 110029',
      addrPatialaHouse: 'పాటియాలా హౌస్ కోర్టులు, న్యూఢిల్లీ 110001',
      addrSgmh: 'ఎస్జీఎం ఆసుపత్రి, మంగోల్‌పురి, న్యూఢిల్లీ 110083',
      addrMumbaiCrawford: 'క్రాఫోర్డ్ మార్కెట్, ముంబై 400001',
      addrMumbaiBkc: 'బికెసి, బాంద్రా ఈస్ట్, ముంబై 400051',
      addrMumbaiKem: 'కెఇఎం ఆసుపత్రి, పరేల్, ముంబై 400012',
      addrMumbaiDharavi: 'ధారవి, ముంబై 400017',
      addrMumbaiFort: 'హైకోర్టు కాంప్లెక్స్, ఫోర్ట్, ముంబై 400032',
      addrBengaluruInfantry: 'ఇన్‌ఫాంట్రీ రోడ్, బెంగళూరు 560001',
      addrBengaluruBowring: 'బౌరింగ్ ఆసుపత్రి, శివాజీ నగర్, బెంగళూరు 560001',
      addrBengaluruHalasuru: 'హలసూరు గేట్, బెంగళూరు 560002',
      addrBengaluruSiddaiah: 'సిద్దయ్య రోడ్, బెంగళూరు 560027',
      addrHyderabadPurani: 'పురానీ హవేలీ, హైదరాబాద్ 500004',
      addrHyderabadOsmania: 'ఉస్మానియా ఆసుపత్రి, అఫ్జల్ గంజ్, హైదరాబాద్ 500012',
      addrHyderabadBegumpet: 'బేగంపేట, హైదరాబాద్ 500016',
      addrChennaiGreams: 'గ్రీమ్స్ రోడ్, థౌసండ్ లైట్స్, చెన్నై 600006',
      addrChennaiTriplicane: 'కస్తూర్బా గాంధీ ఆసుపత్రి, ట్రిప్లికేన్, చెన్నై 600005',
      addrKolkataLalbazar: 'లాల్‌బజార్ పోలీస్ హెడ్‌క్వార్టర్స్, కోల్‌కతా 700001',
      addrKolkataCollege: '88 కాలేజ్ స్ట్రీట్, కోల్‌కతా 700073',
      addrPuneCamp: 'క్యాంప్, పూణే 411001',
      addrJaipurGandhinagar: 'గాంధీనగర్, జైపూర్ 302015',
      addrLucknowHazratganj: 'హజ్రత్‌గంజ్, లక్నో 226001',
      addrJasola: 'జసోలా, న్యూఢిల్లీ 110025',
      addrJamnagar: 'జామ్‌నగర్ హౌస్, షాజహాన్ రోడ్, న్యూఢిల్లీ 110011',
    },
    marquee: {
      tapToFlip: 'తిప్పడానికి క్లిక్ చేయండి',
      source: 'మూలం',
      howSafeSparkResponds: 'SafeSpark పరిష్కారం',
      flipBack: 'వెనుకకు తిప్పండి',
    }
  }
};

// Generate for other 8 languages by falling back gracefully to hindi/english if not specified
const fallbackLangs = ['bn-IN', 'mr-IN', 'gu-IN', 'pa-IN', 'ml-IN', 'od-IN', 'as-IN', 'ur-IN'];
for (const lang of fallbackLangs) {
  const base = newTranslations['hi-IN'];
  newTranslations[lang] = {
    auth: { ...base.auth },
    lawbot: { ...base.lawbot },
    assist: { ...base.assist },
    therapy: { ...base.therapy },
    voiceGuide: { ...base.voiceGuide },
    directory: { ...base.directory },
    marquee: { ...base.marquee }
  };
}

for (const locale of locales) {
  const filePath = path.join(langsDir, `${locale}.js`);
  if (!fs.existsSync(filePath)) continue;
  const existing = require(filePath);
  const patch = newTranslations[locale] || newTranslations['hi-IN'];

  for (const ns of Object.keys(newTranslations['en-IN'])) {
    if (!existing[ns]) existing[ns] = {};
    const patchNs = patch[ns] || newTranslations['en-IN'][ns];
    for (const [k, v] of Object.entries(patchNs)) {
      existing[ns][k] = v;
    }
  }

  const output = `module.exports = ${JSON.stringify(existing, null, 2)};\n`;
  fs.writeFileSync(filePath, output, 'utf8');
  console.log(`Updated ${locale}.js with extra keys`);
}

console.log('Extra keys expansion complete.');
