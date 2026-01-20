import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import AdminProductForm from "./AdminProductForm";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  }

  if (loading) {
    return <PageWrap>Loading products…</PageWrap>;
  }

  return (
    <PageWrap>
      <div style={header}>
        <h2>Products</h2>
        <button style={primaryBtn} onClick={() => setEditing({})}>
          + Add Product
        </button>
      </div>

      <div style={card}>
        <table style={table}>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={row}>
                <Td>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img
                      src={p.image_url}
                      alt={p.name}
                      style={img}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        {p.unit}
                      </div>
                    </div>
                  </div>
                </Td>

                <Td>₹{p.price_per_unit}</Td>

                <Td>
                  <Badge active={p.is_active} />
                </Td>

                <Td>
                  <button
                    style={secondaryBtn}
                    onClick={() => setEditing(p)}
                  >
                    Edit
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <AdminProductForm
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            loadProducts();
          }}
        />
      )}
    </PageWrap>
  );
}

/* ---------- UI ---------- */

function PageWrap({ children }) {
  return (
    <div style={{ padding: 32, background: "#f9fafb", minHeight: "100vh" }}>
      {children}
    </div>
  );
}

function Badge({ active }) {
  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: active ? "#dcfce7" : "#fee2e2",
        color: active ? "#065f46" : "#991b1b",
      }}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

/* ---------- styles ---------- */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const card = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  overflow: "hidden",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const Th = ({ children }) => (
  <th
    style={{
      padding: "14px 16px",
      fontSize: 13,
      textAlign: "left",
      color: "#6b7280",
      borderBottom: "1px solid #e5e7eb",
    }}
  >
    {children}
  </th>
);

const Td = ({ children }) => (
  <td style={{ padding: "14px 16px", fontSize: 14 }}>{children}</td>
);

const row = {
  borderBottom: "1px solid #f1f5f9",
};

const img = {
  width: 44,
  height: 44,
  borderRadius: 8,
  objectFit: "cover",
  background: "#f3f4f6",
};

const primaryBtn = {
  padding: "10px 16px",
  background: "#0f172a",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "6px 12px",
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  cursor: "pointer",
};
