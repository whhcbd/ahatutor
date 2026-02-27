import { BoundValue } from '@shared/types/a2ui.types';
import { DataBindingResolver } from '../../../utils/data-binding-resolver';

export interface ContextResolveOptions {
  recursive?: boolean;
  resolveTemplates?: boolean;
  preserveLiterals?: boolean;
}

export class ContextResolver {
  constructor(private resolver: DataBindingResolver) {}

  resolve(
    context: Record<string, any> | any[] | undefined,
    options: ContextResolveOptions = {}
  ): Record<string, any> | any[] | undefined {
    if (context === undefined || context === null) {
      return context;
    }

    const opts: Required<ContextResolveOptions> = {
      recursive: options.recursive ?? true,
      resolveTemplates: options.resolveTemplates ?? true,
      preserveLiterals: options.preserveLiterals ?? false,
    };

    if (Array.isArray(context)) {
      return this.resolveArray(context, opts);
    }

    if (typeof context === 'object') {
      return this.resolveObject(context as Record<string, any>, opts);
    }

    return context;
  }

  private resolveObject(
    obj: Record<string, any>,
    options: Required<ContextResolveOptions>
  ): Record<string, any> {
    const resolved: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = this.resolveValue(value, options);
    }

    return resolved;
  }

  private resolveArray(
    arr: any[],
    options: Required<ContextResolveOptions>
  ): any[] {
    return arr.map(item => this.resolveValue(item, options));
  }

  private resolveValue(
    value: any,
    options: Required<ContextResolveOptions>
  ): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (this.isBoundValue(value)) {
      if (options.preserveLiterals) {
        return value;
      }
      return this.resolver.resolve(value as BoundValue);
    }

    if (options.recursive) {
      if (Array.isArray(value)) {
        return this.resolveArray(value, options);
      }

      if (typeof value === 'object') {
        return this.resolveObject(value, options);
      }
    }

    return value;
  }

  private isBoundValue(value: any): value is BoundValue {
    return (
      value !== null &&
      typeof value === 'object' &&
      ('path' in value ||
        'literalString' in value ||
        'literalNumber' in value ||
        'literalBoolean' in value)
    );
  }

  resolveTemplate(
    template: {
      dataBinding: string;
      componentId: string;
      context?: Record<string, any>;
    }
  ): any[] | Record<string, any> | undefined {
    const dataArray = this.resolver.resolvePath(
      template.dataBinding,
      this.resolver.getDataModel()
    );

    if (dataArray === undefined || dataArray === null) {
      return [];
    }

    if (!Array.isArray(dataArray)) {
      console.warn(`Template data binding must resolve to an array, got:`, dataArray);
      return [];
    }

    return dataArray;
  }

  resolveTemplateWithContext(
    template: {
      dataBinding: string;
      componentId: string;
      context?: Record<string, any>;
    }
  ): Array<{
    data: any;
    context?: Record<string, any>;
    index: number;
  }> {
    const dataArray = this.resolveTemplate(template);

    if (!Array.isArray(dataArray)) {
      return [];
    }

    return dataArray.map((data, index) => ({
      data,
      context: template.context
        ? this.resolve(template.context, { recursive: true })
        : undefined,
      index,
    }));
  }

  resolvePartialContext(
    context: Record<string, any>,
    keys: string[],
    options: ContextResolveOptions = {}
  ): Record<string, any> {
    const partial: Record<string, any> = {};

    for (const key of keys) {
      if (key in context) {
        partial[key] = this.resolveValue(context[key], {
          recursive: options.recursive ?? true,
          resolveTemplates: options.resolveTemplates ?? true,
          preserveLiterals: options.preserveLiterals ?? false,
        });
      }
    }

    return partial;
  }

  resolveDeepPath(
    context: Record<string, any>,
    path: string
  ): any {
    const resolved = this.resolve(context, { recursive: false });
    return this.resolver.resolvePath(path, resolved);
  }

  mergeContexts(
    base: Record<string, any>,
    override: Record<string, any>,
    options: ContextResolveOptions = {}
  ): Record<string, any> {
    const resolvedBase = this.resolve(base, options);
    const resolvedOverride = this.resolve(override, options);

    return {
      ...resolvedBase,
      ...resolvedOverride,
    };
  }

  flattenContext(
    context: Record<string, any>,
    separator: string = '.'
  ): Record<string, any> {
    const flattened: Record<string, any> = {};

    const flatten = (obj: any, prefix: string = '') => {
      if (obj === null || obj === undefined) {
        return;
      }

      if (typeof obj !== 'object' || Array.isArray(obj)) {
        flattened[prefix] = obj;
        return;
      }

      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}${separator}${key}` : key;
        flatten(value, newKey);
      }
    };

    flatten(context);

    return flattened;
  }

  validateContext(
    context: Record<string, any>,
    schema?: Record<string, any>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!schema) {
      return { valid: true, errors: [] };
    }

    for (const [key, schemaValue] of Object.entries(schema)) {
      if (!(key in context)) {
        errors.push(`Missing required key: ${key}`);
        continue;
      }

      const value = context[key];

      if (schemaValue.required && (value === undefined || value === null)) {
        errors.push(`Required key is null or undefined: ${key}`);
      }

      if (schemaValue.type && typeof value !== schemaValue.type) {
        errors.push(
          `Key ${key} has wrong type. Expected ${schemaValue.type}, got ${typeof value}`
        );
      }

      if (schemaValue.enum && !schemaValue.enum.includes(value)) {
        errors.push(
          `Key ${key} has invalid value. Expected one of ${schemaValue.enum.join(', ')}, got ${value}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
