import { useState } from 'react';
import { format } from 'date-fns';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusCycle = { todo: 'in-progress', 'in-progress': 'completed', completed: 'todo' };
  const statusLabel = { todo: 'To Do', 'in-progress': 'In Progress', completed: 'Completed' };

  const isOverdue =
    task.dueDate &&
    task.status !== 'completed' &&
    new Date(task.dueDate) < new Date();

  return (
    <div style={styles.card} className="fade-in">
      {/* Top row */}
      <div style={styles.topRow}>
        <div style={styles.badges}>
          <span className={`badge badge-${task.status}`}>{statusLabel[task.status]}</span>
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
        </div>
        <div style={styles.menuWrapper}>
          <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>⋯</button>
          {menuOpen && (
            <div style={styles.dropdown}>
              <button onClick={() => { onEdit(task); setMenuOpen(false); }} style={styles.dropdownItem}>
                ✏️ Edit
              </button>
              <button
                onClick={() => { onStatusChange(task._id, statusCycle[task.status]); setMenuOpen(false); }}
                style={styles.dropdownItem}
              >
                🔄 Move to {statusLabel[statusCycle[task.status]]}
              </button>
              <button
                onClick={() => { onDelete(task._id); setMenuOpen(false); }}
                style={{ ...styles.dropdownItem, color: 'var(--red)' }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        ...styles.title,
        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
        opacity: task.status === 'completed' ? 0.5 : 1,
      }}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p style={styles.description}>{task.description}</p>
      )}

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div style={styles.tags}>
          {task.tags.map((tag) => (
            <span key={tag} style={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        {task.dueDate ? (
          <span style={{ ...styles.dueDate, color: isOverdue ? 'var(--red)' : 'var(--text-muted)' }}>
            {isOverdue ? '⚠️' : '📅'} {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </span>
        ) : (
          <span />
        )}
        <span style={styles.createdAt}>
          {format(new Date(task.createdAt), 'MMM d')}
        </span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'border-color 0.2s, transform 0.2s',
    cursor: 'default',
    position: 'relative',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badges: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  menuWrapper: {
    position: 'relative',
  },
  menuBtn: {
    background: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.2rem',
    padding: '2px 8px',
    borderRadius: '6px',
    lineHeight: 1,
    transition: 'background 0.15s',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '110%',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    minWidth: '180px',
    zIndex: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    overflow: 'hidden',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 14px',
    background: 'none',
    color: 'var(--text)',
    fontSize: '0.875rem',
    transition: 'background 0.15s',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1rem',
    fontWeight: '600',
    lineHeight: 1.4,
    fontFamily: 'Syne, sans-serif',
  },
  description: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  tags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: '0.75rem',
    color: 'var(--accent-light)',
    background: 'var(--accent-glow)',
    padding: '2px 8px',
    borderRadius: '20px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border)',
  },
  dueDate: {
    fontSize: '0.78rem',
    fontWeight: '500',
  },
  createdAt: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    opacity: 0.6,
  },
};
