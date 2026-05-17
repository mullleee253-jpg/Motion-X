import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Workout } from '../types';
import WorkoutTimer from '../components/WorkoutTimer';

const PAYMENT_URL = 'https://dalink.to/mull12312312312';

export default function WorkoutsPage() {
  const { user, logout, activatePremium, paymentPending, clearPaymentPending, allWorkouts } = useAuth();
  const [tab, setTab] = useState<'free' | 'standard' | 'pro'>('free');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // Определяем уровень доступа пользователя
  const userTier = user?.subscriptionTier || (user?.isPremium ? 'pro' : 'free');
  
  // Фильтруем тренировки по табу
  const list = allWorkouts.filter(w => {
    const workoutTier = w.tier || (w.premium ? 'pro' : 'free');
    
    if (tab === 'free') {
      return workoutTier === 'free';
    }
    if (tab === 'standard') {
      return workoutTier === 'free' || workoutTier === 'standard';
    }
    if (tab === 'pro') {
      return true; // Показываем все
    }
    return false;
  });

  if (selectedWorkout) {
    return <WorkoutTimer workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center font-black text-sm">M</div>
          <span className="font-black text-xl tracking-tighter">MotonX</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-black uppercase text-zinc-500 tracking-widest">
              {user?.subscriptionTier === 'pro' ? 'PRO Member' : user?.subscriptionTier === 'standard' ? 'Standard Member' : user?.isPremium ? 'PRO Member' : 'Free Plan'}
            </div>
            <div className="text-sm font-bold">{user?.username}</div>
          </div>
          <button onClick={logout} className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-zinc-800 transition-all text-sm">✕</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Payment Pending Banner */}
        {paymentPending && (
          <div className="mb-12 card-premium p-8 rounded-[32px] border-orange-500/30 flex flex-col md:flex-row items-center gap-8 animate-fade-up">
            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center text-3xl animate-bounce">⏳</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black mb-1 italic uppercase">Ожидайте! Скоро всё будет...</h3>
              <p className="text-zinc-500 text-sm">Мы проверяем вашу оплату. Это займет пару минут. Приготовься к хардкору!</p>
            </div>
            <button 
              onClick={() => { activatePremium(); clearPaymentPending(); }}
              className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition-all"
            >
              ПРОВЕРИТЬ СЕЙЧАС
            </button>
          </div>
        )}

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-2">ТРЕНИРОВКИ</h1>
            <p className="text-zinc-500 font-medium">Выбери свою программу на сегодня</p>
          </div>
          
          <div className="flex p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5">
            <button 
              onClick={() => setTab('free')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${tab === 'free' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
            >
              БЕСПЛАТНЫЕ
            </button>
            <button 
              onClick={() => setTab('standard')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${tab === 'standard' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500 hover:text-white'}`}
            >
              STANDARD 💎
            </button>
            <button 
              onClick={() => setTab('pro')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${tab === 'pro' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-zinc-500 hover:text-white'}`}
            >
              PRO 👑
            </button>
          </div>
        </div>

        {/* Workout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map((w, i) => {
            // Проверяем доступ по тарифу
            const workoutTier = w.tier || (w.premium ? 'pro' : 'free');
            const locked = 
              (workoutTier === 'standard' && userTier === 'free') || 
              (workoutTier === 'pro' && (userTier === 'free' || userTier === 'standard'));
            
            return (
              <div 
                key={w.id}
                className="group relative"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`card-premium p-6 rounded-[32px] h-full transition-all flex flex-col ${locked ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-orange-500/40 hover:-translate-y-1'}`}>
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-zinc-950 rounded-[24px] border border-white/10 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                      {w.emoji}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-black bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest text-zinc-400">
                        {w.level}
                      </span>
                      {w.premium && <span className="text-[10px] font-black bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full uppercase tracking-widest text-orange-500">Premium</span>}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-2 tracking-tight">{w.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-8 flex-1">{w.description}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-600 uppercase">Время</span>
                        <span className="text-xs font-bold text-zinc-300">{w.duration}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-600 uppercase">Шагов</span>
                        <span className="text-xs font-bold text-zinc-300">{w.steps.length}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedWorkout(w)}
                      className="px-6 py-2.5 bg-white text-black text-xs font-black rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
                    >
                      START
                    </button>
                  </div>

                  {locked && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-[32px]">
                      <div className="text-4xl mb-4">🔒</div>
                      <span className="text-xs font-black uppercase tracking-widest bg-orange-500 text-white px-4 py-2 rounded-xl">
                        {workoutTier === 'standard' ? 'Unlock with STANDARD' : 'Unlock with PRO'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Cards */}
        {!user?.isPremium && (
          <div className="mt-20 space-y-6">
            {/* Standard Tier */}
            <div className="card-premium p-10 rounded-[40px] bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
              <div className="max-w-md">
                <h2 className="text-3xl font-black tracking-tighter mb-3 italic uppercase">MotonX Standard 💎</h2>
                <p className="text-zinc-400 text-base leading-relaxed mb-5">30 программ и базовая аналитика для серьезных тренировок.</p>
                <ul className="grid grid-cols-2 gap-2.5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <li>✓ 30 тренировок</li>
                  <li>✓ Базовая аналитика</li>
                  <li>✓ Без рекламы</li>
                  <li>✓ Поддержка 24/7</li>
                </ul>
              </div>
              <button 
                onClick={() => window.location.href = PAYMENT_URL + '?tier=standard&payment=pending'}
                className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-black text-lg rounded-2xl shadow-2xl shadow-blue-500/30 whitespace-nowrap active:scale-95 transition-all"
              >
                UPGRADE — 299₽
              </button>
            </div>

            {/* Pro Tier */}
            <div className="card-premium p-12 rounded-[48px] bg-gradient-to-br from-orange-500/20 to-transparent border-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
              <div className="max-w-md">
                <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">MotonX PRO 👑</h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-6">50+ эксклюзивных программ, персональные рекомендации и приоритетная поддержка.</p>
                <ul className="grid grid-cols-2 gap-3 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-8">
                  <li>✓ 50+ тренировок</li>
                  <li>✓ Эксклюзивные программы</li>
                  <li>✓ Персональные рекомендации</li>
                  <li>✓ Приоритетная поддержка</li>
                  <li>✓ Расширенная статистика</li>
                  <li>✓ Кастомные таймеры</li>
                </ul>
              </div>
              <button 
                onClick={() => window.location.href = PAYMENT_URL + '?tier=pro&payment=pending'}
                className="px-12 py-5 btn-premium text-white font-black text-xl rounded-2xl shadow-2xl shadow-orange-500/30 whitespace-nowrap active:scale-95 transition-all"
              >
                UPGRADE — 399₽
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}