import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getUnreadNotificationCount } from '@api/notifications';

type NotificationsContextValue = {
  unreadCount: number;
  loading: boolean;
  panelOpen: boolean;
  refreshUnreadCount: () => Promise<void>;
  togglePanel: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const refreshUnreadCount = useCallback(async () => {
    setLoading(true);
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUnreadCount();
  }, [refreshUnreadCount]);

  const value = useMemo(
    () => ({
      unreadCount,
      loading,
      panelOpen,
      refreshUnreadCount,
      togglePanel: () => setPanelOpen((v) => !v),
    }),
    [unreadCount, loading, panelOpen, refreshUnreadCount]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}
