const fs = require('fs');
const path = require('path');

const LOCALES = [
  'en-IN',
  'hi-IN',
  'bn-IN',
  'ta-IN',
  'te-IN',
  'kn-IN',
  'ml-IN',
  'mr-IN',
  'gu-IN',
  'pa-IN',
  'od-IN',
  'as-IN',
  'ur-IN',
];

const messagesDir = path.join(__dirname, '..', 'messages');

console.log('=== VERIFYING ALL 13 LOCALES MESSAGES ===');

const allMessages = {};
let totalErrors = 0;

LOCALES.forEach((locale) => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] Missing translation file: ${filePath}`);
    totalErrors++;
    return;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(raw);
    allMessages[locale] = json;
    console.log(`[OK] Loaded ${locale}: ${Object.keys(json).length} namespaces`);
  } catch (err) {
    console.error(`[ERROR] Parsing failed for ${locale}:`, err.message);
    totalErrors++;
  }
});

if (totalErrors > 0) {
  process.exit(1);
}

// Compare every locale against en-IN key tree
const enTree = allMessages['en-IN'];

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      keys = keys.concat(getKeys(val, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = getKeys(enTree);
console.log(`\nBase en-IN key count: ${enKeys.length}`);

LOCALES.forEach((locale) => {
  const locKeys = getKeys(allMessages[locale]);
  const missing = enKeys.filter((k) => !locKeys.includes(k));
  if (missing.length > 0) {
    console.error(`[FAIL] ${locale} is missing ${missing.length} keys:`, missing.slice(0, 5));
    totalErrors += missing.length;
  } else {
    console.log(`[PASS] ${locale}: 100% key parity (${locKeys.length}/${enKeys.length} keys verified)`);
  }
});

if (totalErrors === 0) {
  console.log('\n>>> ALL 13 LANGUAGES HAVE ZERO MISSING KEYS AND 100% PARITY! <<<');
} else {
  console.error(`\nFound ${totalErrors} issues.`);
  process.exit(1);
}

