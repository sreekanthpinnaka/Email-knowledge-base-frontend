import React from 'react';
import {
  Sparkles,
  RefreshCw,
  Database,
  Mail,
  Server,
  Cpu,
  ShieldCheck,
  ArrowRight,
  GitBranch,
  Lock,
  Search,
  Globe,
  Cloud,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export const UnderTheHoodPage: React.FC = () => {
  const steps = [
    {
      step: '1',
      title: 'Automated Ingestion & Sync',
      badge: 'n8n + Gmail API',
      badgeColor: 'yellow' as const,
      icon: RefreshCw,
      desc: 'Scheduled daily workflows or on-demand clicks read new messages from Gmail, extract clean text, and detect changes.',
    },
    {
      step: '2',
      title: 'Semantic Vector Indexing',
      badge: 'PostgreSQL + pgvector',
      badgeColor: 'blue' as const,
      icon: Database,
      desc: 'OpenAI creates 1536-dimensional embeddings for each email, stored alongside message metadata in Supabase PostgreSQL for fast similarity search.',
    },
    {
      step: '3',
      title: 'Grounded Answer Synthesis',
      badge: 'FastAPI + OpenAI',
      badgeColor: 'blue' as const,
      icon: Sparkles,
      desc: 'When you ask a question, the backend retrieves matching email passages and synthesizes an answer with verified, clickable citations ([1], [2]).',
    },
    {
      step: '4',
      title: 'Smart Gmail Fallback',
      badge: 'Direct Gmail API',
      badgeColor: 'red' as const,
      icon: GitBranch,
      desc: 'If an email arrived recently and has not yet synced to PostgreSQL, ContextFlow searches Gmail directly so questions never hit a dead end.',
    },
  ];

  const techStack = [
    {
      name: 'FastAPI on Cloud Run',
      role: 'API Gateway & Evidence Engine',
      desc: 'High-performance Python backend deployed on Google Cloud Run with scale-to-zero efficiency and HMAC-SHA256 session encryption.',
      icon: Server,
      color: 'bg-brand-50 text-brand-600 border-brand-200/80',
    },
    {
      name: 'Supabase PostgreSQL + pgvector',
      role: 'Vector Database & State Store',
      desc: 'Persistent relational database storing email metadata, vector embeddings for cosine similarity, and sync job states.',
      icon: Database,
      color: 'bg-brand-50 text-brand-700 border-brand-200/80',
    },
    {
      name: 'Gmail API Integration',
      role: 'Authoritative Source of Truth',
      desc: 'Live OAuth2 connection to fetch full MIME conversation threads on demand with concurrency controls and privacy boundaries.',
      icon: Mail,
      color: 'bg-coral-50 text-coral-600 border-coral-200/80',
    },
    {
      name: 'n8n Workflow Automation',
      role: 'Incremental Ingestion Pipeline',
      desc: 'Low-code orchestration connecting Gmail change history, batch embedding generation, and atomic database commits.',
      icon: RefreshCw,
      color: 'bg-sunshine-50 text-sunshine-700 border-sunshine-200/80',
    },
    {
      name: 'OpenAI Embeddings & LLM',
      role: 'Semantic Search & Grounded Answers',
      desc: 'Uses text-embedding-3-small for semantic matching and GPT-4.1-mini to synthesize answers strictly based on retrieved quotes.',
      icon: Sparkles,
      color: 'bg-coral-50 text-coral-600 border-coral-200/80',
    },
    {
      name: 'React + TypeScript + Vite',
      role: 'Responsive SaaS Client',
      desc: 'Modern interface with Tailwind CSS, TanStack Query, instant citation inspection, and full multi-turn conversation thread drawers.',
      icon: Cpu,
      color: 'bg-brand-50 text-brand-600 border-brand-200/80',
    },
  ];

  const designPrinciples = [
    {
      title: '1. Verifiable Citations, Zero Hallucinations',
      desc: 'Every factual assertion in an answer must link to a specific email excerpt tag ([1], [2]) with verbatim quotes verified by the backend before delivery.',
      icon: ShieldCheck,
      color: 'text-brand-600 bg-brand-50 border-brand-200',
    },
    {
      title: '2. Privacy-Conscious Architecture',
      desc: 'Full email bodies are NOT bulk-stored in the database. Instead, message bodies are retrieved on-demand via the Gmail API only when needed as evidence.',
      icon: Lock,
      color: 'text-coral-600 bg-coral-50 border-coral-200',
    },
    {
      title: '3. Dual-Path Reliability (PostgreSQL + Fallback)',
      desc: 'If database connections time out or an email is too new to be indexed, ContextFlow falls back to native Gmail search queries automatically.',
      icon: Search,
      color: 'text-sunshine-700 bg-sunshine-50 border-sunshine-200',
    },
  ];

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center sm:text-left border-b border-slate-200/90 pb-6">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
          <Badge variant="blue" className="text-xs">
            System Architecture
          </Badge>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 font-medium">How ContextFlow Works</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Under the Hood: Simplified Architecture
        </h1>
        <p className="text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
          A clear, transparent breakdown of how ContextFlow captures everyday email conversations,
          indexes them into PostgreSQL vector storage, and generates verified, evidence-backed answers.
        </p>
      </div>

      {/* 4-Step Pipeline Flow */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">End-to-End Workflow</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            How emails flow from your inbox into grounded answers in 4 straightforward steps:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle flex flex-col justify-between hover:border-brand-300 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-xl bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                      {s.step}
                    </span>
                    <Badge variant={s.badgeColor} className="text-[10px]">
                      {s.badge}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">{s.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Step {s.step} in pipeline</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Core Technology Stack</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The modern tools powering automation, data storage, and AI retrieval:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <Card key={tech.name} className="border-slate-200/90 shadow-subtle hover:border-slate-300 transition-all">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl ${tech.color} flex items-center justify-center border shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-xs font-bold text-slate-900">{tech.name}</CardTitle>
                      <p className="text-[10px] text-slate-500 font-medium">{tech.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-xs text-slate-600 leading-relaxed">{tech.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Production Infrastructure & Hosting */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Production Infrastructure & Deployment</h2>
            <Badge variant="blue" className="text-[10px]">
              Live Cloud Setup
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Exact runtime environments, cloud providers, and deployment architecture for frontend and backend:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Frontend Infra Card */}
          <Card className="border-slate-200/90 shadow-subtle hover:border-brand-200 transition-all">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-white to-white border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-bold text-slate-900">Frontend Tier (Client App)</CardTitle>
                    <p className="text-[10px] text-brand-700 font-medium">React 18 · TypeScript · Vite SPA</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 border border-brand-200">
                  Client Runtime
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-3.5 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-800 min-w-[85px] shrink-0">Framework:</span>
                <span>React 18 with strict TypeScript and Vite build bundling</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-800 min-w-[85px] shrink-0">UI & Styling:</span>
                <span>Tailwind CSS with custom design tokens, responsive grid, and Lucide icons</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-800 min-w-[85px] shrink-0">State & Cache:</span>
                <span>TanStack React Query for async cache invalidation, deduplication, and polling</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-800 min-w-[85px] shrink-0">Network Client:</span>
                <span>Centralized Axios client with 120s timeout for Cloud Run cold-start handling</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-800 min-w-[85px] shrink-0">Deployment:</span>
                <span>Static Single-Page Application (SPA) optimized for fast edge CDN delivery</span>
              </div>
            </CardContent>
          </Card>

          {/* Backend Infra Card */}
          <Card className="border-slate-200/90 shadow-subtle hover:border-coral-200 transition-all">
            <CardHeader className="bg-gradient-to-r from-coral-50/60 via-white to-white border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-coral-500 text-white flex items-center justify-center shadow-sm">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-bold text-slate-900">Backend Tier (API Engine)</CardTitle>
                    <p className="text-[10px] text-coral-700 font-medium">FastAPI on Google Cloud Run</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-coral-100 text-coral-800 border border-coral-200">
                  Google Cloud Run
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-3.5 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-800 min-w-[85px] shrink-0">Compute Host:</span>
                <span><strong>Google Cloud Run</strong> (<code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">us-east4</code> serverless container)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-800 min-w-[85px] shrink-0">Runtime:</span>
                <span>FastAPI (Python 3.11 asynchronous ASGI web framework via Uvicorn)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-800 min-w-[85px] shrink-0">Autoscaling:</span>
                <span>Scale-to-zero when idle for cost-efficiency; horizontal auto-concurrency under traffic</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-800 min-w-[85px] shrink-0">Database:</span>
                <span>Supabase PostgreSQL + <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">pgvector</code> for 1536-dim cosine similarity</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-800 min-w-[85px] shrink-0">Automation:</span>
                <span>n8n workflow webhooks, OpenAI API (<code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">gpt-4.1-mini</code>), and Gmail API OAuth2</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Core Design Principles */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Key Engineering Guardrails</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Architectural decisions made specifically for enterprise operations reliability:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {designPrinciples.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-2.5"
              >
                <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center border shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation CTA */}
      <div className="pt-4 border-t border-slate-200/90 flex items-center justify-between">
        <Link to="/about">
          <Button variant="outline" size="md" className="text-xs bg-white">
            About the Project & Candidate
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
