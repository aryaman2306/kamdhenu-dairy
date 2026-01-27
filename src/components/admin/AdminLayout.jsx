import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  function handleLogout() {
    // IMPORTANT: Admin auth is session-based, not Supabase
    sessionStorage.removeItem("isAdmin");
    navigate("/admin/login");
  }

  return (
    <div>
      {/* Admin Top Bar */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fafafa",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", gap: 16 }}>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/">Homepage</Link>
        </div>

        {/* Right */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {/* Date Range Box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 10px",
              border: "1px solid #d1d5db",
              borderRadius: 10,
              background: "#fff",
            }}
          >
            <span style={{ fontSize: 16 }}>📅</span>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <label style={label}>From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={dateInput}
              />
            </div>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <label style={label}>To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={dateInput}
              />
            </div>
          </div>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Admin Page Content */}
      <Outlet context={{ fromDate, toDate }} />
    </div>
  );
}

const dateInput = {
  padding: "4px 6px",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  fontSize: 13,
};

const label = {
  fontSize: 12,
  color: "#6b7280",
};
