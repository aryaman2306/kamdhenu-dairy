import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

    if (error) 
      {
  console.error('Error loading products:', error);
  setError(error.message || 'Failed to load products. Please try again.');
      }

        else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  return (
    <div>
      {/* Kamdhenu Hero Section */}
      <header style={{ padding: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Kamdhenu Dairy 🐄
        </h1>
        <p style={{ marginBottom: '0.5rem' }}>
          Fresh milk & dairy products from our family shop.
        </p>
        <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
          “Sabse shuddh, sabse taaza – seedha Kamdhenu se aapke ghar tak.”
        </p>
      </header>

      <main style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* Welcome section */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>Welcome!</h2>
          <p>
            Order fresh cow milk, buffalo milk, A2 milk, curd, paneer, lassi and more
            directly from Kamdhenu Dairy. This is our pilot test version.
          </p>
        </section>

        {/* Products section */}
        <section>
          <h2 style={{ marginBottom: '1rem' }}>Our Products</h2>

          {loading && <p>Loading products...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p>No products available right now.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <h3 style={{ marginBottom: '0.25rem' }}>{product.name}</h3>
                  {product.description && (
                    <p
                      style={{
                        fontSize: '0.85rem',
                        marginBottom: '0.5rem',
                        color: '#555',
                      }}
                    >
                      {product.description}
                    </p>
                  )}
                  <p style={{ fontWeight: 'bold' }}>
                    ₹{product.price_per_unit} / {product.unit}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#777' }}>
                    (Cart & ordering coming next…)
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
