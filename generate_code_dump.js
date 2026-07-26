const fs = require('fs');
const path = require('path');

const targetDirs = [
  'apps/api/src',
  'apps/web-admin/src',
  'packages/database/src',
  'packages/ui/src'
];

const outputFile = '/Users/usuario/.gemini/antigravity/brain/2646c861-d9fd-4bd7-be7c-6d7d69f52ffa/codigo_completo.md';

function getFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, filesList);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.css')) {
        filesList.push(filePath);
      }
    }
  }
  return filesList;
}

let markdownContent = '# Código Completo (Backend y Frontend)\n\n';

for (const dir of targetDirs) {
  markdownContent += `# ${dir}\n\n`;
  const files = getFiles(dir);
  for (const file of files) {
    markdownContent += `## ${file}\n\n`;
    let lang = 'typescript';
    if (file.endsWith('.tsx')) lang = 'tsx';
    if (file.endsWith('.css')) lang = 'css';
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      markdownContent += '```' + lang + '\n' + content + '\n```\n\n';
    } catch (e) {
      markdownContent += `*Error reading file: ${e.message}*\n\n`;
    }
  }
}

fs.writeFileSync(outputFile, markdownContent);
console.log('File generated at ' + outputFile);
