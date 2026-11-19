/**
 * ContextFlow API Schema Type Definitions
 * Source of truth: FastAPI Backend (app/schemas/models.py, app/api/auth.py, app/api/routes.py)
 */

export interface UnlockRequest {
  password: string;
}

export interface UnlockResponse {
  access_token: string;
  token_type: string;
  expires_at: number; // Unix timestamp in seconds
  expires_in: number;
}

export interface SessionResponse {
  authenticated: boolean;
  expires_at: number;
}

export interface HealthResponse {
  status: string;
  service: string;
  database_configured: boolean;
}

export interface EmailResult {
  gmail_message_id: string;
  gmail_thread_id: string;
  subject: string | null;
  sender_email: string | null;
  direction?: 'incoming' | 'outgoing' | 'other' | string | null;
  received_at: string | null;
  score?: number | null;
  gmail_url?: string | null;
}

export interface EmailsListResponse {
  items: EmailResult[];
  retrieval: {
    source: string;
    fallback_used: boolean;
  };
}

export interface Source {
  citation: string; // e.g. "[1]"
  gmail_message_id: string;
  gmail_thread_id: string;
  subject: string | null;
  sender_email: string | null;
  received_at: string | null;
  excerpt: string;
  gmail_url: string;
}

export interface DiagnosticItem {
  provider: string;
  stage: string;
  error_type: string;
  sqlstate?: string | null;
}

export interface RetrievalTimings {
  embedding_ms?: number;
  postgresql_ms?: number;
  evidence_ms?: number;
  generation_ms?: number;
  gmail_fallback_ms?: number;
  total_ms?: number;
  [key: string]: number | undefined;
}

export interface RetrievalMetadata {
  source: 'postgresql' | 'gmail_fallback' | string;
  fallback_used: boolean;
  fallback_reason?: string | null;
  coverage?: string;
  warnings?: string[];
  diagnostics?: DiagnosticItem[];
  notice?: string;
  queries_attempted?: string[];
  candidate_messages?: number;
  threads_examined?: number;
  evidence_messages?: number;
  answer_validation?: 'passed' | 'model_insufficient_evidence' | 'missing_citations_or_claims' | 'supporting_quote_mismatch' | 'unknown_citation' | string;
  timings_ms?: RetrievalTimings;
  error?: string;
  provider_error?: string;
}

export interface AnswerResponse {
  answer: string;
  status: 'answered' | 'insufficient_evidence' | 'answer_validation_failed' | string;
  sources: Source[];
  retrieval: RetrievalMetadata;
  evidence_source: string;
}

export interface SearchRequest {
  question: string;
  limit?: number;
  gmail_query?: string | null;
}

export interface AskRequest extends SearchRequest {
  max_threads?: number;
}

export interface SearchResponse {
  question: string;
  results: EmailResult[];
  count: number;
  retrieval: RetrievalMetadata;
}

export interface ThreadMessage {
  gmail_message_id: string;
  gmail_thread_id: string;
  subject: string;
  sender_email: string;
  recipients: string;
  received_at: string | null;
  body: string;
  labels: string[];
}

export interface ThreadResponse {
  thread_id: string;
  gmail_url: string;
  messages: ThreadMessage[];
  retrieval: {
    source: string;
    fallback_used: boolean;
  };
  evidence_source: string;
}

export type SyncJobStatus = 'queued' | 'unknown' | 'running' | 'completed' | 'failed';

export interface SyncJob {
  request_id: string;
  status: SyncJobStatus;
  message: string | null;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  finished_at: string | null;
  status_url?: string;
  poll_after_seconds?: number;
}
