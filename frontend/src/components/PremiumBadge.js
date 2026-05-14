import { useNavigate } from 'react-router-dom';

export default function PremiumBadge({ isPremium }) {
  const navigate = useNavigate();

  if (isPremium) {
    return (
      <div style={styles.activeBadge}>
        <span>👑</span>
        <span>Premium</span>
      </div>
    );
  }

  return (
    <button onClick={() => navigate('/premium')} style={styles.upgradeBtn}>
      ✨ Upgrade to Premium
    </button>
  );
}

const styles = {
  activeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(108,99,255,0.15))',
    border: '1px solid rgba(245,158,11,0.3)',
    color: '#f59e0b',
    padding: '5px 12px',
    borderRadius: 20,
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  upgradeBtn: {
    background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(139,133,255,0.1))',
    border: '1px solid rgba(108,99,255,0.3)',
    color: 'var(--accent-light)',
    padding: '7px 14px',
    borderRadius: 20,
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
};
