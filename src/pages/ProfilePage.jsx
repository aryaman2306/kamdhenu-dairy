import { useEffect, useState } from "react";
import MinimalHeader from "../components/layout/MinimalHeader";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import "../styles/profile.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  }

  async function updateProfile() {
    await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
      })
      .eq("id", user.id);

    alert("Profile updated");
  }

  return (
    <>
      <MinimalHeader />

      <div className="page-with-minimal-header profile-container">
        <div className="profile-card">
          <h2>Your Profile</h2>

          <label>Full Name</label>
          <input
            value={profile?.full_name || ""}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
          />

          <label>Phone</label>
          <input
            value={profile?.phone || ""}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
          />

          <button onClick={updateProfile}>Save</button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
