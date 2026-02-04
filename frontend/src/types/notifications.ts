export type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  createdAt: string; // ISO
  readAt: string | null;
};
