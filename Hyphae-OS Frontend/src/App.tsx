import { useAuth, AuthProvider } from '@/hooks/useAuth';
import LoginPanel from '@/components/auth/LoginPanel';
import PinAuthVault from '@/components/auth/PinAuthVault';
import Dashboard from '@/components/dashboard/Dashboard';
import MycoCorePanel from '@/agents/MycoCorePanel';

function AppRoutes() {
  const { user, token, logout } = useAuth();

  const handleLoginSuccess = () => {
    // Update your state or context here
  };

  const handlePinSuccess = () => {
    // Update your state or context here
  };

  const handleBack = () => {
    // Reset to login stage if needed
  };

  if (!user) return <LoginPanel onSuccess={handleLoginSuccess} />;

  if (user && !user.pinVerified) {
    return (
      <PinAuthVault
        onSuccess={handlePinSuccess}
        onBack={handleBack}
      />
    );
  }

  return (
    <>
      <Dashboard onLogout={logout} />
      {(user.role === 'owner' || user.role === 'admin') && <MycoCorePanel />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 to-dark-400 text-white overflow-hidden">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}
