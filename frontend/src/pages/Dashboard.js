import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StatsBar from '../components/StatsBar';
import Filters from '../components/Filters';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { useTasks } from '../hooks/useTasks';

const DEFAULT_FILTERS = {
  status: 'all',
  priority: 'all',
  search: '',
  sort: '-createdAt',
};

export default function Dashboard() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { tasks, stats, loading, error, createTask, updateTask, updateStatus, deleteTask, clearCompleted } =
    useTasks(filters);

  const handleFilterChange = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    if (editingTask) {
      await updateTask(editingTask._id, data);
    } else {
      await createTask(data);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div style={styles.page}>
      <Navbar onNewTask={handleNewTask} />

      <main style={styles.main}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>My Tasks</h1>
            <p style={styles.pageSubtitle}>Track, manage, and conquer your work</p>
          </div>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Filters */}
        <Filters
          filters={filters}
          onChange={handleFilterChange}
          onClearCompleted={clearCompleted}
        />

        {/* Task Grid */}
        {loading ? (
          <div style={styles.center}>
            <div className="spinner" />
          </div>
        ) : error ? (
          <div style={styles.error}>⚠️ {error}</div>
        ) : tasks.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📋</div>
            <h3 style={styles.emptyTitle}>No tasks found</h3>
            <p style={styles.emptyText}>
              {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first task to get started!'}
            </p>
            {!filters.search && filters.status === 'all' && (
              <button className="btn btn-primary" onClick={handleNewTask} style={{ marginTop: '16px' }}>
                + Create Task
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={deleteTask}
                onStatusChange={updateStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, var(--text) 40%, var(--accent-light))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  pageSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px 0',
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: 'var(--red)',
    borderRadius: 'var(--radius)',
    padding: '16px 20px',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '8px',
  },
  emptyTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
};
