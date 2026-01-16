import { useState, useEffect } from 'react';

/**
 * A hook that persists state to localStorage.
 * Works like useState but syncs with localStorage.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state from localStorage or default
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    return defaultValue;
  });

  // Sync to localStorage whenever value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
