import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-in">
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>✦</div>
          <span style={styles.logoText}>TaskFlow</span>
        </div>

        <h1 style={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={styles.subtitle}>
          {mode === 'login'
            ? 'Sign in to manage your tasks'
            : 'Get started with TaskFlow today'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="form-control"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '1rem', marginTop: 4 }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={styles.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={styles.toggleBtn}
          >
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>

        {/* Demo hint */}
        {mode === 'login' && (
          <div style={styles.demo}>
            <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>Demo: </span>
            <button
              style={styles.demoBtn}
              onClick={() => setForm({ name: '', email: 'demo@taskflow.com', password: 'demo123' })}
            >
              Fill demo credentials
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.12) 0%, transparent 60%)',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: 'var(--shadow)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'var(--accent)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#fff',
  },
  logoText: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: '800',
    fontSize: '1.3rem',
    letterSpacing: '-0.01em',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: '700',
    marginBottom: '6px',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginBottom: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  toggle: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    marginTop: '20px',
  },
  toggleBtn: {
    background: 'none',
    color: 'var(--accent-light)',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
    padding: 0,
  },
  demo: {
    marginTop: '16px',
    textAlign: 'center',
  },
  demoBtn: {
    background: 'none',
    color: 'var(--accent)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textDecorationStyle: 'dashed',
  },
};
