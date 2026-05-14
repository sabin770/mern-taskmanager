import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const { data } = await api.get(`/tasks?${params.toString()}`);
      setTasks(data.tasks);
      setStats(data.stats);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.priority, filters.search, filters.sort]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      setTasks((prev) => [data.task, ...prev]);
      setStats((prev) => ({ ...prev, total: prev.total + 1, todo: prev.todo + 1 }));
      toast.success('Task created!');
      return data.task;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
      toast.success('Task updated!');
      return data.task;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/tasks/${id}/status`, { status });
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
      toast.success(`Moved to ${status}`);
      await fetchTasks(); // re-fetch stats
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
      await fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const clearCompleted = async () => {
    try {
      const { data } = await api.delete('/tasks');
      toast.success(data.message);
      await fetchTasks();
    } catch (err) {
      toast.error('Failed to clear completed tasks');
    }
  };

  return {
    tasks, stats, loading, error,
    createTask, updateTask, updateStatus, deleteTask, clearCompleted,
    refetch: fetchTasks,
  };
};
