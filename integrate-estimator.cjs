const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/generated/HubPages.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add Calculator to lucide-react imports if not there
if (!content.includes('Calculator')) {
    content = content.replace(/import \{([^}]*)\} from 'lucide-react';/, (match, p1) => {
        return `import { Calculator, ${p1} } from 'lucide-react';`;
    });
}

// 2. Import MaterialEstimator
if (!content.includes('MaterialEstimator')) {
    content = content.replace(/import \{([^}]*)\} from 'lucide-react';/, (match) => {
        return `${match}\nimport { MaterialEstimator } from './MaterialEstimator';`;
    });
}

// 3. Add to adminTabs
const adminTabsTarget = `  id: 'settings',\n  label: 'Settings',\n  icon: Settings\n}]`;
const adminTabsReplace = `  id: 'settings',\n  label: 'Settings',\n  icon: Settings\n}, {\n  id: 'estimator',\n  label: 'Estimator',\n  icon: Calculator\n}]`;
content = content.replace(adminTabsTarget, adminTabsReplace);

// 4. Add render in HubAdminPage
const renderTarget = `{/* ─────────────────── SETTINGS ─────────────────── */}`;
const renderReplace = `{/* ─────────────────── ESTIMATOR ─────────────────── */}\n      {activeTab === 'estimator' && <MaterialEstimator />}\n\n      {/* ─────────────────── SETTINGS ─────────────────── */}`;
content = content.replace(renderTarget, renderReplace);

fs.writeFileSync(file, content, 'utf8');
console.log('Estimator integrated.');
