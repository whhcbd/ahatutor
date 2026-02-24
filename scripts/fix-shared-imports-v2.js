const fs = require('fs');
const path = require('path');

const backendSrc = path.join(__dirname, '..', 'src', 'backend', 'src');

const typeMappings = {
  // rag.types 类型
  'DocumentChunk': 'rag.types',
  'Document': 'rag.types',
  'DocumentType': 'rag.types',
  'DocumentMetadata': 'rag.types',
  'DocumentStatus': 'rag.types',
  'QueryResult': 'rag.types',
  'QueryOptions': 'rag.types',
  
  // genetics.types 类型
  'QuizQuestion': 'genetics.types',
  'Difficulty': 'genetics.types',
  'QuestionType': 'genetics.types',
  
  // knowledge-tree.types 类型
  'KnowledgeNodeType': 'knowledge-tree.types',
  'KnowledgeTreeNode': 'knowledge-tree.types',
  'KnowledgeTreeEdge': 'knowledge-tree.types',
  
  // skill.types 类型
  'SkillType': 'skill.types',
  'VisualizationType': 'skill.types',
  'VisualizationGenerateInput': 'skill.types',
  'VisualizationParameter': 'skill.types',
  'VisualizationGenerateOutput': 'skill.types',
  'VisualizationConfig': 'skill.types',
  'GeneticsVisualizationInput': 'skill.types',
  'GeneticsVisualizationOutput': 'skill.types',
  'InteractiveControlInput': 'skill.types',
  'InteractiveControlOutput': 'skill.types',
  'DocumentIndexingInput': 'skill.types',
  'DocumentIndexingOutput': 'skill.types',
  'VectorRetrievalInput': 'skill.types',
  'VectorRetrievalOutput': 'skill.types',
  'RetrievalResult': 'skill.types',
  'ContextRetrievalInput': 'skill.types',
  'ContextRetrievalOutput': 'skill.types',
  'StreamingAnswerInput': 'skill.types',
  'StreamingChunk': 'skill.types',
  'StreamingAnswerOutput': 'skill.types',
  'SearchResult': 'skill.types',
  'WebSearchInput': 'skill.types',
  'WebSearchOutput': 'skill.types',
  'ResourceType': 'skill.types',
  'ResourceRecommendation': 'skill.types',
  'ResourceRecommendInput': 'skill.types',
  'ResourceRecommendOutput': 'skill.types',
  'SkillExecutionResult': 'skill.types',
  
  // knowledge-graph.types 类型
  'KnowledgeGraph': 'knowledge-graph.types',
  'KnowledgeGraphNode': 'knowledge-graph.types',
  'KnowledgeGraphEdge': 'knowledge-graph.types',
  'KnowledgeGraphQuery': 'knowledge-graph.types',
  'KnowledgeGraphNodeDetail': 'knowledge-graph.types',
  
  // a2ui.types 类型
  'A2UIPayload': 'a2ui.types',
  'A2UIComponent': 'a2ui.types',
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
  let changes = [];
  
  // 收集所有需要修正的导入
  const importStatements = content.match(/^import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"]@shared\/types\/agent\.types['"];?$/gm);
  
  if (importStatements) {
    for (const importStatement of importStatements) {
      const typesPart = importStatement.match(/\{([^}]+)\}/)[1];
      const types = typesPart.split(',').map(t => t.trim());
      
      const typeGroups = {
        'skill.types': [],
        'knowledge-graph.types': [],
        'knowledge-tree.types': [],
        'a2ui.types': [],
        'rag.types': [],
        'genetics.types': [],
        'agent.types': []
      };
      
      for (const type of types) {
        const typeName = type.split(' as ')[0].trim();
        const targetFile = typeMappings[typeName];
        if (targetFile) {
          typeGroups[targetFile].push(type);
        } else {
          typeGroups['agent.types'].push(type);
        }
      }
      
      // 为每个目标文件生成新的导入语句
      const newImports = [];
      for (const [targetFile, typesList] of Object.entries(typeGroups)) {
        if (typesList.length > 0) {
          const isTypeImport = importStatement.includes('type ');
          const typeKeyword = isTypeImport ? 'type ' : '';
          newImports.push(`import ${typeKeyword}{ ${typesList.join(', ')} } from '@shared/types/${targetFile}';`);
        }
      }
      
      if (newImports.length > 0 && newImports.length < 4) {
        const newImportBlock = newImports.join('\n');
        content = content.replace(importStatement, newImportBlock);
        modified = true;
        changes.push(`Split import into ${newImports.length} imports`);
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed imports in: ${path.relative(backendSrc, filePath)}`);
    for (const change of changes) {
      console.log(`  ${change}`);
    }
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
