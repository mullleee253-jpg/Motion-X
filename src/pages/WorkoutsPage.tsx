import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { workouts } from '../data/workouts';
import { Workout } from '../types';
import WorkoutTimer from '../components/WorkoutTimer';

const PAYMENT_URL = 'https://dalink.to/mull12312312312';

type Tab = 'free' | 'pro';

export default function WorkoutsPage() {
  const { user, logout, activatePremium, paymentPending, clearPaymentPending } = useAuth();
  const [tab, setTab] = useState<Tab>('free');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const freeWorkouts = workouts.filter(w => !w.premium);
  const proWorkouts = workouts.filter(w => w.premium);
  const list = tab === 'free' ? freeWorkouts : proWorkouts;

  const handlePayment = () => {
    window.location.href = PAYMENT_URL;
  };

  if (paymentPending) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-zinc-800 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-500 animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-lg animate-bounce">
            ⏳
          </div>
        </div>
        <h1 className="text-3xl font-black mb-2">Ожидание подтверждения</h1>
        <p className="text-zinc-400 text-center max-w-xs leading-relaxed mb-2">
          Оплата обрабатывается. Обычно это занимает 1-5 минут.
        </p>
        <p className="text-zinc-500 text-sm text-center max-w-xs mb-10">
          После подтверждения нажми кнопку ниже 👇
        </p>
        <button
          onClick={() => { activatePremium(); clearPaymentPending(); }}
          className="px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/20"
        >
          Проверить оплату
        </button>
        <button
          onClick={clearPaymentPending}
          className="mt-4 text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
        >
          Отмена
        </button>
      </div>
    );
  }

  if (selectedWorkout) {
    return <WorkoutTimer workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />;
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5">
          <button onClick={() => setShowPayment(false)} className="text-zinc-400 hover:text-white transition-colors">
            ← Назад
          </button>
          <span className="font-bold text-sm">PRO доступ</span>
          <div className="w-12" />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-lg shadow-orange-500/30">
            👑
          </div>
          <h1 className="text-3xl font-black mb-2">Активировать PRO</h1>
          <p className="text-zinc-400 mb-8 max-w-xs leading-relaxed">
            Получи доступ ко всем тренировкам и настройкам
          </p>

          <div className="w-full max-w-xs space-y-3 mb-8">
            {[
              '6 эксклюзивных тренировок',
              'Расширенные настройки',
              'Приоритетная поддержка',
              'Без ограничений',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3">
                <div className="w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 text-xs font-bold">✓</div>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handlePayment}
            className="w-full max-w-xs py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-lg rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/25"
          >
            Оплатить 299₽
          </button>

          <p className="text-zinc-600 text-xs mt-4">
            Безопасная оплата через dalink
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-orange-500/20">M</div>
          <span className="font-black text-lg tracking-tight">MotonX</span>
        </div>
        <div className="flex items-center gap-3">
          {user?.isPremium ? (
            <span className="text-xs font-black px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-lg shadow-lg shadow-orange-500/20">👑 PRO</span>
          ) : (
            <button
              onClick={() => setShowPayment(true)}
              className="text-xs font-bold px-3 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-all"
            >
              PRO
            </button>
          )}
          <button onClick={logout} className="text-zinc-500 text-sm hover:text-white transition-colors">Выйти</button>
        </div>
      </header>

      {/* Greeting */}
      <div className="px-6 pt-6 pb-2">
        <p className="text-zinc-500 text-sm">
          Привет, <span className="text-white font-semibold">{user?.username}</span>
          <span className="ml-2">👋</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 pt-4 pb-6">
        <button
          onClick={() => setTab('free')}
          className={`px-5 py-2.5 text-sm font-bold rounded-2xl transition-all ${
            tab === 'free'
              ? 'bg-white text-black shadow-lg shadow-white/10'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
          }`}
        >
          Бесплатные
        </button>
        <button
          onClick={() => setTab('pro')}
          className={`px-5 py-2.5 text-sm font-bold rounded-2xl transition-all flex items-center gap-1.5 ${
            tab === 'pro'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
          }`}
        >
          PRO 👑
        </button>
      </div>

      {/* Workout list */}
      <div className="px-6 pb-32 space-y-3">
        {list.map((workout, i) => {
          const isLocked = workout.premium && !user?.isPremium;
          return (
            <button
              key={workout.id}
              onClick={() => !isLocked && setSelectedWorkout(workout)}
              disabled={isLocked}
              className={`w-full text-left rounded-2xl p-5 border transition-all active:scale-[0.98] group ${
                isLocked
                  ? 'bg-zinc-900/50 border-zinc-800/50 opacity-60 cursor-not-allowed'
                  : 'bg-zinc-900 border-zinc-800/80 hover:border-orange-500/40 hover:bg-zinc-900/80'
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* Emoji box */}
                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform ${isLocked ? '' : 'group-hover:scale-110'}`}
                  style={{ background: workout.premium ? 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(245,158,11,0.05))' : '#27272a' }}
                >
                  {workout.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base">{workout.title}</span>
                    {workout.premium && (
                      <span className="text-xs font-bold px-2 py-0.5 bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/20 rounded-lg">PRO</span>
                    )}
                  </div>
                  <div className="text-zinc-500 text-xs flex items-center gap-3">
                    <span className="flex items-center gap-1">⏱ {workout.duration}</span>
                    <span className="flex items-center gap-1">{workout.level === 'Легкий' ? '🟢' : workout.level === 'Средний' ? '🟡' : '🔴'} {workout.level}</span>
                    <span>{workout.category}</span>
                  </div>
                </div>

                {isLocked ? (
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center text-lg shrink-0">
                    🔒
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    →
                  </div>
                )}
              </div>

              {isLocked && (
                <div className="mt-3 pt-3 border-t border-zinc-800/50 flex items-center gap-2 text-orange-400/70 text-xs font-medium">
                  <span>🔒</span> Открой с PRO доступом
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* PRO CTA (free tab) */}
      {!user?.isPremium && tab === 'free' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
          <button
            onClick={() => setShowPayment(true)}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-base rounded-2xl transition-all active:scale-95 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3"
          >
            <span>👑</span> Открыть PRO — 299₽
          </button>
        </div>
      )}
    </div>
  );
}