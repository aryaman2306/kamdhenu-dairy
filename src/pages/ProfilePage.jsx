import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  if (!user) {
    return <div style={{ padding: 120 }}>Loading profile…</div>;
  }

  return (
    <main style={{ padding: "120px 20px", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>My Profile</h1>

      <div style={{ marginBottom: 20 }}>
        <strong>Email</strong>
        <div>{user.email}</div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button onClick={() => navigate("/support")}>
          Raise Support Request
        </button>

        <button disabled>Edit Profile (Coming Soon)</button>

        <button
          onClick={handleLogout}
          style={{ color: "#991b1b" }}
        >
          Logout
        </button>
      </div>
    </main>
  );
}
