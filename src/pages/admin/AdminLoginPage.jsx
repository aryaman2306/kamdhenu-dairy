import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    // Username check
    if (username.trim() !== "admin") {
      setError("Invalid admin username");
      return;
    }

    // Passkey check (plain text – intentional)
    const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY;

    if (!ADMIN_PASSKEY) {
      setError("Admin passkey not configured");
      return;
    }

    if (passkey !== ADMIN_PASSKEY) {
      setError("Invalid passkey");
      return;
    }

    // Success
    sessionStorage.setItem("isAdmin", "true");
    navigate("/admin/dashboard");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#ffffff",
          padding: "28px 24px",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 6 }}>Admin Access</h2>

        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
          Restricted area — authorized personnel only
        </p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: 10,
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            {error}
          </div>
        )}

        <input
          placeholder="Admin username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 14,
          }}
        />

        <input
          type="password"
          placeholder="Passkey"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 14,
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 999,
            border: "none",
            background: "#2563eb",
            color: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Enter Admin Panel
        </button>
      </form>
    </div>
  );
}
