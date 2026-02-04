import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '@api/notifications';
import type { NotificationItem } from '@types/notifications';

type NotificationsContextValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  panelOpen: boolean;
  refreshNotifications: () => Promise<void>;
  togglePanel: () => void;
  closePanel: () => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listNotifications();
      setNotifications(items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.readAt).length,
    [notifications]
  );

  const markRead = useCallback(async (id: string) => {
    // Optimistic client-side update (stubbed backend)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n))
    );

    try {
      await markNotificationRead(id);
    } catch {
      // ignore
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => {
      const ts = new Date().toISOString();
      return prev.map((n) => ({ ...n, readAt: n.readAt ?? ts }));
    });

    try {
      await markAllNotificationsRead();
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      panelOpen,
      refreshNotifications,
      togglePanel: () => setPanelOpen((v) => !v),
      closePanel: () => setPanelOpen(false),
      markRead,
      markAllRead,
    }),
    [notifications, unreadCount, loading, panelOpen, refreshNotifications, markRead, markAllRead]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}
