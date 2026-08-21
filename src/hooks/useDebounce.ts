import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value (e.g., search query).
 * Delays updating the debounced value until after `delay` ms of inactivity.
 *
 * @param value - The input value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clears timer if `value` or `delay` changes before timer fires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
