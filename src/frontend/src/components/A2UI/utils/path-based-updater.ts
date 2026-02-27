import { DataBindingResolver } from '../../../utils/data-binding-resolver';
import { DataUpdateContent } from './data-update-generator';

export interface PathUpdateOptions {
  createMissing?: boolean;
  overwrite?: boolean;
  mergeArrays?: boolean;
}

export class PathBasedUpdater {
  constructor(private resolver: DataBindingResolver) {}

  updateAtPath(
    path: string,
    contents: DataUpdateContent[],
    options: PathUpdateOptions = {}
  ): Record<string, any> {
    const currentData = this.resolver.getDataModel();
    const updatedData = { ...currentData };

    this.applyPathUpdate(updatedData, path, contents, options);

    return updatedData;
  }

  private applyPathUpdate(
    data: Record<string, any>,
    path: string,
    contents: DataUpdateContent[],
    options: PathUpdateOptions
  ): void {
    if (!path || path === '/') {
      for (const content of contents) {
        this.applyContentUpdate(data, content, '', options);
      }
      return;
    }

    const parts = path.split('/').filter(p => p);
    let current = data;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];

      if (!(part in current)) {
        if (options.createMissing) {
          const nextPart = parts[i + 1];
          current[part] = /^\d+$/.test(nextPart) ? [] : {};
        } else {
          console.warn(`Path ${path} not found and createMissing is false`);
          return;
        }
      }

      current = current[part];
    }

    const lastPart = parts[parts.length - 1];
    this.applyContentUpdate(current, contents, lastPart, options);
  }

  private applyContentUpdate(
    parent: any,
    content: DataUpdateContent | DataUpdateContent[],
    key: string,
    options: PathUpdateOptions
  ): void {
    if (Array.isArray(content)) {
      for (const item of content) {
        this.applySingleContentUpdate(parent, item, key, options);
      }
    } else {
      this.applySingleContentUpdate(parent, content, key, options);
    }
  }

  private applySingleContentUpdate(
    parent: any,
    content: DataUpdateContent,
    key: string,
    options: PathUpdateOptions
  ): void {
    const value = this.extractValueFromContent(content);

    if (Array.isArray(parent)) {
      const index = parseInt(key, 10);

      if (isNaN(index)) {
        console.warn(`Invalid array index: ${key}`);
        return;
      }

      if (Array.isArray(content.valueMap) && content.valueMap.length === 0 && content.valueBoolean === false) {
        parent.splice(index, 1);
      } else {
        if (options.overwrite !== false) {
          parent[index] = value;
        } else {
          if (parent[index] === undefined) {
            parent[index] = value;
          }
        }
      }
    } else {
      if (Array.isArray(content.valueMap) && content.valueMap.length === 0 && content.valueBoolean === false) {
        delete parent[key];
      } else {
        if (options.overwrite !== false) {
          parent[key] = value;
        } else {
          if (parent[key] === undefined) {
            parent[key] = value;
          }
        }
      }
    }
  }

  private extractValueFromContent(content: DataUpdateContent): any {
    if (content.valueString !== undefined) {
      return content.valueString;
    }
    if (content.valueNumber !== undefined) {
      return content.valueNumber;
    }
    if (content.valueBoolean !== undefined) {
      return content.valueBoolean;
    }
    if (content.valueMap !== undefined) {
      return this.convertValueMapToObject(content.valueMap);
    }
    return undefined;
  }

  private convertValueMapToObject(
    valueMap: DataUpdateContent[]
  ): Record<string, any> | any[] {
    if (valueMap.length === 0) {
      return {};
    }

    const isArray = valueMap.every((item, index) => item.key === String(index));

    if (isArray) {
      return valueMap.map(item => this.extractValueFromContent(item));
    }

    const obj: Record<string, any> = {};
    for (const item of valueMap) {
      const value = this.extractValueFromContent(item);
      obj[item.key] = value;
    }
    return obj;
  }

  diffData(
    oldData: Record<string, any>,
    newData: Record<string, any>,
    basePath: string = ''
  ): Array<{ path: string; contents: DataUpdateContent[] }> {
    const updates: Array<{ path: string; contents: DataUpdateContent[] }> = [];
    const keys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);

    for (const key of keys) {
      const oldValue = oldData[key];
      const newValue = newData[key];
      const currentPath = basePath ? `${basePath}/${key}` : key;

      if (!this.isEqual(oldValue, newValue)) {
        if (typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue)) {
          if (typeof oldValue === 'object' && oldValue !== null && !Array.isArray(oldValue)) {
            const nestedUpdates = this.diffData(oldValue, newValue, currentPath);
            updates.push(...nestedUpdates);
          } else {
            updates.push({
              path: currentPath,
              contents: this.convertObjectToContents(newValue),
            });
          }
        } else {
          updates.push({
            path: basePath || '/',
            contents: [this.convertToContent(key, newValue)],
          });
        }
      }
    }

    return updates;
  }

  private isEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, i) => this.isEqual(item, b[i]));
    }

    if (typeof a === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => this.isEqual(a[key], b[key]));
    }

    return false;
  }

  private convertObjectToContents(
    obj: Record<string, any>
  ): DataUpdateContent[] {
    const contents: DataUpdateContent[] = [];

    for (const [key, value] of Object.entries(obj)) {
      contents.push(this.convertToContent(key, value));
    }

    return contents;
  }

  private convertToContent(key: string, value: any): DataUpdateContent {
    if (typeof value === 'string') {
      return { key, valueString: value };
    }
    if (typeof value === 'number') {
      return { key, valueNumber: value };
    }
    if (typeof value === 'boolean') {
      return { key, valueBoolean: value };
    }
    if (Array.isArray(value)) {
      return {
        key,
        valueMap: value.map((item, index) =>
          this.convertToContent(String(index), item)
        ),
      };
    }
    if (typeof value === 'object' && value !== null) {
      return {
        key,
        valueMap: Object.entries(value).map(([k, v]) =>
          this.convertToContent(k, v)
        ),
      };
    }
    return { key, valueString: String(value) };
  }
}
