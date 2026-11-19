import React from 'react';
import {
  Mail,
  ExternalLink,
  Calendar,
  User,
  Users,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Drawer } from '@/components/ui/Drawer';
import { Skeleton } from '@/components/ui/Skeleton';
import { emailService } from '@/services/emails';
import { getApiErrorMessage } from '@/services/api';
import { formatDate } from '@/lib/utils';

interface ThreadDrawerProps {
  threadId: string | null;
  onClose: () => void;
}

export const ThreadDrawer: React.FC<ThreadDrawerProps> = ({ threadId, onClose }) => {
  const {
    data: threadData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => (threadId ? emailService.getThread(threadId) : Promise.reject(new Error('No thread ID'))),
    enabled: Boolean(threadId),
    staleTime: 60000,
    retry: 1,
  });

  const error = queryError ? getApiErrorMessage(queryError, 'Failed to fetch original Gmail conversation.') : null;

  return (
    <Drawer
      isOpen={Boolean(threadId)}
      onClose={onClose}
      width="xl"
      title={
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-brand-600" />
          <span>Original Conversation Thread</span>
        </div>
      }
      subtitle={threadId ? `Thread ID: ${threadId}` : undefined}
      headerAction={
        threadData?.gmail_url ? (
          <a
            href={threadData.gmail_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-brand-700 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 transition-colors"
          >
            <span>Open in Gmail</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : undefined
      }
    >
      <div className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-coral-50 border border-coral-200 text-coral-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-coral-600" />
              <span>Could not load thread</span>
            </div>
            <p>{error}</p>
            <p className="text-[11px] text-coral-600">
              The message may have been deleted, or the thread ID may not exist in the connected mailbox.
            </p>
          </div>
        )}

        {/* Messages List */}
        {!isLoading && !error && threadData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">{threadData.messages.length} message(s) in this thread</span>
              <span className="text-[11px] bg-sunshine-50 border border-sunshine-200/90 px-2.5 py-0.5 rounded-lg text-sunshine-800 font-mono font-medium">
                Fetched live from Gmail API
              </span>
            </div>

            {threadData.messages.map((msg, index) => (
              <div
                key={msg.gmail_message_id || index}
                className="rounded-xl border border-slate-200/90 bg-white shadow-subtle overflow-hidden"
              >
                {/* Message Header */}
                <div className="p-4 bg-slate-50/70 border-b border-slate-100 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      {msg.subject || '(No Subject)'}
                    </h4>
                    <span className="text-[11px] text-slate-500 shrink-0 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(msg.received_at)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-500">From:</span>
                      <span className="font-medium text-slate-800 truncate">{msg.sender_email}</span>
                    </div>

                    {msg.recipients && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-500">To:</span>
                        <span className="text-slate-700 truncate">{msg.recipients}</span>
                      </div>
                    )}
                  </div>

                  {/* Labels */}
                  {msg.labels && msg.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {msg.labels.map((lbl) => (
                        <span
                          key={lbl}
                          className="inline-flex items-center gap-1 text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded"
                        >
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          {lbl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div className="p-4 bg-white text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap select-text break-words">
                  {msg.body || <em className="text-slate-400">Empty message body</em>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
};
