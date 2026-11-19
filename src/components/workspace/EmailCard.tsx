import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PROJECT_GMAIL_ACCOUNT } from '@/lib/config';
import { copyToClipboard } from '@/lib/utils';

export const EmailCard: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(PROJECT_GMAIL_ACCOUNT);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="h-full flex flex-col justify-between border-slate-200/90 shadow-subtle hover:border-coral-200 transition-all">
      <div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-coral-50/40 via-white to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-coral-100 text-coral-700 flex items-center justify-center border border-coral-200 shadow-sm">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Target Ingestion Mailbox</CardTitle>
              <p className="text-[11px] text-slate-500">Live destination for test emails</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-coral-700 bg-coral-50 border border-coral-200 px-2.5 py-0.5 rounded-full shadow-subtle">
            Monitored Live
          </span>
        </CardHeader>

        <CardContent className="space-y-3 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 truncate select-all shadow-subtle">
              {PROJECT_GMAIL_ACCOUNT}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs shrink-0 py-2 border-slate-200 hover:border-coral-300 hover:text-coral-700 hover:bg-coral-50/50"
              title="Copy email to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
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
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-coral-600 hover:border-coral-200 hover:bg-coral-50/50 transition-colors shadow-subtle"
              title="Send an email now"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Send sample project updates, decisions, meeting notes, or deployment status to test the
            pipeline. Then trigger synchronization to generate embeddings.
          </p>

          <div className="p-3 rounded-xl bg-sunshine-50/90 border border-sunshine-200 text-[11px] text-sunshine-950 flex items-start gap-2 shadow-subtle">
            <AlertTriangle className="w-3.5 h-3.5 text-sunshine-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Notice:</strong> Please do not send confidential, proprietary, or sensitive personal
              data. This mailbox is monitored exclusively for this demonstration.
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
