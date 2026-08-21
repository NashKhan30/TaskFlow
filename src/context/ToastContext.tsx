import React, { createContext, useContext, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { useTheme } from './ThemeContext';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      case 'info':
      default:
        toast.info(message);
        break;
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* 🚀 Sonner: Ultra-Modern Fluid Stack Toasts with Rich Colors & Theme Sync */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
        theme={theme === 'dark' ? 'dark' : 'light'}
        style={{
          fontFamily: 'Inter, sans-serif',
        }}
      />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
