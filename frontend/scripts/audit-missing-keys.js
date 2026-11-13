const fs = require('fs');
const path = require('path');
const en = require('../messages/en-IN.json');

function getAllFiles(dir, exts) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '.next') {
        files = files.concat(getAllFiles(full, exts));
      }
    } else if (exts.some(ext => item.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const files = getAllFiles(path.join(__dirname, '../src'), ['.tsx', '.ts']);
const missingKeys = new Set();

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Match const t = useTranslations('ns')
  const nsMatch = content.match(/useTranslations\(['"]([^'"]+)['"]\)/);
  if (!nsMatch) continue;
  const ns = nsMatch[1];

  // Find all t('key')
  const keyMatches = [...content.matchAll(/t\(['"]([^'"]+)['"]/g)];
  for (const km of keyMatches) {
    const key = km[1];
    if (key.includes('.')) continue;
    if (!en[ns] || en[ns][key] === undefined) {
      missingKeys.add(`${ns}.${key} (in ${path.basename(file)})`);
    }
  }
}

console.log('MISSING KEYS AUDIT RESULT:');
console.log(Array.from(missingKeys));

