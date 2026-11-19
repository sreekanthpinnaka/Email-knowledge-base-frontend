import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UnlockPage } from '@/pages/UnlockPage';
import { AppRoutes } from './router';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading, coldStartNotice } = useAuth();

  // Initial loading state while verifying existing session token
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            {coldStartNotice
              ? 'Connecting to ContextFlow (waking up backend)...'
              : 'Verifying session...'}
          </p>
        </div>
      </div>
    );
  }

  // Strict Requirement: Show ONLY the password unlock screen before authentication
  if (!isAuthenticated) {
    return <UnlockPage />;
  }

  // Once unlocked, display the application experience
  return <AppRoutes />;
};
