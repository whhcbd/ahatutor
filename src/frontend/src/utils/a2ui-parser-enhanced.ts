import type { MindMapData, MindMapInteraction } from '../types/mindmap.types';

export interface A2UIComponent {
  type: string;
  id: string;
  properties: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface A2UIPayload {
  type: 'card';
  id: string;
  children: A2UIComponent[];
  metadata?: Record<string, any>;
}

export interface A2UIEvent {
  type: string;
  componentId: string;
  data?: Record<string, any>;
  timestamp: number;
}

export interface ParseResult {
  directives: Array<{
    type: string;
    content: any;
    startIndex: number;
    endIndex: number;
  }>;
  cleanedText: string;
  payloads: A2UIPayload[];
}

export function parseA2UIDirectives(text: string): ParseResult {
  const directives: Array<{
    type: string;
    content: any;
    startIndex: number;
    endIndex: number;
  }> = [];
  let cleanedText = text;
  const regex = /\[A2UI-([A-Z_]+)\]([\s\S]*?)\[\/A2UI-\1\]/g;
  let match;
  const replacements: Array<{ start: number; end: number; replacement: string }> = [];

  while ((match = regex.exec(text)) !== null) {
    const fullMatch = match[0];
    const directiveType = match[1];
    const contentText = match[2];
    const startIndex = match.index;
    const endIndex = startIndex + fullMatch.length;

    try {
      const content = parseDirectiveContent(directiveType, contentText);
      directives.push({
        type: directiveType,
        content,
        startIndex,
        endIndex,
      });

      replacements.push({
        start: startIndex,
        end: endIndex,
        replacement: `[${directiveType}可视化已生成]`,
      });
    } catch (error) {
      console.error(`Failed to parse ${directiveType} directive:`, error);
    }
  }

  if (replacements.length > 0) {
    replacements.sort((a, b) => b.start - a.start);
    let result = text;
    for (const replacement of replacements) {
      result = result.slice(0, replacement.start) + replacement.replacement + result.slice(replacement.end);
    }
    cleanedText = result;
  }

  const payloads = directives.map(directive => {
    return directiveToPayload(directive);
  });

  return { directives, cleanedText, payloads };
}

function parseDirectiveContent(directiveType: string, contentText: string): any {
  switch (directiveType) {
    case 'MINDMAP':
      return parseMindMapDirective(contentText);
    case 'PUNNETT':
      return parsePunnettDirective(contentText);
    case 'INHERITANCE':
      return parseInheritanceDirective(contentText);
    case 'PROBABILITY':
      return parseProbabilityDirective(contentText);
    case 'KNOWLEDGE_GRAPH':
      return parseKnowledgeGraphDirective(contentText);
    case 'MEIOSIS':
      return parseMeiosisDirective(contentText);
    case 'PEDIGREE':
      return parsePedigreeDirective(contentText);
    case 'CHROMOSOME':
      return parseChromosomeDirective(contentText);
    case 'DNA_REPLICATION':
      return parseDNAReplicationDirective(contentText);
    case 'TRANSCRIPTION':
      return parseTranscriptionDirective(contentText);
    case 'TRANSLATION':
      return parseTranslationDirective(contentText);
    case 'GENE_STRUCTURE':
      return parseGeneStructureDirective(contentText);
    case 'CRISPR':
      return parseCRISPRDirective(contentText);
    case 'TRISOMY':
      return parseTrisomyDirective(contentText);
    case 'MITOSIS':
      return parseMitosisDirective(contentText);
    case 'ALLELE':
      return parseAlleleDirective(contentText);
    default:
      throw new Error(`Unknown directive type: ${directiveType}`);
  }
}

function directiveToPayload(directive: { type: string; content: any }): A2UIPayload {
  const componentTypeMap: Record<string, string> = {
    MINDMAP: 'ahatutor-mindmap',
    PUNNETT: 'ahatutor-punnett-square',
    INHERITANCE: 'ahatutor-inheritance-path',
    PROBABILITY: 'ahatutor-probability-distribution',
    KNOWLEDGE_GRAPH: 'ahatutor-knowledge-graph',
    MEIOSIS: 'ahatutor-meiosis-animation',
    PEDIGREE: 'ahatutor-pedigree-chart',
    CHROMOSOME: 'ahatutor-chromosome-behavior',
    DNA_REPLICATION: 'ahatutor-dna-replication',
    TRANSCRIPTION: 'ahatutor-transcription',
    TRANSLATION: 'ahatutor-translation',
    GENE_STRUCTURE: 'ahatutor-gene-structure',
    CRISPR: 'ahatutor-crispr',
    TRISOMY: 'ahatutor-trisomy',
    MITOSIS: 'ahatutor-mitosis',
    ALLELE: 'ahatutor-allele',
  };

  const componentType = componentTypeMap[directive.type];
  if (!componentType) {
    throw new Error(`Unknown directive type for payload: ${directive.type}`);
  }

  return {
    type: 'card',
    id: `viz_${directive.type.toLowerCase()}`,
    children: [
      {
        type: componentType,
        id: `${directive.type.toLowerCase()}_component`,
        properties: directive.content,
      },
    ],
  };
}

function parseMindMapDirective(contentText: string): MindMapData {
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);
  const data: Partial<MindMapData> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    } else if (line.startsWith('description:')) {
      data.description = parseString(line.slice(12).trim());
    } else if (line.startsWith('root:')) {
      const rootText = extractBlock(lines, i, 'root:');
      data.root = parseNode(rootText);
      i += countLines(rootText);
    } else if (line.startsWith('layout:')) {
      data.layout = parseString(line.slice(7).trim().replace(/['"]/g, '')) as any;
    } else if (line.startsWith('style:')) {
      const styleText = extractBlock(lines, i, 'style:');
      data.style = parseStyle(styleText);
      i += countLines(styleText);
    } else if (line.startsWith('interactions:')) {
      data.interactions = parseInteractions(line.slice(13).trim());
    } else if (line.startsWith('annotations:')) {
      const annotationsText = extractBlock(lines, i, 'annotations:');
      data.annotations = parseAnnotations(annotationsText);
      i += countLines(annotationsText);
    }
  }

  if (!data.title || !data.root || !data.layout || !data.style || !data.interactions) {
    throw new Error('Missing required fields in MINDMAP directive');
  }

  return data as MindMapData;
}

function parsePunnettDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('maleGametes:')) {
      data.maleGametes = parseArray(line.slice(14).trim());
    } else if (line.startsWith('femaleGametes:')) {
      data.femaleGametes = parseArray(line.slice(16).trim());
    } else if (line.startsWith('parentalCross:')) {
      const crossText = extractBlock(lines, lines.indexOf(line), 'parentalCross:');
      data.parentalCross = parseObject(crossText);
    } else if (line.startsWith('offspring:')) {
      const offspringText = extractBlock(lines, lines.indexOf(line), 'offspring:');
      data.offspring = parseArray(offspringText);
    } else if (line.startsWith('description:')) {
      data.description = parseString(line.slice(12).trim());
    }
  }

  return data;
}

function parseInheritanceDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('generations:')) {
      const generationsText = extractBlock(lines, lines.indexOf(line), 'generations:');
      data.generations = parseArray(generationsText);
    } else if (line.startsWith('inheritance:')) {
      const inheritanceText = extractBlock(lines, lines.indexOf(line), 'inheritance:');
      data.inheritance = parseObject(inheritanceText);
    } else if (line.startsWith('explanation:')) {
      data.explanation = parseString(line.slice(12).trim());
    }
  }

  return data;
}

function parseProbabilityDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('categories:')) {
      data.categories = parseArray(line.slice(11).trim());
    } else if (line.startsWith('values:')) {
      data.values = parseArray(line.slice(7).trim());
    } else if (line.startsWith('colors:')) {
      data.colors = parseArray(line.slice(7).trim());
    } else if (line.startsWith('total:')) {
      data.total = parseString(line.slice(6).trim());
    } else if (line.startsWith('formula:')) {
      data.formula = parseString(line.slice(8).trim());
    }
  }

  return data;
}

function parseKnowledgeGraphDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('nodes:')) {
      const nodesText = extractBlock(lines, lines.indexOf(line), 'nodes:');
      data.nodes = parseArray(nodesText);
    } else if (line.startsWith('links:')) {
      const linksText = extractBlock(lines, lines.indexOf(line), 'links:');
      data.links = parseArray(linksText);
    } else if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    } else if (line.startsWith('description:')) {
      data.description = parseString(line.slice(12).trim());
    }
  }

  return data;
}

function parseMeiosisDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('stages:')) {
      const stagesText = extractBlock(lines, lines.indexOf(line), 'stages:');
      data.stages = parseArray(stagesText);
    } else if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    } else if (line.startsWith('description:')) {
      data.description = parseString(line.slice(12).trim());
    } else if (line.startsWith('controls:')) {
      const controlsText = extractBlock(lines, lines.indexOf(line), 'controls:');
      data.controls = parseObject(controlsText);
    }
  }

  return data;
}

function parsePedigreeDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('individuals:')) {
      const individualsText = extractBlock(lines, lines.indexOf(line), 'individuals:');
      data.individuals = parseArray(individualsText);
    } else if (line.startsWith('legend:')) {
      const legendText = extractBlock(lines, lines.indexOf(line), 'legend:');
      data.legend = parseObject(legendText);
    }
  }

  return data;
}

function parseChromosomeDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('chromosomes:')) {
      const chromosomesText = extractBlock(lines, lines.indexOf(line), 'chromosomes:');
      data.chromosomes = parseArray(chromosomesText);
    } else if (line.startsWith('behavior:')) {
      const behaviorText = extractBlock(lines, lines.indexOf(line), 'behavior:');
      data.behavior = parseObject(behaviorText);
    } else if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    }
  }

  return data;
}

function parseDNAReplicationDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('dnaSequence:')) {
      const dnaText = extractBlock(lines, lines.indexOf(line), 'dnaSequence:');
      data.dnaSequence = parseObject(dnaText);
    } else if (line.startsWith('replicationProcess:')) {
      const processText = extractBlock(lines, lines.indexOf(line), 'replicationProcess:');
      data.replicationProcess = parseArray(processText);
    } else if (line.startsWith('enzymes:')) {
      const enzymesText = extractBlock(lines, lines.indexOf(line), 'enzymes:');
      data.enzymes = parseArray(enzymesText);
    } else if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    }
  }

  return data;
}

function parseTranscriptionDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('dnaTemplate:')) {
      data.dnaTemplate = parseString(line.slice(13).trim());
    } else if (line.startsWith('rnaSequence:')) {
      data.rnaSequence = parseString(line.slice(12).trim());
    } else if (line.startsWith('geneStructure:')) {
      const structureText = extractBlock(lines, lines.indexOf(line), 'geneStructure:');
      data.geneStructure = parseObject(structureText);
    } else if (line.startsWith('transcriptionFactors:')) {
      const factorsText = extractBlock(lines, lines.indexOf(line), 'transcriptionFactors:');
      data.transcriptionFactors = parseArray(factorsText);
    } else if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    }
  }

  return data;
}

function parseTranslationDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('mRNASequence:')) {
      data.mRNASequence = parseString(line.slice(14).trim());
    } else if (line.startsWith('proteinSequence:')) {
      data.proteinSequence = parseArray(line.slice(16).trim());
    } else if (line.startsWith('codons:')) {
      const codonsText = extractBlock(lines, lines.indexOf(line), 'codons:');
      data.codons = parseArray(codonsText);
    } else if (line.startsWith('trnas:')) {
      const trnasText = extractBlock(lines, lines.indexOf(line), 'trnas:');
      data.trnas = parseArray(trnasText);
    } else if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    }
  }

  return data;
}

function parseGeneStructureDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('geneName:')) {
      data.geneName = parseString(line.slice(9).trim());
    } else if (line.startsWith('geneComponents:')) {
      const componentsText = extractBlock(lines, lines.indexOf(line), 'geneComponents:');
      data.geneComponents = parseArray(componentsText);
    } else if (line.startsWith('regulatoryElements:')) {
      const elementsText = extractBlock(lines, lines.indexOf(line), 'regulatoryElements:');
      data.regulatoryElements = parseArray(elementsText);
    } else if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    }
  }

  return data;
}

function parseCRISPRDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('targetGene:')) {
      data.targetGene = parseString(line.slice(11).trim());
    } else if (line.startsWith('targetSequence:')) {
      data.targetSequence = parseString(line.slice(15).trim());
    } else if (line.startsWith('gRNASequence:')) {
      data.gRNASequence = parseString(line.slice(13).trim());
    } else if (line.startsWith('pAMSequence:')) {
      data.pAMSequence = parseString(line.slice(12).trim());
    } else if (line.startsWith('editingProcess:')) {
      const processText = extractBlock(lines, lines.indexOf(line), 'editingProcess:');
      data.editingProcess = parseArray(processText);
    } else if (line.startsWith('outcome:')) {
      data.outcome = parseString(line.slice(8).trim());
    } else if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    }
  }

  return data;
}

function parseTrisomyDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('chromosomeNumber:')) {
      data.chromosomeNumber = parseNumber(line.slice(18).trim());
    } else if (line.startsWith('conditionName:')) {
      data.conditionName = parseString(line.slice(14).trim());
    } else if (line.startsWith('normalKaryotype:')) {
      data.normalKaryotype = parseString(line.slice(17).trim());
    } else if (line.startsWith('abnormalKaryotype:')) {
      data.abnormalKaryotype = parseString(line.slice(19).trim());
    } else if (line.startsWith('cause:')) {
      data.cause = parseString(line.slice(6).trim());
    } else if (line.startsWith('symptoms:')) {
      data.symptoms = parseArray(line.slice(9).trim());
    } else if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    }
  }

  return data;
}

function parseMitosisDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('stages:')) {
      const stagesText = extractBlock(lines, lines.indexOf(line), 'stages:');
      data.stages = parseArray(stagesText);
    } else if (line.startsWith('cellType:')) {
      data.cellType = parseString(line.slice(9).trim());
    } else if (line.startsWith('ploidyChange:')) {
      const ploidyText = extractBlock(lines, lines.indexOf(line), 'ploidyChange:');
      data.ploidyChange = parseObject(ploidyText);
    } else if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    }
  }

  return data;
}

function parseAlleleDirective(contentText: string): any {
  const data: any = {};
  const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    if (line.startsWith('gene:')) {
      data.gene = parseString(line.slice(5).trim());
    } else if (line.startsWith('alleles:')) {
      const allelesText = extractBlock(lines, lines.indexOf(line), 'alleles:');
      data.alleles = parseArray(allelesText);
    } else if (line.startsWith('genotypes:')) {
      const genotypesText = extractBlock(lines, lines.indexOf(line), 'genotypes:');
      data.genotypes = parseArray(genotypesText);
    } else if (line.startsWith('title:')) {
      data.title = parseString(line.slice(6).trim());
    }
  }

  return data;
}

function parseString(value: string): string {
  value = value.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function parseNumber(value: string): number {
  return parseFloat(value.trim());
}

function parseArray(text: string): any[] {
  const cleanText = text.trim().replace(/^\[|\]$/g, '');
  if (!cleanText) return [];
  
  const items: any[] = [];
  let current = '';
  let braceCount = 0;
  let bracketCount = 0;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    
    if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
    else if (char === '[') bracketCount++;
    else if (char === ']') bracketCount--;

    if (char === ',' && braceCount === 0 && bracketCount === 0) {
      if (current.trim()) {
        items.push(parseValue(current.trim()));
      }
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    items.push(parseValue(current.trim()));
  }

  return items;
}

function parseObject(text: string): any {
  const cleanText = text.trim().replace(/^\{|\}$/g, '');
  if (!cleanText) return {};
  
  const obj: any = {};
  let current = '';
  let braceCount = 0;
  let bracketCount = 0;
  let inKey = true;
  let currentKey = '';

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    
    if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
    else if (char === '[') bracketCount++;
    else if (char === ']') bracketCount--;

    if (char === ':' && braceCount === 0 && bracketCount === 0 && inKey) {
      currentKey = parseValue(current.trim());
      current = '';
      inKey = false;
    } else if (char === ',' && braceCount === 0 && bracketCount === 0 && !inKey) {
      if (current.trim()) {
        obj[currentKey] = parseValue(current.trim());
      }
      current = '';
      inKey = true;
      currentKey = '';
    } else {
      current += char;
    }
  }

  if (current.trim() && currentKey) {
    obj[currentKey] = parseValue(current.trim());
  }

  return obj;
}

function parseValue(text: string): any {
  text = text.trim();
  
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1);
  }
  
  if (text === 'true' || text === 'false') {
    return text === 'true';
  }
  
  if (!isNaN(parseFloat(text))) {
    return parseFloat(text);
  }
  
  if (text.startsWith('[') && text.endsWith(']')) {
    return parseArray(text);
  }
  
  if (text.startsWith('{') && text.endsWith('}')) {
    return parseObject(text);
  }
  
  return text;
}

function extractBlock(lines: string[], startIndex: number, key: string): string {
  const startLine = lines[startIndex];
  const content = startLine.slice(key.length).trim();
  
  if (content.startsWith('{') && content.endsWith('}')) {
    return content;
  }

  let result = content;
  let braceCount = (content.match(/\{/g) || []).length - (content.match(/\}/g) || []).length;
  let i = startIndex + 1;

  while (braceCount > 0 && i < lines.length) {
    const line = lines[i];
    result += '\n' + line;
    braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    i++;
  }

  return result;
}

function countLines(text: string): number {
  return text.split('\n').length - 1;
}

function parseNode(nodeText: string): any {
  const cleanText = nodeText.trim().replace(/^\{|\}$/g, '');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l);
  const node: any = {
    children: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const colonIndex = line.indexOf(':');
    
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    if (key === 'id') {
      node.id = parseString(value);
    } else if (key === 'text') {
      node.text = parseString(value);
    } else if (key === 'type') {
      node.type = parseString(value).replace(/['"]/g, '');
    } else if (key === 'level') {
      node.level = parseInt(value, 10);
    } else if (key === 'expanded') {
      node.expanded = value === 'true' || value === 'True';
    } else if (key === 'color') {
      node.color = parseString(value);
    } else if (key === 'textColor') {
      node.textColor = parseString(value);
    } else if (key === 'borderColor') {
      node.borderColor = parseString(value);
    } else if (key === 'children') {
      if (value.startsWith('[') && value.endsWith(']')) {
        const childrenText = value.slice(1, -1).trim();
        if (childrenText) {
          node.children = parseNodeArray(childrenText);
        }
      }
    } else if (key === 'metadata') {
      if (value.startsWith('{') && value.endsWith('}')) {
        node.metadata = parseMetadata(value);
      }
    }
  }

  return node;
}

function parseNodeArray(arrayText: string): any[] {
  const nodes: any[] = [];
  let current = '';
  let braceCount = 0;

  for (let i = 0; i < arrayText.length; i++) {
    const char = arrayText[i];
    
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
    }

    if (char === ',' && braceCount === 0) {
      if (current.trim()) {
        nodes.push(parseNode(current.trim()));
      }
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    nodes.push(parseNode(current.trim()));
  }

  return nodes;
}

function parseMetadata(metadataText: string): any {
  const cleanText = metadataText.trim().replace(/^\{|\}$/g, '');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l);
  const metadata: any = {};

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    metadata[key] = parseString(value);
  }

  return metadata;
}

function parseStyle(styleText: string): any {
  const cleanText = styleText.trim().replace(/^\{|\}$/g, '');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l);
  const style: any = {};

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    if (key === 'nodeShape' || key === 'edgeType' || key === 'fontWeight') {
      style[key] = parseString(value).replace(/['"]/g, '');
    } else if (key === 'nodeWidth' || key === 'nodeHeight' || key === 'borderRadius' || 
               key === 'edgeWidth' || key === 'fontSize' || key === 'levelSpacing' || key === 'nodeSpacing') {
      style[key] = parseInt(value, 10);
    } else if (key === 'curved') {
      style[key] = value === 'true' || value === 'True';
    } else {
      style[key] = parseString(value);
    }
  }

  return style;
}

function parseInteractions(interactionsText: string): MindMapInteraction[] {
  const cleanText = interactionsText.trim().replace(/^\[|\]$/g, '');
  if (!cleanText) return ['click', 'hover', 'zoom', 'drag', 'expand'];

  return cleanText.split(',').map(s => parseString(s).trim().replace(/['"]/g, '') as MindMapInteraction);
}

function parseAnnotations(annotationsText: string): any[] {
  const cleanText = annotationsText.trim().replace(/^\[|\]$/g, '');
  if (!cleanText) return [];

  const annotations: any[] = [];
  let current = '';
  let braceCount = 0;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
    }

    if (char === ',' && braceCount === 0) {
      if (current.trim()) {
        annotations.push(parseAnnotation(current.trim()));
      }
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    annotations.push(parseAnnotation(current.trim()));
  }

  return annotations;
}

function parseAnnotation(annotationText: string): any {
  const cleanText = annotationText.trim().replace(/^\{|\}$/g, '');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l);
  const annotation: any = {};

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    annotation[key] = parseString(value);
  }

  return annotation;
}

export function validateMindMapData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title) {
    errors.push('Missing title');
  }

  if (!data.root) {
    errors.push('Missing root node');
  }

  if (!data.layout) {
    errors.push('Missing layout');
  }

  if (!data.style) {
    errors.push('Missing style');
  }

  if (!data.interactions) {
    errors.push('Missing interactions');
  }

  if (data.root) {
    checkNode(data.root, errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function checkNode(node: any, errors: string[], depth: number = 0, ids: Set<string> = new Set()): void {
  if (depth > 6) {
    errors.push(`Node depth exceeds 6: ${node.id}`);
  }
  
  if (!node.id) {
    errors.push('Node missing id');
  } else if (ids.has(node.id)) {
    errors.push(`Duplicate node id: ${node.id}`);
  } else {
    ids.add(node.id);
  }

  if (node.children) {
    node.children.forEach((child: any) => checkNode(child, errors, depth + 1, ids));
  }
}

export function createA2UIEventHandler(onEvent: (event: A2UIEvent) => void) {
  return {
    handleEvent: (event: A2UIEvent) => {
      onEvent(event);
    },
    
    createEvent: (type: string, componentId: string, data?: Record<string, any>): A2UIEvent => {
      return {
        type,
        componentId,
        data,
        timestamp: Date.now(),
      };
    },
  };
}

export function mergeA2UIPayloads(payloads: A2UIPayload[]): A2UIPayload {
  if (payloads.length === 0) {
    return {
      type: 'card',
      id: 'empty',
      children: [],
    };
  }

  if (payloads.length === 1) {
    return payloads[0];
  }

  return {
    type: 'card',
    id: 'merged',
    children: payloads.flatMap(payload => payload.children),
  };
}
