import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import WorkoutsPage from './pages/WorkoutsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

type Screen = 'landing' | 'login' | 'register' | 'admin' | '404';

import SupportChat from './components/SupportChat';

function AppInner() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/admin') return 'admin';
    return 'landing';
  });

  // URL-based routing for /admin and 404
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setScreen('admin');
      } else if (path !== '/' && path !== '/login' && path !== '/register') {
        setScreen('404');
      }
    };
    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (screen === '404') {
    return <NotFoundPage />;
  }

  if (screen === 'admin') {
    return <AdminPage />;
  }

  if (user && !user.isAdmin) {
    return (
      <>
        <WorkoutsPage />
        <SupportChat />
      </>
    );
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
