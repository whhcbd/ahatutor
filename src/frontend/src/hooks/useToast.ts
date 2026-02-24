import { useToastStore } from '@/components/ui/toast.store';

export function useToast() {
  const { addToast, removeToast, clearToasts, toasts } = useToastStore();

  const toast = {
    success: (message: string, title?: string, duration?: number) => {
      addToast({ type: 'success', message, title, duration });
    },
    error: (message: string, title?: string, duration?: number) => {
      addToast({ type: 'error', message, title, duration });
    },
    info: (message: string, title?: string, duration?: number) => {
      addToast({ type: 'info', message, title, duration });
    },
    warning: (message: string, title?: string, duration?: number) => {
      addToast({ type: 'warning', message, title, duration });
    },
  };

  return {
    toast,
    removeToast,
    clearToasts,
    toasts,
  };
}
