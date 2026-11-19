import { apiClient } from './api';
import type { AskRequest, AnswerResponse } from '@/types/api';
import { USE_MOCK_API } from '@/lib/config';
import { getMockAnswer } from './mockData';

export const questionService = {
  /**
   * Submit an AI question for grounded retrieval and structured answer generation.
   * Calls POST /api/v1/ask or serves realistic mock grounded answer.
   */
  async askQuestion(payload: AskRequest): Promise<AnswerResponse> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 650)); // Realistic latency for embedding + pgvector + LLM
      return getMockAnswer(payload.question);
    }

    const response = await apiClient.post<AnswerResponse>('/api/v1/ask', payload);
    return response.data;
  },
};
