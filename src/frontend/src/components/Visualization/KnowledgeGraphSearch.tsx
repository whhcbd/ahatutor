import React, { useState, useMemo } from 'react';
import { GraphNode } from './KnowledgeGraph';
import { getMasteryColor } from '../../constants/visualization-colors';

interface KnowledgeGraphSearchProps {
  nodes: GraphNode[];
  onSearchResults?: (nodeIds: string[]) => void;
  onFilterChange?: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  types: string[];
  masteryRange: { min: number; max: number };
  levels: number[];
}

export function KnowledgeGraphSearch({ nodes, onSearchResults, onFilterChange }: KnowledgeGraphSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    types: [],
    masteryRange: { min: 0, max: 100 },
    levels: [],
  });

  const availableTypes = useMemo(() => {
    return Array.from(new Set(nodes.map(n => n.type)));
  }, [nodes]);

  const availableLevels = useMemo(() => {
    return Array.from(new Set(nodes.map(n => n.level))).sort((a, b) => a - b);
  }, [nodes]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, filters);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    applyFilters(searchTerm, newFilters);
  };

  const applyFilters = (term: string, currentFilters: FilterOptions) => {
    let filteredNodes = nodes;

    if (term) {
      const lowerTerm = term.toLowerCase();
      filteredNodes = filteredNodes.filter(n => 
        n.name.toLowerCase().includes(lowerTerm) ||
        n.type.toLowerCase().includes(lowerTerm)
      );
    }

    if (currentFilters.types.length > 0) {
      filteredNodes = filteredNodes.filter(n => currentFilters.types.includes(n.type));
    }

    if (currentFilters.masteryRange.min > 0 || currentFilters.masteryRange.max < 100) {
      filteredNodes = filteredNodes.filter(n => 
        n.mastery >= currentFilters.masteryRange.min &&
        n.mastery <= currentFilters.masteryRange.max
      );
    }

    if (currentFilters.levels.length > 0) {
      filteredNodes = filteredNodes.filter(n => currentFilters.levels.includes(n.level));
    }

    onSearchResults?.(filteredNodes.map(n => n.id));
  };

  const toggleType = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    handleFilterChange({ ...filters, types: newTypes });
  };

  const toggleLevel = (level: number) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter(l => l !== level)
      : [...filters.levels, level];
    handleFilterChange({ ...filters, levels: newLevels });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          搜索节点
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="输入节点名称或类型..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          节点类型
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTypes.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.types.includes(type)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          掌握度范围: {filters.masteryRange.min}% - {filters.masteryRange.max}%
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={filters.masteryRange.min}
            onChange={(e) => handleFilterChange({
              ...filters,
              masteryRange: { ...filters.masteryRange, min: Number(e.target.value) }
            })}
            className="flex-1"
          />
          <input
            type="range"
            min="0"
            max="100"
            value={filters.masteryRange.max}
            onChange={(e) => handleFilterChange({
              ...filters,
              masteryRange: { ...filters.masteryRange, max: Number(e.target.value) }
            })}
            className="flex-1"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          知识等级
        </label>
        <div className="flex flex-wrap gap-2">
          {availableLevels.map(level => (
            <button
              key={level}
              onClick={() => toggleLevel(level)}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.levels.includes(level)
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              等级 {level}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setSearchTerm('');
          setFilters({
            types: [],
            masteryRange: { min: 0, max: 100 },
            levels: [],
          });
          onSearchResults?.(nodes.map(n => n.id));
        }}
        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
      >
        重置筛选
      </button>
    </div>
  );
}
