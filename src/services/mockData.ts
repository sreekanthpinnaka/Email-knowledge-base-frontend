import type {
  EmailResult,
  ThreadResponse,
  AnswerResponse,
  SyncJob,
} from '@/types/api';

export const MOCK_PASSWORD = 'spine';

export const MOCK_EMAILS: EmailResult[] = [
  {
    gmail_message_id: 'msg-101',
    gmail_thread_id: 'thread-timeline-01',
    subject: 'Sprint 42 Timeline & Deployment Milestones',
    sender_email: 'sarah.lin@spineops.internal',
    direction: 'incoming',
    received_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    score: 0.94,
    gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-timeline-01',
  },
  {
    gmail_message_id: 'msg-102',
    gmail_thread_id: 'thread-db-02',
    subject: 'PostgreSQL Migration & pgvector Schema Review',
    sender_email: 'alex.chen@spineops.internal',
    direction: 'incoming',
    received_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    score: 0.88,
    gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-db-02',
  },
  {
    gmail_message_id: 'msg-103',
    gmail_thread_id: 'thread-n8n-03',
    subject: 'Client Onboarding Workflow Automation with n8n',
    sender_email: 'priya.patel@spineops.internal',
    direction: 'incoming',
    received_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    score: 0.82,
    gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-n8n-03',
  },
  {
    gmail_message_id: 'msg-104',
    gmail_thread_id: 'thread-sync-04',
    subject: 'Decision Record: Gmail API Sync Lease & Cursor Management',
    sender_email: 'sreekanth.pinnaka@spineops.internal',
    direction: 'outgoing',
    received_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    score: 0.79,
    gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-sync-04',
  },
  {
    gmail_message_id: 'msg-105',
    gmail_thread_id: 'thread-ops-05',
    subject: 'Quarterly Operations Review & Action Items',
    sender_email: 'marcus.vance@spineops.internal',
    direction: 'incoming',
    received_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    score: 0.75,
    gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-ops-05',
  },
];

export const MOCK_THREADS: Record<string, ThreadResponse> = {
  'thread-timeline-01': {
    thread_id: 'thread-timeline-01',
    gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-timeline-01',
    retrieval: {
      source: 'gmail',
      fallback_used: false,
    },
    evidence_source: 'gmail',
    messages: [
      {
        gmail_message_id: 'msg-101-a',
        gmail_thread_id: 'thread-timeline-01',
        subject: 'Sprint 42 Timeline & Deployment Milestones',
        sender_email: 'sarah.lin@spineops.internal',
        recipients: 'team@spineops.internal',
        received_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        labels: ['INBOX', 'PROJECTS'],
        body: `Hi Team,\n\nFollowing our sprint planning meeting, here is the approved deployment timeline for Sprint 42:\n\n1. Staging Freeze: Thursday 4:00 PM EST.\n2. Final End-to-End QA: Friday 10:00 AM EST.\n3. Production Rollout: Next Tuesday at 02:00 UTC during our lowest traffic window.\n\nDecision note: We decided to postpone the multi-region failover dry-run by one week to ensure the pgvector index indexing finishes cleanly without locking tables.\n\nPlease flag any blocker before Thursday morning.\n\nBest,\nSarah`,
      },
      {
        gmail_message_id: 'msg-101-b',
        gmail_thread_id: 'thread-timeline-01',
        subject: 'Re: Sprint 42 Timeline & Deployment Milestones',
        sender_email: 'sreekanth.pinnaka@spineops.internal',
        recipients: 'sarah.lin@spineops.internal, team@spineops.internal',
        received_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        labels: ['SENT'],
        body: `Thanks Sarah. The Cloud Run service container is prepared and verified against the staging Supabase pooler. Concurrency limits are set to 3 slots for Gmail fetching to prevent rate limiting.\n\nEverything is on track for Tuesday deployment.\n\nSreekanth`,
      },
    ],
  },
  'thread-db-02': {
    thread_id: 'thread-db-02',
    gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-db-02',
    retrieval: {
      source: 'gmail',
      fallback_used: false,
    },
    evidence_source: 'gmail',
    messages: [
      {
        gmail_message_id: 'msg-102-a',
        gmail_thread_id: 'thread-db-02',
        subject: 'PostgreSQL Migration & pgvector Schema Review',
        sender_email: 'alex.chen@spineops.internal',
        recipients: 'engineering@spineops.internal',
        received_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        labels: ['INBOX', 'DATABASE'],
        body: `Team,\n\nThe SQL migration create-sync-jobs.sql has been validated on the Supabase test instance.\n\nKey decisions:\n- Table sync_jobs uses UUID primary keys and state transitions: queued -> running -> completed/failed.\n- Pool size is strictly capped at 3 connections to prevent exhausting the Supabase session pooler.\n- Embedding dimension is locked to 1536 (text-embedding-3-small).\n\nPlease review the PR by end of day.\n\nAlex`,
      },
    ],
  },
  'thread-n8n-03': {
    thread_id: 'thread-n8n-03',
    gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-n8n-03',
    retrieval: {
      source: 'gmail',
      fallback_used: false,
    },
    evidence_source: 'gmail',
    messages: [
      {
        gmail_message_id: 'msg-103-a',
        gmail_thread_id: 'thread-n8n-03',
        subject: 'Client Onboarding Workflow Automation with n8n',
        sender_email: 'priya.patel@spineops.internal',
        recipients: 'ops@spineops.internal',
        received_at: new Date(Date.now() - 3600000 * 26).toISOString(),
        labels: ['INBOX', 'AUTOMATION'],
        body: `Hi Operations Team,\n\nThe automated n8n workflow for incremental Gmail sync is now active.\n\nImportant operational details:\n- The hourly scheduled workflow acquires an incremental lease of 90 minutes.\n- The manual controller webhook responds immediately with HTTP 202 and then runs sub-workflows.\n- Callbacks authenticate with FastAPI via the X-Sync-Token header.\n\nPriya`,
      },
    ],
  },
  'thread-sync-04': {
    thread_id: 'thread-sync-04',
    gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-sync-04',
    retrieval: {
      source: 'gmail',
      fallback_used: false,
    },
    evidence_source: 'gmail',
    messages: [
      {
        gmail_message_id: 'msg-104-a',
        gmail_thread_id: 'thread-sync-04',
        subject: 'Decision Record: Gmail API Sync Lease & Cursor Management',
        sender_email: 'sreekanth.pinnaka@spineops.internal',
        recipients: 'architecture@spineops.internal',
        received_at: new Date(Date.now() - 3600000 * 48).toISOString(),
        labels: ['SENT', 'DECISIONS'],
        body: `Architecture Decision Record:\n\nTopic: Gmail Cursor Commit & Fallback Behavior\n\nDecision:\n1. If PostgreSQL vector retrieval returns 0 candidates or fails with database timeout, the search service automatically initiates direct Gmail fallback.\n2. Fallback synthesizes search terms and queries Gmail API directly, bypassing the need for prior synchronization.\n3. Synchronization state commits the history cursor only when all embeddings and deletions succeed atomically.\n\nSreekanth Pinnaka`,
      },
    ],
  },
  'thread-ops-05': {
    thread_id: 'thread-ops-05',
    gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-ops-05',
    retrieval: {
      source: 'gmail',
      fallback_used: false,
    },
    evidence_source: 'gmail',
    messages: [
      {
        gmail_message_id: 'msg-105-a',
        gmail_thread_id: 'thread-ops-05',
        subject: 'Quarterly Operations Review & Action Items',
        sender_email: 'marcus.vance@spineops.internal',
        recipients: 'leadership@spineops.internal',
        received_at: new Date(Date.now() - 3600000 * 72).toISOString(),
        labels: ['INBOX', 'ACTION_ITEMS'],
        body: `Leadership Team,\n\nHere are the consolidated action items from yesterday's Operations review:\n\n1. Sreekanth: Finalize the ContextFlow retrieval engine with citation validation.\n2. Sarah: Coordinate Sprint 42 staging freeze on Thursday.\n3. Alex: Monitor PostgreSQL pool usage during peak batch syncs.\n4. Priya: Validate n8n retry credentials.\n\nMarcus Vance\nOperations Lead`,
      },
    ],
  },
};

/**
 * Generates dynamic, realistic answers for testing based on user questions.
 */
export function getMockAnswer(question: string): AnswerResponse {
  const q = question.toLowerCase();

  if (q.includes('timeline') || q.includes('schedule') || q.includes('when')) {
    return {
      answer:
        'Based on the Sprint 42 planning discussion [1], the approved timeline includes three key milestones:\n\n' +
        '1. **Staging Freeze**: Scheduled for Thursday at 4:00 PM EST [1].\n' +
        '2. **Final End-to-End QA**: Friday at 10:00 AM EST [1].\n' +
        '3. **Production Rollout**: Scheduled for next Tuesday at 02:00 UTC during the lowest traffic window [1].\n\n' +
        'Additionally, the team decided to postpone the multi-region failover dry-run by one week to ensure the pgvector index completes cleanly without table locks [1]. Sreekanth verified that the Cloud Run service container is ready and verified against the staging Supabase pooler [2].',
      status: 'answered',
      sources: [
        {
          citation: '[1]',
          gmail_message_id: 'msg-101-a',
          gmail_thread_id: 'thread-timeline-01',
          subject: 'Sprint 42 Timeline & Deployment Milestones',
          sender_email: 'sarah.lin@spineops.internal',
          received_at: new Date(Date.now() - 3600000 * 6).toISOString(),
          excerpt:
            'Following our sprint planning meeting, here is the approved deployment timeline for Sprint 42: 1. Staging Freeze: Thursday 4:00 PM EST. 2. Final End-to-End QA: Friday 10:00 AM EST. 3. Production Rollout: Next Tuesday at 02:00 UTC...',
          gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-timeline-01',
        },
        {
          citation: '[2]',
          gmail_message_id: 'msg-101-b',
          gmail_thread_id: 'thread-timeline-01',
          subject: 'Re: Sprint 42 Timeline & Deployment Milestones',
          sender_email: 'sreekanth.pinnaka@spineops.internal',
          received_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          excerpt:
            'The Cloud Run service container is prepared and verified against the staging Supabase pooler. Concurrency limits are set to 3 slots for Gmail fetching...',
          gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-timeline-01',
        },
      ],
      retrieval: {
        source: 'postgresql',
        fallback_used: false,
        fallback_reason: null,
        coverage: 'bounded',
        candidate_messages: 5,
        threads_examined: 2,
        evidence_messages: 2,
        answer_validation: 'passed',
        notice: 'Found through PostgreSQL; message bodies are fetched from Gmail.',
        timings_ms: {
          embedding_ms: 18.4,
          postgresql_ms: 32.1,
          evidence_ms: 24.6,
          generation_ms: 480.2,
          total_ms: 555.3,
        },
      },
      evidence_source: 'gmail',
    };
  }

  if (q.includes('action item') || q.includes('who') || q.includes('task')) {
    return {
      answer:
        'The consolidated operational action items from the quarterly review [1] are assigned as follows:\n\n' +
        '- **Sreekanth**: Finalize the ContextFlow retrieval engine with citation validation [1].\n' +
        '- **Sarah**: Coordinate the Sprint 42 staging freeze scheduled for Thursday [1].\n' +
        '- **Alex**: Monitor PostgreSQL connection pool usage during peak batch synchronization [1].\n' +
        '- **Priya**: Validate n8n retry credentials and webhook triggers [1].',
      status: 'answered',
      sources: [
        {
          citation: '[1]',
          gmail_message_id: 'msg-105-a',
          gmail_thread_id: 'thread-ops-05',
          subject: 'Quarterly Operations Review & Action Items',
          sender_email: 'marcus.vance@spineops.internal',
          received_at: new Date(Date.now() - 3600000 * 72).toISOString(),
          excerpt:
            "Here are the consolidated action items from yesterday's Operations review: 1. Sreekanth: Finalize the ContextFlow retrieval engine with citation validation. 2. Sarah: Coordinate Sprint 42 staging freeze on Thursday...",
          gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-ops-05',
        },
      ],
      retrieval: {
        source: 'postgresql',
        fallback_used: false,
        fallback_reason: null,
        coverage: 'bounded',
        candidate_messages: 4,
        threads_examined: 1,
        evidence_messages: 1,
        answer_validation: 'passed',
        notice: 'Found through PostgreSQL; message bodies are fetched from Gmail.',
        timings_ms: {
          embedding_ms: 16.2,
          postgresql_ms: 28.5,
          evidence_ms: 19.8,
          generation_ms: 395.4,
          total_ms: 459.9,
        },
      },
      evidence_source: 'gmail',
    };
  }

  if (q.includes('deployment') || q.includes('cloud run') || q.includes('staging')) {
    return {
      answer:
        'Regarding deployment, the production rollout is scheduled for Tuesday at 02:00 UTC [1]. The container image is hosted on Google Cloud Run and tested against the staging Supabase pooler [2].\n\n' +
        'Key operational guardrails include capping thread fetching to 3 concurrent slots to prevent Gmail API rate limiting [2], and strictly maintaining a maximum connection pool of 3 on PostgreSQL [3].',
      status: 'answered',
      sources: [
        {
          citation: '[1]',
          gmail_message_id: 'msg-101-a',
          gmail_thread_id: 'thread-timeline-01',
          subject: 'Sprint 42 Timeline & Deployment Milestones',
          sender_email: 'sarah.lin@spineops.internal',
          received_at: new Date(Date.now() - 3600000 * 6).toISOString(),
          excerpt:
            'Production Rollout: Next Tuesday at 02:00 UTC during our lowest traffic window...',
          gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-timeline-01',
        },
        {
          citation: '[2]',
          gmail_message_id: 'msg-101-b',
          gmail_thread_id: 'thread-timeline-01',
          subject: 'Re: Sprint 42 Timeline & Deployment Milestones',
          sender_email: 'sreekanth.pinnaka@spineops.internal',
          received_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          excerpt:
            'The Cloud Run service container is prepared and verified against the staging Supabase pooler. Concurrency limits are set to 3 slots for Gmail fetching...',
          gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-timeline-01',
        },
        {
          citation: '[3]',
          gmail_message_id: 'msg-102-a',
          gmail_thread_id: 'thread-db-02',
          subject: 'PostgreSQL Migration & pgvector Schema Review',
          sender_email: 'alex.chen@spineops.internal',
          received_at: new Date(Date.now() - 3600000 * 12).toISOString(),
          excerpt:
            'Pool size is strictly capped at 3 connections to prevent exhausting the Supabase session pooler...',
          gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-db-02',
        },
      ],
      retrieval: {
        source: 'postgresql',
        fallback_used: false,
        fallback_reason: null,
        coverage: 'bounded',
        candidate_messages: 5,
        threads_examined: 3,
        evidence_messages: 3,
        answer_validation: 'passed',
        notice: 'Found through PostgreSQL; message bodies are fetched from Gmail.',
        timings_ms: {
          embedding_ms: 19.1,
          postgresql_ms: 35.8,
          evidence_ms: 31.2,
          generation_ms: 512.0,
          total_ms: 598.1,
        },
      },
      evidence_source: 'gmail',
    };
  }

  // Generic fallback response for any custom question
  return {
    answer:
      `In response to your query regarding "${question}", operational records indicate that synchronization and architecture decisions were agreed upon in recent communications [1][2].\n\n` +
      '1. **Sync & Cursor Policy**: Incremental Gmail changes are tracked with history cursors, and un-indexed messages can be located via direct Gmail fallback search [1].\n' +
      '2. **Infrastructure**: PostgreSQL pgvector embeddings are paired with text-embedding-3-small, and background jobs are persisted in the sync_jobs state table [2].',
    status: 'answered',
    sources: [
      {
        citation: '[1]',
        gmail_message_id: 'msg-104-a',
        gmail_thread_id: 'thread-sync-04',
        subject: 'Decision Record: Gmail API Sync Lease & Cursor Management',
        sender_email: 'sreekanth.pinnaka@spineops.internal',
        received_at: new Date(Date.now() - 3600000 * 48).toISOString(),
        excerpt:
          'If PostgreSQL vector retrieval returns 0 candidates or fails with database timeout, the search service automatically initiates direct Gmail fallback...',
        gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-sync-04',
      },
      {
        citation: '[2]',
        gmail_message_id: 'msg-102-a',
        gmail_thread_id: 'thread-db-02',
        subject: 'PostgreSQL Migration & pgvector Schema Review',
        sender_email: 'alex.chen@spineops.internal',
        received_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        excerpt:
          'Table sync_jobs uses UUID primary keys and state transitions: queued -> running -> completed/failed...',
        gmail_url: 'https://mail.google.com/mail/u/0/#all/thread-db-02',
      },
    ],
    retrieval: {
      source: 'postgresql',
      fallback_used: false,
      fallback_reason: null,
      coverage: 'bounded',
      candidate_messages: 3,
      threads_examined: 2,
      evidence_messages: 2,
      answer_validation: 'passed',
      notice: 'Found through PostgreSQL; message bodies are fetched from Gmail.',
      timings_ms: {
        embedding_ms: 17.5,
        postgresql_ms: 30.2,
        evidence_ms: 22.0,
        generation_ms: 430.5,
        total_ms: 500.2,
      },
    },
    evidence_source: 'gmail',
  };
}

/**
 * In-memory simulated sync job state tracker for testing polling
 */
let simulatedJobStartTime: number | null = null;
let simulatedJobId: string | null = null;

export function createMockSyncJob(): SyncJob {
  simulatedJobId = 'sync-job-' + Math.random().toString(36).substring(2, 9);
  simulatedJobStartTime = Date.now();

  return {
    request_id: simulatedJobId,
    status: 'queued',
    message: 'Sync job queued in PostgreSQL. Dispatching webhook to n8n...',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    started_at: null,
    finished_at: null,
    status_url: `/api/v1/sync/${simulatedJobId}`,
    poll_after_seconds: 3,
  };
}

export function getMockSyncJobStatus(requestId: string): SyncJob {
  const elapsed = simulatedJobStartTime ? (Date.now() - simulatedJobStartTime) / 1000 : 10;

  if (elapsed < 3) {
    return {
      request_id: requestId,
      status: 'queued',
      message: 'Workflow accepted by n8n controller. Preparing worker...',
      created_at: new Date(Date.now() - elapsed * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      started_at: null,
      finished_at: null,
    };
  }

  if (elapsed < 9) {
    return {
      request_id: requestId,
      status: 'running',
      message: 'n8n worker is actively parsing Gmail changes, generating embeddings, and updating pgvector...',
      created_at: new Date(Date.now() - elapsed * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      started_at: new Date(Date.now() - (elapsed - 3) * 1000).toISOString(),
      finished_at: null,
    };
  }

  return {
    request_id: requestId,
    status: 'completed',
    message: 'Synchronization finished successfully. 4 new messages indexed, 4 embeddings committed.',
    created_at: new Date(Date.now() - elapsed * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    started_at: new Date(Date.now() - (elapsed - 3) * 1000).toISOString(),
    finished_at: new Date().toISOString(),
  };
}
