import { useEffect, useMemo, useState } from 'react';
import apiClient from '@api/client';

export type SessionUser = {
  email: string;
  workspace_id: number;
  workspace_slug: string;
};

const AUTH_CHANGED_EVENT = 'coreport:authChanged';

export function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenVersion, setTokenVersion] = useState(0);

  // Re-check localStorage token when we get notified.
  useEffect(() => {
    const onChanged = () => setTokenVersion((v) => v + 1);
    window.addEventListener(AUTH_CHANGED_EVENT, onChanged);
    window.addEventListener('storage', onChanged);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, onChanged);
      window.removeEventListener('storage', onChanged);
    };
  }, []);

  const token = useMemo(() => localStorage.getItem('coreport.token'), [tokenVersion]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('coreport.token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return { user, loading };
}
