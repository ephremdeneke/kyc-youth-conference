import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('kyc_user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('Failed to parse user from localStorage:', e);
      localStorage.removeItem('kyc_user');
      return null;
    }
  });

  const login = useCallback((userData) => {
    localStorage.setItem('kyc_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('kyc_user');
    setUser(null);
  }, []);

  return { user, login, logout, isAuthenticated: !!user };
}

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
