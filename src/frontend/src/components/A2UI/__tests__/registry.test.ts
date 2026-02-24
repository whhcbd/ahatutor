import { describe, it, expect, beforeEach } from 'vitest';
import {
  A2UI_REGISTRY,
  registerA2UIComponent,
  getA2UIComponent,
  getA2UIComponentRegistration,
  isComponentRegistered,
  unregisterA2UIComponent,
  getRegisteredComponentTypes,
  getComponentsByCategory,
  adaptComponentProps,
  validateComponent,
  getComponentDependencies,
  checkDependenciesSatisfied,
  getComponentMetadata,
  type A2UIComponentRegistration
} from './registry';
import React from 'react';

const TestComponent = () => React.createElement('div', null, 'Test Component');

describe('A2UI Registry', () => {
  beforeEach(() => {
    unregisterA2UIComponent('test-component');
  });

  describe('Component Registration', () => {
    it('should register a new component', () => {
      registerA2UIComponent('test-component', TestComponent, {
        displayName: 'Test Component',
        category: 'test',
        version: '1.0.0'
      });

      expect(isComponentRegistered('test-component')).toBe(true);
    });

    it('should unregister a component', () => {
      registerA2UIComponent('test-component', TestComponent);
      expect(isComponentRegistered('test-component')).toBe(true);

      const result = unregisterA2UIComponent('test-component');
      expect(result).toBe(true);
      expect(isComponentRegistered('test-component')).toBe(false);
    });

    it('should return false when unregistering non-existent component', () => {
      const result = unregisterA2UIComponent('non-existent');
      expect(result).toBe(false);
    });

    it('should get registered component', () => {
      registerA2UIComponent('test-component', TestComponent);
      const component = getA2UIComponent('test-component');
      expect(component).toBe(TestComponent);
    });

    it('should return undefined for non-existent component', () => {
      const component = getA2UIComponent('non-existent');
      expect(component).toBeUndefined();
    });
  });

  describe('Component Metadata', () => {
    it('should get component registration', () => {
      const options: Partial<A2UIComponentRegistration> = {
        displayName: 'Test Component',
        category: 'test',
        version: '1.0.0'
      };
      registerA2UIComponent('test-component', TestComponent, options);

      const registration = getA2UIComponentRegistration('test-component');
      expect(registration).toBeDefined();
      expect(registration?.displayName).toBe('Test Component');
      expect(registration?.category).toBe('test');
      expect(registration?.version).toBe('1.0.0');
    });

    it('should get component metadata', () => {
      registerA2UIComponent('test-component', TestComponent, {
        displayName: 'Test Component',
        category: 'test',
        version: '1.0.0'
      });

      const metadata = getComponentMetadata('test-component');
      expect(metadata).toEqual({
        displayName: 'Test Component',
        category: 'test',
        version: '1.0.0'
      });
    });

    it('should return null for non-existent component metadata', () => {
      const metadata = getComponentMetadata('non-existent');
      expect(metadata).toBeNull();
    });
  });

  describe('Component Listing', () => {
    beforeEach(() => {
      registerA2UIComponent('test-1', TestComponent, { category: 'category-a' });
      registerA2UIComponent('test-2', TestComponent, { category: 'category-a' });
      registerA2UIComponent('test-3', TestComponent, { category: 'category-b' });
    });

    afterEach(() => {
      unregisterA2UIComponent('test-1');
      unregisterA2UIComponent('test-2');
      unregisterA2UIComponent('test-3');
    });

    it('should get all registered component types', () => {
      const types = getRegisteredComponentTypes();
      expect(types).toContain('ahatutor-punnett-square');
      expect(types).toContain('ahatutor-inheritance-path');
      expect(types.length).toBeGreaterThan(2);
    });

    it('should get components by category', () => {
      const categoryA = getComponentsByCategory('category-a');
      expect(categoryA).toHaveProperty('test-1');
      expect(categoryA).toHaveProperty('test-2');
      expect(categoryA).not.toHaveProperty('test-3');

      const categoryB = getComponentsByCategory('category-b');
      expect(categoryB).toHaveProperty('test-3');
      expect(categoryB).not.toHaveProperty('test-1');
    });
  });

  describe('Component Props Adaptation', () => {
    it('should apply default props', () => {
      registerA2UIComponent('test-component', TestComponent, {
        defaultProps: {
          color: 'red',
          size: 'medium'
        }
      });

      const adapted = adaptComponentProps('test-component', { size: 'large' });
      expect(adapted).toEqual({
        color: 'red',
        size: 'large'
      });
    });

    it('should apply adapter function', () => {
      const adapter = (props: any) => ({
        ...props,
        computedValue: props.value * 2
      });

      registerA2UIComponent('test-component', TestComponent, { adapter });

      const adapted = adaptComponentProps('test-component', { value: 5 });
      expect(adapted).toEqual({
        value: 5,
        computedValue: 10
      });
    });

    it('should apply both default props and adapter', () => {
      const adapter = (props: any) => ({
        ...props,
        doubled: props.base * 2
      });

      registerA2UIComponent('test-component', TestComponent, {
        defaultProps: { base: 10 },
        adapter
      });

      const adapted = adaptComponentProps('test-component', { base: 5 });
      expect(adapted).toEqual({
        base: 5,
        doubled: 10
      });
    });

    it('should return original props for unregistered component', () => {
      const props = { foo: 'bar' };
      const adapted = adaptComponentProps('non-existent', props);
      expect(adapted).toBe(props);
    });
  });

  describe('Component Validation', () => {
    it('should validate registered component', () => {
      registerA2UIComponent('test-component', TestComponent);
      const validation = validateComponent('test-component');
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should fail validation for unregistered component', () => {
      const validation = validateComponent('non-existent');
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Component type "non-existent" is not registered');
    });

    it('should detect deprecated components', () => {
      registerA2UIComponent('test-component', TestComponent, {
        deprecated: true
      });

      const validation = validateComponent('test-component');
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Component "test-component" is deprecated');
    });
  });

  describe('Component Dependencies', () => {
    it('should get component dependencies', () => {
      registerA2UIComponent('test-component', TestComponent, {
        dependencies: ['dep-1', 'dep-2']
      });

      const deps = getComponentDependencies('test-component');
      expect(deps).toEqual(['dep-1', 'dep-2']);
    });

    it('should return empty array for component without dependencies', () => {
      registerA2UIComponent('test-component', TestComponent);
      const deps = getComponentDependencies('test-component');
      expect(deps).toEqual([]);
    });

    it('should check if dependencies are satisfied', () => {
      registerA2UIComponent('dep-1', TestComponent);
      registerA2UIComponent('dep-2', TestComponent);
      registerA2UIComponent('test-component', TestComponent, {
        dependencies: ['dep-1', 'dep-2']
      });

      const satisfied = checkDependenciesSatisfied('test-component');
      expect(satisfied).toBe(true);
    });

    it('should detect unsatisfied dependencies', () => {
      registerA2UIComponent('test-component', TestComponent, {
        dependencies: ['non-existent-dep-1', 'non-existent-dep-2']
      });

      const satisfied = checkDependenciesSatisfied('test-component');
      expect(satisfied).toBe(false);
    });

    it('should return true for component without dependencies', () => {
      registerA2UIComponent('test-component', TestComponent);
      const satisfied = checkDependenciesSatisfied('test-component');
      expect(satisfied).toBe(true);
    });
  });

  describe('Built-in Components', () => {
    it('should have punnett-square component registered', () => {
      expect(isComponentRegistered('ahatutor-punnett-square')).toBe(true);
      expect(getA2UIComponent('ahatutor-punnett-square')).toBeDefined();
    });

    it('should have inheritance-path component registered', () => {
      expect(isComponentRegistered('ahatutor-inheritance-path')).toBe(true);
      expect(getA2UIComponent('ahatutor-inheritance-path')).toBeDefined();
    });

    it('should have knowledge-graph component registered', () => {
      expect(isComponentRegistered('ahatutor-knowledge-graph')).toBe(true);
      expect(getA2UIComponent('ahatutor-knowledge-graph')).toBeDefined();
    });

    it('should have meiosis-animation component registered', () => {
      expect(isComponentRegistered('ahatutor-meiosis-animation')).toBe(true);
      expect(getA2UIComponent('ahatutor-meiosis-animation')).toBeDefined();
    });

    it('should have probability-distribution component registered', () => {
      expect(isComponentRegistered('ahatutor-probability-distribution')).toBe(true);
      expect(getA2UIComponent('ahatutor-probability-distribution')).toBeDefined();
    });

    it('should have dna-replication component registered', () => {
      expect(isComponentRegistered('ahatutor-dna-replication')).toBe(true);
      expect(getA2UIComponent('ahatutor-dna-replication')).toBeDefined();
    });

    it('should have transcription component registered', () => {
      expect(isComponentRegistered('ahatutor-transcription')).toBe(true);
      expect(getA2UIComponent('ahatutor-transcription')).toBeDefined();
    });

    it('should have translation component registered', () => {
      expect(isComponentRegistered('ahatutor-translation')).toBe(true);
      expect(getA2UIComponent('ahatutor-translation')).toBeDefined();
    });

    it('should have gene-structure component registered', () => {
      expect(isComponentRegistered('ahatutor-gene-structure')).toBe(true);
      expect(getA2UIComponent('ahatutor-gene-structure')).toBeDefined();
    });

    it('should have crispr component registered', () => {
      expect(isComponentRegistered('ahatutor-crispr')).toBe(true);
      expect(getA2UIComponent('ahatutor-crispr')).toBeDefined();
    });

    it('should have trisomy component registered', () => {
      expect(isComponentRegistered('ahatutor-trisomy')).toBe(true);
      expect(getA2UIComponent('ahatutor-trisomy')).toBeDefined();
    });

    it('should have mitosis component registered', () => {
      expect(isComponentRegistered('ahatutor-mitosis')).toBe(true);
      expect(getA2UIComponent('ahatutor-mitosis')).toBeDefined();
    });

    it('should have allele component registered', () => {
      expect(isComponentRegistered('ahatutor-allele')).toBe(true);
      expect(getA2UIComponent('ahatutor-allele')).toBeDefined();
    });

    it('should have chromosome-behavior component registered', () => {
      expect(isComponentRegistered('ahatutor-chromosome-behavior')).toBe(true);
      expect(getA2UIComponent('ahatutor-chromosome-behavior')).toBeDefined();
    });

    it('should have pedigree-chart component registered', () => {
      expect(isComponentRegistered('ahatutor-pedigree-chart')).toBe(true);
      expect(getA2UIComponent('ahatutor-pedigree-chart')).toBeDefined();
    });
  });
});
