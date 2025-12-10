import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      if (orderError) throw orderError;
      setOrder(orderData);

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, products(name, unit)')
        .eq('order_id', id);
      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (err) {
      console.error('Load order detail error', err);
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!order) return;
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: order.status, is_paid: order.is_paid })
        .eq('id', order.id);
      if (error) throw error;
      await load();
    } catch (err) {
      console.error('Save order error', err);
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (error) return <div style={{ padding: 20, color: 'crimson' }}>{error}</div>;
  if (!order) return <div style={{ padding: 20 }}>Order not found</div>;

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>

      <h3>Order: {order.id}</h3>
      <div style={{ marginBottom: 8 }}>
        <strong>{order.customer_name}</strong> — {order.customer_phone}
      </div>
      <div style={{ marginBottom: 12 }}>{order.customer_address}</div>

      <section style={{ marginBottom: 12 }}>
        <h4>Items</h4>
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              {it.products?.name || 'Item'} — {it.quantity} {it.products?.unit || ''} = ₹{it.line_total}
            </li>
          ))}
        </ul>
        <div style={{ fontWeight: 800 }}>Total: ₹{Number(order.total_amount).toFixed(2)}</div>
      </section>

      <form onSubmit={handleSave} style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <label>
          Status
          <select value={order.status} onChange={(e) => setOrder({ ...order, status: e.target.value })} style={{ width: '100%', padding: 8 }}>
            <option value="PENDING">PENDING</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="DELIVERING">DELIVERING</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={!!order.is_paid} onChange={(e) => setOrder({ ...order, is_paid: e.target.checked })} />
          Paid
        </label>

        {error && <div style={{ color: 'crimson' }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={saving} style={{ padding: '8px 12px', background: '#0b6', color: '#fff', border: 'none', borderRadius: 6 }}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>

          <button type="button" onClick={() => navigate('/admin/orders')} style={{ padding: '8px 12px', borderRadius: 6 }}>
            Back to orders
          </button>
        </div>
      </form>
    </div>
  );
}
