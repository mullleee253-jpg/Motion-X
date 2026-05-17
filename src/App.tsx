import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import WorkoutsPage from './pages/WorkoutsPage';
import AdminPage from './pages/AdminPage';

type Screen = 'landing' | 'login' | 'register' | 'admin';

function AppInner() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/admin') return 'admin';
    return 'landing';
  });

  // URL-based routing for /admin
  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname === '/admin') {
        setScreen('admin');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (screen === 'admin') {
    return <AdminPage />;
  }

  if (user) {
    return <WorkoutsPage />;
  }

  if (screen === 'login' || screen === 'register') {
    return (
      <AuthPage
        mode={screen}
        onSuccess={() => {}}
        onBack={() => setScreen('landing')}
        onSwitch={(mode) => setScreen(mode)}
      />
    );
  }

  return (
    <LandingPage
      onLogin={() => setScreen('login')}
      onRegister={() => setScreen('register')}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
