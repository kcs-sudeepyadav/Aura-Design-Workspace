const fs = require('fs');
const path = 'd:/wamp64/www/aura/aura/src/components/generated/HubPages.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace('key={log-photo-$' + '{idx}}', 'key={log-photo-$' + '{idx}}');
content = content.replace('alt={Log photo $' + '{idx + 1}}', 'alt={Log photo $' + '{idx + 1}}');
content = content.replace('width: $' + '{log.progress}%', 'width: $'+'{log.progress}%');
fs.writeFileSync(path, content, 'utf8');
console.log('Fixed syntax error');
