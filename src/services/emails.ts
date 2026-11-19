import { apiClient } from './api';
import type {
  EmailsListResponse,
  SearchRequest,
  SearchResponse,
  ThreadResponse,
} from '@/types/api';
import { USE_MOCK_API } from '@/lib/config';
import { MOCK_EMAILS, MOCK_THREADS } from './mockData';

export const emailService = {
  /**
   * Browse indexed email metadata from PostgreSQL.
   */
  async listEmails(params?: {
    limit?: number;
    offset?: number;
    sender?: string;
    subject?: string;
  }): Promise<EmailsListResponse> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 200));
      let filtered = [...MOCK_EMAILS];
      if (params?.sender) {
        filtered = filtered.filter((e) =>
          e.sender_email?.toLowerCase().includes(params.sender!.toLowerCase())
        );
      }
      if (params?.subject) {
        filtered = filtered.filter((e) =>
          e.subject?.toLowerCase().includes(params.subject!.toLowerCase())
        );
      }
      const offset = params?.offset || 0;
      const limit = params?.limit || 15;
      const items = filtered.slice(offset, offset + limit);

      return {
        items,
        retrieval: {
          source: 'postgresql',
          fallback_used: false,
        },
      };
    }

    const response = await apiClient.get<EmailsListResponse>('/api/v1/emails', {
      params,
    });
    return response.data;
  },

  /**
   * Search indexed emails with PostgreSQL hybrid retrieval or direct Gmail fallback.
   */
  async searchEmails(payload: SearchRequest): Promise<SearchResponse> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      const q = payload.question.toLowerCase();
      const results = MOCK_EMAILS.filter((e) =>
        e.subject?.toLowerCase().includes(q) || e.sender_email?.toLowerCase().includes(q)
      );

      return {
        question: payload.question,
        results: results.length > 0 ? results : MOCK_EMAILS.slice(0, 3),
        count: results.length > 0 ? results.length : 3,
        retrieval: {
          source: 'postgresql',
          fallback_used: false,
          coverage: 'bounded',
          notice: 'Found through PostgreSQL; message bodies are fetched from Gmail.',
          timings_ms: {
            embedding_ms: 15.2,
            postgresql_ms: 22.4,
            total_ms: 37.6,
          },
        },
      };
    }

    const response = await apiClient.post<SearchResponse>('/api/v1/search', payload);
    return response.data;
  },

  /**
   * Fetch full original Gmail conversation thread.
   */
  async getThread(threadId: string): Promise<ThreadResponse> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 250));
      const cleanId = threadId.trim();
      if (MOCK_THREADS[cleanId]) {
        return MOCK_THREADS[cleanId];
      }

      // Default mock thread response if ID not in predefined map
      return {
        thread_id: cleanId,
        gmail_url: `https://mail.google.com/mail/u/0/#all/${cleanId}`,
        retrieval: {
          source: 'gmail',
          fallback_used: false,
        },
        evidence_source: 'gmail',
        messages: [
          {
            gmail_message_id: `msg-${cleanId}`,
            gmail_thread_id: cleanId,
            subject: 'Operational Communication Record',
            sender_email: 'sarah.lin@spineops.internal',
            recipients: 'ops@spineops.internal',
            received_at: new Date().toISOString(),
            labels: ['INBOX', 'CONTEXTFLOW'],
            body: `This is a verified live message thread record for thread ID ${cleanId}.\n\nAll operational evidence and header metadata were extracted directly from the Gmail API with strict privacy boundaries.`,
          },
        ],
      };
    }

    const cleanId = encodeURIComponent(threadId.trim());
    const response = await apiClient.get<ThreadResponse>(`/api/v1/threads/${cleanId}`);
    return response.data;
  },
};
