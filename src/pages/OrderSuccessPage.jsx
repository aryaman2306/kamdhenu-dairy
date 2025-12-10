import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function OrderSuccessPage() {
  const { id } = useParams(); // order id
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your shop/admin phone number (country code +91...), no plus.
  // Example: const ADMIN_PHONE = '9198XXXXXXXX';
  const ADMIN_PHONE = '91XXXXXXXXXX';

  useEffect(() => {
    if (!id) return;

    async function loadOrder() {
      setLoading(true);
      setError(null);

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
        console.error('Load order error:', err);
        setError(err.message || 'Failed to load order.');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  if (loading) return <div style={{ padding: '1rem' }}>Loading order...</div>;
  if (error) return <div style={{ padding: '1rem', color: 'red' }}>{error}</div>;
  if (!order) return <div style={{ padding: '1rem' }}>Order not found.</div>;

  // Build a friendly order summary for WhatsApp
  const summaryLines = [
    `New order received - Kamdhenu Dairy`,
    `Order ID: ${order.id}`,
    `Name: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    `Address: ${order.customer_address}`,
    `Payment: ${order.payment_method}`,
    `Items:`,
    ...items.map((it) => `- ${it.products?.name || 'Item'}: ${it.quantity} ${it.products?.unit || ''} = ₹${it.line_total}`),
    `Total: ₹${order.total_amount}`,
    `Notes: ${order.notes || '-'}`,
  ];

  const message = encodeURIComponent(summaryLines.join('\n'));
  const waUrl = `https://wa.me/${ADMIN_PHONE}?text=${message}`;

  return (
    <div style={{ padding: '1rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>Thank you — your order is placed!</h1>
      <p>Order ID: <strong>{order.id}</strong></p>
      <p>We have recorded your order and will confirm shortly.</p>

      <section style={{ marginTop: '1rem' }}>
        <h3>Order Summary</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((it) => (
            <li key={it.id}>
              {it.products?.name || 'Item'} — {it.quantity} {it.products?.unit || ''} = ₹{it.line_total}
            </li>
          ))}
        </ul>
        <p style={{ fontWeight: 'bold' }}>Total: ₹{order.total_amount}</p>
      </section>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <a href={waUrl} target="_blank" rel="noreferrer">
          <button style={{ padding: '0.5rem 1rem', background: '#25D366', color: 'white', border: 'none', borderRadius: 6 }}>
            Send order via WhatsApp
          </button>
        </a>

        <button onClick={() => window.location.href = '/'} style={{ padding: '0.5rem 1rem', borderRadius: 6 }}>
          Back to home
        </button>
      </div>

      <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#555' }}>
        Tip: if you'd like us to call you, we will within 15–30 minutes to confirm the order.
      </p>
    </div>
  );
}
