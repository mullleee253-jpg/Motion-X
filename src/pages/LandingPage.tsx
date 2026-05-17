interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage({ onLogin, onRegister }: Props) {
  const handleAdminSecret = () => {
    window.location.href = '/admin';
  };

  const categories = [
    { t: 'Сила', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400' },
    { t: 'Йога', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400' },
    { t: 'Кардио', img: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=400' },
    { t: 'HIIT', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="min-h-screen bg-mesh text-white selection:bg-orange-500/30 overflow-x-hidden">
      {/* Invisible Admin Trigger */}
      <div 
        onClick={handleAdminSecret}
        className="fixed bottom-4 right-4 w-4 h-4 bg-transparent cursor-default z-[999]"
      />

      {/* Modern Floating Header */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-5xl glass-card rounded-[24px] px-6 py-4 flex items-center justify-between border-white/10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(249,115,22,0.5)]">M</div>
          <span className="text-xl font-black tracking-tighter uppercase">MotonX</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={onLogin} className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors px-4">Вход</button>
          <button 
            onClick={onRegister}
            className="px-5 py-2.5 bg-white text-black text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
          >
            Начать
          </button>
        </div>
      </nav>

      {/* Hero: Next Gen */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Global Training System 2.6</span>
            </div>

            <h1 className="text-7xl md:text-[120px] font-black leading-[0.8] tracking-tighter uppercase">
              ТВОЙ <br/>
              <span className="text-stroke">ПРЕДЕЛ</span> <br/>
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">ОТСУТСТВУЕТ</span>
            </h1>

            <p className="max-w-md text-zinc-500 text-lg font-medium leading-relaxed">
              Ультимативная платформа для трансформации тела. 
              Умные алгоритмы, хардкорные программы и 
              нулевой порог входа.
            </p>

            <div className="flex items-center gap-6 pt-4">
              <button 
                onClick={onRegister}
                className="group relative px-10 py-5 bg-orange-500 text-white font-black rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
              >
                <span className="relative z-10 flex items-center gap-3 uppercase tracking-widest">
                  Создать аккаунт
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
              
              <div className="hidden sm:flex -space-x-3">
                {[1, 2, 3, 4].map(_idx => (
                  <div key={_idx} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                    {_idx === 4 ? '+5k' : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="relative z-10 aspect-square rounded-[60px] overflow-hidden border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent" />
              <img 
                src="/hero-bg.jpg" 
                className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700"
                alt="Athlete"
              />
              <div className="absolute bottom-8 left-8 right-8 glass-card p-6 rounded-3xl border-white/5">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-black uppercase text-orange-500 mb-1">Live Training</div>
                    <div className="text-xl font-black">300 СПАРТАНЦЕВ</div>
                  </div>
                  <div className="text-2xl animate-pulse">🔥</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </section>

      {/* Infinite Scroll Line */}
      <div className="py-12 border-y border-white/5 bg-white/[0.02] overflow-hidden whitespace-nowrap flex select-none">
        {[1, 2, 3, 4].map(_i => (
          <div key={_i} className="flex items-center gap-12 px-6 animate-pulse">
            <span className="text-5xl font-black text-stroke uppercase">Power</span>
            <span className="text-5xl font-black uppercase text-zinc-800 italic">MotonX</span>
            <span className="text-5xl font-black text-stroke uppercase">Endurance</span>
            <span className="text-5xl font-black uppercase text-zinc-800 italic">Elite</span>
            <span className="text-5xl font-black text-stroke uppercase">Victory</span>
          </div>
        ))}
      </div>

      {/* Features Showcase */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Почему выбирают нас</h2>
          <p className="text-zinc-500 max-w-xl mx-auto font-medium">Мы объединили передовые технологии и опыт профессиональных тренеров, чтобы создать идеальный инструмент.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Adaptive Timer',
              desc: 'Таймер, который подстраивается под твой ритм и прогресс.',
              icon: '⏱️',
              color: 'border-orange-500/20'
            },
            {
              title: 'Pro Analytics',
              desc: 'Глубокая статистика каждого повторения и сжженых калорий.',
              icon: '📊',
              color: 'border-blue-500/20'
            },
            {
              title: 'Elite Club',
              desc: 'Доступ в закрытое комьюнити сильнейших атлетов планеты.',
              icon: '👑',
              color: 'border-purple-500/20'
            }
          ].map((f, i) => (
            <div 
              key={f.title} 
              className={`p-10 rounded-[40px] border glass-card hover:-translate-y-2 transition-all duration-500 group ${f.color} animate-fade-up`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Training Categories Preview */}
      <section className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-4">
          {categories.map((c, _i) => (
            <div key={c.t} className={`relative rounded-[32px] overflow-hidden group cursor-pointer h-80 animate-fade-up`} style={{ animationDelay: `${_i * 100}ms` }}>
              <img src={c.img} alt={c.t} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6">
                <div className="text-2xl font-black uppercase italic tracking-tighter">{c.t}</div>
                <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">Explore Programs</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto glass-card rounded-[60px] p-12 md:p-24 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 to-transparent -z-10" />
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
            ГОТОВ <br/> <span className="text-stroke">ДОМИНИРОВАТЬ?</span>
          </h2>
          <button 
            onClick={onRegister}
            className="px-12 py-6 bg-white text-black font-black rounded-2xl hover:bg-orange-500 hover:text-white transition-all duration-300 uppercase tracking-[0.2em]"
          >
            Начать бесплатно
          </button>
        </div>
      </section>

      {/* Footer: Ultra Modern */}
      <footer className="py-20 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center font-black text-xs text-orange-500">M</div>
              <span className="text-xl font-black tracking-tighter uppercase">MotonX</span>
            </div>
            <p className="text-zinc-600 text-xs max-w-xs uppercase tracking-widest leading-loose">The most powerful training platform of 2026. Built for those who never settle.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <div className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-6">Product</div>
              <ul className="space-y-3 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <li className="hover:text-orange-500 cursor-pointer">Workouts</li>
                <li className="hover:text-orange-500 cursor-pointer">PRO Plan</li>
                <li className="hover:text-orange-500 cursor-pointer">Timer</li>
              </ul>
            </div>
            <div>
              <div className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-6">Company</div>
              <ul className="space-y-3 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <li className="hover:text-orange-500 cursor-pointer">About</li>
                <li className="hover:text-orange-500 cursor-pointer">Careers</li>
                <li className="hover:text-orange-500 cursor-pointer">Support</li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-6">Social</div>
              <div className="flex gap-4 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-zinc-500 hover:border-orange-500/50 hover:text-white transition-all cursor-pointer">IG</div>
                <div className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-zinc-500 hover:border-orange-500/50 hover:text-white transition-all cursor-pointer">X</div>
                <div className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-zinc-500 hover:border-orange-500/50 hover:text-white transition-all cursor-pointer">YT</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 text-center text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em]">
          Powered by Vercel & MongoDB Atlas // 2026 MotonX Systems
        </div>
      </footer>
    </div>
  );
}