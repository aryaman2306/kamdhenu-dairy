/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setIsAdmin(true);
    }

    setLoading(false);
  }

  if (loading) return <div>Checking permissions…</div>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return children;
}
