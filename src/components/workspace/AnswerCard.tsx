import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Sliders,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Layers,
  Quote,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { AnswerResponse, Source } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { RetrievalDetailsModal } from './RetrievalDetailsModal';

interface AnswerCardProps {
  data: AnswerResponse;
  question: string;
  onInspectThread: (threadId: string) => void;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  data,
  question,
  onInspectThread,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [highlightedCitation, setHighlightedCitation] = useState<string | null>(null);

  const { answer, status, sources, retrieval, evidence_source } = data;

  // Format citations [1], [2] inside answer text into clickable badges
  const renderFormattedAnswer = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/^\[(\d+)\]$/);
      if (match) {
        const citationTag = part;
        const isHighlighted = highlightedCitation === citationTag;
        return (
          <button
            key={index}
            onClick={() => {
              setHighlightedCitation(citationTag);
              const el = document.getElementById(`source-card-${citationTag}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }}
            className={`inline-flex items-center px-2 py-0.5 mx-0.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-subtle ${
              isHighlighted
                ? 'bg-coral-600 text-white ring-2 ring-coral-300 shadow-glow-red'
                : 'bg-brand-100 text-brand-900 hover:bg-brand-200 border border-brand-300'
            }`}
            title={`View evidence source ${citationTag}`}
          >
            {citationTag}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'answered':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Answer Grounded
          </Badge>
        );
      case 'insufficient_evidence':
        return (
          <Badge variant="warning" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            Insufficient Evidence
          </Badge>
        );
      case 'answer_validation_failed':
        return (
          <Badge variant="error" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            Validation Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="border-2 border-brand-100 shadow-elevated bg-white rounded-3xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-brand-50/50 via-white to-sunshine-50/40 border-b border-brand-100/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-glow-blue">
            <Sparkles className="w-4 h-4 text-sunshine-300" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">Synthesized Answer</CardTitle>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-md">
              "{question}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDetailsOpen(true)}
            className="text-xs gap-1.5 py-1 px-2.5 bg-sunshine-50/80 border-sunshine-300 text-sunshine-950 hover:bg-sunshine-100 font-bold shadow-subtle"
          >
            <Sliders className="w-3 h-3 text-sunshine-700" />
            <span>Telemetry</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {/* Notice banner if fallback used or notice returned */}
        {retrieval?.notice && (
          <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/90 text-[11px] text-slate-600 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{retrieval.notice}</span>
            </div>
            {retrieval.fallback_used && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                Fallback Active
              </span>
            )}
          </div>
        )}

        {/* Answer Content */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 text-sm text-slate-800 leading-relaxed font-sans shadow-subtle">
          <div className="whitespace-pre-wrap">{renderFormattedAnswer(answer)}</div>
        </div>

        {/* Grounded Sources */}
        {sources && sources.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Quote className="w-3.5 h-3.5 text-slate-400" />
                <span>Cited Evidence Sources ({sources.length})</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Click any citation tag or card to inspect
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sources.map((src: Source) => {
                const isSelected = highlightedCitation === src.citation;
                return (
                  <div
                    key={src.citation}
                    id={`source-card-${src.citation}`}
                    className={`rounded-2xl border p-4 transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-coral-400 bg-coral-50/30 ring-2 ring-coral-300 shadow-glow-red'
                        : 'border-slate-200 bg-white hover:border-brand-300 hover:shadow-subtle'
                    }`}
                  >
                    <div>
                      {/* Source Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs bg-sunshine-100 text-sunshine-950 border border-sunshine-300 shadow-subtle shrink-0">
                          {src.citation}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0 font-medium bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/60">
                          <Calendar className="w-3 h-3 text-brand-500" />
                          {formatDate(src.received_at)}
                        </span>
                      </div>

                      {/* Subject and Sender */}
                      <div className="font-bold text-slate-900 truncate" title={src.subject || ''}>
                        {src.subject || '(No Subject)'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        From: <span className="text-slate-800 font-semibold">{src.sender_email}</span>
                      </div>

                      {/* Quoted Excerpt */}
                      {src.excerpt && (
                        <div className="mt-2.5 p-2.5 bg-brand-50/40 rounded-xl border border-brand-100/90 text-slate-700 text-[11px] italic leading-relaxed line-clamp-3">
                          "{src.excerpt}"
                        </div>
                      )}
                    </div>

                    {/* Source Card Actions */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onInspectThread(src.gmail_thread_id)}
                        className="text-[11px] py-1.5 px-3 w-full justify-center bg-white border-brand-200 text-brand-700 hover:bg-brand-50 hover:border-brand-300 font-semibold shadow-subtle"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-brand-500" />
                        Inspect Original Thread
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>

      {/* Telemetry Modal */}
      <RetrievalDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        metadata={retrieval}
        evidenceSource={evidence_source}
      />
    </Card>
  );
};
