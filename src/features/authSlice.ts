import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/auth';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getSavedUser = (): User | null => {
  try {
    const saved = localStorage.getItem('taskflow_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_1',
      name: 'Alex Rivers',
      email: 'alex@taskflow.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    };
  } catch {
    return null;
  }
};

const getSavedToken = (): string | null => {
  try {
    const saved = localStorage.getItem('taskflow_auth_token');
    return saved ? (saved.startsWith('"') ? JSON.parse(saved) : saved) : 'mock_jwt_token_taskflow_xyz123';
  } catch {
    return null;
  }
};

const initialUser = getSavedUser();
const initialToken = getSavedToken();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialUser && !!initialToken,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('taskflow_user', JSON.stringify(action.payload.user));
      localStorage.setItem('taskflow_auth_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('taskflow_user');
      localStorage.removeItem('taskflow_auth_token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
