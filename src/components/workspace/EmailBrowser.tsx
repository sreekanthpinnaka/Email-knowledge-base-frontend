import React, { useState } from 'react';
import {
  Search,
  Mail,
  Calendar,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Database,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { emailService } from '@/services/emails';
import { getApiErrorMessage } from '@/services/api';
import type { EmailResult, RetrievalMetadata } from '@/types/api';
import { formatDate } from '@/lib/utils';

interface EmailBrowserProps {
  onInspectThread: (threadId: string) => void;
}

export const EmailBrowser: React.FC<EmailBrowserProps> = ({ onInspectThread }) => {
  // Input form state
  const [searchInput, setSearchInput] = useState('');
  const [senderInput, setSenderInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');

  // Active query parameters
  const [activeParams, setActiveParams] = useState({
    searchQuery: '',
    senderFilter: '',
    subjectFilter: '',
    offset: 0,
  });

  const limit = 15;

  // TanStack Query for indexed emails and search
  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      'emails',
      activeParams.searchQuery,
      activeParams.senderFilter,
      activeParams.subjectFilter,
      activeParams.offset,
      limit,
    ],
    queryFn: async () => {
      if (activeParams.searchQuery.trim()) {
        const searchRes = await emailService.searchEmails({
          question: activeParams.searchQuery.trim(),
          limit,
        });
        return {
          items: searchRes.results,
          retrieval: searchRes.retrieval,
        };
      } else {
        const listRes = await emailService.listEmails({
          limit,
          offset: activeParams.offset,
          sender: activeParams.senderFilter.trim() || undefined,
          subject: activeParams.subjectFilter.trim() || undefined,
        });
        return {
          items: listRes.items,
          retrieval: listRes.retrieval as RetrievalMetadata,
        };
      }
    },
    staleTime: 15000,
  });

  const error = queryError ? getApiErrorMessage(queryError, 'Failed to fetch email index.') : null;
  const emails: EmailResult[] = data?.items || [];
  const retrievalMeta: RetrievalMetadata | null = data?.retrieval || null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveParams({
      searchQuery: searchInput.trim(),
      senderFilter: senderInput.trim(),
      subjectFilter: subjectInput.trim(),
      offset: 0,
    });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSenderInput('');
    setSubjectInput('');
    setActiveParams({
      searchQuery: '',
      senderFilter: '',
      subjectFilter: '',
      offset: 0,
    });
  };

  return (
    <Card className="border-slate-200/90 shadow-subtle">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 bg-slate-50/70 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200/80 shadow-sm">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">Email Knowledge Base Browser</CardTitle>
            <p className="text-[11px] text-slate-500">
              Browse indexed metadata from PostgreSQL or search across threads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {retrievalMeta && (
            <Badge variant="blue" className="text-[11px]">
              Source: {retrievalMeta.source}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            isLoading={isFetching}
            className="text-xs py-1 px-2.5 bg-white shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Search & Filter Bar */}
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search email contents or vector keywords..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 shadow-sm"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Filter by sender"
                value={senderInput}
                onChange={(e) => setSenderInput(e.target.value)}
                disabled={Boolean(searchInput.trim())}
                className="w-36 px-2.5 py-1.5 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 disabled:bg-slate-50 shadow-sm"
              />

              <input
                type="text"
                placeholder="Filter by subject"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                disabled={Boolean(searchInput.trim())}
                className="w-36 px-2.5 py-1.5 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 disabled:bg-slate-50 shadow-sm"
              />

              <Button type="submit" variant="primary" size="sm" className="text-xs">
                Filter
              </Button>

              {(searchInput || senderInput || subjectInput || activeParams.searchQuery || activeParams.senderFilter || activeParams.subjectFilter) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Error Notice */}
        {error && (
          <div className="p-3 bg-coral-50 border border-coral-200 text-coral-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-coral-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3.5 border border-slate-200/90 rounded-xl bg-slate-50 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Email Table / List */}
        {!isLoading && !error && emails.length === 0 && (
          <div className="py-12 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No emails found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {activeParams.searchQuery
                ? `No emails matched "${activeParams.searchQuery}". Try a broader query or trigger synchronization.`
                : 'The indexed mailbox is empty or synchronization has not run yet. Send a test email and click Sync Inbox.'}
            </p>
          </div>
        )}

        {!isLoading && !error && emails.length > 0 && (
          <div className="space-y-2">
            {emails.map((item) => (
              <div
                key={item.gmail_message_id}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-brand-300 hover:shadow-subtle transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 truncate">
                      {item.subject || '(No Subject)'}
                    </span>
                    {item.direction && (
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                          item.direction === 'incoming'
                            ? 'bg-brand-50 text-brand-700 border-brand-200'
                            : item.direction === 'outgoing'
                            ? 'bg-coral-50 text-coral-700 border-coral-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.direction}
                      </span>
                    )}
                    {item.score !== undefined && item.score !== null && (
                      <span className="text-[10px] font-mono text-sunshine-800 bg-sunshine-50 border border-sunshine-200 px-1.5 py-0.5 rounded">
                        Score: {item.score}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                    <span className="truncate">From: <strong className="text-slate-700 font-medium">{item.sender_email}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDate(item.received_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onInspectThread(item.gmail_thread_id)}
                    className="text-xs py-1 px-2.5 text-slate-700 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-200 bg-white shadow-sm"
                  >
                    <MessageSquare className="w-3 h-3 mr-1 text-brand-500" />
                    Inspect Thread
                  </Button>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {!activeParams.searchQuery && (
              <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeParams.offset === 0 || isLoading}
                  onClick={() =>
                    setActiveParams((prev) => ({
                      ...prev,
                      offset: Math.max(0, prev.offset - limit),
                    }))
                  }
                  className="text-xs"
                >
                  Previous
                </Button>
                <span>Offset: {activeParams.offset}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={emails.length < limit || isLoading}
                  onClick={() =>
                    setActiveParams((prev) => ({
                      ...prev,
                      offset: prev.offset + limit,
                    }))
                  }
                  className="text-xs"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
