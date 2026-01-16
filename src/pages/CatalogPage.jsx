import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/products/ProductCard";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const { items, totalAmount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (!ignore && !error) {
        setProducts(data || []);
      }
    }

    loadProducts();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div style={{ background: "#f9fbfd", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
        <h1 style={{ marginBottom: 6 }}>Our Fresh Products</h1>
        <p style={{ color: "#6b7280", marginBottom: 28 }}>
          Pure, fresh dairy sourced daily — delivered with care.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#ffffff",
            borderTop: "1px solid #e5e7eb",
            padding: "14px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <div style={{ fontWeight: 600 }}>
            {items.length} items • ₹{totalAmount}
          </div>

          <button
            onClick={() => navigate("/checkout")}
            style={{
              background: "#1f5eff",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: 12,
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Go to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
