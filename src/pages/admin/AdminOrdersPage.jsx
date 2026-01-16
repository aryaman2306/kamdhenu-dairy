/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  }

  if (loading) return <div style={{ padding: 30 }}>Loading orders…</div>;

  return (
    <div style={{ padding: 30 }}>
      <h2>Orders</h2>

      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Time</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{new Date(o.created_at).toLocaleString()}</td>
              <td>{o.customer_name}</td>
              <td>{o.customer_phone}</td>
              <td>₹{o.total_amount}</td>
              <td>{o.payment_status}</td>
              <td>{o.order_status}</td>
              <td>
                <Link to={`/admin/orders/${o.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
