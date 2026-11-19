import React, { useState } from 'react';
import { Eye, EyeOff, Lock, ArrowRight, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { USE_MOCK_API } from '@/lib/config';

export const UnlockPage: React.FC = () => {
  const { login, isLoading, error, coldStartNotice, clearError } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLoading) return;
    await login(password);
  };

  return (
    <div className="min-h-screen w-full bg-[#0b132b] flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Background ambient lighting in Blue, Yellow and Red */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-sunshine-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* ContextFlow branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-sunshine-400 text-white shadow-glow-blue mb-3">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">ContextFlow</h1>
            <span className="w-2 h-2 rounded-full bg-sunshine-400"></span>
          </div>
          <p className="text-xs text-blue-200/80 mt-1 font-medium tracking-wide">
            Operational AI Knowledge Platform
          </p>
        </div>

        {/* Password Card in Crisp White */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-brand-100 space-y-5">
          <div className="text-left border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Enter Access Password</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sunshine-100 text-sunshine-900 border border-sunshine-200">
                Spine Evaluation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Please enter the password to enter the workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password-input" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="Enter workspace password"
                  autoFocus
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-medium rounded-2xl px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message in Warm Coral Red */}
            {error && (
              <div className="p-3.5 rounded-xl bg-coral-50 border border-coral-200 text-coral-800 text-xs flex items-start gap-2 shadow-subtle">
                <span className="shrink-0 font-bold text-coral-600">!</span>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Cold Start / Loading indicator in Soft Blue */}
            {isLoading && (
              <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs flex items-center gap-2.5 shadow-subtle">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600 shrink-0" />
                <span className="font-medium">
                  {coldStartNotice
                    ? 'Connecting to ContextFlow (Cloud Run starting)...'
                    : 'Connecting to ContextFlow...'}
                </span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold py-3.5 rounded-2xl shadow-elevated transition-all"
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              Enter Workspace
            </Button>
          </form>

          {/* Quick Demo Password Pill in Sunshine Yellow (Only when Mock API is active) */}
          {USE_MOCK_API && (
            <div className="pt-2 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sunshine-50 border border-sunshine-300 shadow-subtle text-xs">
                <Sparkles className="w-3.5 h-3.5 text-sunshine-600 fill-sunshine-400" />
                <span className="text-slate-600 font-medium">Local mock password:</span>
                <button
                  type="button"
                  onClick={() => setPassword('spine')}
                  className="font-mono text-brand-700 font-bold hover:underline cursor-pointer bg-white px-2 py-0.5 rounded border border-sunshine-300"
                  title="Click to fill password"
                >
                  spine
                </button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
            <span>Encrypted Session • Designed for Spine Team</span>
          </div>
        </div>
      </div>
    </div>
  );
};
