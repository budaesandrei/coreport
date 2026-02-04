import apiClient from './client';

export type UnreadCountResponse = {
  unread: number;
};

/**
 * Fetch unread notifications count.
 *
 * Backend wiring is currently stubbed, but this function is the single place
 * to swap in the real endpoint later.
 */
export async function getUnreadNotificationCount(): Promise<number> {
  // Future: GET /notifications/unread_count -> { unread: number }
  try {
    const res = await apiClient.get<UnreadCountResponse>('/notifications/unread_count');
    if (typeof res.data?.unread === 'number') return res.data.unread;
  } catch {
    // ignore
  }

  // Stub (task #4)
  return 3;
}
