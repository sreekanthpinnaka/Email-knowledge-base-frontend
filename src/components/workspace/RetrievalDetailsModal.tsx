import React from 'react';
import {
  Database,
  Mail,
  AlertTriangle,
  Clock,
  Layers,
  Search,
  Activity,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import type { RetrievalMetadata } from '@/types/api';

interface RetrievalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: RetrievalMetadata | null;
  evidenceSource?: string;
}

export const RetrievalDetailsModal: React.FC<RetrievalDetailsModalProps> = ({
  isOpen,
  onClose,
  metadata,
  evidenceSource = 'gmail',
}) => {
  if (!metadata) return null;

  const isFallback = metadata.fallback_used;
  const timings = metadata.timings_ms || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-600" />
          <span>How This Answer Was Found</span>
        </div>
      }
      description="Inspect the actual backend retrieval telemetry, validation pass, and execution latency."
    >
      <div className="space-y-5">
        {/* Notice from backend */}
        {metadata.notice && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
            {metadata.notice}
          </div>
        )}

        {/* Primary Method & Fallback Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-subtle">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              {isFallback ? (
                <Mail className="w-4 h-4 text-sunshine-600" />
              ) : (
                <Database className="w-4 h-4 text-brand-600" />
              )}
              <span>Retrieval Source</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 mt-1 capitalize">
              {metadata.source.replace('_', ' ')}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Evidence body fetched from {evidenceSource.toUpperCase()} API
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-subtle">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 text-slate-500" />
              <span>Gmail Fallback</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  isFallback
                    ? 'bg-sunshine-50 text-sunshine-800 border-sunshine-200'
                    : 'bg-brand-50 text-brand-700 border-brand-200'
                }`}
              >
                {isFallback ? 'Engaged' : 'Not Needed'}
              </span>
            </div>
            {metadata.fallback_reason && (
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                Reason: {metadata.fallback_reason}
              </div>
            )}
          </div>
        </div>

        {/* Verification and Pipeline Counts (Only what backend returned) */}
        {(metadata.candidate_messages !== undefined ||
          metadata.threads_examined !== undefined ||
          metadata.evidence_messages !== undefined ||
          metadata.answer_validation) && (
          <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-3">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Pipeline Stages & Citation Validation
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              {metadata.candidate_messages !== undefined && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-sm">
                  <div className="text-lg font-bold text-slate-900">
                    {metadata.candidate_messages}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">Candidates</div>
                </div>
              )}

              {metadata.threads_examined !== undefined && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-sm">
                  <div className="text-lg font-bold text-slate-900">
                    {metadata.threads_examined}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">Threads Read</div>
                </div>
              )}

              {metadata.evidence_messages !== undefined && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-sm">
                  <div className="text-lg font-bold text-slate-900">
                    {metadata.evidence_messages}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">Evidence In Budget</div>
                </div>
              )}

              {metadata.answer_validation && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-sm">
                  <div
                    className={`text-xs font-bold mt-1 ${
                      metadata.answer_validation === 'passed'
                        ? 'text-brand-600 font-extrabold'
                        : 'text-coral-600 font-extrabold'
                    }`}
                  >
                    {metadata.answer_validation}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase mt-0.5">Citation Check</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Backend Execution Latency Timings */}
        {Object.keys(timings).length > 0 && (
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Backend Execution Timings</span>
              </span>
              {timings.total_ms !== undefined && (
                <span className="font-mono text-slate-900 font-bold">
                  Total: {timings.total_ms.toFixed(1)} ms
                </span>
              )}
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              {timings.embedding_ms !== undefined && (
                <div className="flex justify-between items-center text-slate-600 border-b border-slate-100 pb-1">
                  <span>OpenAI Query Embedding:</span>
                  <span className="font-mono text-slate-900 font-medium">
                    {timings.embedding_ms.toFixed(1)} ms
                  </span>
                </div>
              )}
              {timings.postgresql_ms !== undefined && (
                <div className="flex justify-between items-center text-slate-600 border-b border-slate-100 pb-1">
                  <span>PostgreSQL pgvector & Keyword:</span>
                  <span className="font-mono text-slate-900 font-medium">
                    {timings.postgresql_ms.toFixed(1)} ms
                  </span>
                </div>
              )}
              {timings.gmail_fallback_ms !== undefined && (
                <div className="flex justify-between items-center text-slate-600 border-b border-slate-100 pb-1">
                  <span>Gmail Search Fallback API:</span>
                  <span className="font-mono text-slate-900 font-medium">
                    {timings.gmail_fallback_ms.toFixed(1)} ms
                  </span>
                </div>
              )}
              {timings.evidence_ms !== undefined && (
                <div className="flex justify-between items-center text-slate-600 border-b border-slate-100 pb-1">
                  <span>Evidence Window Extraction:</span>
                  <span className="font-mono text-slate-900 font-medium">
                    {timings.evidence_ms.toFixed(1)} ms
                  </span>
                </div>
              )}
              {timings.generation_ms !== undefined && (
                <div className="flex justify-between items-center text-slate-600 border-b border-slate-100 pb-1">
                  <span>OpenAI Answer Generation & Quotes:</span>
                  <span className="font-mono text-slate-900 font-medium">
                    {timings.generation_ms.toFixed(1)} ms
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fallback Queries Attempted if any */}
        {metadata.queries_attempted && metadata.queries_attempted.length > 0 && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Gmail API Queries Attempted</span>
            </div>
            <div className="space-y-1">
              {metadata.queries_attempted.map((q, idx) => (
                <div
                  key={idx}
                  className="font-mono text-[11px] bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-800"
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings or Diagnostics */}
        {((metadata.warnings && metadata.warnings.length > 0) ||
          (metadata.diagnostics && metadata.diagnostics.length > 0)) && (
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Backend Warnings & Diagnostics</span>
            </div>
            {metadata.warnings?.map((w, idx) => (
              <div key={idx} className="font-mono text-[11px]">
                • {w}
              </div>
            ))}
            {metadata.diagnostics?.map((d, idx) => (
              <div key={idx} className="font-mono text-[11px]">
                • Provider: {d.provider} ({d.stage}) - {d.error_type} {d.sqlstate ? `[${d.sqlstate}]` : ''}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
