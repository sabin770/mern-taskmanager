export default function Filters({ filters, onChange, onClearCompleted }) {
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'Any Priority' },
    { value: 'high', label: '🔴 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low', label: '🟢 Low' },
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'dueDate', label: 'Due Date' },
    { value: '-priority', label: 'Priority' },
  ];

  return (
    <div style={styles.wrapper}>
      {/* Search */}
      <div style={styles.searchWrapper}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.controls}>
        {/* Status tabs */}
        <div style={styles.tabs}>
          {statusOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ status: value })}
              style={{
                ...styles.tab,
                ...(filters.status === value ? styles.tabActive : {}),
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={styles.selects}>
          <select
            value={filters.priority}
            onChange={(e) => onChange({ priority: e.target.value })}
            style={styles.select}
          >
            {priorityOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value })}
            style={styles.select}
          >
            {sortOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <button className="btn btn-danger" onClick={onClearCompleted} style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
            Clear Completed
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  searchWrapper: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '0.9rem',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '11px 14px 11px 40px',
    color: 'var(--text)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '4px',
  },
  tab: {
    background: 'none',
    color: 'var(--text-muted)',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.15s',
    cursor: 'pointer',
  },
  tabActive: {
    background: 'var(--accent)',
    color: '#fff',
  },
  selects: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  select: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '8px 12px',
    color: 'var(--text)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    outline: 'none',
  },
};
