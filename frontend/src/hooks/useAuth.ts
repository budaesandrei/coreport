import { useEffect, useState } from 'react';
import apiClient from '@api/client';

export type SessionUser = {
  email: string;
  project_id: number;
  tenant_id: string;
};

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('coreport.token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    apiClient
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('coreport.token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
