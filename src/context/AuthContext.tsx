import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  activatePremium: () => void;
  paymentPending: boolean;
  clearPaymentPending: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'motonx_users';
const SESSION_KEY = 'motonx_session';
const PAYMENT_KEY = 'motonx_payment_pending';

function getUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { const s = localStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [paymentPending, setPaymentPending] = useState(() => {
    return localStorage.getItem(PAYMENT_KEY) === 'true';
  });

  // Check for payment return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'pending') {
      localStorage.setItem(PAYMENT_KEY, 'true');
      setPaymentPending(true);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (found) { setUser(found); localStorage.setItem(SESSION_KEY, JSON.stringify(found)); return true; }
    return false;
  };

  const register = (username: string, password: string): boolean => {
    const users = getUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) return false;
    const newUser: User = { username, password, isPremium: false };
    saveUsers([...users, newUser]);
    setUser(newUser); localStorage.setItem(SESSION_KEY, JSON.stringify(newUser)); return true;
  };

  const logout = () => { setUser(null); localStorage.removeItem(SESSION_KEY); };

  const activatePremium = () => {
    if (!user) return;
    const users = getUsers();
    const updated = users.map(u => u.username === user.username ? { ...u, isPremium: true } : u);
    saveUsers(updated);
    const u = { ...user, isPremium: true };
    setUser(u); localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  };

  const clearPaymentPending = () => {
    localStorage.removeItem(PAYMENT_KEY);
    setPaymentPending(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, activatePremium, paymentPending, clearPaymentPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth required');
  return ctx;
}