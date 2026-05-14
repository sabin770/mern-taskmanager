import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePremium } from '../hooks/usePremium';

export default function KhaltiCallback() {
  const [searchParams] = useSearchParams();
  const { verifyPayment } = usePremium();
  const navigate = useNavigate();
  const [state, setState] = useState('verifying'); // verifying | success | failed

  useEffect(() => {
    const verify = async () => {
      const pidx = searchParams.get('pidx');
      const status = searchParams.get('status');

      if (!pidx || status !== 'Completed') {
        setState('failed');
        setTimeout(() => navigate('/premium'), 3000);
        return;
      }

      try {
        await verifyPayment(pidx);
        setState('success');
        setTimeout(() => navigate('/'), 3500);
      } catch {
        setState('failed');
        setTimeout(() => navigate('/premium'), 3000);
      }
    };

    verify();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-in">
        {state === 'verifying' && (
          <>
            <div className="spinner" style={{ margin: '0 auto 24px' }} />
            <h2 style={styles.title}>Verifying your payment...</h2>
            <p style={styles.sub}>Please wait, do not close this page.</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div style={styles.successIcon}>🎉</div>
            <h2 style={styles.title}>Premium Activated!</h2>
            <p style={styles.sub}>
              Your payment was successful. A receipt has been sent to your email.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 12 }}>
              Redirecting to dashboard...
            </p>
          </>
        )}

        {state === 'failed' && (
          <>
            <div style={styles.failIcon}>⚠️</div>
            <h2 style={{ ...styles.title, color: 'var(--red)' }}>Payment Failed</h2>
            <p style={styles.sub}>
              We couldn't verify your payment. If money was deducted, please contact support.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 12 }}>
              Redirecting back...
            </p>
          </>
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
    background: 'var(--bg)',
    padding: 24,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '48px 40px',
    textAlign: 'center',
    maxWidth: 420,
    width: '100%',
    boxShadow: 'var(--shadow)',
  },
  title: { fontSize: '1.5rem', fontWeight: '700', marginBottom: 12 },
  sub: { color: 'var(--text-muted)', lineHeight: 1.6 },
  successIcon: { fontSize: '4rem', marginBottom: 20, filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.4))' },
  failIcon: { fontSize: '4rem', marginBottom: 20 },
};
