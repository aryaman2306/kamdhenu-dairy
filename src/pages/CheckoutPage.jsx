import { useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseClient";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function placeOrder() {
    if (!name || !phone || !address) {
      alert("Please fill all details");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: name,
          customer_phone: phone,
          customer_address: address,
          total_amount: totalAmount,
          payment_method: "COD",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2️⃣ Create order items (SCALABLE MODEL)
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.pricePerUnit,
        line_total: item.pricePerUnit * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ================= THANK YOU PAGE ================= */
  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fbfd",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 40,
            borderRadius: 20,
            textAlign: "center",
            maxWidth: 420,
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: 12 }}>🙏 Thank you!</h2>
          <p style={{ color: "#374151", marginBottom: 16 }}>
            Your order has been placed successfully.
          </p>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            Our team will contact you shortly for confirmation and delivery.
          </p>
        </div>
      </div>
    );
  }

  /* ================= CHECKOUT UI ================= */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fbfd",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          background: "#fff",
          padding: 28,
          borderRadius: 20,
          boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Checkout</h2>

        {/* CUSTOMER DETAILS */}
        <div style={{ display: "grid", gap: 14 }}>
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Phone" value={phone} onChange={setPhone} />
          <Textarea label="Address" value={address} onChange={setAddress} />
        </div>

        {/* ORDER SUMMARY */}
        <h3 style={{ marginTop: 28 }}>Order Summary</h3>
        <div style={{ marginTop: 12 }}>
          {items.map((item) => (
            <div
              key={item.productId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px dashed #e5e7eb",
                fontSize: 14,
              }}
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>
                ₹{item.pricePerUnit * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
            fontWeight: 700,
          }}
        >
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          style={{
            marginTop: 28,
            width: "100%",
            padding: "16px 0",
            background: "#c56a1a",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "Placing Order…" : "Place Order"}
        </button>
      </div>
    </div>
  );
}

/* ================= SMALL UI HELPERS ================= */

function Input({ label, value, onChange }) {
  return (
    <label style={{ fontSize: 14 }}>
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #d1d5db",
          marginTop: 6,
        }}
      />
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label style={{ fontSize: 14 }}>
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #d1d5db",
          marginTop: 6,
        }}
      />
    </label>
  );
}
