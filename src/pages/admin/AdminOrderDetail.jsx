import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    load();
  }, [id]);

  async function load() {
    const { data: o } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    const { data: it } = await supabase
      .from("order_items")
      .select(`
        quantity,
        unit_price,
        line_total,
        products ( name, unit )
      `)
      .eq("order_id", id);

    setOrder(o);
    setItems(it || []);
  }

  async function save() {
    setSaving(true);
    await supabase
      .from("orders")
      .update({
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        order_status: order.order_status,
        payment_status: order.payment_status,
      })
      .eq("id", id);

    setSaving(false);
    alert("Order updated");
  }

  if (!order) return <PageWrap>Loading…</PageWrap>;

  return (
    <PageWrap>
      <div style={card}>
        <h3>Order Details</h3>

        <Field label="Name" value={order.customer_name}
          onChange={(v) => setOrder({ ...order, customer_name: v })}
        />
        <Field label="Phone" value={order.customer_phone}
          onChange={(v) => setOrder({ ...order, customer_phone: v })}
        />
        <Field label="Address" textarea value={order.customer_address}
          onChange={(v) => setOrder({ ...order, customer_address: v })}
        />

        <Select
          label="Order Status"
          value={order.order_status}
          options={["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"]}
          onChange={(v) => setOrder({ ...order, order_status: v })}
        />

        <Select
          label="Payment Status"
          value={order.payment_status}
          options={["UNPAID", "PAID"]}
          onChange={(v) => setOrder({ ...order, payment_status: v })}
        />

        <h4 style={{ marginTop: 24 }}>Items</h4>
        <div style={itemsBox}>
          {items.map((i, idx) => (
            <div key={idx} style={itemRow}>
              <span>
                {i.products.name} × {i.quantity} {i.products.unit}
              </span>
              <span>₹{i.line_total}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <button onClick={save} disabled={saving} style={primaryBtn}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={() => navigate(-1)} style={secondaryBtn}>
            Back
          </button>
        </div>
      </div>
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

function Field({ label, value, onChange, textarea }) {
  const Input = textarea ? "textarea" : "input";
  return (
    <label style={field}>
      {label}
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label style={field}>
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

const card = {
  background: "#fff",
  padding: 28,
  borderRadius: 16,
  maxWidth: 720,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginTop: 14,
};

const itemsBox = {
  marginTop: 12,
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  overflow: "hidden",
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderBottom: "1px solid #f1f5f9",
};

const primaryBtn = {
  padding: "12px 20px",
  background: "#0f172a",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "12px 20px",
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  cursor: "pointer",
};
