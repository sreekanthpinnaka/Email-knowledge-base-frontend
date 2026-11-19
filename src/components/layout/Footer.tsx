import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">ContextFlow</span>
              <span>—</span>
              <span>Built by <strong className="text-slate-700">Sreekanth Pinnaka</strong></span>
            </div>
            <p className="text-[11px] text-slate-400">
              Independent AI & Operations Engineering Project • Inspired by the AI & Operations Associate role at Spine.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">FastAPI</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">PostgreSQL / pgvector</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">n8n Automation</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Gmail API</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">OpenAI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
