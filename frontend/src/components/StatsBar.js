export default function StatsBar({ stats }) {
  const total = stats.total || 1; // avoid division by zero
  const completedPct = Math.round((stats.completed / total) * 100);

  const items = [
    { label: 'Total', value: stats.total, color: 'var(--accent)' },
    { label: 'To Do', value: stats.todo, color: 'var(--text-muted)' },
    { label: 'In Progress', value: stats.inProgress, color: 'var(--yellow)' },
    { label: 'Completed', value: stats.completed, color: 'var(--green)' },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.cards}>
        {items.map(({ label, value, color }) => (
          <div key={label} style={styles.statCard}>
            <span style={{ ...styles.statValue, color }}>{value}</span>
            <span style={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Overall Progress</span>
          <span style={styles.progressPct}>{completedPct}%</span>
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${completedPct}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  statCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '1.8rem',
    fontWeight: '800',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  progressSection: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  progressLabel: {
    fontSize: '0.82rem',
    fontWeight: '500',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  progressPct: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--green)',
  },
  progressBar: {
    height: '6px',
    background: 'var(--surface2)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent), var(--green))',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
};
