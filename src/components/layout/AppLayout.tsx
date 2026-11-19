import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';

export const AppLayout: React.FC = () => {
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      <Navbar onOpenOnboarding={() => setOnboardingOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Outlet />
      </main>

      <Footer />

      <WelcomeModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
    </div>
  );
};
