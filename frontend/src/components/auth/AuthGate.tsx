import Login from '@pages/Login';
import { useAuth } from '@hooks/useAuth';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading user...</p>;
  if (!user) return <Login />;

  return <>{children}</>;
}