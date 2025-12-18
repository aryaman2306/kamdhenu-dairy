import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

/* -------------------- UI helpers -------------------- */

function StatusBadge({ status }) {
  const styles = {
    PENDING: { bg: '#fff7ed', color: '#92400e' },
    ACCEPTED: { bg: '#ecfccb', color: '#365314' },
    DELIVERING: { bg: '#fff7ed', color: '#92400e' },
    DELIVERED: { bg: '#dbeafe', color: '#1e3a8a' },
    CANCELLED: { bg: '#fee2e2', color: '#991b1b' },
  };

  const s = styles[status] || { bg: '#f3f4f6', color: '#374151' };

  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: '5px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        minWidth: 90,
        textAlign: 'center',
        display: 'inline-block',
      }}
    >
      {status}
    </span>
  );
}

/* -------------------- PAGE -------------------- */

export default function AdminOrdersPage() {
  const navigate = useNavigate();

  /* 🔐 Admin gate */
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  /* Orders state */
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState(null);

  /* -------------------- HARD ADMIN CHECK -------------------- */
  useEffect(() => {
    let alive = true;

    async function verifyAdmin() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/admin/login', { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data) {
        navigate('/admin/login', { replace: true });
        return;
      }

      if (alive) setCheckingAdmin(false);
    }

    verifyAdmin();
    return () => { alive = false; };
  }, [navigate]);

  /* -------------------- FETCH ORDERS (only after admin verified) -------------------- */
  useEffect(() => {
    if (checkingAdmin) return;
    fetchOrders();
    // eslint-disable-next-line
  }, [checkingAdmin, statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    setError(null);

    try {
      let q = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (statusFilter !== 'ALL') {
        q = q.eq('status', statusFilter);
      }

      const { data: ordersData, error: ordersError } = await q;
      if (ordersError) throw ordersError;

      const baseOrders = ordersData || [];
      if (baseOrders.length === 0) {
        setOrders([]);
        return;
      }

      const orderIds = baseOrders.map(o => o.id);

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('order_id, quantity, line_total, products(name, unit)')
        .in('order_id', orderIds);

      if (itemsError) {
        setOrders(baseOrders.map(o => ({ ...o, _itemCount: 0, _itemsTotal: o.total_amount, _lines: [] })));
        return;
      }

      const map = {};
      (itemsData || []).forEach(it => {
        if (!map[it.order_id]) map[it.order_id] = { count: 0, total: 0, lines: [] };
        map[it.order_id].count += Number(it.quantity || 0);
        map[it.order_id].total += Number(it.line_total || 0);
        map[it.order_id].lines.push(it);
      });

      const merged = baseOrders.map(o => {
        const m = map[o.id] || { count: 0, total: o.total_amount, lines: [] };
        return { ...o, _itemCount: m.count, _itemsTotal: m.total, _lines: m.lines };
      });

      setOrders(merged);
    } catch (err) {
      console.error(err);
      setError(err?.message ?? 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  /* -------------------- LOGOUT -------------------- */
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  }

  /* -------------------- BLOCK RENDER -------------------- */
  if (checkingAdmin) {
    return <div style={{ padding: 24 }}>Verifying admin access…</div>;
  }

  /* -------------------- UI -------------------- */
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Orders</h2>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/products">
            <button>Products</button>
          </Link>
          <button onClick={fetchOrders}>Refresh</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{ margin: '14px 0' }}>
        <label>
          Filter:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DELIVERING">Delivering</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
      </div>

      {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

      {loading ? (
        <div>Loading orders…</div>
      ) : orders.length === 0 ? (
        <div>No orders yet.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th>When</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{new Date(o.created_at).toLocaleString()}</td>
                <td>
                  <strong>{o.customer_name}</strong>
                  <div style={{ fontSize: 12 }}>{o.customer_phone}</div>
                </td>
                <td>
                  {o._itemCount} items
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {o._lines.slice(0, 2).map((l, i) => (
                      <div key={i}>
                        {l.products?.name} x {l.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td>₹{Number(o.total_amount).toFixed(2)}</td>
                <td>{o.is_paid ? 'Yes' : 'No'}</td>
                <td><StatusBadge status={o.status} /></td>
                <td>
                  <Link to={`/admin/orders/${o.id}`}>
                    <button>View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
