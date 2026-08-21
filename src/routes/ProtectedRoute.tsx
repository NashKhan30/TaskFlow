import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated user to login, preserving intended path in location.state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child routes via Outlet if used as layout route, or direct children
  return children ? <>{children}</> : <Outlet />;
};
