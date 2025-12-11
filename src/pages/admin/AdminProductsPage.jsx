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
      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: name.trim(),
            description: description.trim(),
            unit,
            price_per_unit: Number(price),
            is_active: isActive,
          },
        ])
        .select();
      if (error) throw error;
      setName('');
      setDescription('');
      setPrice('');
      setIsActive(true);
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

  async function toggleActive(productId, current) {
    try {
      const { error } = await supabase.from('products').update({ is_active: !current }).eq('id', productId);
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Toggle active error', err);
      setMessage('Update failed');
      setTimeout(() => setMessage(null), 2500);
    }
  }

  async function deleteProduct(productId) {
    if (!confirm('Delete this product? This action cannot be undone.')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Delete product error', err);
      setMessage('Delete failed');
      setTimeout(() => setMessage(null), 2500);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 320, flex: '0 0 360px' }}>
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

        <div style={{ flex: 1, minWidth: 320 }}>
          <h4>Existing products</h4>
          {loading ? <div>Loading…</div> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {products.map(p => (
                <li key={p.id} style={{ padding: 8, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{p.name}</strong>
                    <div style={{ color: '#666', fontSize: 13 }}>{p.description}</div>
                    <div style={{ color: '#444', fontSize: 12, marginTop: 6 }}>₹{Number(p.price_per_unit).toFixed(2)} / {p.unit}</div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ fontSize: 12, color: p.is_active ? '#065f46' : '#666' }}>{p.is_active ? 'Active' : 'Inactive'}</div>
                    <button onClick={() => toggleActive(p.id, p.is_active)} style={{ padding: '6px 8px' }}>{p.is_active ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={() => deleteProduct(p.id)} style={{ padding: '6px 8px', background: '#fee2e2', border: '1px solid #fca5a5' }}>Delete</button>
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
