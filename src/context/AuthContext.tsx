import React, { createContext, useContext } from 'react';
import type { User, AuthContextType } from '../types/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('taskflow_user', null);
  const [token, setToken] = useLocalStorage<string | null>('taskflow_auth_token', null);
  const { showToast } = useToast();

  const login = async (email: string, _password?: string) => {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Retrieve existing user list or generate new user identity based on email
    const cleanEmail = email.trim().toLowerCase();
    const storedUsersRaw = localStorage.getItem('taskflow_registered_users');
    const registeredUsers: Record<string, User> = storedUsersRaw ? JSON.parse(storedUsersRaw) : {};

    let currentUser = registeredUsers[cleanEmail];

    if (!currentUser) {
      const derivedName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = derivedName
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      currentUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: formattedName || 'User',
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName || 'User')}&backgroundColor=5865f2,2d3449`,
      };

      registeredUsers[cleanEmail] = currentUser;
      localStorage.setItem('taskflow_registered_users', JSON.stringify(registeredUsers));
    }

    const mockToken = `jwt_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    setUser(currentUser);
    setToken(mockToken);
    showToast(`Logged in successfully! Welcome, ${currentUser.name.split(' ')[0]} 👋`, 'success');
  };

  const register = async (name: string, email: string, _password?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=5865f2,2d3449`,
    };

    // Save to registered users dictionary
    const storedUsersRaw = localStorage.getItem('taskflow_registered_users');
    const registeredUsers: Record<string, User> = storedUsersRaw ? JSON.parse(storedUsersRaw) : {};
    registeredUsers[cleanEmail] = newUser;
    localStorage.setItem('taskflow_registered_users', JSON.stringify(registeredUsers));

    const mockToken = `jwt_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    setUser(newUser);
    setToken(mockToken);
    showToast(`Account created successfully! Welcome to TaskFlow, ${cleanName.split(' ')[0]} 🎉`, 'success');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    showToast('Logged out successfully. See you soon! 👋', 'info');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
