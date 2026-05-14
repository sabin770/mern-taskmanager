import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNewTask }) {
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handlePremiumClick = () => {
    window.location.href = 'http://localhost:3000/premium';
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>✦</div>
        <span style={styles.logoText}>TaskFlow</span>
      </div>

      <div style={styles.right}>
        <button className="btn btn-premium" onClick={handlePremiumClick} style={styles.premiumBtn}>
          ⭐ Premium
        </button>

        <button className="btn btn-primary" onClick={onNewTask} style={styles.newBtn}>
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
          New Task
        </button>

        <div style={styles.userMenu}>
          <div style={styles.avatar}>{initials}</div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.name}</span>
            <button onClick={logout} style={styles.logoutBtn}>Sign out</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: '64px',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backdropFilter: 'blur(10px)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'var(--accent)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    color: '#fff',
  },
  logoText: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: '800',
    fontSize: '1.2rem',
    letterSpacing: '-0.01em',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  premiumBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    border: 'none',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '0.875rem',
  },
  newBtn: {
    padding: '8px 16px',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.8rem',
    color: '#fff',
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    lineHeight: 1.2,
  },
  logoutBtn: {
    background: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    padding: 0,
    cursor: 'pointer',
    textAlign: 'left',
  },
};