import { BoundValue } from '@shared/types/a2ui.types';

export class DataBindingResolver {
  constructor(private dataModel: Record<string, any>) {}

  resolve(boundValue: BoundValue): any {
    if (boundValue === null || boundValue === undefined) {
      return undefined;
    }

    if (boundValue.literalString !== undefined) {
      return boundValue.literalString;
    }

    if (boundValue.literalNumber !== undefined) {
      return boundValue.literalNumber;
    }

    if (boundValue.literalBoolean !== undefined) {
      return boundValue.literalBoolean;
    }

    if (boundValue.path) {
      return this.resolvePath(boundValue.path, this.dataModel);
    }

    return undefined;
  }

  resolvePath(path: string, data: any): any {
    if (!path || typeof path !== 'string') {
      return undefined;
    }

    if (!data || typeof data !== 'object') {
      return undefined;
    }

    try {
      const parts = this.parsePath(path);
      let current = data;

      for (const part of parts) {
        if (current === null || current === undefined) {
          return undefined;
        }

        if (part.type === 'key') {
          current = current[part.value as string];
        } else if (part.type === 'index') {
          if (Array.isArray(current)) {
            current = current[part.value as number];
          } else {
            return undefined;
          }
        }
      }

      return current;
    } catch (error) {
      console.error(`Failed to resolve path: ${path}`, error);
      return undefined;
    }
  }

  private parsePath(path: string): Array<{ type: 'key' | 'index'; value: string | number }> {
    let normalizedPath = path;

    if (path.startsWith('/') && path.length > 1) {
      normalizedPath = path.substring(1);
    } else if (path.startsWith('#/')) {
      normalizedPath = path.substring(2);
    }

    const parts: Array<{ type: 'key' | 'index'; value: string | number }> = [];
    const segments = normalizedPath.split('/');

    for (const segment of segments) {
      if (segment === '') {
        continue;
      }

      const decoded = this.decodeJsonPointerSegment(segment);

      if (/^\d+$/.test(decoded)) {
        parts.push({ type: 'index', value: parseInt(decoded, 10) });
      } else {
        parts.push({ type: 'key', value: decoded });
      }
    }

    return parts;
  }

  private decodeJsonPointerSegment(segment: string): string {
    return segment
      .replace(/~1/g, '/')
      .replace(/~0/g, '~');
  }

  resolveObject(obj: Record<string, any>): Record<string, any> {
    const resolved: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && 'path' in value) {
        resolved[key] = this.resolve(value as BoundValue);
      } else {
        resolved[key] = value;
      }
    }

    return resolved;
  }

  updateDataModel(path: string, value: any): Record<string, any> {
    const cloned = JSON.parse(JSON.stringify(this.dataModel));

    try {
      const parts = this.parsePath(path);
      let current = cloned;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];

        if (part.type === 'key') {
          if (current[part.value] === undefined) {
            const nextPart = parts[i + 1];
            current[part.value] = nextPart?.type === 'index' ? [] : {};
          }
          current = current[part.value];
        } else if (part.type === 'index') {
          if (!Array.isArray(current)) {
            current = [];
          }
          if (current[part.value] === undefined) {
            current[part.value] = {};
          }
          current = current[part.value];
        }
      }

      const lastPart = parts[parts.length - 1];
      if (lastPart.type === 'key') {
        current[lastPart.value] = value;
      } else if (lastPart.type === 'index') {
        if (!Array.isArray(current)) {
          current = [];
        }
        current[lastPart.value] = value;
      }

      this.dataModel = cloned;
      return cloned;
    } catch (error) {
      console.error(`Failed to update data model at path: ${path}`, error);
      return this.dataModel;
    }
  }

  setDataModel(dataModel: Record<string, any>): void {
    this.dataModel = dataModel;
  }

  getDataModel(): Record<string, any> {
    return this.dataModel;
  }
}
