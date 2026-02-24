const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const backendSrc = path.join(__dirname, '..', 'src', 'backend', 'src');

const importMappings = {
  '@shared/types/agent.types': '@shared/types',
  '@shared/types/skill.types': '@shared/types',
  '@shared/types/genetics.types': '@shared/types',
  '@shared/types/rag.types': '@shared/types',
  '@shared/types/a2ui.types': '@shared/types',
  '@shared/types/knowledge-tree.types': '@shared/types',
  '@shared/types/knowledge-graph.types': '@shared/types',
  '@shared/types/auth.types': '@shared/types',
  '@shared/types/progress.types': '@shared/types',
  '@shared/types/dynamic-viz.types': '@shared/types',
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

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  for (const [oldImport, newImport] of Object.entries(importMappings)) {
    const regex = new RegExp(`from ['"]${oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
    
    if (regex.test(content)) {
      content = content.replace(regex, `from '${newImport}'`);
      modified = true;
      console.log(`Fixed imports in: ${path.relative(backendSrc, filePath)}`);
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
    if (fixImportsInFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n✓ Fixed imports in ${fixedCount} files`);
}

main();
