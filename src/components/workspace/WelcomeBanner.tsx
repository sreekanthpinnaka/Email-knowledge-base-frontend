import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  RefreshCw,
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { PROJECT_GMAIL_ACCOUNT } from '@/lib/config';
import { copyToClipboard } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface WelcomeBannerProps {
  onOpenFullGuide: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onOpenFullGuide }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('contextflow_banner_collapsed') === 'true';
  });
  const [copied, setCopied] = useState(false);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('contextflow_banner_collapsed', String(next));
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(PROJECT_GMAIL_ACCOUNT);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-brand-100 shadow-elevated overflow-hidden transition-all">
      {/* Top Banner Header with luminous soft gradient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-sunshine-400 to-coral-500" />

      <div className="px-6 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-white flex items-center justify-center shrink-0 shadow-glow-blue">
            <Sparkles className="w-5 h-5 text-sunshine-300" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">ContextFlow</h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sunshine-100 text-sunshine-900 border border-sunshine-300 shadow-subtle">
                Spine Hiring Demo
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Turn scattered email conversations into actionable, verified knowledge.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenFullGuide}
            className="hidden sm:inline-flex text-xs border-brand-200 text-brand-700 hover:bg-brand-50"
          >
            Review Full Architecture & Purpose
          </Button>
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Expand introduction' : 'Collapse introduction'}
          >
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Walkthrough Section */}
      {!isCollapsed && (
        <div className="px-6 pb-6 pt-1 border-t border-slate-100 space-y-4">
          <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
            This operational AI platform was designed and engineered by <strong>Sreekanth Pinnaka</strong> to demonstrate
            end-to-end operational intelligence: connecting live Gmail ingestion via <strong>n8n</strong>, semantic vector search via <strong>PostgreSQL/pgvector</strong>, bounded evidence synthesis with <strong>OpenAI</strong>, and direct <strong>Gmail API</strong> fallback.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            {/* Step 1 - Coral Red Theme */}
            <div className="bg-coral-50/60 border border-coral-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-subtle">
              <div>
                <div className="flex items-center gap-2 text-coral-800 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-coral-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">1. Send Test Emails</span>
                </div>
                <p className="text-xs text-coral-950/85 leading-relaxed">
                  Fire away! Send in as many emails as you want—project updates, tricky timeline decisions, or notes you know the context of. Then run a sync to see ContextFlow connect the dots!
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-900 bg-white px-2 py-1 rounded-lg border border-coral-200 truncate select-all flex-1 shadow-subtle">
                  {PROJECT_GMAIL_ACCOUNT}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white border border-coral-200 hover:bg-coral-100 text-coral-700 transition-colors shrink-0 shadow-subtle"
                  title="Copy email address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={`mailto:${PROJECT_GMAIL_ACCOUNT}`}
                  className="p-1.5 rounded-lg bg-white border border-coral-200 hover:bg-coral-100 text-coral-700 transition-colors shrink-0 shadow-subtle"
                  title="Send email"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="text-[10px] text-coral-900/70 mt-2 font-medium">
                💡 Tip: Try sending multiple related emails to test multi-turn citation grounding • No sensitive data.
              </div>
            </div>

            {/* Step 2 - Sunshine Yellow Theme */}
            <div className="bg-sunshine-50/70 border border-sunshine-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-subtle">
              <div>
                <div className="flex items-center gap-2 text-sunshine-900 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-sunshine-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">2. Synchronize</span>
                </div>
                <p className="text-xs text-sunshine-950/80 leading-relaxed">
                  Click the highlighted <strong>Sync Inbox</strong> button in the right corner. n8n reads incremental changes, indexes headers, generates embeddings, and updates pgvector.
                </p>
              </div>
              <div className="mt-3 text-[11px] font-medium text-sunshine-900/70">
                Hourly scheduled runs + on-demand webhook execution.
              </div>
            </div>

            {/* Step 3 - Royal Blue Theme */}
            <div className="bg-brand-50/70 border border-brand-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-subtle">
              <div>
                <div className="flex items-center gap-2 text-brand-900 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">3. Ask Questions</span>
                </div>
                <p className="text-xs text-brand-950/80 leading-relaxed">
                  Ask questions in plain English. Answers are grounded with strict citation validation and original Gmail thread links.
                </p>
              </div>
              <div className="mt-3 text-[11px] font-medium text-brand-900/70">
                PostgreSQL semantic search with direct Gmail search fallback.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
