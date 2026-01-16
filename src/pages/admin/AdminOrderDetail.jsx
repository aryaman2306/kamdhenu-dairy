// eslint-disable-next-line no-unused-vars
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
    loadOrder();
  }, [id]);

  async function loadOrder() {
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setOrder(orderData);
    setItems(itemsData || []);
  }

  async function saveChanges() {
    setSaving(true);

    await supabase.from("orders").update({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address,
      order_status: order.order_status,
      payment_status: order.payment_status,
    }).eq("id", id);

    setSaving(false);
    alert("Order updated");
  }

  if (!order) return <div style={{ padding: 30 }}>Loading…</div>;

  return (
    <div style={{ padding: 30, maxWidth: 600 }}>
      <h3>Order Details</h3>

      <label>Name</label>
      <input value={order.customer_name} onChange={e => setOrder({ ...order, customer_name: e.target.value })} />

      <label>Phone</label>
      <input value={order.customer_phone} onChange={e => setOrder({ ...order, customer_phone: e.target.value })} />

      <label>Address</label>
      <textarea value={order.customer_address} onChange={e => setOrder({ ...order, customer_address: e.target.value })} />

      <label>Order Status</label>
      <select value={order.order_status} onChange={e => setOrder({ ...order, order_status: e.target.value })}>
        <option>PENDING</option>
        <option>CONFIRMED</option>
        <option>DELIVERED</option>
        <option>CANCELLED</option>
      </select>

      <label>Payment Status</label>
      <select value={order.payment_status} onChange={e => setOrder({ ...order, payment_status: e.target.value })}>
        <option>UNPAID</option>
        <option>PAID</option>
      </select>

      <h4>Items</h4>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            {i.product_name} × {i.quantity}
          </li>
        ))}
      </ul>

      <button onClick={saveChanges} disabled={saving}>
        {saving ? "Saving…" : "Save Changes"}
      </button>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
