import { apiClient } from './api';
import type { SyncJob } from '@/types/api';
import { USE_MOCK_API } from '@/lib/config';
import { createMockSyncJob, getMockSyncJobStatus } from './mockData';

export const syncService = {
  /**
   * Trigger manual email synchronization via n8n webhook.
   */
  async triggerSync(): Promise<SyncJob> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return createMockSyncJob();
    }

    const response = await apiClient.post<SyncJob>('/api/v1/sync');
    return response.data;
  },

  /**
   * Poll synchronization job status.
   */
  async getSyncStatus(requestId: string): Promise<SyncJob> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 150));
      return getMockSyncJobStatus(requestId);
    }

    const response = await apiClient.get<SyncJob>(`/api/v1/sync/${requestId}`);
    return response.data;
  },
};
