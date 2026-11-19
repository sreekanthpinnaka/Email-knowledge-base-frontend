import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { questionService } from '@/services/questions';
import { getApiErrorMessage } from '@/services/api';
import type { AnswerResponse, AskRequest } from '@/types/api';
import { Skeleton } from '@/components/ui/Skeleton';

interface QuestionInterfaceProps {
  onAnswerReceived: (answer: AnswerResponse, question: string) => void;
  initialQuestion?: string;
}


export const QuestionInterface: React.FC<QuestionInterfaceProps> = ({
  onAnswerReceived,
  initialQuestion = '',
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Advanced query options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [maxThreads, setMaxThreads] = useState<number>(5);
  const [limit, setLimit] = useState<number>(10);
  const [gmailQuery, setGmailQuery] = useState<string>('');

  const handleAsk = async (queryText?: string) => {
    const textToSubmit = (queryText ?? question).trim();
    if (!textToSubmit || isLoading) return;

    if (queryText) {
      setQuestion(queryText);
    }

    setIsLoading(true);
    setError(null);

    const payload: AskRequest = {
      question: textToSubmit,
      limit,
      max_threads: maxThreads,
      gmail_query: gmailQuery.trim() ? gmailQuery.trim() : null,
    };

    try {
      const response = await questionService.askQuestion(payload);
      onAnswerReceived(response, textToSubmit);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(
        err,
        'Failed to generate answer. If the backend is starting up, please retry.'
      );
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border-2 border-brand-200/90 shadow-elevated p-2 sm:p-2.5 transition-all focus-within:ring-4 focus-within:ring-brand-500/10 focus-within:border-brand-500">
        <div className="flex items-center gap-2">
          <div className="pl-2.5 text-brand-500 shrink-0">
            <Search className="w-5 h-5 text-brand-500" />
          </div>

          <input
            type="text"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask anything about the email knowledge base..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none py-2 px-1 font-medium"
          />

          <div className="flex items-center gap-1.5 shrink-0 pr-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                showAdvanced || gmailQuery.trim()
                  ? 'bg-brand-100 text-brand-800'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Toggle advanced query filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <Button
              variant="primary"
              size="md"
              onClick={() => handleAsk()}
              disabled={!question.trim() || isLoading}
              isLoading={isLoading}
              className="px-5 py-2 text-xs sm:text-sm shadow-md transition-all font-semibold"
            >
              <span>Ask</span>
              {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvanced && (
          <div className="mt-3 pt-3 border-t border-slate-100 px-3 pb-2 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/50 rounded-xl">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Max Threads (Evidence Budget):
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={maxThreads}
                onChange={(e) => setMaxThreads(Math.max(1, Math.min(10, Number(e.target.value))))}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Max 3 concurrent Gmail fetches</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Candidate Limit:
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={limit}
                onChange={(e) => setLimit(Math.max(1, Math.min(30, Number(e.target.value))))}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">PostgreSQL / fallback candidates</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Direct Gmail Query Filter (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. from:lead@domain.com"
                value={gmailQuery}
                onChange={(e) => setGmailQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs placeholder:text-slate-400"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Used in fallback search</span>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton during /ask */}
      {isLoading && (
        <div className="p-6 bg-white rounded-3xl border-2 border-brand-100 shadow-elevated space-y-4">
          <div className="flex items-center gap-2 text-xs text-brand-600 font-bold animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin text-sunshine-500" />
            <span>Retrieving candidate messages and validating citations...</span>
          </div>
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      )}

      {/* Error Banner with Retry */}
      {error && !isLoading && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-900">Retrieval failed</p>
              <p className="text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAsk()}
            className="text-xs bg-white text-rose-700 border-rose-200 hover:bg-rose-100/50 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};
