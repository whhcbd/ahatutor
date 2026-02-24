import type { MindMapData, MindMapInteraction } from '../types/mindmap.types';

export interface ParseResult {
  directives: Array<{
    type: string;
    content: any;
    startIndex: number;
    endIndex: number;
  }>;
  cleanedText: string;
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

  return { directives, cleanedText };
}

function parseDirectiveContent(directiveType: string, contentText: string): any {
  switch (directiveType) {
    case 'MINDMAP':
      return parseMindMapDirective(contentText);
    default:
      throw new Error(`Unknown directive type: ${directiveType}`);
  }
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

function parseString(value: string): string {
  value = value.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
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
