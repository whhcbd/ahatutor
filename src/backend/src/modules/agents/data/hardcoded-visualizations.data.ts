import type { VisualizationSuggestion } from '@shared/types/agent.types';

export interface HardcodedVisualization {
  concept: string;
  data: Omit<VisualizationSuggestion, 'insights'>;
}

import { MENDELIAN_GENETICS } from './modules/mendelian-genetics';
import { MOLECULAR_GENETICS } from './modules/molecular-genetics';
import { CHROMOSOMAL_GENETICS } from './modules/chromosomal-genetics';
import { POPULATION_GENETICS } from './modules/population-genetics';
import { MODERN_TECHNIQUES } from './modules/modern-techniques';
import { EPIGENETICS } from './modules/epigenetics';
import { BASIC_CONCEPTS } from './modules/basic-concepts';

export const HARDCODED_VISUALIZATIONS: Record<string, Omit<VisualizationSuggestion, 'insights'>> = {
  ...BASIC_CONCEPTS,
  ...MENDELIAN_GENETICS,
  ...MOLECULAR_GENETICS,
  ...CHROMOSOMAL_GENETICS,
  ...POPULATION_GENETICS,
  ...MODERN_TECHNIQUES,
  ...EPIGENETICS,
};

export const HARDCODED_CONCEPTS_COUNT = Object.keys(HARDCODED_VISUALIZATIONS).length;

export const getHardcodedConceptNames = (): string[] => {
  return Object.keys(HARDCODED_VISUALIZATIONS);
};

export const getHardcodedVisualization = (concept: string): Omit<VisualizationSuggestion, 'insights'> | undefined => {
  return HARDCODED_VISUALIZATIONS[concept];
};

export const isHardcodedConcept = (concept: string): boolean => {
  return concept in HARDCODED_VISUALIZATIONS;
};

export const getHardcodedConceptList = getHardcodedConceptNames;
