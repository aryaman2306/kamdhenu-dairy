import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from  '../context/CartContext';

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD or UPI
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simple validation
  function validate() {
    if (!name.trim()) return 'Please enter your name';
    if (!phone.trim()) return 'Please enter your phone number';
    if (!address.trim()) return 'Please enter your delivery address';
    if (items.length === 0) return 'Your cart is empty';
    return null;
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      // 1) Insert order row
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: name,
            customer_phone: phone,
            customer_address: address,
            notes,
            payment_method: paymentMethod,
            is_paid: paymentMethod === 'UPI' ? false : false, // you'll update when paid
            status: 'PENDING',
            total_amount: totalAmount,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;
      const orderId = orderData.id;

      // 2) Insert order_items rows
      const orderItemsPayload = items.map((it) => ({
        order_id: orderId,
        product_id: it.productId,
        quantity: it.quantity,
        unit_price: it.pricePerUnit,
        line_total: Number((it.pricePerUnit * it.quantity).toFixed(2)),
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsError) {
        // Attempt to rollback by deleting the order we just created (best-effort)
        await supabase.from('orders').delete().eq('id', orderId);
        throw itemsError;
      }

      // Success! clear cart and navigate to success page
      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error('Place order error:', err);
      setError(err.message || 'Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '1rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>Checkout</h1>

      {error && (
        <div style={{ background: '#ffe8e8', padding: '0.6rem', marginBottom: '0.75rem', color: '#900' }}>
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <p>Your cart is empty. Go back to the home page to add items.</p>
      ) : (
        <form onSubmit={handlePlaceOrder}>
          <section style={{ marginBottom: '1rem' }}>
            <h3>Order Summary</h3>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {items.map((it) => (
                <li key={it.productId} style={{ marginBottom: '0.35rem' }}>
                  {it.name} — {it.quantity} {it.unit} @ ₹{it.pricePerUnit} =&nbsp;
                  ₹{(it.pricePerUnit * it.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Total: ₹{totalAmount.toFixed(2)}</p>
          </section>

          <section style={{ marginBottom: '1rem' }}>
            <h3>Customer details</h3>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Phone
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Address
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" rows={3} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Payment method
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
                <option value="COD">Cash on delivery (COD)</option>
                <option value="UPI">UPI (customer will pay via UPI on delivery or you can send an invoice)</option>
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Notes (optional)
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="E.g., deliver before 8 AM" style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </label>
          </section>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={loading} style={{ padding: '0.6rem 1rem', background: '#0b6', color: 'white', border: 'none', borderRadius: 6 }}>
              {loading ? 'Placing order...' : 'Place Order'}
            </button>

            <button type="button" onClick={() => navigate('/')} style={{ padding: '0.6rem 1rem', borderRadius: 6 }}>
              Continue shopping
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
