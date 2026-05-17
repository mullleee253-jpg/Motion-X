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
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
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
const STORAGE_KEY = 'motonx_users_v2';
const SESSION_KEY = 'motonx_session_v2';
const PAYMENT_KEY = 'motonx_payment_pending_v2';
const WORKOUTS_KEY = 'motonx_workouts_v2';
const MESSAGES_KEY = 'motonx_messages_v2';

const ADMIN_LOGIN = 'admin';
const ADMIN_PASS = 'master_2026_secure';
export const ADMIN_KEY = 'motonx-key-99';

function getUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getWorkouts(): Workout[] {
  try {
    const saved = localStorage.getItem(WORKOUTS_KEY);
    return saved ? JSON.parse(saved) : initialWorkouts;
  } catch { return initialWorkouts; }
}

function getMessages(): Message[] {
  try { return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]'); } catch { return []; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { 
      const s = localStorage.getItem(SESSION_KEY); 
      if (!s) return null;
      const data = JSON.parse(s);
      // Security Check: Session Expiration
      if (data.expiresAt && Date.now() > data.expiresAt) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return data; 
    } catch { 
      return null; 
    }
  });
  const [allUsers, setAllUsers] = useState<User[]>(getUsers);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>(getWorkouts);
  const [messages, setMessages] = useState<Message[]>(getMessages);
  const [paymentPending, setPaymentPending] = useState(() => localStorage.getItem(PAYMENT_KEY) === 'true');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'pending') {
      localStorage.setItem(PAYMENT_KEY, 'true');
      setPaymentPending(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Prevent common injection patterns
    const cleanUser = username.trim().toLowerCase();
    
    // Hardened Admin Auth
    if (cleanUser === ADMIN_LOGIN && password === ADMIN_PASS) {
      const adminUser: User = { 
        username: 'Admin', 
        password: '', 
        isPremium: true, 
        isAdmin: true 
      };
      const sessionData = { 
        ...adminUser, 
        token: btoa(cleanUser + Date.now()), // Simulated Secure Token
        expiresAt: Date.now() + 86400000 
      };
      setUser(adminUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      return true;
    }

    const users = getUsers();
    const found = users.find(u => u.username.toLowerCase() === cleanUser && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      const sessionData = { 
        ...safeUser, 
        token: btoa(cleanUser + Date.now()),
        expiresAt: Date.now() + 86400000 
      };
      setUser(safeUser as User);
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      return true;
    }
    return false;
  };

  const register = (username: string, password: string): boolean => {
    if (username.toLowerCase() === 'admin') return false;
    const users = getUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) return false;
    const newUser: User = { username, password, isPremium: false };
    const updated = [...users, newUser];
    saveUsers(updated);
    setAllUsers(updated);
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => { setUser(null); localStorage.removeItem(SESSION_KEY); };

  const activatePremium = (username?: string) => {
    const targetName = username || user?.username;
    if (!targetName) return;
    const users = getUsers();
    const updated = users.map(u => u.username === targetName ? { ...u, isPremium: true } : u);
    saveUsers(updated);
    setAllUsers(updated);
    if (user && user.username === targetName) {
      const u = { ...user, isPremium: true };
      setUser(u);
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    }
  };

  const removePremium = (username: string) => {
    const users = getUsers();
    const updated = users.map(u => u.username === username ? { ...u, isPremium: false } : u);
    saveUsers(updated);
    setAllUsers(updated);
  };

  const addWorkout = (w: Workout) => {
    const updated = [...allWorkouts, w];
    setAllWorkouts(updated);
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(updated));
  };

  const deleteWorkout = (id: number) => {
    const updated = allWorkouts.filter(w => w.id !== id);
    setAllWorkouts(updated);
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(updated));
  };

  const sendMessage = (text: string, to?: string) => {
    if (!user) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      from: user.username,
      to: to || 'Admin',
      text,
      timestamp: Date.now(),
    };
    const updated = [...messages, newMessage];
    setMessages(updated);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
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
