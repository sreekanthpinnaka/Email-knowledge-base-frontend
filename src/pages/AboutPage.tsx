import React from 'react';
import {
  Layers,
  Sparkles,
  Workflow,
  ShieldCheck,
  Server,
  Mail,
  Database,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const highlights = [
    {
      title: 'End-to-End AI Engineering',
      desc: 'Architected and built full-stack system from API routing and embedding generation to responsive client UI.',
      icon: Code2,
    },
    {
      title: 'FastAPI Backend & Connection Pooling',
      desc: 'High-performance async Python service with psycopg connection pooling and HMAC-SHA256 bearer session signing.',
      icon: Server,
    },
    {
      title: 'Gmail OAuth2 & Live API Integration',
      desc: 'Bounded evidence extraction directly from Gmail API with token refreshing, message normalization, and concurrency limits.',
      icon: Mail,
    },
    {
      title: 'n8n Workflow Automation',
      desc: 'Decoupled scheduled daily sync from on-demand webhook execution with authenticated status callbacks and history cursors.',
      icon: Workflow,
    },
    {
      title: 'PostgreSQL + pgvector Semantic Search',
      desc: 'Hybrid retrieval pairing 1536-dimensional OpenAI vector embeddings with robust ILIKE keyword token fallback.',
      icon: Database,
    },
    {
      title: 'Direct Gmail Fallback Discovery',
      desc: 'Resilient secondary search engine that discovers un-indexed messages directly through native Gmail search queries.',
      icon: Layers,
    },
    {
      title: 'Deterministic Citation Validation',
      desc: 'Server-side verification matching generated claims against verbatim quoted text in the extracted evidence budget.',
      icon: ShieldCheck,
    },
    {
      title: 'Cloud Run Deployment',
      desc: 'Containerized deployment on Google Cloud Run with scale-to-zero efficiency and cold-start resilience.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Title & Attribution Header */}
      <div className="text-center sm:text-left border-b border-slate-200/90 pb-8">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
          <Badge variant="blue" className="text-xs">
            Spine AI & Operations Candidate Portfolio
          </Badge>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 font-medium">Independent Project</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About ContextFlow
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          An operational AI knowledge retrieval platform designed to turn fragmented inbox threads into searchable,
          verifiable business intelligence.
        </p>

        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle flex items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center font-bold text-sm shadow-sm">
              SP
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Designed & Developed by Sreekanth Pinnaka</div>
              <div className="text-slate-500 mt-0.5">
                Independent AI & Operations Engineering Project • Inspired by Spine
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Problem & The Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-coral-200/80 bg-gradient-to-b from-coral-50/20 to-white shadow-subtle">
          <CardHeader className="bg-coral-50/40 border-b border-coral-100 pb-3">
            <CardTitle className="text-sm font-bold text-coral-950">The Operational Problem</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-xs text-slate-700 space-y-3 leading-relaxed">
            <p>
              In fast-moving companies, crucial decisions, technical handoffs, timeline changes, and operational action items are routinely scattered across hundreds of fragmented email threads.
            </p>
            <p>
              Traditional email search is brittle: keyword queries fail when vocabulary changes, and standard LLM chat interfaces lack grounding, hallucinate details, and have no visibility into the live mailbox.
            </p>
          </CardContent>
        </Card>

        <Card className="border-brand-200/80 bg-gradient-to-b from-brand-50/20 to-white shadow-subtle">
          <CardHeader className="bg-brand-50/40 border-b border-brand-100 pb-3">
            <CardTitle className="text-sm font-bold text-brand-950">The ContextFlow Solution</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-xs text-slate-700 space-y-3 leading-relaxed">
            <p>
              ContextFlow continuously synchronizes email metadata and vector embeddings into PostgreSQL using automated n8n workflows, while fetching original conversation text directly from Gmail when evidence is needed.
            </p>
            <p>
              When a team member asks a question, the system retrieves relevant threads, compiles a bounded evidence budget, synthesizes an answer with OpenAI, and deterministically validates that all citations and quotes exist before responding.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Why I Built It (Spine Alignment) */}
      <div className="rounded-2xl border-2 border-brand-300/80 bg-gradient-to-br from-brand-50/70 via-white to-sunshine-50/40 p-6 sm:p-8 space-y-4 shadow-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-brand">
            <Sparkles className="w-4 h-4 text-sunshine-300" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Why I Built This Project</h2>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
          "I built ContextFlow as a practical demonstration of the type of AI-enabled workflow automation and systems integration described in Spine's <strong>AI & Operations Associate</strong> role. Rather than presenting only a conceptual solution, I wanted to build a working application that the team could test firsthand."
        </p>

        <p className="text-xs text-slate-600 leading-relaxed">
          The project exercises the exact intersections needed for operational AI: automating data pipelines with low-code tools (n8n), integrating enterprise communication protocols (Gmail API), engineering solid APIs and databases (FastAPI + pgvector), and crafting an intuitive interface that nontechnical colleagues can trust.
        </p>
      </div>

      {/* Engineering Highlights Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Engineering & Architecture Highlights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {highlights.map((h, idx) => {
            const Icon = h.icon;
            // Cycle through our soft palette
            const colorThemes = [
              { bg: 'bg-brand-50', text: 'text-brand-600', border: 'border-brand-200/80' },
              { bg: 'bg-coral-50', text: 'text-coral-600', border: 'border-coral-200/80' },
              { bg: 'bg-sunshine-50', text: 'text-sunshine-700', border: 'border-sunshine-200/80' },
            ];
            const theme = colorThemes[idx % colorThemes.length];

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-subtle space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${theme.bg} ${theme.text} border ${theme.border}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{h.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{h.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Credibility & Factual Boundary Note */}
      <div className="p-4 rounded-xl bg-sunshine-50/70 border border-sunshine-200/90 text-xs text-slate-700 space-y-1.5 shadow-subtle">
        <div className="font-semibold text-sunshine-950 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-sunshine-600" />
          <span>Factual Verification & Engineering Credibility</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          While ContextFlow validates that cited claims match verbatim text in the retrieved evidence window, citation validation is not an absolute guarantee of real-world truth. Operational stakeholders can always use the "Inspect Thread" action to review the full, verified conversation context.
        </p>
      </div>

      {/* Bottom CTA to Workspace */}
      <div className="pt-4 flex items-center justify-between">
        <Link to="/under-the-hood">
          <Button variant="outline" size="md" className="text-xs bg-white">
            Inspect Architecture Diagram
          </Button>
        </Link>

        <Link to="/">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Back to Workspace
          </Button>
        </Link>
      </div>
    </div>
  );
};
