import { QueryClient } from '@tanstack/react-query';

/**
 * Global TanStack Query Client Configuration
 * Handles caching, automatic background re-fetching, and stale-time management
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cached in memory for 30 minutes
      retry: 1, // Retry failed queries once before throwing
      refetchOnWindowFocus: false, // Prevent unwanted refetches when switching browser tabs
    },
  },
});
