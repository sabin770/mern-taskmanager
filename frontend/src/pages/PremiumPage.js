import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../hooks/usePremium';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export default function PremiumPage() {
  const { user } = useAuth();
  const { status, plans, loading, history, fetchHistory, initiatePurchase, updateNotifications } = usePremium();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [purchasing, setPurchasing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({ emailReminders: true, reminderHoursBefore: 24 });
  const navigate = useNavigate();

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      await initiatePurchase(selectedPlan);
    } finally {
      setPurchasing(false);
    }
  };

  const handleShowHistory = async () => {
    await fetchHistory();
    setShowHistory(true);
  };

  if (loading) return (
    <div style={styles.page}>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <div className="spinner" />
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>← Back to Dashboard</button>
        <div style={styles.headerContent}>
          <div style={styles.crownBadge}>👑</div>
          <h1 style={styles.title}>TaskFlow Premium</h1>
          <p style={styles.subtitle}>Get email reminders and never miss a deadline again</p>
        </div>
      </div>

      <div style={styles.content}>

        {/* Already Premium */}
        {status?.isPremium ? (
          <div style={styles.activeBanner}>
            <div style={styles.activeBannerLeft}>
              <span style={styles.activeCrown}>👑</span>
              <div>
                <div style={styles.activeBannerTitle}>Premium Active</div>
                <div style={styles.activeBannerSub}>
                  {status.premiumExpiry
                    ? `Expires ${format(new Date(status.premiumExpiry), 'MMMM d, yyyy')} · ${status.daysLeft} days left`
                    : 'Lifetime access'}
                </div>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={handleShowHistory} style={{ fontSize: '0.85rem' }}>
              View Receipts
            </button>
          </div>
        ) : null}

        {/* Plans */}
        {!status?.isPremium && (
          <>
            <h2 style={styles.sectionTitle}>Choose your plan</h2>
            <div style={styles.plans}>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{
                    ...styles.planCard,
                    ...(selectedPlan === plan.id ? styles.planCardSelected : {}),
                    ...(plan.id === 'yearly' ? styles.planCardPopular : {}),
                  }}
                >
                  {plan.id === 'yearly' && <div style={styles.popularBadge}>Most Popular</div>}
                  <div style={styles.planHeader}>
                    <div style={styles.planName}>{plan.name}</div>
                    <div style={styles.planPrice}>
                      <span style={styles.planAmount}>{plan.priceFormatted}</span>
                      <span style={styles.planPeriod}>/{plan.period}</span>
                    </div>
                    {plan.savings && <div style={styles.savings}>{plan.savings}</div>}
                  </div>
                  <ul style={styles.featureList}>
                    {plan.features.map((f) => (
                      <li key={f} style={styles.featureItem}>
                        <span style={{ color: 'var(--green)' }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div style={{
                    ...styles.radioCircle,
                    ...(selectedPlan === plan.id ? styles.radioCircleSelected : {}),
                  }} />
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary"
              style={styles.buyBtn}
              onClick={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? 'Redirecting to Khalti...' : `Pay with Khalti — ${plans.find(p => p.id === selectedPlan)?.priceFormatted}`}
            </button>

            <div style={styles.khaltiNote}>
              <img
                src="https://khalti.com/static/khalti-logo.png"
                alt="Khalti"
                style={{ height: 20, opacity: 0.7 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span>Secure payment via Khalti · Nepal's trusted payment gateway</span>
            </div>
          </>
        )}

        {/* Notification Settings (premium only) */}
        {status?.isPremium && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📧 Email Reminder Settings</h2>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <label style={styles.toggle}>
                <div>
                  <div style={styles.toggleLabel}>Email Reminders</div>
                  <div style={styles.toggleSub}>Receive daily emails about upcoming & overdue tasks</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs.emailReminders}
                  onChange={(e) => setNotifPrefs({ ...notifPrefs, emailReminders: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                />
              </label>

              <div className="form-group">
                <label>Remind me this many hours before due date</label>
                <select
                  className="form-control"
                  value={notifPrefs.reminderHoursBefore}
                  onChange={(e) => setNotifPrefs({ ...notifPrefs, reminderHoursBefore: Number(e.target.value) })}
                >
                  <option value={6}>6 hours before</option>
                  <option value={12}>12 hours before</option>
                  <option value={24}>24 hours before (1 day)</option>
                  <option value={48}>48 hours before (2 days)</option>
                  <option value={72}>72 hours before (3 days)</option>
                </select>
              </div>

              <button
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => updateNotifications(notifPrefs)}
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Payment History Modal */}
        {showHistory && (
          <div style={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={styles.sectionTitle}>🧾 Payment History</h2>
              <button className="btn btn-ghost" onClick={() => setShowHistory(false)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Close</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No payments found.</p>
              ) : history.map((p) => (
                <div key={p._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {p.plan === 'yearly' ? 'Yearly' : 'Monthly'} Premium
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {format(new Date(p.createdAt), 'MMM d, yyyy')} · ID: {p.transactionId || p.pidx}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--green)' }}>NPR {p.amountNPR}</div>
                    <span className="badge badge-completed">Paid</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  header: {
    background: 'linear-gradient(180deg, rgba(108,99,255,0.15) 0%, transparent 100%)',
    borderBottom: '1px solid var(--border)',
    padding: '24px 32px 40px',
  },
  backBtn: {
    background: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    marginBottom: 24,
    display: 'block',
    cursor: 'pointer',
    padding: 0,
  },
  headerContent: { textAlign: 'center', maxWidth: 600, margin: '0 auto' },
  crownBadge: {
    fontSize: '3rem',
    marginBottom: 12,
    display: 'block',
    filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.5))',
  },
  title: { fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: 8 },
  subtitle: { color: 'var(--text-muted)', fontSize: '1rem' },
  content: { maxWidth: 800, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 32 },
  activeBanner: {
    background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(34,197,94,0.1))',
    border: '1px solid rgba(108,99,255,0.3)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeBannerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  activeCrown: { fontSize: '2rem' },
  activeBannerTitle: { fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 },
  activeBannerSub: { color: 'var(--text-muted)', fontSize: '0.875rem' },
  sectionTitle: { fontSize: '1.3rem', fontWeight: '700', marginBottom: 16 },
  section: {},
  plans: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  planCard: {
    background: 'var(--surface)',
    border: '2px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    overflow: 'hidden',
  },
  planCardSelected: { borderColor: 'var(--accent)', background: 'rgba(108,99,255,0.05)' },
  planCardPopular: {},
  popularBadge: {
    position: 'absolute',
    top: 12, right: 12,
    background: 'var(--accent)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 20,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  planHeader: { marginBottom: 16 },
  planName: { fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
  planPrice: { display: 'flex', alignItems: 'baseline', gap: 4 },
  planAmount: { fontSize: '2rem', fontWeight: '800', fontFamily: 'Syne, sans-serif' },
  planPeriod: { color: 'var(--text-muted)', fontSize: '0.9rem' },
  savings: { marginTop: 6, fontSize: '0.8rem', color: 'var(--green)', fontWeight: 600 },
  featureList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 },
  featureItem: { fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', gap: 8 },
  radioCircle: { width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border)', marginTop: 8 },
  radioCircleSelected: { border: '5px solid var(--accent)', background: 'rgba(108,99,255,0.1)' },
  buyBtn: { width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', fontWeight: 700 },
  khaltiNote: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  },
  toggle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  toggleLabel: { fontWeight: 600, marginBottom: 4 },
  toggleSub: { fontSize: '0.82rem', color: 'var(--text-muted)' },
};
