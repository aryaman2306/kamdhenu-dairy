import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading'); 
  // loading | allowed | denied

  useEffect(() => {
    let isMounted = true;

    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (isMounted) setStatus('denied');
        return;
      }

      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!error && data) {
        if (isMounted) setStatus('allowed');
      } else {
        if (isMounted) setStatus('denied');
      }
    }

    checkAdmin();
    return () => { isMounted = false; };
  }, []);

  if (status === 'loading') {
    return <div style={{ padding: 20 }}>Verifying admin access…</div>;
  }

  if (status === 'denied') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
