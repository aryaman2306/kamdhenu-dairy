import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // On success navigate to orders
      navigate('/admin/orders');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 520, margin: '40px auto' }}>
      <h2>Admin Login</h2>
      <p>Sign in to manage orders & products.</p>

      {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          style={{ padding: 8 }}
          required
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          style={{ padding: 8 }}
          required
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 12px', background: '#0b6', color: '#fff', border: 'none', borderRadius: 6 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={() => {
              // simple sign-out helper (if needed)
              supabase.auth.signOut();
            }}
            style={{ padding: '8px 12px', borderRadius: 6 }}
          >
            Sign out
          </button>
        </div>
      </form>
    </div>
  );
}
