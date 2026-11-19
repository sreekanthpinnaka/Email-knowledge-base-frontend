import React, { useState, useEffect, useRef } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  X,
  Info,
} from 'lucide-react';
import { syncService } from '@/services/sync';
import { getApiErrorMessage } from '@/services/api';
import type { SyncJob, SyncJobStatus } from '@/types/api';
import { formatDate } from '@/lib/utils';

interface SyncButtonProps {
  onSyncComplete?: () => void;
  className?: string;
}

const POLLING_TIMEOUT_SECONDS = 90;

export const SyncButton: React.FC<SyncButtonProps> = ({ onSyncComplete, className = '' }) => {
  const [job, setJob] = useState<SyncJob | null>(() => {
    const saved = sessionStorage.getItem('contextflow_active_sync_job');
    return saved ? JSON.parse(saved) : null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pollElapsedSeconds, setPollElapsedSeconds] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [showStatusBanner, setShowStatusBanner] = useState(() => {
    const saved = sessionStorage.getItem('contextflow_active_sync_job');
    if (!saved) return false;
    try {
      const parsed = JSON.parse(saved);
      return Boolean(parsed?.status && ['queued', 'running'].includes(parsed.status));
    } catch {
      return false;
    }
  });

  const pollIntervalRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const jobStatus = job?.status;
  const jobRequestId = job?.request_id;

  // Poll active job status
  useEffect(() => {
    if (!jobRequestId || !jobStatus || !['queued', 'running'].includes(jobStatus)) {
      stopPolling();
      return;
    }

    let secondsCounter = 0;

    const poll = async () => {
      try {
        secondsCounter += 3;
        setPollElapsedSeconds(secondsCounter);

        if (secondsCounter >= POLLING_TIMEOUT_SECONDS) {
          setIsTimedOut(true);
          stopPolling();
          return;
        }

        const updated = await syncService.getSyncStatus(jobRequestId);
        setJob(updated);
        sessionStorage.setItem('contextflow_active_sync_job', JSON.stringify(updated));

        if (updated.status === 'completed') {
          stopPolling();
          if (onSyncComplete) onSyncComplete();
        } else if (['failed', 'unknown'].includes(updated.status)) {
          stopPolling();
        }
      } catch (err: unknown) {
        console.warn('Sync polling attempt encountered an issue:', err);
      }
    };

    pollIntervalRef.current = window.setInterval(poll, 3000);

    return () => {
      stopPolling();
    };
  }, [jobRequestId, jobStatus, onSyncComplete]);

  // Initiate manual sync
  const handleStartSync = async () => {
    setSubmitError(null);
    setIsTimedOut(false);
    setPollElapsedSeconds(0);
    setIsSubmitting(true);
    setShowStatusBanner(true);

    try {
      const initialJob = await syncService.triggerSync();
      setJob(initialJob);
      sessionStorage.setItem('contextflow_active_sync_job', JSON.stringify(initialJob));
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to trigger synchronization.');
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    stopPolling();
    setJob(null);
    setIsTimedOut(false);
    setSubmitError(null);
    setShowStatusBanner(false);
    sessionStorage.removeItem('contextflow_active_sync_job');
  };

  const status = job?.status as SyncJobStatus | undefined;
  const isJobActive = isSubmitting || status === 'queued' || status === 'running';

  return (
    <div className={`relative flex flex-col items-end ${className}`}>
      {/* The Highlighted, Simple Sync Button */}
      <div className="flex items-center gap-2">
        {/* Idle / Ready State */}
        {!job && !isSubmitting && !submitError && (
          <button
            onClick={handleStartSync}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 hover:from-brand-500 hover:to-brand-600 shadow-glow-blue hover:shadow-brand transition-all cursor-pointer border border-brand-400/40 active:scale-95"
            title="Trigger n8n synchronization to ingest new emails and update pgvector embeddings"
          >
            <Sparkles className="w-3.5 h-3.5 text-sunshine-300 fill-sunshine-300 group-hover:rotate-12 transition-transform" />
            <span>Sync Inbox</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>
        )}

        {/* Submitting / Active State */}
        {isJobActive && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-brand-900 bg-brand-50 border border-brand-300 shadow-subtle">
            <RefreshCw className="w-3.5 h-3.5 text-brand-600 animate-spin" />
            <span>{status === 'queued' ? 'Sync Requested...' : 'Updating Index...'}</span>
            <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-brand-200 text-brand-700">
              {pollElapsedSeconds}s
            </span>
          </div>
        )}

        {/* Completed State */}
        {status === 'completed' && !isJobActive && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-50 border border-emerald-300 shadow-subtle">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Index Synced</span>
            <span className="text-slate-300">•</span>
            <button
              onClick={handleStartSync}
              className="text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline cursor-pointer"
              title="Run sync again"
            >
              Sync again
            </button>
          </div>
        )}

        {/* Failed State */}
        {status === 'failed' && !isJobActive && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-coral-950 bg-coral-50 border border-coral-300 shadow-subtle">
            <AlertCircle className="w-4 h-4 text-coral-600" />
            <span>Sync Failed</span>
            <button
              onClick={handleStartSync}
              className="ml-1 text-xs font-bold text-coral-700 hover:underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Unknown / Timed Out State */}
        {(status === 'unknown' || isTimedOut) && !isJobActive && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 shadow-subtle">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>In Background</span>
            <button
              onClick={handleStartSync}
              className="ml-1 text-xs font-bold text-brand-700 hover:underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Submit Error */}
        {submitError && !job && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-coral-900 bg-coral-50 border border-coral-300 shadow-subtle">
            <AlertCircle className="w-3.5 h-3.5 text-coral-600" />
            <span>Error</span>
            <button
              onClick={handleStartSync}
              className="text-xs font-bold text-coral-700 hover:underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Floating Status Notification Drawer (shown when active or on recent completion) */}
      {showStatusBanner && job && (
        <div className="absolute right-0 top-11 z-30 w-80 sm:w-96 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-elevated text-xs space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              {status === 'completed' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Knowledge Base Index Updated</span>
                </>
              ) : status === 'running' ? (
                <>
                  <RefreshCw className="w-4 h-4 text-brand-600 animate-spin" />
                  <span>n8n Synchronization In Progress</span>
                </>
              ) : status === 'queued' ? (
                <>
                  <Clock className="w-4 h-4 text-sunshine-600 animate-pulse" />
                  <span>Job Queued in PostgreSQL</span>
                </>
              ) : status === 'failed' ? (
                <>
                  <AlertCircle className="w-4 h-4 text-coral-600" />
                  <span>Synchronization Failed</span>
                </>
              ) : (
                <>
                  <Info className="w-4 h-4 text-slate-600" />
                  <span>Sync Status</span>
                </>
              )}
            </div>
            <button
              onClick={() => setShowStatusBanner(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Close status panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            {status === 'completed'
              ? 'Your email index and vector embeddings have been updated in PostgreSQL. You can now ask questions with up-to-date semantic retrieval.'
              : status === 'running'
              ? job?.message || 'n8n worker is actively parsing new Gmail MIME payloads, generating embeddings, and updating tables.'
              : status === 'queued'
              ? `FastAPI generated request ID (${job?.request_id.slice(0, 8)}...) and dispatched webhook to n8n.`
              : status === 'failed'
              ? job?.message || 'Workflow reported a failure during execution.'
              : 'Still awaiting callback. Direct Gmail fallback is available.'}
          </p>

          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
            <span>
              {job?.finished_at
                ? `Finished at ${formatDate(job.finished_at)}`
                : `${pollElapsedSeconds}s elapsed`}
            </span>
            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
