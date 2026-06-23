const fs = require('fs');

const path = 'd:/wamp64/www/aura/aura/src/components/generated/HubPages.tsx';
let content = fs.readFileSync(path, 'utf8');

const start_idx = content.indexOf("{activeTab === 'logs' && <div className="space-y-4">");
let end_idx = content.indexOf("{activeTab === 'tasks' && <div className="bg-[#0f172a] border border-amber-500/10 p-5">");
if (end_idx !== -1) {
    end_idx = content.lastIndexOf("      {/*", end_idx);
}

if (start_idx === -1 || end_idx === -1) {
  console.log('Markers not found!');
  process.exit(1);
}

const replacement = fs.readFileSync('replacement.txt', 'utf8');

const newContent = content.substring(0, start_idx - 7) + replacement + '\n' + content.substring(end_idx);

fs.writeFileSync(path, newContent, 'utf8');
console.log('Replacement successful');
