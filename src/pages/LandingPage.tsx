interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage({ onLogin, onRegister }: Props) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[300px] h-[300px] bg-orange-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-orange-500/25 animate-pulse-slow">
            M
          </div>
          <span className="font-black text-xl tracking-tight">MotonX</span>
        </div>
        <button
          onClick={onLogin}
          className="px-5 py-2 text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
        >
          Войти
        </button>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-6 pt-12 pb-8 max-w-lg mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Новое в 2026</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none mb-4">
            TRAIN<br />
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              LIKE A
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              MONSTER
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-zinc-400 text-center text-base leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: '160ms' }}>
          Простые тренировки с умным таймером.<br />
          Без инвентаря. Без ерунды.
        </p>

        {/* CTA */}
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: '240ms' }}>
          <button
            onClick={onRegister}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-base rounded-2xl transition-all active:scale-[0.97] shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 group"
          >
            Начать бесплатно
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button
            onClick={onLogin}
            className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-semibold text-sm rounded-2xl transition-all active:scale-[0.97]"
          >
            У меня уже есть аккаунт
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-14 animate-fade-up" style={{ animationDelay: '320ms' }}>
          {[
            { v: '12', l: 'Тренировок' },
            { v: '6', l: 'PRO эксклюзив' },
            { v: '∞', l: 'Повторений' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">{s.v}</div>
              <div className="text-zinc-600 text-xs mt-1 font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section className="relative z-10 px-6 py-16 max-w-lg mx-auto">
        <div className="space-y-3">
          {[
            {
              emoji: '⏱',
              title: 'Умный таймер',
              desc: 'Автоматически переключает упражнения и передышки. Просто следуй за экраном.',
              color: 'from-blue-500/10 to-blue-600/5',
              border: 'border-blue-500/10',
            },
            {
              emoji: '📋',
              title: 'Чёткий план',
              desc: 'Каждая тренировка — это последовательность упражнений с таймером и отдыхом.',
              color: 'from-purple-500/10 to-purple-600/5',
              border: 'border-purple-500/10',
            },
            {
              emoji: '👑',
              title: 'PRO режим',
              desc: 'Хардкорные тренировки для тех, кто хочет выжать максимум. Интенсивность 100%.',
              color: 'from-orange-500/10 to-amber-500/5',
              border: 'border-orange-500/10',
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className={`bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-5 animate-fade-up`}
              style={{ animationDelay: `${400 + i * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-zinc-900/80 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                  {f.emoji}
                </div>
                <div>
                  <div className="font-bold text-base mb-1">{f.title}</div>
                  <div className="text-zinc-500 text-sm leading-relaxed">{f.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 pb-16 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: '640ms' }}>
        <button
          onClick={onRegister}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-base rounded-2xl transition-all active:scale-[0.97] shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 group"
        >
          Создать аккаунт бесплатно
          <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <p className="text-center text-zinc-600 text-xs mt-3">Это бесплатно. Всегда.</p>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-zinc-700 text-xs">
        © 2026 MotonX · Версия для Vercel
      </footer>
    </div>
  );
}