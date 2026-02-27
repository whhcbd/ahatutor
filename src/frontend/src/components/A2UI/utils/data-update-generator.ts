import { DataModelUpdateMessage } from '@shared/types/a2ui.types';

export interface DataUpdateContent {
  key: string;
  valueString?: string;
  valueNumber?: number;
  valueBoolean?: boolean;
  valueMap?: DataUpdateContent[];
}

export interface DataUpdateOptions {
  merge?: boolean;
  append?: boolean;
  remove?: boolean;
}

export class DataUpdateGenerator {
  generateDataModelUpdate(
    surfaceId: string,
    path: string,
    updates: Record<string, any>,
    options?: DataUpdateOptions
  ): DataModelUpdateMessage {
    const contents = this.convertUpdatesToContents(updates, options);

    return {
      dataModelUpdate: {
        surfaceId,
        path,
        contents,
      },
    };
  }

  generateBatchUpdates(
    surfaceId: string,
    updates: Array<{
      path: string;
      data: Record<string, any>;
      options?: DataUpdateOptions;
    }>
  ): DataModelUpdateMessage[] {
    return updates.map(update =>
      this.generateDataModelUpdate(
        surfaceId,
        update.path,
        update.data,
        update.options
      )
    );
  }

  generatePatchUpdate(
    surfaceId: string,
    patches: Array<{
      path: string;
      op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
      value?: any;
      from?: string;
    }>
  ): DataModelUpdateMessage[] {
    const messages: DataModelUpdateMessage[] = [];

    for (const patch of patches) {
      const pathParts = patch.path.split('/').filter(p => p);
      const key = pathParts.pop() || '';

      const contents: DataUpdateContent[] = [];

      if (patch.op === 'remove') {
        contents.push({
          key,
          valueMap: [],
          valueBoolean: false,
        });
      } else if (patch.value !== undefined) {
        const content = this.convertValueToContent(patch.value, key);
        contents.push(content);
      }

      if (contents.length > 0) {
        const basePath = pathParts.length > 0 ? '/' + pathParts.join('/') : '';
        messages.push({
          dataModelUpdate: {
            surfaceId,
            path: basePath || undefined,
            contents,
          },
        });
      }
    }

    return messages;
  }

  generateIncrementalUpdate(
    surfaceId: string,
    path: string,
    delta: any,
    currentData: any
  ): DataModelUpdateMessage {
    const mergedData = this.mergeData(currentData, delta);
    const contents = this.convertUpdatesToContents(mergedData);

    return {
      dataModelUpdate: {
        surfaceId,
        path,
        contents,
      },
    };
  }

  generateArrayUpdate(
    surfaceId: string,
    path: string,
    index: number,
    item: any,
    operation: 'replace' | 'insert' | 'delete' = 'replace'
  ): DataModelUpdateMessage {
    const contents: DataUpdateContent[] = [];

    if (operation === 'delete') {
      contents.push({
        key: String(index),
        valueBoolean: false,
      });
    } else {
      const content = this.convertValueToContent(item, String(index));
      contents.push(content);
    }

    return {
      dataModelUpdate: {
        surfaceId,
        path: path + '/' + String(index),
        contents,
      },
    };
  }

  private convertUpdatesToContents(
    updates: Record<string, any>,
    options?: DataUpdateOptions
  ): DataUpdateContent[] {
    const contents: DataUpdateContent[] = [];

    for (const [key, value] of Object.entries(updates)) {
      const content = this.convertValueToContent(value, key, options);
      contents.push(content);
    }

    return contents;
  }

  private convertValueToContent(
    value: any,
    key: string,
    options?: DataUpdateOptions
  ): DataUpdateContent {
    if (value === null || value === undefined) {
      return {
        key,
        valueBoolean: false,
      };
    }

    if (typeof value === 'string') {
      return {
        key,
        valueString: value,
      };
    }

    if (typeof value === 'number') {
      return {
        key,
        valueNumber: value,
      };
    }

    if (typeof value === 'boolean') {
      return {
        key,
        valueBoolean: value,
      };
    }

    if (Array.isArray(value)) {
      return {
        key,
        valueMap: value.map((item, index) =>
          this.convertValueToContent(item, String(index), options)
        ),
      };
    }

    if (typeof value === 'object') {
      return {
        key,
        valueMap: Object.entries(value).map(([k, v]) =>
          this.convertValueToContent(v, k, options)
        ),
      };
    }

    return {
      key,
      valueString: String(value),
    };
  }

  private mergeData(current: any, delta: any): any {
    if (delta === null || delta === undefined) {
      return current;
    }

    if (current === null || current === undefined) {
      return delta;
    }

    if (typeof delta !== typeof current) {
      return delta;
    }

    if (Array.isArray(delta) && Array.isArray(current)) {
      return [...delta];
    }

    if (typeof delta === 'object' && typeof current === 'object') {
      const merged = { ...current };
      for (const [key, value] of Object.entries(delta)) {
        merged[key] = this.mergeData(current[key], value);
      }
      return merged;
    }

    return delta;
  }
}

export const dataUpdateGenerator = new DataUpdateGenerator();
