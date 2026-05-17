import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SupportChat() {
  const { user, messages, sendMessage } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const myMessages = messages.filter(m => m.from === user?.username || m.to === user?.username);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (user?.isAdmin) return null; // Admin has their own view

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {isOpen ? (
        <div className="w-80 h-[450px] bg-zinc-950 border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-5 border-b border-white/5 bg-gradient-to-r from-orange-500/20 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs">🤖</div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-white">Support</div>
                <div className="text-[10px] text-orange-500 font-bold">Online</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">✕</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
            {myMessages.length === 0 && (
              <div className="text-center py-10">
                <div className="text-2xl mb-2">👋</div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest leading-relaxed">Нужна помощь?<br/>Напиши нам!</p>
              </div>
            )}
            {myMessages.map(m => (
              <div key={m.id} className={`flex ${m.from === user?.username ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  m.from === user?.username 
                    ? 'bg-orange-500 text-white rounded-tr-none' 
                    : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); if(text.trim()) { sendMessage(text.trim()); setText(''); } }}
            className="p-4 border-t border-white/5 bg-black"
          >
            <div className="relative">
              <input 
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Сообщение..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-xs">
                ▲
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-orange-500/40 hover:scale-110 active:scale-95 transition-all animate-bounce-gentle"
        >
          💬
        </button>
      )}
    </div>
  );
}
