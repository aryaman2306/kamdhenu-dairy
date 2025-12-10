import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../CartContext.jsx';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { items, setItemQuantity, totalAmount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (error) throw error;
        if (mounted) setProducts(data || []);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err?.message || 'Unable to load products right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  function getQuantity(productId) {
    const it = items.find((i) => i.productId === productId);
    return it ? it.quantity : 0;
  }

  // helpers to call setItemQuantity with product object
  function increase(product) {
    const q = getQuantity(product.id);
    setItemQuantity(product, q + 1);
  }
  function decrease(product) {
    const q = getQuantity(product.id);
    setItemQuantity(product, Math.max(0, q - 1));
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
      {/* Intrusive Kamdhenu hero */}
      <header
        style={{
          background:
            'linear-gradient(180deg, #fff7ed 0%, #fffdf6 60%)',
          padding: '2rem 1rem',
          textAlign: 'center',
          borderBottom: '1px solid #eee',
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* You can replace this emoji with an SVG or image later */}
            <div style={{ fontSize: 72, lineHeight: 1 }}>🐄</div>

            <div style={{ textAlign: 'left', minWidth: 240 }}>
              <h1 style={{ margin: 0, fontSize: '1.9rem' }}>Kamdhenu Dairy</h1>
              <p style={{ margin: '0.25rem 0 0', color: '#444' }}>
                Fresh milk & dairy — straight from our farm to your plate.
              </p>
              <p style={{ margin: '0.5rem 0 0', fontStyle: 'italic', color: '#666', fontSize: '0.95rem' }}>
                “Sabse shuddh, sabse taaza — seedha Kamdhenu se.” 
              </p>
            </div>

            <div style={{ textAlign: 'center', minWidth: 180 }}>
              <button
                onClick={() => window.scrollTo({ top: 420, behavior: 'smooth' })}
                style={{
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1rem',
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Order Now
              </button>
              <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                Or share this link on WhatsApp
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ padding: '1rem', maxWidth: 960, margin: '0 auto' }}>
        {/* Intro */}
        <section style={{ margin: '1.25rem 0' }}>
          <h2 style={{ marginBottom: '0.25rem' }}>Welcome to our pilot</h2>
          <p style={{ marginTop: 0, color: '#555' }}>
            This is a pilot Kamdhenu Dairy web app. Choose items below, set quantities, and proceed to checkout.
          </p>
        </section>

        {/* Products grid */}
        <section style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: '0.75rem' }}>Products</h3>

          {loading && <div>Loading products…</div>}
          {error && <div style={{ color: 'crimson' }}>{error}</div>}

          {!loading && !error && products.length === 0 && (
            <div>No products available right now.</div>
          )}

          {!loading && !error && products.length > 0 && (
            <div
              style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                alignItems: 'start',
              }}
            >
              {products.map((p) => {
                const qty = getQuantity(p.id);
                return (
                  <div
                    key={p.id}
                    style={{
                      border: '1px solid #eee',
                      borderRadius: 10,
                      padding: '0.9rem',
                      background: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 160,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 0.35rem 0' }}>{p.name}</h4>
                      {p.description && <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>{p.description}</div>}
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>
                        ₹{Number(p.price_per_unit).toFixed(2)} / {p.unit}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          onClick={() => decrease(p)}
                          disabled={qty === 0}
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: 6,
                            border: '1px solid #ccc',
                            background: qty === 0 ? '#fafafa' : '#fff',
                            cursor: qty === 0 ? 'not-allowed' : 'pointer',
                          }}
                        >
                          −
                        </button>

                        <div style={{ minWidth: 32, textAlign: 'center', fontWeight: 700 }}>{qty}</div>

                        <button
                          onClick={() => increase(p)}
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: 6,
                            border: '1px solid #ccc',
                            background: '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, color: '#777' }}>Add to cart</div>
                        <div style={{ fontWeight: 700 }}>₹{(Number(p.price_per_unit) * qty).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Sticky Cart Summary (shows only if cart has items) */}
      {items.length > 0 && (
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            width: 320,
            maxWidth: 'calc(100% - 32px)',
            background: '#fff',
            border: '1px solid #e6e6e6',
            borderRadius: 12,
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            padding: '0.9rem',
            zIndex: 1200,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <strong>Cart</strong>
            <span style={{ fontSize: 13, color: '#666' }}>{items.reduce((s, it) => s + it.quantity, 0)} items</span>
          </div>

          <div style={{ maxHeight: 160, overflow: 'auto', marginBottom: 8 }}>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {items.map((it) => (
                <li key={it.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: 14 }}>{it.name} <span style={{ color: '#777', fontSize: 12 }}>x{it.quantity}</span></div>
                  <div style={{ fontWeight: 700 }}>₹{(it.pricePerUnit * it.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 800 }}>Total</div>
            <div style={{ fontWeight: 800 }}>₹{totalAmount.toFixed(2)}</div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => navigate('/checkout')}
              style={{ flex: 1, padding: '0.5rem', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700 }}
            >
              Checkout
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
