import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { A2UIPayload } from '@shared/types/a2ui.types';

export interface A2UIState {
  currentPayload: A2UIPayload | null;
  registeredComponents: Record<string, boolean>;
  isStreaming: boolean;
  streamingContent: string;
  isRendering: boolean;
  renderError: Error | null;
  renderTime: number;
  lastUpdated: number;
  eventHistory: Array<{
    type: string;
    componentId: string;
    data?: Record<string, any>;
    timestamp: number;
  }>;
  componentStates: Record<string, any>;
  preferences: {
    enableAnimations: boolean;
    autoPlay: boolean;
    animationSpeed: number;
    theme: 'light' | 'dark';
  };
  cache: Record<string, A2UIPayload>;
  
  setCurrentPayload: (payload: A2UIPayload) => void;
  clearCurrentPayload: () => void;
  registerComponent: (type: string) => void;
  unregisterComponent: (type: string) => void;
  startStreaming: () => void;
  appendStreamingContent: (content: string) => void;
  completeStreaming: () => void;
  setRendering: (isRendering: boolean) => void;
  setRenderError: (error: Error | null) => void;
  updatePerformance: (renderTime: number) => void;
  logEvent: (event: {
    type: string;
    componentId: string;
    data?: Record<string, any>;
  }) => void;
  setComponentState: (componentId: string, state: any) => void;
  getComponentState: (componentId: string) => any;
  clearComponentState: (componentId: string) => void;
  updatePreferences: (preferences: Partial<A2UIState['preferences']>) => void;
  cachePayload: (key: string, payload: A2UIPayload) => void;
  getCachedPayload: (key: string) => A2UIPayload | undefined;
  clearCache: () => void;
  reset: () => void;
}

const initialState: A2UIState = {
  currentPayload: null,
  registeredComponents: {},
  isStreaming: false,
  streamingContent: '',
  isRendering: false,
  renderError: null,
  renderTime: 0,
  lastUpdated: Date.now(),
  eventHistory: [],
  componentStates: {},
  preferences: {
    enableAnimations: true,
    autoPlay: true,
    animationSpeed: 1,
    theme: 'light'
  },
  cache: {},
  setCurrentPayload: () => {},
  clearCurrentPayload: () => {},
  registerComponent: () => {},
  unregisterComponent: () => {},
  startStreaming: () => {},
  appendStreamingContent: () => {},
  completeStreaming: () => {},
  setRendering: () => {},
  setRenderError: () => {},
  updatePerformance: () => {},
  logEvent: () => {},
  setComponentState: () => {},
  getComponentState: () => undefined,
  clearComponentState: () => {},
  updatePreferences: () => {},
  cachePayload: () => {},
  getCachedPayload: () => undefined,
  clearCache: () => {},
  reset: () => {}
};

export const useA2UIStore = create<A2UIState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    
    setCurrentPayload: (payload) => set({ 
      currentPayload: payload, 
      lastUpdated: Date.now() 
    }),
    
    clearCurrentPayload: () => set({
      currentPayload: null,
      renderError: null,
      renderTime: 0
    }),
    
    registerComponent: (type) => set((state) => ({
      registeredComponents: { ...state.registeredComponents, [type]: true }
    })),
    
    unregisterComponent: (type) => set((state) => {
      const newRegistered = { ...state.registeredComponents };
      delete newRegistered[type];
      return { registeredComponents: newRegistered };
    }),
    
    startStreaming: () => set({ 
      isStreaming: true, 
      streamingContent: '' 
    }),
    
    appendStreamingContent: (content) => set((state) => ({
      streamingContent: state.streamingContent + content
    })),
    
    completeStreaming: () => set({ 
      isStreaming: false 
    }),
    
    setRendering: (isRendering) => set({ isRendering }),
    
    setRenderError: (error) => set({ renderError: error }),
    
    updatePerformance: (renderTime) => set({ 
      renderTime, 
      lastUpdated: Date.now() 
    }),
    
    logEvent: (event) => set((state) => ({
      eventHistory: [
        ...state.eventHistory.slice(-49),
        {
          ...event,
          timestamp: Date.now()
        }
      ]
    })),
    
    setComponentState: (componentId, componentState) => set((state) => ({
      componentStates: {
        ...state.componentStates,
        [componentId]: componentState
      }
    })),
    
    getComponentState: (componentId) => {
      return get().componentStates[componentId];
    },
    
    clearComponentState: (componentId) => set((state) => {
      const newStates = { ...state.componentStates };
      delete newStates[componentId];
      return { componentStates: newStates };
    }),
    
    updatePreferences: (preferences) => set((state) => ({
      preferences: {
        ...state.preferences,
        ...preferences
      }
    })),
    
    cachePayload: (key, payload) => set((state) => ({
      cache: {
        ...state.cache,
        [key]: payload
      }
    })),
    
    getCachedPayload: (key) => {
      return get().cache[key];
    },
    
    clearCache: () => set({ cache: {} }),
    
    reset: () => set(initialState)
  }))
);

export const selectCurrentPayload = (state: A2UIState) => state.currentPayload;
export const selectIsStreaming = (state: A2UIState) => state.isStreaming;
export const selectStreamingContent = (state: A2UIState) => state.streamingContent;
export const selectIsRendering = (state: A2UIState) => state.isRendering;
export const selectRenderError = (state: A2UIState) => state.renderError;
export const selectRenderTime = (state: A2UIState) => state.renderTime;
export const selectEventHistory = (state: A2UIState) => state.eventHistory;
export const selectPreferences = (state: A2UIState) => state.preferences;
export const selectComponentState = (componentId: string) => (state: A2UIState) => state.componentStates[componentId];
