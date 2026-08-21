import { RouterProvider } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './features/store';
import { queryClient } from './api/queryClient';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { router } from './routes';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <TaskProvider>
                <RouterProvider router={router} />
              </TaskProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}
