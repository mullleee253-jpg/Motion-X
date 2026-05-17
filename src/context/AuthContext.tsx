import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Workout } from '../types';
import { workouts as initialWorkouts } from '../data/workouts';

interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  activatePremium: (username?: string) => void;
  removePremium: (username: string) => void;
  paymentPending: boolean;
  clearPaymentPending: () => void;
  allUsers: User[];
  allWorkouts: Workout[];
  addWorkout: (w: Workout) => void;
  deleteWorkout: (id: number) => void;
  messages: Message[];
  sendMessage: (text: string, to?: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const SESSION_KEY = 'motonx_session_v3';
const PAYMENT_KEY = 'motonx_payment_pending_v3';

const ADMIN_LOGIN = 'admin';
const ADMIN_PASS = 'master_2026_secure';
export const ADMIN_KEY = 'motonx-key-99';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { 
      const s = localStorage.getItem(SESSION_KEY); 
      if (!s) return null;
      const data = JSON.parse(s);
      if (data.expiresAt && Date.now() > data.expiresAt) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return data; 
    } catch { return null; }
  });

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>(initialWorkouts);
  const [messages, setMessages] = useState<Message[]>([]);
  const [paymentPending, setPaymentPending] = useState(() => localStorage.getItem(PAYMENT_KEY) === 'true');

  // 🔄 CLOUD SYNC
  useEffect(() => {
    const sync = async () => {
      try {
        // Sync Messages
        const resMsg = await fetch('/api/messages');
        if (resMsg.ok) {
          const cloudMsgs = await resMsg.json();
          setMessages(cloudMsgs);
        }

        // Sync Users (Admin only)
        if (user?.isAdmin) {
          const resUsers = await fetch('/api/users');
          if (resUsers.ok) {
            const cloudUsers = await resUsers.json();
            setAllUsers(cloudUsers);
          }
        }
        
        // Sync Workouts
        const resWorkouts = await fetch('/api/workouts');
        if (resWorkouts.ok) {
          const cloudWorkouts = await resWorkouts.json();
          // Обновляем только если в базе есть данные
          if (cloudWorkouts && cloudWorkouts.length > 0) {
            setAllWorkouts(cloudWorkouts);
          }
        }
      } catch (e) {
        console.log("Cloud sync error (check Mongo URI on Vercel)");
      }
    };

    const interval = setInterval(sync, 4000);
    sync();
    return () => clearInterval(interval);
  }, [user?.isAdmin]);

  const login = async (username: string, password: string): Promise<boolean> => {
    const cleanUser = username.trim().toLowerCase();
    
    // Admin Hardcoded
    if (cleanUser === ADMIN_LOGIN && password === ADMIN_PASS) {
      const adminUser: User = { username: 'Admin', password: '', isPremium: true, isAdmin: true };
      const sessionData = { ...adminUser, expiresAt: Date.now() + 86400000 };
      setUser(adminUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      return true;
    }

    // Проверяем через API с action=login
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password, action: 'login' })
      });
      
      if (res.ok) {
        const userData = await res.json();
        const sessionData = { ...userData, expiresAt: Date.now() + 86400000 };
        setUser(userData);
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        return true;
      }
    } catch (e) {
      console.error('Login error:', e);
    }
    
    return false;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    const cleanUser = username.trim().toLowerCase();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password, isPremium: false })
      });
      if (res.ok) {
        return await login(username, password);
      }
    } catch (e) {
      console.error('Registration error:', e);
    }
    return false;
  };

  const logout = () => { setUser(null); localStorage.removeItem(SESSION_KEY); };

  const activatePremium = async (username?: string) => {
    const targetName = username || user?.username;
    if (!targetName) return;
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: targetName, isPremium: true })
      });
      if (user?.username === targetName) setUser({ ...user, isPremium: true });
    } catch (e) {}
  };

  const removePremium = async (username: string) => {
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, isPremium: false })
      });
    } catch (e) {}
  };

  const sendMessage = async (text: string, to?: string) => {
    if (!user) return;
    const newMessage = {
      from: user.username,
      to: to || 'Admin',
      text,
      timestamp: Date.now(),
    };
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      setMessages(prev => [...prev, newMessage as Message]);
    } catch (e) {}
  };

  const addWorkout = async (w: Workout) => {
    try {
      await fetch('/api/workouts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_KEY}`
        },
        body: JSON.stringify(w)
      });
      setAllWorkouts(prev => [...prev, w]);
    } catch (e) {}
  };

  const deleteWorkout = async (id: number) => {
    try {
      await fetch(`/api/workouts?id=${id}`, { method: 'DELETE' });
      setAllWorkouts(prev => prev.filter(w => w.id !== id));
    } catch (e) {}
  };

  const clearPaymentPending = () => {
    localStorage.removeItem(PAYMENT_KEY);
    setPaymentPending(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, register, logout, activatePremium, removePremium,
      paymentPending, clearPaymentPending, allUsers, allWorkouts,
      addWorkout, deleteWorkout, messages, sendMessage
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth required');
  return ctx;
}
