import { create } from 'zustand';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, toast.duration || 5000);
    }
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}));

const toastIcons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-up ${toastStyles[toast.type]}`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex-shrink-0 mt-0.5">{toastIcons[toast.type]}</div>
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="font-semibold text-sm">{toast.title}</p>
            )}
            <p className="text-sm mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
            aria-label="关闭通知"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// 便捷函数
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
