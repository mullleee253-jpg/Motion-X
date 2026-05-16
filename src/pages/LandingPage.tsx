interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage({ onLogin, onRegister }: Props) {
  return (
    <div className="min-h-screen bg-mesh text-white selection:bg-orange-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center font-black text-lg shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:rotate-12 transition-transform">M</div>
          <span className="text-2xl font-black tracking-tighter">MotonX</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Войти</button>
          <button onClick={onRegister} className="px-6 py-2.5 bg-white text-black text-sm font-black rounded-xl hover:bg-zinc-200 transition-all active:scale-95">ПОПРОБОВАТЬ</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6 flex flex-col items-center">
        {/* Decorative elements */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Доступно обновление 2026</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] animate-fade-up" style={{ animationDelay: '100ms' }}>
            ТВОЁ ТЕЛО — <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600">ТВОЙ ПРОЕКТ</span>
          </h1>

          <p className="max-w-xl mx-auto text-zinc-400 text-lg md:text-xl font-medium leading-relaxed animate-fade-up" style={{ animationDelay: '200ms' }}>
            Профессиональные тренировки с адаптивным таймером. <br className="hidden md:block"/>
            Без лишнего шума. Только результат.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <button 
              onClick={onRegister}
              className="px-12 py-5 btn-premium text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 group"
            >
              НАЧАТЬ ТРЕНИРОВКУ
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Floating Mockup (Visual decoration) */}
        <div className="mt-24 w-full max-w-5xl animate-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="relative aspect-video rounded-[40px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-500/40 animate-pulse">
                <span className="text-4xl">⚡</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { v: '150K+', l: 'Атлетов' },
            { v: '12', l: 'Программ' },
            { v: '4.9', l: 'Рейтинг' },
            { v: '2026', l: 'Версия' },
          ].map((s, i) => (
            <div key={s.l} className="animate-fade-up" style={{ animationDelay: `${500 + i * 100}ms` }}>
              <div className="text-4xl font-black mb-1">{s.v}</div>
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { t: 'Умный таймер', d: 'Сам считает время подходов и отдыха.', e: '⏱' },
            { t: 'PRO Контент', d: 'Эксклюзивные программы от монстров спорта.', e: '👑' },
            { t: 'Простой старт', d: 'Никаких сложных настроек. Просто нажми Play.', e: '🚀' },
          ].map((f, i) => (
            <div 
              key={f.t} 
              className="card-premium p-8 rounded-[32px] hover:border-orange-500/30 transition-all group animate-fade-up"
              style={{ animationDelay: `${700 + i * 100}ms` }}
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{f.e}</div>
              <h3 className="text-xl font-black mb-3">{f.t}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto card-premium p-12 md:p-20 rounded-[48px] text-center space-y-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">ГОТОВ ПРИНЯТЬ <br/> ВЫЗОВ?</h2>
          <button 
            onClick={onRegister}
            className="px-12 py-5 bg-white text-black font-black text-lg rounded-2xl hover:bg-zinc-200 transition-all active:scale-95"
          >
            ЗАРЕГИСТРИРОВАТЬСЯ БЕСПЛАТНО
          </button>
        </div>
      </section>

      <footer className="py-12 text-center text-zinc-600 text-xs border-t border-white/5 uppercase tracking-[0.3em]">
        © 2026 MotonX Systems · Vercel Engine
      </footer>
    </div>
  );
}