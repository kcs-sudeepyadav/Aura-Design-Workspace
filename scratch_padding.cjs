const fs = require('fs');
const filepath = 'd:/wamp64/www/velour/velour/src/components/generated/HubPages.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// Revert logo
content = content.replace('className="flex items-center gap-3 group mb-16"', 'className="flex items-center gap-3 group"');

// Apply new padding to text
content = content.replace('<p className="text-[#f59e0b] text-[10px] tracking-[0.25em] uppercase mb-6" >Agency Master Dashboard</p>', '<p className="text-[#f59e0b] text-[10px] tracking-[0.25em] uppercase mb-4 mt-2" >Agency Master Dashboard</p>');

fs.writeFileSync(filepath, content, 'utf8');
console.log('Successfully applied user requested padding.');
