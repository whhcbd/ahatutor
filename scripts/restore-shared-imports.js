const fs = require('fs');
const path = require('path');

const backendSrc = path.join(__dirname, '..', 'src', 'backend', 'src');

const importMappings = {
  '@shared/types': '@shared/types/agent.types',
};

function findFiles(dir, extensions = ['.ts']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function restoreImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  for (const [oldImport, newImport] of Object.entries(importMappings)) {
    const regex = new RegExp(`from ['"]${oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
    
    if (regex.test(content)) {
      content = content.replace(regex, `from '${newImport}'`);
      modified = true;
      console.log(`Restored imports in: ${path.relative(backendSrc, filePath)}`);
      console.log(`  ${oldImport} -> ${newImport}`);
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return modified;
}

function main() {
  console.log('Finding TypeScript files in backend...');
  const files = findFiles(backendSrc, ['.ts']);
  console.log(`Found ${files.length} TypeScript files\n`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (restoreImportsInFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n✓ Restored imports in ${fixedCount} files`);
}

main();
