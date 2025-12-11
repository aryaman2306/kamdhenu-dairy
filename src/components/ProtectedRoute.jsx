import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

/**
 * ProtectedRoute
 * Wrap admin pages: <ProtectedRoute><AdminPage /></ProtectedRoute>
 * Checks current user via supabase.auth.getUser() and listens for auth state changes.
 */
export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const resp = await supabase.auth.getUser();
        const user = resp?.data?.user ?? null;
        if (!mounted) return;
        setIsAuth(!!user);
      } catch (err) {
        console.error('Auth check failed', err);
        if (!mounted) return;
        setIsAuth(false);
      } finally {
        if (mounted) setChecking(false);
      }
    }

    check();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuth(!!session?.user);
    });

    return () => {
      mounted = false;
      try {
        subscription?.unsubscribe?.();
      } finally {console.log()}
    };
  }, []);

  if (checking) return <div style={{ padding: 20 }}>Checking authentication…</div>;
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  return children;
}
