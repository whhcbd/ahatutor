import React, { useState } from 'react';
import { VisualizationSuggestion } from '@shared/types/agent.types';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'color' | 'range' | 'checkbox' | 'multiselect';
  defaultValue?: string | number | boolean | string[];
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  placeholder?: string;
  description?: string;
}

interface DynamicFormGeneratorProps {
  visualizationType: VisualizationSuggestion['type'];
  fields: FormField[];
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel?: () => void;
  initialValues?: Record<string, unknown>;
}

export function DynamicFormGenerator({ 
  visualizationType, 
  fields, 
  onSubmit, 
  onCancel,
  initialValues 
}: DynamicFormGeneratorProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues || {});

  const handleChange = (name: string, value: unknown) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={(values[field.name] as string) || field.defaultValue || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={(values[field.name] as number) ?? field.defaultValue ?? ''}
            onChange={(e) => handleChange(field.name, Number(e.target.value))}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={(values[field.name] as string) || field.defaultValue || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'select':
        return (
          <select
            value={(values[field.name] as string) || field.defaultValue || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(values[field.name] as string) || field.defaultValue || '#000000'}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <span className="text-sm text-gray-600">
              {(values[field.name] as string) || field.defaultValue || '#000000'}
            </span>
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={(values[field.name] as number) ?? field.defaultValue ?? 0}
              onChange={(e) => handleChange(field.name, Number(e.target.value))}
              min={field.min}
              max={field.max}
              step={field.step}
              className="w-full"
            />
            <div className="text-sm text-gray-600 text-center">
              {(values[field.name] as number) ?? field.defaultValue ?? 0}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(values[field.name] as boolean) ?? field.defaultValue ?? false}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="w-4 h-4 text-blue-500 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">{field.label}</span>
          </label>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const selected = (values[field.name] as string[]) || [];
              const isSelected = selected.includes(option.value);
              return (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newSelected = isSelected
                        ? selected.filter(v => v !== option.value)
                        : [...selected, option.value];
                      handleChange(field.name, newSelected);
                    }}
                    className="w-4 h-4 text-blue-500 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">
        编辑 {getVisualizationTypeName(visualizationType)}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1">
            {field.type !== 'checkbox' && (
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            {renderField(field)}
          </div>
        ))}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            保存
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function getVisualizationTypeName(type: VisualizationSuggestion['type']): string {
  const names: Record<VisualizationSuggestion['type'], string> = {
    knowledge_graph: '知识图谱',
    animation: '动画',
    chart: '图表',
    diagram: '示意图',
    punnett_square: 'Punnett 方格',
    inheritance_path: '遗传路径',
    pedigree_chart: '系谱图',
    probability_distribution: '概率分布',
    meiosis_animation: '减数分裂动画',
    chromosome_behavior: '染色体行为',
  };
  return names[type] || '可视化';
}

export function getFormFieldsForVisualizationType(type: VisualizationSuggestion['type']): FormField[] {
  const commonFields: FormField[] = [
    {
      name: 'title',
      label: '标题',
      type: 'text',
      defaultValue: '',
      required: true,
    },
    {
      name: 'description',
      label: '描述',
      type: 'textarea',
      defaultValue: '',
      required: false,
    },
  ];

  switch (type) {
    case 'punnett_square':
      return [
        ...commonFields,
        {
          name: 'parentalGenotypes',
          label: '亲本基因型',
          type: 'text',
          placeholder: '例如: Aa × Aa',
          required: true,
        },
        {
          name: 'trait',
          label: '性状名称',
          type: 'text',
          placeholder: '例如: 种子颜色',
          required: true,
        },
        {
          name: 'dominantPhenotype',
          label: '显性表型',
          type: 'text',
          placeholder: '例如: 黄色',
          required: true,
        },
        {
          name: 'recessivePhenotype',
          label: '隐性表型',
          type: 'text',
          placeholder: '例如: 绿色',
          required: true,
        },
      ];

    case 'probability_distribution':
      return [
        ...commonFields,
        {
          name: 'categories',
          label: '类别（用逗号分隔）',
          type: 'text',
          placeholder: '例如: 显性纯合, 杂合, 隐性纯合',
          required: true,
        },
        {
          name: 'values',
          label: '概率值（用逗号分隔）',
          type: 'text',
          placeholder: '例如: 0.25, 0.5, 0.25',
          required: true,
        },
      ];

    case 'inheritance_path':
      return [
        ...commonFields,
        {
          name: 'generations',
          label: '代数',
          type: 'number',
          min: 1,
          max: 10,
          defaultValue: 3,
          required: true,
        },
        {
          name: 'inheritancePattern',
          label: '遗传模式',
          type: 'select',
          options: [
            { label: '常染色体显性', value: 'autosomal_dominant' },
            { label: '常染色体隐性', value: 'autosomal_recessive' },
            { label: 'X连锁显性', value: 'x_dominant' },
            { label: 'X连锁隐性', value: 'x_recessive' },
          ],
          required: true,
        },
      ];

    default:
      return commonFields;
  }
}
