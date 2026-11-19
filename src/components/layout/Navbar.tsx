import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Server,
  BookOpen,
  Cpu,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onOpenOnboarding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOnboarding }) => {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);

  // Check health periodically
  useEffect(() => {
    let active = true;
    async function check() {
      try {
        const res = await authService.checkHealth();
        if (active) setBackendHealthy(res.status === 'ok');
      } catch {
        if (active) setBackendHealthy(false);
      }
    }
    check();
    const timer = setInterval(check, 60000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const navLinks = [
    { name: 'Workspace', path: '/', icon: Sparkles },
    { name: 'Under the Hood', path: '/under-the-hood', icon: Cpu },
    { name: 'About the Project', path: '/about', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-100/80 bg-white/95 backdrop-blur-md shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Spine evaluation badge */}
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center font-bold text-base shadow-glow-blue transition-transform group-hover:scale-105">
                <Layers className="w-4 h-4 text-sunshine-200" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 tracking-tight text-sm leading-tight group-hover:text-brand-600 transition-colors">
                    ContextFlow
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sunshine-500"></span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  AI Operations Platform
                </span>
              </div>
            </NavLink>

            {/* Spine Evaluation pill with Red & Yellow accent */}
            <div className="hidden md:flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-sunshine-50 border border-sunshine-200 text-[11px] text-sunshine-900 font-semibold shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse"></span>
              <span>Spine AI & Ops Portfolio</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
                      isActive
                        ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-subtle'
                        : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                    )
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right actions: How it Works, Backend Health, Sign Out */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50/50 shadow-subtle transition-all cursor-pointer"
              title="View instructions & how to test"
            >
              <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
              <span>How to Test</span>
            </button>

            {/* Backend Health indicator */}
            <div
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-subtle',
                backendHealthy === true
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : backendHealthy === false
                  ? 'bg-sunshine-50 text-sunshine-800 border-sunshine-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              )}
              title={
                backendHealthy === true
                  ? 'FastAPI Backend Online'
                  : backendHealthy === false
                  ? 'Backend waking up or connecting'
                  : 'Checking backend status...'
              }
            >
              <Server className="w-3 h-3 text-brand-600" />
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  backendHealthy === true
                    ? 'bg-emerald-500'
                    : backendHealthy === false
                    ? 'bg-sunshine-500 animate-pulse'
                    : 'bg-slate-400'
                )}
              />
              <span className="hidden lg:inline">
                {backendHealthy === true ? 'Cloud Run Ready' : 'Connecting'}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Lock / Sign Out */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-coral-600 hover:bg-coral-50 hover:border-coral-200 transition-all cursor-pointer border border-transparent"
              title="Lock workspace and clear session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-blue-100 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  )
                }
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOnboarding();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl text-left"
            >
              <HelpCircle className="w-4 h-4 text-brand-600" />
              <span>How to Test ContextFlow</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-coral-600 hover:bg-coral-50 rounded-xl text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Lock Workspace</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
