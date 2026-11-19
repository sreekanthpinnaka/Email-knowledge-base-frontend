# ContextFlow — Frontend

A production-quality React application for **ContextFlow**, an AI-powered email knowledge base.

This portfolio project was designed and implemented by **Sreekanth Pinnaka**, inspired specifically by the **AI & Operations Associate** role at **Spine**.

It demonstrates end-to-end capabilities in operational workflow automation, API integration (Gmail API, n8n, OpenAI), semantic search (PostgreSQL/pgvector), resilient fallback engineering, and building trustworthy operational interfaces for cross-functional teams.

---

## Key Features

1. **Initial Password Gate**
   - Strictly hides all application information, metrics, navigation, and dashboard components until unlocked.
   - Communicates with `POST /api/v1/auth/unlock` on FastAPI.
   - Detects and gracefully handles Google Cloud Run cold starts ("Connecting to ContextFlow...").
   - Maintains stateless bearer session in browser storage without re-requesting credentials across refreshes.

2. **Spine Hiring Reviewer Onboarding**
   - 3-step interactive testing guide (Send Email &rarr; Synchronize &rarr; Ask Questions).
   - Display of the live demo mailbox (`liveprojectdemo001@gmail.com`) with one-click clipboard copying.
   - Pre-populated operational question chips for rapid evaluation.

3. **Grounded AI Question Answering & Verification**
   - Natural language queries to `POST /api/v1/ask`.
   - Clickable inline citation tags (`[1]`, `[2]`) that highlight corresponding source cards.
   - Verbatim excerpt quotes extracted from live Gmail bodies.
   - Full conversation thread inspector drawer via `GET /api/v1/threads/{thread_id}`.
   - Live retrieval telemetry inspector ("How this answer was found") showing candidate counts, timing breakdowns, and validation checks.

4. **Inbox Synchronization Tracking**
   - Triggers manual n8n webhook sync via `POST /api/v1/sync` (returns HTTP 202).
   - Polls `GET /api/v1/sync/{request_id}` every 3 seconds.
   - Manages complete lifecycle states: `queued`, `running`, `completed`, `failed`, and `unknown`.
   - Built-in polling timeout and duplicate request prevention.

5. **Email Knowledge Base Browser & Search**
   - Direct browsing of indexed metadata from PostgreSQL (`GET /api/v1/emails`).
   - Keyword search across email headers and snippets (`POST /api/v1/search`).
   - Deep inspection of any thread without leaving the workspace.

6. **Interactive "Under the Hood" Architecture Page**
   - Visual step-by-step breakdown of the grounded retrieval pipeline.
   - Visual breakdown of the dual-workflow n8n ingestion architecture (Scheduled hourly vs. User-triggered sync).
   - Transparent engineering audit detailing intentional omissions (e.g., why Redis, streaming, or background queues were deliberately omitted in favor of verifiable correctness and cost efficiency).

---

## Technology Stack

- **React 19** with **TypeScript** (Strict mode)
- **Vite** (Optimized chunking with Rollup)
- **Tailwind CSS** (Custom enterprise color palette & typography)
- **TanStack Query (React Query v5)** (Server state management, background caching, and automatic deduplication)
- **React Router v7** (Client-side routing)
- **Axios** (Centralized API client with interceptors, bearer tokens, and cold-start timeouts)
- **Lucide React** (Consistent iconography)

---

## Project Structure

```text
src/
├── app/
│   ├── App.tsx             # Root gate: strictly enforces password unlock
│   ├── router.tsx          # Protected application routes
│   └── providers.tsx       # TanStack Query, Auth, and Router providers
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Navigation, Spine demo badge, backend health check
│   │   ├── Footer.tsx      # Developer attribution and technical tags
│   │   └── AppLayout.tsx   # Authenticated layout shell
│   ├── workspace/
│   │   ├── WelcomeBanner.tsx      # Collapsible quick-start banner
│   │   ├── EmailCard.tsx          # Live mailbox display & instructions
│   │   ├── SyncPanel.tsx          # n8n trigger & status polling engine
│   │   ├── QuestionInterface.tsx  # Natural language Q&A input
│   │   ├── AnswerCard.tsx         # Grounded response, citation tags & sources
│   │   ├── RetrievalDetailsModal.tsx # Execution latency & pipeline telemetry
│   │   ├── ThreadDrawer.tsx       # Slide-over full Gmail conversation viewer
│   │   └── EmailBrowser.tsx       # PostgreSQL email list & search
│   ├── onboarding/
│   │   └── WelcomeModal.tsx       # 3-step walkthrough for Spine hiring reviewers
│   └── ui/                        # Reusable accessible UI primitives
├── context/
│   ├── authContextDef.ts   # React context interface
│   └── AuthContext.tsx     # Session lifecycle provider
├── hooks/
│   └── useAuth.ts          # Authentication consumer hook
├── pages/
│   ├── UnlockPage.tsx      # Dark-themed password-only entry screen
│   ├── WorkspacePage.tsx   # Primary operational AI workspace
│   ├── UnderTheHoodPage.tsx # Interactive system architecture & engineering audit
│   └── AboutPage.tsx       # Narrative, problem/solution, and attribution
├── services/
│   ├── api.ts              # Axios instance with auth interceptor & Cloud Run timeout
│   ├── auth.ts             # Unlock & session verification endpoints
│   ├── emails.ts           # Email metadata listing & thread retrieval
│   ├── questions.ts        # Grounded AI Q&A API calls
│   └── sync.ts             # Sync dispatch & polling endpoints
├── types/
│   └── api.ts              # Strict TypeScript definitions matching FastAPI Pydantic models
└── lib/
    ├── config.ts           # Environment configuration
    └── utils.ts            # Formatting & utility helpers
```

---

## Environment Configuration

Create a `.env` file in the frontend root:

```env
# URL of your FastAPI backend (local development or Google Cloud Run)
VITE_API_BASE_URL=http://localhost:8000

# Configured Gmail mailbox for test emails and deep links
VITE_PROJECT_GMAIL_ACCOUNT=liveprojectdemo001@gmail.com

# Application Title
VITE_APP_TITLE=ContextFlow
```

---

## Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### 3. Local Evaluation & Password
- **Access Password:** Enter `spine` on the initial lock screen to unlock the full workspace locally.
- **Mock Mode:** `VITE_USE_MOCK_API=true` is enabled by default in `.env` so you can test all features (Q&A with citations, sync polling, full thread drawer, email search) without running the backend server.
- **Live Mode:** Set `VITE_USE_MOCK_API=false` in `.env` whenever you want to connect to the live Cloud Run or local FastAPI instance.

### 4. Run Linting
```bash
npm run lint
```

### 5. Build for Production
```bash
npm run build
```

### 6. Preview Production Build
```bash
npm run preview
```

---

## Integration with FastAPI Backend

ContextFlow frontend connects to the following FastAPI endpoints:

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Backend and database connectivity status |
| `POST` | `/api/v1/auth/unlock` | Shared password verification and bearer token issuance |
| `GET` | `/api/v1/auth/session` | Stateless token validation |
| `GET` | `/api/v1/emails` | Paginated indexed email headers |
| `POST` | `/api/v1/search` | PostgreSQL vector/keyword search with Gmail fallback |
| `GET` | `/api/v1/threads/{id}` | Original Gmail thread conversation fetch |
| `POST` | `/api/v1/ask` | Grounded AI answer synthesis with citation validation |
| `POST` | `/api/v1/sync` | Trigger asynchronous manual sync via n8n |
| `GET` | `/api/v1/sync/{id}` | Poll synchronization job state in PostgreSQL |

---

## Attribution & Independent Portfolio Statement

- **Developer:** Sreekanth Pinnaka
- **Role Alignment:** Inspired by the *AI & Operations Associate* position at Spine.
- **Affiliation Disclaimer:** This is an independent portfolio demonstration built to showcase real-world operational AI systems engineering. It is not an official Spine product or company-sponsored deployment.
