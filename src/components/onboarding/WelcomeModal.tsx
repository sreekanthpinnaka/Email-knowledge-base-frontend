import React, { useState } from 'react';
import {
  Mail,
  RefreshCw,
  Search,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PROJECT_GMAIL_ACCOUNT } from '@/lib/config';
import { copyToClipboard } from '@/lib/utils';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSampleQuestion?: (question: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onSelectSampleQuestion,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(PROJECT_GMAIL_ACCOUNT);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sampleQuestions = [
    'What decisions were made about the project timeline?',
    'Summarize the latest project updates.',
    'What action items were discussed?',
    'What information was shared about the deployment?',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <span>Welcome to ContextFlow</span>
          <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            Interactive Guide
          </span>
        </div>
      }
      description="Turn scattered email conversations into actionable knowledge."
    >
      <div className="space-y-6">
        {/* Hero Supporting Description & Tech Badges */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5">
          <p className="text-sm text-slate-700 leading-relaxed">
            ContextFlow is an AI-powered email knowledge base that transforms everyday email
            conversations into searchable, evidence-backed answers. It combines workflow
            automation, semantic retrieval, and AI to make operational information easier to
            discover.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-600 font-medium">
            <span className="text-slate-400 font-normal">Architecture Stack:</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Gmail API</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">n8n Automation</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">FastAPI</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">PostgreSQL / pgvector</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">OpenAI</span>
          </div>
        </div>

        {/* Spine-Specific Note */}
        <div className="border-l-4 border-brand-600 bg-brand-50/40 pl-4 py-3 pr-4 rounded-r-xl">
          <h4 className="text-xs font-semibold text-brand-900 uppercase tracking-wider">
            Built specifically with Spine in mind
          </h4>
          <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
            I developed ContextFlow as an independent, hands-on project inspired by Spine’s{' '}
            <strong>AI & Operations Associate</strong> role. My goal was to demonstrate how AI,
            workflow automation, and API integrations can solve real operational knowledge-management
            problems. Rather than presenting only a conceptual solution, I wanted to build a working
            application that the team could test firsthand.
          </p>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              Designed and developed by <strong>Sreekanth Pinnaka</strong>
            </span>
            <span className="text-slate-400 italic">Independent portfolio demonstration</span>
          </div>
        </div>

        {/* 3 Step Interactive Process */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            How to Test ContextFlow (3 Steps)
          </h3>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Step 1 - Coral Red */}
            <div className="p-4 rounded-2xl border border-coral-200 bg-coral-50/50 shadow-subtle hover:border-coral-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-coral-500 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-coral-950">
                      Step 1 — Send an Email
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-coral-800 bg-white border border-coral-200 px-2 py-0.5 rounded-full shadow-subtle">
                      Live Mailbox
                    </span>
                  </div>
                  <p className="text-xs text-coral-900/80 mt-1 leading-relaxed">
                    Send a test email with project updates, decisions, meeting notes, or deployment
                    details (no sensitive info).
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-coral-200 rounded-xl text-xs font-mono text-slate-800 select-all shadow-subtle">
                      <span>{PROJECT_GMAIL_ACCOUNT}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="text-xs py-1.5 bg-white border-coral-200 hover:bg-coral-50 text-coral-700"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                    <a
                      href={`mailto:${PROJECT_GMAIL_ACCOUNT}`}
                      className="p-1.5 rounded-xl border border-coral-200 bg-white text-coral-600 hover:text-coral-800 hover:bg-coral-50 shadow-subtle"
                      title="Open in default mail client"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - Sunshine Yellow */}
            <div className="p-4 rounded-2xl border border-sunshine-300 bg-sunshine-50/60 shadow-subtle hover:border-sunshine-400 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sunshine-400 text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-sunshine-950">
                    Step 2 — Synchronize
                  </h4>
                  <p className="text-xs text-sunshine-900/90 mt-1 leading-relaxed">
                    Click <strong>Sync Inbox</strong> in the workspace. This triggers an n8n workflow
                    that fetches Gmail changes, normalizes metadata, generates vector embeddings, and
                    updates PostgreSQL.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 - Royal Blue */}
            <div className="p-4 rounded-2xl border border-brand-200 bg-brand-50/60 shadow-subtle hover:border-brand-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                  <Search className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-brand-950">
                    Step 3 — Ask Questions
                  </h4>
                  <p className="text-xs text-brand-900/80 mt-1 leading-relaxed">
                    Ask questions in natural language. Answers are generated with direct citations
                    and links to the original Gmail threads.
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {sampleQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          if (onSelectSampleQuestion) onSelectSampleQuestion(q);
                          onClose();
                        }}
                        className="text-left text-[11px] bg-white hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 border border-brand-200/80 text-slate-700 font-medium px-3 py-1.5 rounded-xl shadow-subtle transition-colors"
                      >
                        "{q}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Retrieval Architecture Callout */}
        <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Hybrid Architecture Note:</strong> Retrieval is <em>PostgreSQL-first with direct Gmail fallback</em>.
            Syncing updates the vector knowledge base for rapid semantic search. If an email has not yet
            been synchronized, the Gmail fallback flow can still discover matching threads directly from the mailbox.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Exploring Workspace
          </Button>
        </div>
      </div>
    </Modal>
  );
};
