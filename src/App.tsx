import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import WorkoutsPage from './pages/WorkoutsPage';

type Screen = 'landing' | 'login' | 'register';

function AppInner() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>('landing');

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
