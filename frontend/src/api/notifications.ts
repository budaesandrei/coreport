import apiClient from './client';
import type { NotificationItem } from '@types/notifications';

export type UnreadCountResponse = {
  unread: number;
};

export type NotificationsListResponse = {
  notifications: NotificationItem[];
};

function stubNotifications(): NotificationItem[] {
  const now = Date.now();
  return [
    {
      id: 'stub-1',
      title: 'Submission ready for review',
      body: 'A new submission is waiting in your queue.',
      createdAt: new Date(now - 1000 * 60 * 15).toISOString(),
      readAt: null,
    },
    {
      id: 'stub-2',
      title: 'Workspace invite accepted',
      body: 'A user has joined your workspace.',
      createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
      readAt: null,
    },
    {
      id: 'stub-3',
      title: 'Daily summary available',
      body: 'Your daily report is ready to view.',
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      readAt: null,
    },
  ];
}

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
  return stubNotifications().filter((n) => !n.readAt).length;
}

/**
 * List notifications.
 *
 * Currently stubbed client-side until backend is implemented.
 */
export async function listNotifications(): Promise<NotificationItem[]> {
  // Future: GET /notifications -> { notifications: [...] }
  try {
    const res = await apiClient.get<NotificationsListResponse>('/notifications');
    if (Array.isArray(res.data?.notifications)) return res.data.notifications;
  } catch {
    // ignore
  }

  return stubNotifications();
}

/**
 * Mark a notification as read.
 *
 * Currently stubbed; keeps API contract in one place for future backend wiring.
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
  // Future: POST /notifications/{id}/read
  try {
    await apiClient.post(`/notifications/${notificationId}/read`);
    return;
  } catch {
    // ignore
  }

  // Stub: no-op
}

/**
 * Mark all notifications as read.
 */
export async function markAllNotificationsRead(): Promise<void> {
  // Future: POST /notifications/read_all
  try {
    await apiClient.post('/notifications/read_all');
    return;
  } catch {
    // ignore
  }

  // Stub: no-op
}
