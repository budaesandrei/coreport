import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@api/client';
import { notifyAuthChanged } from '@hooks/useAuth';

export type WorkspaceRole = 'PROJECT_ADMIN' | 'PROJECT_SUBMITTER' | 'PROJECT_APPROVER';

export type UserContextValue = {
  loading: boolean;
  user: {
    email: string;
    name: string;
    initials: string;
    role: WorkspaceRole;
    workspace: {
      id: number;
      slug: string;
      name?: string;
    };
    allowedPaths: string[];
  } | null;
  logout: () => void;
};

const ALL_ALLOWED_PATHS: string[] = [
  '/',
  '/workspace',
  '/activity',
  '/field-mapping',
  '/submissions',
  '/setup/providers',
  '/setup/data-packets',
  '/setup/report-types',
  '/setup/entity-types',
  '/setup/entities',
  '/setup/schedules',
  '/setup/value-mapping-sets',
  '/admin/users',
  '/admin/groups',
  '/admin/permissions',
  '/admin/subscription',
  '/admin/validation-rules',
  '/admin/integrations',
  '/admin/workspace-settings',
  '/settings/user',
];

// (placeholder) If backend later adds a full name field, we can display it here.

function toInitials(nameOrEmail: string) {
  const base = nameOrEmail.trim();
  if (!base) return '?';

  // Email: e2e-123@example.com -> E2
  if (base.includes('@')) {
    const local = base.split('@')[0] || base;
    const alnum = local.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return (alnum.slice(0, 2) || '?').toUpperCase();
  }

  const parts = base.split(/\s+/).filter(Boolean);
  const letters = parts.map((p) => p[0]).join('').toUpperCase();
  return (letters.slice(0, 2) || '?').toUpperCase();
}

const UserContext = createContext<UserContextValue | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

type UserProviderProps = {
  children: React.ReactNode;
};

const AUTH_CHANGED_EVENT = 'coreport:authChanged';

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tokenVersion, setTokenVersion] = useState(0);
  const [user, setUser] = useState<UserContextValue['user']>(null);

  const logout = useCallback(() => {
    // Auth
    localStorage.removeItem('coreport.token');

    // Workspace context
    localStorage.removeItem('workspace_id');
    localStorage.removeItem('workspace_name');

    // Other auth-ish values
    localStorage.removeItem('invite_token');

    notifyAuthChanged();
    setUser(null);
    setLoading(false);
    navigate('/login', { replace: true });
  }, [navigate]);

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
      .then((res) => {
        const email = String(res.data.email);
        const name = email; // /me currently returns email only; use it as the display name.
        const workspaceName = localStorage.getItem('workspace_name') || undefined;

        setUser({
          email,
          name,
          initials: toInitials(email),
          // Backend doesn't yet expose membership role in /me; default to admin for now.
          role: 'PROJECT_ADMIN',
          workspace: {
            id: Number(res.data.workspace_id),
            slug: String(res.data.workspace_slug),
            name: workspaceName,
          },
          // Backend doesn't yet expose permissions; keep current full-menu behaviour.
          allowedPaths: ALL_ALLOWED_PATHS,
        });
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          logout();
          return;
        }
        // For transient errors, behave as logged out to avoid rendering protected UI.
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token, logout]);

  const value: UserContextValue = useMemo(() => ({ loading, user, logout }), [loading, user, logout]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
