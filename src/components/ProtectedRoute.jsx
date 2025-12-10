import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Usage: <ProtectedRoute><AdminOrdersPage /></ProtectedRoute>
export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      setIsAuth(!!user);
      setChecking(false);
    }
    check();

    // subscribe to changes (optional)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuth(!!session?.user);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (checking) return <div style={{ padding: 20 }}>Checking authentication…</div>;
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  return children;
}
