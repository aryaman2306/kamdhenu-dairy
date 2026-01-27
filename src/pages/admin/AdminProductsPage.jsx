import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  async function updateProduct(id, updates) {
    await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      )
    );
  }

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Products</h2>

      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Unit</th>
            <th>Price (₹)</th>
            <th>Active</th>
            <th>Save</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              onSave={updateProduct}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductRow({ product, onSave }) {
  const [price, setPrice] = useState(product.price_per_unit);
  const [active, setActive] = useState(product.is_active);

  return (
    <tr>
      <td>{product.name}</td>
      <td>{product.unit}</td>

      <td>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          style={{ width: 80 }}
        />
      </td>

      <td>
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
      </td>

      <td>
        <button
          onClick={() =>
            onSave(product.id, {
              price_per_unit: price,
              is_active: active,
            })
          }
        >
          Save
        </button>
      </td>
    </tr>
  );
}
