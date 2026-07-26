const fs = require('fs');
const path = require('path');

const targetDirs = [
  'apps/web-admin/src',
  'packages/ui/src'
];

const outputFile = '/Users/usuario/Desktop/codigo_frontend.md';

function getFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, filesList);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.css') || filePath.endsWith('.json')) {
        filesList.push(filePath);
      }
    }
  }
  return filesList;
}

let markdownContent = '# Código Completo (Frontend - web-admin y UI)\n\n';

for (const dir of targetDirs) {
  markdownContent += `# ${dir}\n\n`;
  const files = getFiles(dir);
  for (const file of files) {
    markdownContent += `## ${file}\n\n`;
    let lang = 'typescript';
    if (file.endsWith('.tsx')) lang = 'tsx';
    if (file.endsWith('.css')) lang = 'css';
    if (file.endsWith('.json')) lang = 'json';
    
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
