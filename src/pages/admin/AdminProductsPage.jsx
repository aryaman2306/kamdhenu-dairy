import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('Litre');
  const [price, setPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Fetch products error', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setMessage(null);
    if (!name.trim() || !price) {
      setMessage('Please enter name and price');
      return;
    }
    setSaving(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { data, error } = await supabase.from('products').insert([{
        name: name.trim(),
        description: description.trim(),
        unit,
        price_per_unit: Number(price),
        is_active: isActive
      }]).select();
      if (error) throw error;
      setName(''); setDescription(''); setPrice(''); setIsActive(true);
      setMessage('Product added');
      fetchProducts();
    } catch (err) {
      console.error('Add product error', err);
      setMessage(err.message || 'Add failed');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 360 }}>
          <form onSubmit={handleAdd} style={{ display: 'grid', gap: 8 }}>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: 8 }} />
            <input placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: 8 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="Price per unit" value={price} onChange={(e) => setPrice(e.target.value)} style={{ padding: 8, flex: 1 }} />
              <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ padding: 8 }}>
                <option>Litre</option>
                <option>Kg</option>
                <option>Glass</option>
                <option>Packet</option>
              </select>
            </div>

            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active
            </label>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={saving} style={{ padding: '8px 12px', background: '#0b6', color: '#fff', border: 'none', borderRadius: 6 }}>
                {saving ? 'Adding...' : 'Add product'}
              </button>
              <button type="button" onClick={() => { setName(''); setDescription(''); setPrice(''); setIsActive(true); }} style={{ padding: '8px 12px' }}>
                Clear
              </button>
            </div>

            {message && <div style={{ color: 'green' }}>{message}</div>}
          </form>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Existing products</h4>
          {loading ? <div>Loading…</div> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {products.map(p => (
                <li key={p.id} style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{p.name}</strong>
                      <div style={{ color: '#666', fontSize: 13 }}>{p.description}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>₹{Number(p.price_per_unit).toFixed(2)} / {p.unit}</div>
                      <div style={{ color: p.is_active ? '#0a0' : '#999', fontSize: 12 }}>{p.is_active ? 'Active' : 'Inactive'}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
