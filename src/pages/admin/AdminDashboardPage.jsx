import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={page}>
      <h2 style={{ marginBottom: 24 }}>Admin Dashboard</h2>

      <div style={grid}>
        <Card
          title="Orders"
          desc="View and manage customer orders"
          onClick={() => navigate("/admin/orders")}
        />

        <Card
          title="Products"
          desc="Add or update product catalog"
          onClick={() => navigate("/admin/products")}
        />

        <Card
          title="Analytics"
          desc="Sales insights & performance"
          onClick={() => navigate("/admin/analytics")}
        />

        <Card
          title="Expenses"
          desc="Track business expenses"
          onClick={() => navigate("/admin/expenses")}
        />
      </div>
    </div>
  );
}

/* ---------- UI ---------- */

function Card({ title, desc, onClick, muted }) {
  return (
    <div
      onClick={!muted ? onClick : undefined}
      style={{
        ...card,
        opacity: muted ? 0.6 : 1,
        cursor: muted ? "not-allowed" : "pointer",
      }}
    >
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#6b7280" }}>{desc}</p>
    </div>
  );
}

const page = {
  padding: 32,
  minHeight: "100vh",
  background: "#f9fafb",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
};

const card = {
  background: "#fff",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  transition: "transform 0.15s ease",
};
