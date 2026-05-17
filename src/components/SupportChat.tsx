import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SupportChat() {
  const { user, messages, sendMessage } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const myMessages = messages.filter(m => m.from === user?.username || m.to === user?.username);

  // Авто-скролл вниз при новых сообщениях
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!user || user.isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {isOpen ? (
        <div className="w-80 h-[500px] bg-zinc-950 border border-white/10 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-5 border-b border-white/5 bg-gradient-to-r from-orange-500/20 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">🤖</div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-white">MotonX Support</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <div className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Online Now</div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scroll bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent)]">
            {myMessages.length === 0 && (
              <div className="text-center py-12 px-6">
                <div className="text-4xl mb-4">🏋️‍♂️</div>
                <p className="text-white font-black text-sm uppercase tracking-tighter mb-2">Привет, {user.username}!</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest leading-relaxed">Есть вопросы по программе или оплате? Пиши, мы поможем!</p>
              </div>
            )}
            {myMessages.map(m => (
              <div key={m.id} className={`flex flex-col ${m.from === user?.username ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.from === user?.username 
                    ? 'bg-orange-500 text-white rounded-tr-none shadow-lg shadow-orange-500/20' 
                    : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-white/5'
                }`}>
                  {m.text}
                </div>
                <span className="text-[8px] text-zinc-600 mt-1 uppercase font-bold px-1">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={(e) => { e.preventDefault(); if(text.trim()) { sendMessage(text.trim()); setText(''); } }}
            className="p-5 border-t border-white/5 bg-black/40 backdrop-blur-md"
          >
            <div className="relative flex items-center gap-2">
              <input 
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Напишите нам..."
                className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-orange-500 outline-none transition-all placeholder:text-zinc-700"
              />
              <button 
                type="submit"
                className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white hover:bg-orange-400 active:scale-90 transition-all shadow-lg shadow-orange-500/20"
              >
                <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-orange-500 rounded-[24px] flex items-center justify-center text-3xl shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all animate-bounce-gentle overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10">💬</span>
          {/* Уведомление (если есть новые сообщения) */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full border-4 border-orange-500 animate-pulse" />
        </button>
      )}
    </div>
  );
}
