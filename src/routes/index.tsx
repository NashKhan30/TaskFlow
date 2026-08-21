import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RouteErrorBoundary } from '../components/RouteErrorBoundary';
import { TasksPage } from '../pages/TasksPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

export const router = createBrowserRouter([
  // 1. Protected Routes (Data Routing with Error Boundaries)
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <TasksPage />,
          },
          {
            path: '/tasks',
            element: <TasksPage />,
          },
        ],
      },
    ],
  },

  // 2. Public Auth Routes
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },

  // 3. Fallback Route
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
