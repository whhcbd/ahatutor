import { useToastStore } from './toast.store';

export const toast = {
  success: (message: string, title?: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'success', message, title, duration });
  },
  error: (message: string, title?: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'error', message, title, duration });
  },
  info: (message: string, title?: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'info', message, title, duration });
  },
  warning: (message: string, title?: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'warning', message, title, duration });
  },
};