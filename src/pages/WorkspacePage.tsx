import React, { useState } from 'react';
import {
  Sparkles,
} from 'lucide-react';
import { WelcomeBanner } from '@/components/workspace/WelcomeBanner';
import { SyncButton } from '@/components/workspace/SyncButton';
import { QuestionInterface } from '@/components/workspace/QuestionInterface';
import { AnswerCard } from '@/components/workspace/AnswerCard';
import { ThreadDrawer } from '@/components/workspace/ThreadDrawer';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';
import type { AnswerResponse } from '@/types/api';

export const WorkspacePage: React.FC = () => {
  const [currentAnswer, setCurrentAnswer] = useState<{
    data: AnswerResponse;
    question: string;
  } | null>(null);

  // Thread Inspection Drawer
  const [inspectThreadId, setInspectThreadId] = useState<string | null>(null);

  // Full Welcome Onboarding Guide
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(() => {
    // Only show modal once per browser session automatically
    const seen = sessionStorage.getItem('contextflow_seen_welcome_guide');
    if (!seen) {
      sessionStorage.setItem('contextflow_seen_welcome_guide', 'true');
      return true;
    }
    return false;
  });

  const [prefilledQuestion, setPrefilledQuestion] = useState<string>('');

  const handleAnswerReceived = (data: AnswerResponse, question: string) => {
    setCurrentAnswer({ data, question });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <WelcomeBanner onOpenFullGuide={() => setOnboardingOpen(true)} />

      {/* Main Workspace Header & Highlighted Sync Button */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/90 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">AI Knowledge Retrieval</h2>
              <p className="text-[11px] text-slate-500">Ask questions grounded in your email evidence</p>
            </div>
          </div>

          {/* Right Corner: Status Badge + Simple & Highlighted Sync Button */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              <span className="font-medium">PostgreSQL-First • Live Gmail Fallback</span>
            </div>

            <SyncButton onSyncComplete={() => {
              // Trigger any refetches or state refreshes
            }} />
          </div>
        </div>

        {/* AI Question Answering Interface */}
        <div className="space-y-6">
          <QuestionInterface
            onAnswerReceived={handleAnswerReceived}
            initialQuestion={prefilledQuestion}
          />

          {currentAnswer && (
            <AnswerCard
              data={currentAnswer.data}
              question={currentAnswer.question}
              onInspectThread={(tid) => setInspectThreadId(tid)}
            />
          )}
        </div>
      </div>

      {/* Original Gmail Thread Drawer */}
      <ThreadDrawer
        threadId={inspectThreadId}
        onClose={() => setInspectThreadId(null)}
      />

      {/* Guided Spine Onboarding Modal */}
      <WelcomeModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onSelectSampleQuestion={(q) => {
          setPrefilledQuestion(q);
        }}
      />
    </div>
  );
};
