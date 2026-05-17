import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  mode: 'login' | 'register';
  onSuccess: () => void;
  onBack: () => void;
  onSwitch: (mode: 'login' | 'register') => void;
}

export default function AuthPage({ mode, onSuccess, onBack, onSwitch }: Props) {
  const { login, register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) { setError('Введи логин'); return; }
    if (password.length < 4) { setError('Минимум 4 символа'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    
    try {
      if (mode === 'login') {
        if (!login(username.trim(), password)) { 
          setError('Неверный логин или пароль'); 
          setLoading(false); 
          return; 
        }
      } else {
        const success = await register(username.trim(), password);
        if (!success) { 
          setError('Логин занят или ошибка сервера'); 
          setLoading(false); 
          return; 
        }
      }
      onSuccess();
    } catch (err) {
      setError('Ошибка соединения');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-sm">Назад</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-orange-500/25">M</div>
          <span className="font-black text-base tracking-tight">MotonX</span>
        </div>
        <div className="w-16" />
      </header>

      {/* Content */}
      <div className="flex-1 px-6 max-w-sm mx-auto w-full pt-10 flex flex-col">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight leading-none">
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            {mode === 'login' ? 'С возвращением, атлет!' : 'Создай аккаунт за 10 секунд'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 flex-1">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider pl-1">Логин</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="твой_логин"
              autoComplete="username"
              className="w-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-orange-500 rounded-2xl px-4 py-4 text-white text-base placeholder-zinc-600 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider pl-1">Пароль</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                className="w-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-orange-500 rounded-2xl px-4 py-4 text-white text-base placeholder-zinc-600 outline-none transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPass ? '👁' : '👁‍🗨'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3.5">
              <span className="text-red-400 text-sm font-medium flex items-center gap-2">
                <span>⚠️</span> {error}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-2xl transition-all active:scale-[0.97] shadow-lg shadow-orange-500/20 mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Проверяем...
              </span>
            ) : (
              mode === 'login' ? 'Войти' : 'Создать аккаунт'
            )}
          </button>
        </form>

        {/* Switch */}
        <div className="mt-8 pb-10 text-center">
          <span className="text-zinc-500 text-sm">
            {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          </span>
          <button
            onClick={() => onSwitch(mode === 'login' ? 'register' : 'login')}
            className="text-orange-500 font-semibold text-sm hover:text-orange-400 transition-colors"
          >
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}