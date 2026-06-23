const fs = require('fs');
const path = require('path');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', '.git', 'prisma'].includes(file)) {
        findFiles(fullPath, fileList);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.html') || file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.cjs') || file.endsWith('.css') || file.endsWith('.md')) {
        if (!file.includes('lock')) {
            fileList.push(fullPath);
        }
      }
    }
  }
  return fileList;
}

const files = findFiles('d:/wamp64/www/velour/velour');
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Fix the corrupted copyright symbols first
  content = content.replace(/Ac\s*2026/g, '&copy; 2026');
  
  // Replace the text globally
  content = content.replace(/Aura : A Design Studio Workspace/g, 'Aura : A Design Studio Workspace');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Patched text in:', file);
    changedFiles++;
  }
});

console.log(`Finished renaming. Changed ${changedFiles} files.`);
