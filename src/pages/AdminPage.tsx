import { useState, useEffect, useRef } from 'react';
import { useAuth, ADMIN_KEY } from '../context/AuthContext';
import { Workout, WorkoutStep } from '../types';

export default function AdminPage() {
  const { user, login, allUsers, allWorkouts, activatePremium, removePremium, addWorkout, deleteWorkout, logout, messages, sendMessage } = useAuth();
  
  const [adminLogin, setAdminLogin] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'workouts' | 'support'>('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserChat, setSelectedUserChat] = useState<string | null>(null);
  const [adminReply, setAdminReply] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, selectedUserChat]);

  const chatUsers = Array.from(new Set((messages || []).map(m => m.from === 'Admin' ? m.to : m.from))).filter(u => u !== 'Admin');
  const currentChatMessages = (messages || []).filter(m => m.from === selectedUserChat || m.to === selectedUserChat);

  const [nw, setNw] = useState<Partial<Workout>>({
    title: '', description: '', level: 'Средний', category: 'Сила', premium: false, emoji: '⚡', steps: []
  });
  const [newStep, setNewStep] = useState<WorkoutStep>({ name: '', duration: 60, type: 'exercise' });

  // Security Gate UI
  if (!user?.isAdmin || !isAuthorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-mono">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-10 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,1)] relative overflow-hidden animate-scale-in">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
          
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-zinc-900 rounded-[20px] mb-6 border border-white/5 shadow-inner">
              <span className="text-4xl">🔐</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Terminal Access</h1>
            <p className="text-zinc-600 text-[9px] uppercase tracking-[0.5em] mt-2">Authorization Protocol 2.6.0</p>
          </div>
          
          <div className="space-y-4">
            {!user?.isAdmin && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={adminLogin}
                  onChange={(e) => setAdminLogin(e.target.value)}
                  placeholder="ADMIN_IDENTIFIER"
                  className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white font-mono text-xs tracking-wider outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-800"
                />
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="ENCRYPTION_PASS"
                  className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white font-mono text-xs tracking-wider outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-800"
                />
              </div>
            )}
            
            <div className="relative">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-full" />
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="SYSTEM_MASTER_KEY"
                className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-center text-orange-500 font-mono text-sm tracking-[0.3em] outline-none focus:border-orange-500/50 transition-all placeholder:text-zinc-800"
              />
            </div>
            
            <button
              onClick={() => {
                let ok = true;
                if (!user?.isAdmin) {
                  ok = login(adminLogin, adminPass);
                }
                if (ok && keyInput === ADMIN_KEY) {
                  setIsAuthorized(true);
                } else {
                  alert('AUTH_FAILURE: ACCESS DENIED');
                }
              }}
              className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-xl shadow-white/5 uppercase tracking-widest text-xs mt-4"
            >
              Start Session
            </button>
            
            <div className="pt-6 text-center border-t border-white/5 mt-6">
              <button 
                onClick={() => window.location.href = '/'} 
                className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em] hover:text-zinc-400 transition-colors"
              >
                ← Back to Matrix
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nw.title || (nw.steps?.length || 0) === 0) return alert('ERROR: Title or Steps missing');
    
    const workout: Workout = {
      ...nw as Workout,
      id: Date.now(),
      duration: `${Math.round((nw.steps?.reduce((acc, s) => acc + s.duration, 0) || 0) / 60)} мин`
    };
    
    addWorkout(workout);
    
    // Attempt to sync with MongoDB via API with Authorization
    fetch('/api/workouts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_KEY}`
      },
      body: JSON.stringify(workout)
    }).catch(() => console.log('Sync failed: Saved locally only'));

    setShowAddModal(false);
    setNw({ title: '', description: '', level: 'Средний', category: 'Сила', premium: false, emoji: '⚡', steps: [] });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono selection:bg-orange-500/30">
      {/* Admin Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-black border-r border-white/5 p-8 flex flex-col">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black text-black">M</div>
          <div>
            <div className="text-white font-black tracking-tighter text-lg uppercase">System</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Cloud Synced (Mongo)</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          {[
            { id: 'users', l: 'Пользователи', e: '👥' },
            { id: 'workouts', l: 'Тренировки', e: '🏋️' },
            { id: 'support', l: 'Поддержка', e: '💬' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-zinc-600 hover:text-white hover:bg-white/5'}`}
            >
              <span>{t.l}</span>
              <span>{t.e}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5">
            <button onClick={() => window.location.href = '/'} className="w-full mb-3 px-5 py-3 bg-zinc-900/50 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
              Go to Site
            </button>
            <button onClick={logout} className="w-full px-5 py-4 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
              Logout System
            </button>
        </div>
      </div>

      {/* Main Admin Content */}
      <main className="ml-72 p-12 max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-16 pb-8 border-b border-white/5">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 italic">
              {activeTab === 'users' ? 'User Management' : 'Content Engine'}
            </h1>
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em]">Accessing data cluster // Stable</p>
          </div>
          
          {activeTab === 'workouts' && (
            <div className="flex gap-4">
              <button
                onClick={async () => {
                  if (!confirm('Удалить ВСЕ тренировки из базы?')) return;
                  try {
                    // Удаляем все тренировки
                    for (const w of allWorkouts) {
                      await fetch(`/api/workouts?id=${w.id}`, { 
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${ADMIN_KEY}` }
                      });
                    }
                    alert('Все тренировки удалены!');
                    window.location.reload();
                  } catch (e) {
                    alert('Ошибка при удалении');
                  }
                }}
                className="px-6 py-4 bg-red-500 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-500/20"
              >
                🗑️ CLEAR_ALL
              </button>
              <button
                onClick={async () => {
                  if (!confirm('Загрузить начальные тренировки? Существующие с такими же ID будут заменены.')) return;
                  try {
                    const { workouts } = await import('../data/workouts');
                    
                    // Сначала удаляем все существующие
                    const res = await fetch('/api/workouts');
                    if (res.ok) {
                      const existing = await res.json();
                      for (const w of existing) {
                        await fetch(`/api/workouts?id=${w.id}`, { 
                          method: 'DELETE',
                          headers: { 'Authorization': `Bearer ${ADMIN_KEY}` }
                        });
                      }
                    }
                    
                    // Потом добавляем новые
                    for (const w of workouts) {
                      await addWorkout(w);
                    }
                    
                    alert(`${workouts.length} тренировок загружено в MongoDB!`);
                    window.location.reload();
                  } catch (e) {
                    alert('Ошибка при загрузке');
                  }
                }}
                className="px-6 py-4 bg-green-500 text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-500/20"
              >
                🔄 SEED_DB
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-8 py-4 bg-orange-500 text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20"
              >
                + NEW_PROGRAM
              </button>
            </div>
          )}
        </header>

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 px-8 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-600">
              <span>Identity</span>
              <span className="text-center">License</span>
              <span className="text-right">Operation</span>
            </div>
            {allUsers.map(u => (
              <div key={u.username} className="bg-zinc-950 border border-white/5 rounded-3xl p-6 flex items-center justify-between hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center font-black text-zinc-500 group-hover:text-white transition-colors">
                    {u.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-bold">{u.username}</div>
                    <div className="text-[9px] text-zinc-600 uppercase tracking-widest">User_ID: {u.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16)}</div>
                  </div>
                </div>
                
                <div className="text-center">
                  {u.isPremium ? (
                    <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black rounded-md border border-orange-500/20">PRO_ELITE</span>
                  ) : (
                    <span className="px-3 py-1 bg-zinc-900 text-zinc-700 text-[10px] font-bold rounded-md">BASIC_FREE</span>
                  )}
                </div>

                <div className="text-right">
                  <button
                    onClick={() => u.isPremium ? removePremium(u.username) : activatePremium(u.username)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      u.isPremium 
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
                        : 'bg-white text-black hover:bg-orange-500 shadow-xl shadow-white/5'
                    }`}
                  >
                    {u.isPremium ? 'Revoke Access' : 'Grant PRO'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'workouts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allWorkouts.map(w => (
              <div key={w.id} className="bg-zinc-950 border border-white/5 rounded-[32px] p-8 group hover:border-orange-500/30 transition-all">
                <div className="flex items-start justify-between mb-8">
                  <div className="text-4xl bg-black w-20 h-20 rounded-3xl flex items-center justify-center border border-white/5 shadow-inner">{w.emoji}</div>
                  <button 
                    onClick={() => deleteWorkout(w.id)}
                    className="w-12 h-12 bg-black text-zinc-800 hover:text-red-500 hover:bg-red-500/10 rounded-2xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                    🗑
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{w.title}</h3>
                  {w.premium && <span className="text-[9px] bg-orange-500 text-black px-2 py-0.5 rounded-md font-black">PRO</span>}
                </div>
                <p className="text-zinc-600 text-xs leading-relaxed mb-8 line-clamp-2">{w.description}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex gap-6">
                    <div>
                      <div className="text-white text-xs font-bold">{w.steps.length}</div>
                      <div className="text-zinc-700 text-[9px] font-black uppercase">Steps</div>
                    </div>
                    <div>
                      <div className="text-white text-xs font-bold">{w.duration}</div>
                      <div className="text-zinc-700 text-[9px] font-black uppercase">Est_Time</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-zinc-500 bg-zinc-900 px-3 py-1.5 rounded-xl uppercase tracking-widest">{w.level}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'support' && (
          <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
            {/* User List */}
            <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5 bg-black">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Активные диалоги</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {chatUsers.length === 0 ? (
                  <div className="p-8 text-center text-zinc-700 text-xs">Нет сообщений</div>
                ) : (
                  chatUsers.map(u => (
                    <button
                      key={u}
                      onClick={() => setSelectedUserChat(u)}
                      className={`w-full p-6 text-left border-b border-white/5 transition-all ${selectedUserChat === u ? 'bg-white/5' : 'hover:bg-white/[0.02]'}`}
                    >
                      <div className="font-bold text-white">{u}</div>
                      <div className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest">User Cluster</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat View */}
            <div className="lg:col-span-2 bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden flex flex-col">
              {selectedUserChat ? (
                <>
                  <div className="p-6 border-b border-white/5 bg-black flex justify-between items-center">
                    <h3 className="text-sm font-black text-white uppercase tracking-tighter italic">Диалог: {selectedUserChat}</h3>
                  </div>
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-8 space-y-4 custom-scroll">
                    {currentChatMessages.map(m => (
                      <div key={m.id} className={`flex ${m.from === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed ${
                          m.from === 'Admin' 
                            ? 'bg-orange-500 text-white rounded-tr-none' 
                            : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-white/5'
                        }`}>
                          <div className="font-black mb-1 opacity-50 uppercase text-[8px] tracking-widest">{m.from}</div>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form 
                    onSubmit={(e) => { 
                      e.preventDefault(); 
                      if(adminReply.trim()) { 
                        sendMessage(adminReply.trim(), selectedUserChat); 
                        setAdminReply(''); 
                      } 
                    }}
                    className="p-6 border-t border-white/5 bg-black"
                  >
                    <div className="flex gap-4">
                      <input 
                        value={adminReply}
                        onChange={e => setAdminReply(e.target.value)}
                        placeholder="Введите ответ..."
                        className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-orange-500 outline-none transition-all"
                      />
                      <button className="px-8 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all">
                        SEND
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-700">
                  <div className="text-4xl mb-4">💬</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em]">Выберите диалог для начала</div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modern Add Workout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-white/5 w-full max-w-3xl rounded-[48px] shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black">
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Initialize Content</h2>
              <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all">✕</button>
            </div>
            
            <form onSubmit={handleCreateWorkout} className="p-10 space-y-8 overflow-y-auto flex-1 custom-scroll">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block ml-1">Title_String</label>
                  <input required value={nw.title} onChange={e => setNw({...nw, title: e.target.value})} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-orange-500 outline-none transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block ml-1">Emoji_Icon</label>
                  <input required value={nw.emoji} onChange={e => setNw({...nw, emoji: e.target.value})} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-center text-2xl outline-none" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block ml-1">Meta_Description</label>
                <textarea required value={nw.description} onChange={e => setNw({...nw, description: e.target.value})} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white h-32 outline-none resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block ml-1">Intensity_Level</label>
                  <select value={nw.level} onChange={e => setNw({...nw, level: e.target.value})} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white outline-none">
                    <option>Легкий</option>
                    <option>Средний</option>
                    <option>Хардкор</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block ml-1">Access_Permission</label>
                  <div className="flex p-1 bg-black rounded-2xl border border-white/5">
                    <button type="button" onClick={() => setNw({...nw, premium: false})} className={`flex-1 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${!nw.premium ? 'bg-white text-black' : 'text-zinc-600'}`}>FREE_ID</button>
                    <button type="button" onClick={() => setNw({...nw, premium: true})} className={`flex-1 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${nw.premium ? 'bg-orange-500 text-black' : 'text-zinc-600'}`}>PRO_PRO</button>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 p-8 rounded-[40px] border border-white/5">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-6 text-center underline underline-offset-8">Sequence_Editor // {nw.steps?.length} Steps</label>
                
                <div className="space-y-3 mb-8">
                  {nw.steps?.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-zinc-900/30 px-6 py-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-zinc-700">{idx + 1}</span>
                        <span className="text-xs font-bold text-white uppercase italic">{s.name}</span>
                        <span className="text-[9px] text-zinc-600 font-black">({s.duration}S // {s.type === 'rest' ? 'REST' : 'WORK'})</span>
                      </div>
                      <button type="button" onClick={() => setNw({...nw, steps: nw.steps?.filter((_, i) => i !== idx)})} className="text-red-500 text-xs hover:scale-125 transition-transform">✕</button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <input placeholder="STEP_NAME" value={newStep.name} onChange={e => setNewStep({...newStep, name: e.target.value})} className="flex-1 bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] outline-none" />
                  <input type="number" value={newStep.duration} onChange={e => setNewStep({...newStep, duration: Number(e.target.value)})} className="w-20 bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] outline-none" />
                  <select value={newStep.type} onChange={e => setNewStep({...newStep, type: e.target.value as any})} className="bg-black border border-white/5 rounded-xl px-3 py-3 text-[10px] outline-none">
                    <option value="exercise">WORK</option>
                    <option value="rest">REST</option>
                  </select>
                  <button type="button" onClick={() => { if(newStep.name) { setNw(prev => ({ ...prev, steps: [...(prev.steps || []), newStep] })); setNewStep({ name: '', duration: 60, type: 'exercise' }); } }} className="px-5 bg-white text-black rounded-xl text-[10px] font-black hover:scale-105 transition-all">ADD</button>
                </div>
              </div>

              <button type="submit" className="w-full py-6 bg-white text-black font-black rounded-3xl hover:bg-zinc-200 transition-all shadow-2xl uppercase tracking-[0.5em] text-sm">
                Commit to System
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
