import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

function StatusBadge({ status }) {
  const bg =
    status === 'PENDING'
      ? '#fff7ed'
      : status === 'ACCEPTED'
      ? '#ecfccb'
      : status === 'DELIVERING'
      ? '#fff7ed'
      : status === 'DELIVERED'
      ? '#dbeafe'
      : status === 'CANCELLED'
      ? '#fee2e2'
      : '#f3f4f6';
  const color =
    status === 'CANCELLED' ? '#991b1b' : status === 'DELIVERED' ? '#1e3a8a' : '#065f46';

  return (
    <span
      style={{
        background: bg,
        color,
        padding: '5px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        display: 'inline-block',
        minWidth: 80,
        textAlign: 'center',
      }}
    >
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]); // merged orders with _itemCount/_itemsTotal
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState(null);

  // logout handler
  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } finally {
      navigate('/admin/login');
    }
  }

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [statusFilter]);

  // fetch orders and merge item counts/totals
  async function fetchOrders() {
    setLoading(true);
    setError(null);

    try {
      // 1) fetch orders (filtered)
      let q = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200);
      if (statusFilter !== 'ALL') q = q.eq('status', statusFilter);
      const { data: ordersData, error: ordersError } = await q;
      if (ordersError) throw ordersError;

      const orderList = ordersData || [];

      // If no orders, set empty and stop — but ensure loading is turned off
      if (orderList.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // 2) fetch order_items for these orders
      const orderIds = orderList.map((o) => o.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('order_id, quantity, line_total, products(id, name, unit)')
        .in('order_id', orderIds);

      if (itemsError) {
        // If order_items fetch fails, still show orders without counts
        console.warn('Could not fetch order items:', itemsError);
        const fallback = orderList.map((o) => ({ ...o, _itemCount: 0, _itemsTotal: Number(o.total_amount || 0), _lines: [] }));
        setOrders(fallback);
        setLoading(false);
        return;
      }

      // 3) compute counts/totals per order
      const map = {}; // orderId -> {itemCount, itemsTotal, lines}
      (itemsData || []).forEach((it) => {
        const oid = it.order_id;
        if (!map[oid]) map[oid] = { itemCount: 0, itemsTotal: 0, lines: [] };
        map[oid].itemCount += Number(it.quantity || 0);
        map[oid].itemsTotal += Number(it.line_total || 0);
        map[oid].lines.push(it);
      });

      // 4) merge into orders
      const merged = orderList.map((o) => {
        const stats = map[o.id] || { itemCount: 0, itemsTotal: Number(o.total_amount || 0), lines: [] };
        return {
          ...o,
          _itemCount: stats.itemCount,
          _itemsTotal: stats.itemsTotal,
          _lines: stats.lines,
        };
      });

      setOrders(merged);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Fetch orders error', err);
      setError(err?.message ?? 'Failed to load orders.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0 }}>Orders</h2>
          <div style={{ color: '#666', fontSize: 13 }}>{orders.length} total</div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/admin/products">
            <button style={{ marginRight: 8, padding: '8px 12px' }}>Products</button>
          </Link>

          <button onClick={fetchOrders} style={{ padding: '8px 12px' }}>
            Refresh
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '8px 12px',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ margin: '12px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 14 }}>Filter:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ marginLeft: 8, padding: 6 }}>
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DELIVERING">Delivering</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
      </div>

      {error && (
        <div style={{ marginBottom: 12, color: 'crimson' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading orders…</div>
      ) : orders.length === 0 ? (
        <div>No orders yet.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
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
                  <td style={{ padding: 8, verticalAlign: 'top' }}>{new Date(o.created_at).toLocaleString()}</td>

                  <td style={{ padding: 8 }}>
                    <div style={{ fontWeight: 700 }}>{o.customer_name}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>{o.customer_phone}</div>
                    <div style={{ color: '#444', fontSize: 12, marginTop: 6 }}>{o.customer_address}</div>
                  </td>

                  <td style={{ padding: 8 }}>
                    <div style={{ fontWeight: 700 }}>{o._itemCount} {o._itemCount === 1 ? 'item' : 'items'}</div>
                    {o._lines && o._lines.length > 0 && (
                      <div style={{ color: '#666', fontSize: 12, marginTop: 6 }}>
                        {o._lines.slice(0, 3).map((ln, i) => (
                          <div key={i}>
                            {ln.products?.name || 'Item'} x {ln.quantity} = ₹{Number(ln.line_total).toFixed(2)}
                          </div>
                        ))}
                        {o._lines.length > 3 && <div style={{ color: '#999', fontSize: 12 }}>+{o._lines.length - 3} more</div>}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: 8 }}>
                    <div style={{ fontWeight: 800 }}>₹{Number(o.total_amount).toFixed(2)}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>items subtotal ₹{Number(o._itemsTotal || o.total_amount).toFixed(2)}</div>
                  </td>

                  <td style={{ padding: 8 }}>
                    <span style={{ color: o.is_paid ? '#065f46' : '#7f1d1d', fontWeight: 800 }}>
                      {o.is_paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>

                  <td style={{ padding: 8 }}>
                    <StatusBadge status={o.status} />
                  </td>

                  <td style={{ padding: 8 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/admin/orders/${o.id}`}>
                        <button style={{ padding: '6px 8px' }}>View</button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
