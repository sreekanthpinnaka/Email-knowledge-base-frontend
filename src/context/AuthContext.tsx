import React, { useEffect, useState, useCallback } from 'react';
import { authService } from '@/services/auth';
import { getApiErrorMessage } from '@/services/api';
import { AuthContext } from './authContextDef';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [coldStartNotice, setColdStartNotice] = useState<boolean>(false);

  // Initialize session from storage
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      const token = authService.getStoredToken();
      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }

      // Timer to detect potential backend cold start
      const coldStartTimer = setTimeout(() => {
        if (isMounted) setColdStartNotice(true);
      }, 2500);

      try {
        const session = await authService.verifySession();
        if (isMounted && session.authenticated) {
          setIsAuthenticated(true);
        }
      } catch {
        if (isMounted) {
          authService.clearSession();
          setIsAuthenticated(false);
        }
      } finally {
        clearTimeout(coldStartTimer);
        if (isMounted) {
          setColdStartNotice(false);
          setIsLoading(false);
        }
      }
    }

    initSession();

    // Listen for auth-expired event from API client interceptor
    const handleExpired = () => {
      authService.clearSession();
      setIsAuthenticated(false);
      setError('Your session has expired. Please re-enter the password.');
    };

    window.addEventListener('contextflow:auth-expired', handleExpired);

    return () => {
      isMounted = false;
      window.removeEventListener('contextflow:auth-expired', handleExpired);
    };
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    // If Cloud Run has scaled to 0, it may take several seconds to boot
    const coldStartTimer = setTimeout(() => {
      setColdStartNotice(true);
    }, 2500);

    try {
      const response = await authService.unlock(password);
      if (response.access_token) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to authenticate. Please check the password.');
      setError(msg);
      return false;
    } finally {
      clearTimeout(coldStartTimer);
      setColdStartNotice(false);
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.clearSession();
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        error,
        coldStartNotice,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
