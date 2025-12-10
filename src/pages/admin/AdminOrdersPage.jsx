import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200);
      if (statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Fetch orders error', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Orders</h2>
        <div>
          <Link to="/admin/products"><button style={{ marginRight: 8, padding: '6px 10px' }}>Products</button></Link>
          <button onClick={fetchOrders} style={{ padding: '6px 10px' }}>Refresh</button>
        </div>
      </div>

      <div style={{ margin: '12px 0' }}>
        <label>
          Filter:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DELIVERING">Delivering</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
      </div>

      {loading ? (
        <div>Loading orders…</div>
      ) : orders.length === 0 ? (
        <div>No orders yet.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: 8 }}>When</th>
              <th style={{ padding: 8 }}>Customer</th>
              <th style={{ padding: 8 }}>Items</th>
              <th style={{ padding: 8 }}>Total</th>
              <th style={{ padding: 8 }}>Pay</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 8 }}>{new Date(o.created_at).toLocaleString()}</td>
                <td style={{ padding: 8 }}>{o.customer_name} <div style={{ color: '#666', fontSize: 12 }}>{o.customer_phone}</div></td>
                <td style={{ padding: 8 }}>{/* We'll show count of items */} 
                  {/* fetch item count not joined here; show placeholder or compute on client if you fetch items */}
                  {/* For now show '-' and admin can open detail */}
                  -
                </td>
                <td style={{ padding: 8 }}>₹{Number(o.total_amount).toFixed(2)}</td>
                <td style={{ padding: 8 }}>{o.is_paid ? 'Yes' : 'No'}</td>
                <td style={{ padding: 8 }}>{o.status}</td>
                <td style={{ padding: 8 }}>
                  <Link to={`/admin/orders/${o.id}`}><button style={{ padding: '6px 8px' }}>View</button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
