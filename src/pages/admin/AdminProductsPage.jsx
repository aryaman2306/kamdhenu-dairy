import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [savingRow, setSavingRow] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (!error) setProducts(data || []);
    setLoading(false);
  }

  async function commitChange(productId, updates) {
    setSavingRow(productId);

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, ...updates } : p
        )
      );
    } else {
      alert("Update failed");
    }

    setSavingRow(null);
    setEditing(null);
  }

  function renderEditableCell(product, field, type = "text") {
    const isEditing =
      editing?.productId === product.id &&
      editing?.field === field;

    if (isEditing) {
      if (type === "checkbox") {
        return (
          <input
            type="checkbox"
            autoFocus
            defaultChecked={product[field]}
            onBlur={(e) =>
              commitChange(product.id, {
                [field]: e.target.checked,
              })
            }
          />
        );
      }

      return (
        <input
          type={type}
          autoFocus
          defaultValue={product[field] || ""}
          onBlur={(e) =>
            commitChange(product.id, {
              [field]:
                type === "number"
                  ? Number(e.target.value)
                  : e.target.value,
            })
          }
          style={input}
        />
      );
    }

    return (
      <span
        onDoubleClick={() =>
          setEditing({ productId: product.id, field })
        }
        style={{ cursor: "pointer" }}
      >
        {field === "is_active"
          ? product[field]
            ? "Yes"
            : "No"
          : product[field] || "—"}
      </span>
    );
  }

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Products</h2>

      <div style={card}>
        <table style={table}>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Unit</Th>
              <Th>Price (₹)</Th>
              <Th>Image URL</Th>
              <Th>Active</Th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => {
              const isEditingRow =
                editing?.productId === p.id;

              return (
                <tr
                  key={p.id}
                  style={{
                    ...row,
                    opacity:
                      savingRow === p.id || isEditingRow
                        ? 0.6
                        : 1,
                  }}
                >
                  <Td>
                    {renderEditableCell(p, "name")}
                  </Td>

                  <Td>
                    {renderEditableCell(p, "unit")}
                  </Td>

                  <Td>
                    {renderEditableCell(
                      p,
                      "price_per_unit",
                      "number"
                    )}
                  </Td>

                  <Td>
                    {renderEditableCell(
                      p,
                      "image_url"
                    )}
                  </Td>

                  <Td>
                    {renderEditableCell(
                      p,
                      "is_active",
                      "checkbox"
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- UI ---------- */

const card = {
  marginTop: 16,
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
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
      color: "#6b7280",
      textAlign: "left",
    }}
  >
    {children}
  </th>
);

const Td = ({ children }) => (
  <td style={{ padding: "14px 16px", fontSize: 14 }}>
    {children}
  </td>
);

const row = {
  borderBottom: "1px solid #f1f5f9",
};

const input = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
};
