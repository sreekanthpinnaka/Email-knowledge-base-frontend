/**
 * Application Runtime Configuration
 */

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

export const PROJECT_GMAIL_ACCOUNT =
  import.meta.env.VITE_PROJECT_GMAIL_ACCOUNT || 'liveprojectdemo001@gmail.com';

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'ContextFlow';

// Enabled by default so design and functionality can be tested locally out of the box
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
