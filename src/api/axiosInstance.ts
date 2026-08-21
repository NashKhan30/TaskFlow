import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

/**
 * Single centralized Axios instance for TaskFlow
 * Base URL configured for JSONPlaceholder mock backend
 */
export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// 1. REQUEST INTERCEPTOR: Automatically attach auth token to all outgoing requests
// ============================================================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const rawToken = localStorage.getItem('taskflow_auth_token');
      if (rawToken) {
        // Parse token if stored as JSON string
        const token = rawToken.startsWith('"') ? JSON.parse(rawToken) : rawToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.warn('[Axios Request Interceptor] Could not parse auth token:', e);
    }

    console.info(`📡 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('[Axios Request Error]', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// 2. RESPONSE INTERCEPTOR: Centralized response logging & global error handling
// ============================================================================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.info(`✅ [API Response ${response.status}] ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;

    console.error(`❌ [API Error ${status || 'Network'}] ${url}:`, error.message);

    // Global 401 Unauthorized handling
    if (status === 401) {
      console.warn('Unauthorized request! Clearing session and redirecting to login...');
      localStorage.removeItem('taskflow_auth_token');
      localStorage.removeItem('taskflow_user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
