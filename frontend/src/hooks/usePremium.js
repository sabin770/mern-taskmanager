import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const usePremium = () => {
  const [status, setStatus] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statusRes, plansRes] = await Promise.all([
          api.get('/payment/status'),
          api.get('/payment/plans'),
        ]);
        setStatus(statusRes.data);
        setPlans(plansRes.data.plans);
      } catch (err) {
        console.error('Failed to load premium status');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/payment/history');
      setHistory(data.payments);
    } catch {}
  };

  const initiatePurchase = async (plan) => {
    try {
      const { data } = await api.post('/payment/initiate', { plan });
      // Redirect to Khalti
      window.location.href = data.paymentUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  const verifyPayment = async (pidx) => {
    try {
      const { data } = await api.post('/payment/verify', { pidx });
      toast.success('🎉 Premium activated! Receipt sent to your email.');
      setStatus({ ...status, isPremium: true, premiumExpiry: data.premiumExpiry });
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment verification failed');
      throw err;
    }
  };

  const updateNotifications = async (prefs) => {
    try {
      await api.put('/payment/notifications', prefs);
      toast.success('Notification preferences saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save preferences');
    }
  };

  return {
    status, plans, loading, history,
    initiatePurchase, verifyPayment, updateNotifications, fetchHistory,
  };
};
