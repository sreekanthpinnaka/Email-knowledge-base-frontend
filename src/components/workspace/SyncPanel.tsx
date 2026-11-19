import React, { useState, useEffect, useRef } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  Loader2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { syncService } from '@/services/sync';
import { getApiErrorMessage } from '@/services/api';
import type { SyncJob, SyncJobStatus } from '@/types/api';
import { formatDate } from '@/lib/utils';

interface SyncPanelProps {
  onSyncComplete?: () => void;
}

const POLLING_TIMEOUT_SECONDS = 300; // 5 minutes polling window

export const SyncPanel: React.FC<SyncPanelProps> = ({ onSyncComplete }) => {
  const [job, setJob] = useState<SyncJob | null>(() => {
    const saved = sessionStorage.getItem('contextflow_active_sync_job');
    return saved ? JSON.parse(saved) : null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pollElapsedSeconds, setPollElapsedSeconds] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const pollIntervalRef = useRef<number | null>(null);

  // Clear polling interval
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

    const requestId = jobRequestId;
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

        const updated = await syncService.getSyncStatus(requestId);
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

    // Poll every 3 seconds (as requested by poll_after_seconds)
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

  // Reset or dismiss completed/failed state
  const handleReset = () => {
    stopPolling();
    setJob(null);
    setIsTimedOut(false);
    setSubmitError(null);
    sessionStorage.removeItem('contextflow_active_sync_job');
  };

  const status = job?.status as SyncJobStatus | undefined;
  const isJobActive = isSubmitting || status === 'queued' || status === 'running';

  return (
    <Card className="h-full flex flex-col justify-between border-slate-200/90 shadow-subtle hover:border-sunshine-300 transition-all">
      <div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-sunshine-50/50 via-white to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sunshine-100 text-sunshine-800 flex items-center justify-center border border-sunshine-300 shadow-sm">
              <RefreshCw className={`w-4 h-4 ${isJobActive ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Knowledge Base Synchronization</CardTitle>
              <p className="text-[11px] text-slate-500">n8n incremental pipeline & embeddings</p>
            </div>
          </div>

          {status && (
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize border shadow-subtle ${
                status === 'completed'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : status === 'running'
                  ? 'bg-brand-50 text-brand-800 border-brand-300'
                  : status === 'queued'
                  ? 'bg-sunshine-100 text-sunshine-900 border-sunshine-300'
                  : status === 'failed'
                  ? 'bg-coral-50 text-coral-800 border-coral-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {status}
            </span>
          )}
        </CardHeader>

        <CardContent className="space-y-3 pt-3">
          {/* Status Display Area */}
          {!job && !submitError && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <p className="text-xs text-slate-700 font-medium">Ready to synchronize</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Trigger n8n to ingest new messages from Gmail, generate OpenAI embeddings, and commit the history cursor to PostgreSQL.
              </p>
            </div>
          )}

          {/* Queued State */}
          {status === 'queued' && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/90 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Synchronization requested.</span>
              </div>
              <p className="text-[11px] text-amber-700">
                Job created in PostgreSQL (ID: {job?.request_id.slice(0, 8)}...). Dispatching workflow webhook to n8n.
              </p>
              <div className="text-[10px] text-amber-600 font-mono">
                Polling status: {pollElapsedSeconds}s elapsed
              </div>
            </div>
          )}

          {/* Running State */}
          {status === 'running' && (
            <div className="p-3 bg-blue-50/70 border border-blue-200/90 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-blue-800 text-xs font-semibold">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Updating the knowledge base...</span>
              </div>
              <p className="text-[11px] text-blue-700">
                {job?.message || 'n8n worker is actively parsing messages, generating embeddings, and updating pgvector tables.'}
              </p>
              <div className="text-[10px] text-blue-600 font-mono">
                Polling status: {pollElapsedSeconds}s elapsed
              </div>
            </div>
          )}

          {/* Completed State */}
          {status === 'completed' && (
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Synchronization complete!</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Your email index has been updated. You can now ask questions with up-to-date semantic retrieval.
              </p>
              {job?.finished_at && (
                <div className="text-[10px] text-emerald-600">
                  Completed at {formatDate(job.finished_at)}
                </div>
              )}
            </div>
          )}

          {/* Failed State */}
          {status === 'failed' && (
            <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Synchronization failed</span>
              </div>
              <p className="text-[11px] text-rose-700">
                {job?.message || 'The n8n workflow reported a failure during message extraction or embedding generation.'}
              </p>
            </div>
          )}

          {/* Unknown State */}
          {status === 'unknown' && (
            <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-slate-800 text-xs font-semibold">
                <HelpCircle className="w-4 h-4 text-slate-600" />
                <span>Delivery unconfirmed</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {job?.message || 'Workflow delivery could not be confirmed. Check n8n execution history before retrying.'}
              </p>
            </div>
          )}

          {/* Polling Timeout / Taking Long Notice */}
          {isTimedOut && (
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Still processing in background</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The n8n workflow may still be executing or awaiting callback delivery. The backend does not run an autonomous background sync watchdog. You can ask questions immediately using direct Gmail fallback retrieval.
              </p>
            </div>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}
        </CardContent>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-5 pt-2 flex items-center justify-between gap-3 border-t border-slate-100 mt-2">
        <div className="text-[11px] text-slate-400">
          {job?.created_at ? `Job: ${formatDate(job.created_at)}` : 'Hourly cron active'}
        </div>

        <div className="flex items-center gap-2">
          {job && !isJobActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleStartSync}
            disabled={isJobActive}
            isLoading={isSubmitting}
            className="text-xs shadow-sm"
          >
            {isJobActive ? (
              <span>Syncing...</span>
            ) : status === 'failed' ? (
              <span>Retry Sync</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                <span>Sync Inbox</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
