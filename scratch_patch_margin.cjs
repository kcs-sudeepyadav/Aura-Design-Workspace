const fs = require('fs');
const filepath = 'd:/wamp64/www/velour/velour/src/components/generated/HubPages.tsx';
let content = fs.readFileSync(filepath, 'utf8');

const targetStr = `<button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-[#f59e0b] rounded-sm flex items-center justify-center shadow-md shadow-amber-500/20">
            <span className="text-[#020617] font-bold text-lg">A</span>
          </div>
          <span className="text-white font-light text-base tracking-[0.15em] uppercase" >Aura</span>
        </button>`;

const newStr = `<button onClick={() => onNavigate('home')} className="flex items-center gap-3 group mb-16">
          <div className="w-9 h-9 bg-[#f59e0b] rounded-sm flex items-center justify-center shadow-md shadow-amber-500/20">
            <span className="text-[#020617] font-bold text-lg">A</span>
          </div>
          <span className="text-white font-light text-base tracking-[0.15em] uppercase" >Aura</span>
        </button>`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(filepath, content, 'utf8');
console.log('Successfully patched margin');
