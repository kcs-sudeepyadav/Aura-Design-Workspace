const fs = require('fs');

const path = 'd:/wamp64/www/aura/aura/src/components/generated/HubPages.tsx';
let content = fs.readFileSync(path, 'utf8');

const start_idx = content.indexOf('{/* \u25AA\uFE0F\u25AA\uFE0F SITE LOGS \u25AA\uFE0F\u25AA\uFE0F */}');
const end_idx = content.indexOf('{/* \u25AA\uFE0F\u25AA\uFE0F TASKS \u25AA\uFE0F\u25AA\uFE0F */}');

if (start_idx === -1 || end_idx === -1) {
  console.log('Markers not found!');
  process.exit(1);
}

const replacement = fs.readFileSync('replacement.txt', 'utf8');

const newContent = content.substring(0, start_idx) + replacement + '\n      ' + content.substring(end_idx);

fs.writeFileSync(path, newContent, 'utf8');
console.log('Replacement successful');
