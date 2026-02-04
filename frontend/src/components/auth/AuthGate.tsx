import Login from '@pages/Login';
import { useUser } from '@context/UserContext';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  // E2E bypass (keeps the app shell mounted for UI tests without a backend).
  if (import.meta.env.VITE_E2E_BYPASS_AUTH === '1') return <>{children}</>;

  const { user, loading } = useUser();

  if (loading) return <p>Loading user...</p>;
  if (!user) return <Login />;

  return <>{children}</>;
}
