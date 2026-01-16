import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const ADMIN_EMAIL = "nagararyaman@gmail.com"; // 👈 CHANGE THIS

export default function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email === ADMIN_EMAIL) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
      setLoading(false);
    }

    checkAdmin();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Checking access…</div>;

  if (!allowed) return <Navigate to="/admin/login" replace />;

  return children;
}
