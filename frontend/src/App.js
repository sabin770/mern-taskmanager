import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import PremiumPage from './pages/PremiumPage';
import KhaltiCallback from './pages/KhaltiCallback';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/khalti-payment" element={<PrivateRoute><KhaltiCallback /></PrivateRoute>} />
          <Route path="/premium" element={<PrivateRoute><PremiumPage /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface2)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: 'var(--green)', secondary: 'var(--surface2)' } },
            error: { iconTheme: { primary: 'var(--red)', secondary: 'var(--surface2)' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
