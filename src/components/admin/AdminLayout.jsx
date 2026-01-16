import { Outlet, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
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
        <div style={{ display: "flex", gap: 16 }}>
          <Link to="/admin/orders">Orders</Link>
          {/* Future */}
          {/* <Link to="/admin/products">Products</Link> */}
          {/* <Link to="/admin/analytics">Analytics</Link> */}
        </div>

        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Admin Page Content */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
