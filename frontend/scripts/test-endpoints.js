const http = require('http');

const testCases = [
  { url: 'http://localhost:3000/', expect: ['Quick Exit', 'SafeSpark'] },
  { url: 'http://localhost:3000/kn-IN', expect: ['ಕನ್ನಡ', 'ತ್ವರಿತ ನಿರ್ಗಮನ'] },
  { url: 'http://localhost:3000/hi-IN', expect: ['हिन्दी', 'त्वरित निकास'] },
  { url: 'http://localhost:3000/ta-IN', expect: ['தமிழ்', 'உடனடி வெளியேறு'] },
  { url: 'http://localhost:3000/te-IN', expect: ['తెలుగు', 'త్వరిత నిష్క్రమణ'] },
  { url: 'http://localhost:3000/bn-IN', expect: ['বাংলা', 'দ্রুত প্রস্থান'] },
  { url: 'http://localhost:3000/mr-IN', expect: ['मराठी', 'त्वरित बाहेर पडा'] },
  { url: 'http://localhost:3000/gu-IN', expect: ['ગુજરાતી', 'ત્વરિત બહાર નીકળો'] },
  { url: 'http://localhost:3000/pa-IN', expect: ['ਪੰਜਾਬੀ', 'ਤੁਰੰਤ ਬਾਹਰ ਨਿਕਲੋ'] },
  { url: 'http://localhost:3000/ml-IN', expect: ['മലയാളം', 'ഉടൻ പുറത്തുകടക്കുക'] },
  { url: 'http://localhost:3000/od-IN', expect: ['ଓଡ଼ିଆ', 'ତୁରନ୍ତ ପ୍ରସ୍ଥାନ'] },
  { url: 'http://localhost:3000/as-IN', expect: ['অসমীয়া', 'দ্ৰুত প্ৰস্থান'] },
  { url: 'http://localhost:3000/ur-IN', expect: ['dir="rtl"', 'اردو'] },
  // Localized Subpages
  { url: 'http://localhost:3000/hi-IN/therapybot', expect: ['माया • SafeSpark साथी', 'पूर्ण विंडो'] },
  { url: 'http://localhost:3000/hi-IN/assist', expect: ['शिकायत सहायता', 'डेमो मोड'] },
  { url: 'http://localhost:3000/hi-IN/directory', expect: ['स्थान अनुसार निकटतम आपातकालीन केंद्र', 'सत्यापित'] },
  { url: 'http://localhost:3000/kn-IN/therapybot', expect: ['ಮಾಯಾ • SafeSpark ಒಡನಾಡಿ', 'ಪೂರ್ಣ ವಿಂಡೋ'] },
  { url: 'http://localhost:3000/kn-IN/assist', expect: ['ದೂರು ಸಹಾಯ', 'ಡೆಮೊ ಮೋಡ್'] },
  { url: 'http://localhost:3000/kn-IN/directory', expect: ['ಸ್ಥಳವಾರು ಹತ್ತಿರದ ತುರ್ತು ಕೇಂದ್ರಗಳು', 'ದೃಢೀಕೃತ'] },
  { url: 'http://localhost:3000/ta-IN/directory', expect: ['இருப்பிட அடிப்படையிலான அவசர உதவி மையங்கள்', 'சரிபார்க்கப்பட்டது'] },
  { url: 'http://localhost:3000/te-IN/directory', expect: ['ప్రాంతం వారీగా సమీప అత్యవసర కేంద్రాలు', 'ధృవీకరించబడింది'] }
];

async function run() {
  let passedCount = 0;
  for (const tc of testCases) {
    await new Promise((resolve) => {
      http.get(tc.url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let allMatched = true;
          for (const exp of tc.expect) {
            if (!data.includes(exp)) {
              console.error(`[FAIL] ${tc.url} missing: "${exp}"`);
              allMatched = false;
            }
          }
          if (allMatched) {
            console.log(`[PASS] ${tc.url} -> HTTP ${res.statusCode} (All expected strings found)`);
            passedCount++;
          }
          resolve();
        });
      }).on('error', (err) => {
        console.error(`[ERROR] ${tc.url}:`, err.message);
        resolve();
      });
    });
  }
  console.log(`\nEndpoint tests completed: ${passedCount}/${testCases.length} passed.`);
  if (passedCount !== testCases.length) {
    process.exit(1);
  }
}

run();
