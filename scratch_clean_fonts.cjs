const fs = require('fs');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(dir + '/' + file);
    if (stat.isDirectory()) {
      findFiles(dir + '/' + file, fileList);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        fileList.push(dir + '/' + file);
      }
    }
  }
  return fileList;
}

const files = findFiles('d:/wamp64/www/aura/aura/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // A string can be "...", '...', or `...`
  const strRegex = /(?:"[^"]*"|'[^']*'|`[^`]*`)/;
  
  // 1. Match entire style={{ fontFamily: "..." }}
  const r1 = new RegExp(`style=\\{\\{\\s*fontFamily:\\s*${strRegex.source}\\s*\\}\\}`,'g');
  content = content.replace(r1, '');
  
  // 2. Match fontFamily: "...", (at the beginning of style object)
  const r2 = new RegExp(`fontFamily:\\s*${strRegex.source}\\s*,\\s*`,'g');
  content = content.replace(r2, '');
  
  // 3. Match , fontFamily: "..." (at the end or middle)
  const r3 = new RegExp(`,\\s*fontFamily:\\s*${strRegex.source}\\s*`,'g');
  content = content.replace(r3, '');
  
  // 4. Clean up any empty style tags left over
  content = content.replace(/style=\{\{\s*\}\}/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned inline fonts in:', file);
  }
});
