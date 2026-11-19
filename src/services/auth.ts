import { apiClient, AUTH_TOKEN_KEY, AUTH_EXPIRES_KEY } from './api';
import type { UnlockResponse, SessionResponse } from '@/types/api';
import { USE_MOCK_API } from '@/lib/config';
import { MOCK_PASSWORD } from './mockData';

export const authService = {
  /**
   * Unlock backend with shared password.
   */
  async unlock(password: string): Promise<UnlockResponse> {
    const cleanPassword = password.trim();

    // Only use local mock bypass when USE_MOCK_API is explicitly enabled in .env
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 450));

      if (cleanPassword.toLowerCase() === MOCK_PASSWORD) {
        const expiresAt = Math.floor(Date.now() / 1000) + 86400;
        const mockData: UnlockResponse = {
          access_token: 'mock-spine-token-' + Date.now(),
          token_type: 'bearer',
          expires_at: expiresAt,
          expires_in: 86400,
        };
        localStorage.setItem(AUTH_TOKEN_KEY, mockData.access_token);
        localStorage.setItem(AUTH_EXPIRES_KEY, String(mockData.expires_at));
        return mockData;
      }

      throw new Error("Incorrect password. Please enter 'spine' to access local workspace.");
    }

    // Live backend call (Cloud Run / FastAPI)
    const response = await apiClient.post<UnlockResponse>('/api/v1/auth/unlock', {
      password: cleanPassword,
    });
    const data = response.data;
    if (data.access_token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
      localStorage.setItem(AUTH_EXPIRES_KEY, String(data.expires_at));
    }
    return data;
  },

  /**
   * Verify current session claims.
   */
  async verifySession(): Promise<SessionResponse> {
    const token = this.getStoredToken();
    if (USE_MOCK_API && token?.startsWith('mock-spine-token-')) {
      return {
        authenticated: true,
        expires_at: Math.floor(Date.now() / 1000) + 86400,
      };
    }

    const response = await apiClient.get<SessionResponse>('/api/v1/auth/session');
    return response.data;
  },

  /**
   * Check backend health status without requiring auth.
   */
  async checkHealth(): Promise<{ status: string; service: string; database_configured: boolean }> {
    if (USE_MOCK_API) {
      return {
        status: 'ok',
        service: 'contextflow-mock-mode',
        database_configured: true,
      };
    }

    const response = await apiClient.get('/api/v1/health');
    return response.data;
  },

  /**
   * Read token from storage if not expired
   */
  getStoredToken(): string | null {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const expiresAtStr = localStorage.getItem(AUTH_EXPIRES_KEY);
    if (!token || !expiresAtStr) return null;

    // If we're in live backend mode, clear any legacy mock token
    if (!USE_MOCK_API && token.startsWith('mock-spine-token-')) {
      this.clearSession();
      return null;
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    // Buffer by 30 seconds before actual expiration
    if (nowInSeconds >= expiresAt - 30) {
      this.clearSession();
      return null;
    }
    return token;
  },

  /**
   * Clear all session data
   */
  clearSession(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_EXPIRES_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_EXPIRES_KEY);
  },
};
