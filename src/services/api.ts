import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/lib/config';

export const AUTH_TOKEN_KEY = 'contextflow_access_token';
export const AUTH_EXPIRES_KEY = 'contextflow_token_expires_at';

// Create a centralized Axios client
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Cloud Run cold start may take 15-30s; bounded evidence retrieval / OpenAI may take longer.
  // Generous timeout prevents client aborting prematurely.
  timeout: 120000,
});

// Attach Authorization header if session exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses (session expiry) & format errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Don't auto-clear on /api/v1/auth/unlock failure (wrong password is also 401)
      const url = error.config?.url || '';
      if (!url.includes('/auth/unlock')) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_EXPIRES_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_EXPIRES_KEY);
        window.dispatchEvent(new CustomEvent('contextflow:auth-expired'));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Extracts a human-friendly error message from an API error response.
 */
export function getApiErrorMessage(error: unknown, defaultMessage = 'An unexpected error occurred'): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return 'The request took too long. If the backend was scaling up, please wait a moment and try again.';
    }
    if (!error.response) {
      return 'Unable to connect to ContextFlow backend. Ensure the server is online or Cloud Run service is reachable.';
    }
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      if (typeof obj.detail === 'string') return obj.detail;
      if (typeof obj.message === 'string') return obj.message;
      if (obj.detail && typeof obj.detail === 'object') {
        const detailObj = obj.detail as Record<string, unknown>;
        if (typeof detailObj.message === 'string') return detailObj.message;
      }
    }
    if (error.response.status === 429) {
      return 'Too many requests. Please wait a moment before trying again.';
    }
    if (error.response.status === 503) {
      return 'Backend service temporarily unavailable or unconfigured.';
    }
  }
  if (error instanceof Error) return error.message;
  return defaultMessage;
}
