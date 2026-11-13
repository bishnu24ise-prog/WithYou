const fs = require('fs');
const path = require('path');

const locales = [
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

const langsDir = path.join(__dirname, 'langs');
const messagesDir = path.join(__dirname, '..', 'messages');

// Load en-IN as the reference schema
const enData = require(path.join(langsDir, 'en-IN.js'));

function getFlattenedKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    if (k.startsWith('_')) continue;
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getFlattenedKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const referenceKeys = getFlattenedKeys(enData);
console.log(`Total reference translation keys in en-IN: ${referenceKeys.length}`);

let hasErrors = false;

for (const locale of locales) {
  const filePath = path.join(langsDir, `${locale}.js`);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing language file: ${filePath}`);
    hasErrors = true;
    continue;
  }

  const langData = require(filePath);
  const langKeys = new Set(getFlattenedKeys(langData));

  const missing = referenceKeys.filter((k) => !langKeys.has(k));
  if (missing.length > 0) {
    console.error(`[${locale}] Missing ${missing.length} keys:`);
    console.error(missing.slice(0, 10).join(', '));
    hasErrors = true;
  } else {
    console.log(`[${locale}] Verified 100% complete (${langKeys.size} keys).`);
  }

  // Write JSON
  const targetJsonPath = path.join(messagesDir, `${locale}.json`);
  fs.writeFileSync(targetJsonPath, JSON.stringify(langData, null, 2), 'utf8');
}

if (hasErrors) {
  console.error('\nErrors encountered during message build.');
  process.exit(1);
} else {
  console.log('\nAll 13 language JSON message files successfully generated and verified!');
}

