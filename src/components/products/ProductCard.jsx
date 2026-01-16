import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { items, setItemQuantity } = useCart();

  const existing = items.find((i) => i.productId === product.id);
  const quantity = existing?.quantity || 0;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          style={{
            width: "100%",
            height: 160,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 12,
          }}
        />
      )}

      <h3 style={{ margin: "4px 0" }}>{product.name}</h3>

      <div style={{ color: "#6b7280", fontSize: 14 }}>
        ₹{product.price_per_unit} / {product.unit}
      </div>

      {product.description && (
        <p style={{ fontSize: 14, marginTop: 8, color: "#374151" }}>
          {product.description}
        </p>
      )}

      <div style={{ marginTop: "auto", paddingTop: 12 }}>
        {quantity === 0 ? (
          <button
            onClick={() => setItemQuantity(product, 1)}
            style={{
              width: "100%",
              padding: "10px 0",
              background: "#1f5eff",
              color: "#fff",
              borderRadius: 10,
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => setItemQuantity(product, quantity - 1)}
              style={qtyBtn}
            >
              −
            </button>

            <span style={{ fontWeight: 700 }}>{quantity}</span>

            <button
              onClick={() => setItemQuantity(product, quantity + 1)}
              style={qtyBtn}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const qtyBtn = {
  width: 36,
  height: 36,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  fontSize: 18,
  cursor: "pointer",
};
