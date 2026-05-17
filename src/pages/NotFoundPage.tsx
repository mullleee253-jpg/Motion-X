export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-32 h-32 bg-orange-500/10 rounded-full flex items-center justify-center text-6xl mb-8 animate-pulse">
        🚫
      </div>
      <h1 className="text-6xl font-black mb-4 uppercase italic tracking-tighter">404</h1>
      <p className="text-zinc-500 text-lg max-w-xs mb-10 uppercase tracking-widest font-bold">
        Объект не найден в системе MotonX
      </p>
      <button 
        onClick={() => window.location.href = '/'}
        className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest"
      >
        Вернуться в базу
      </button>
    </div>
  );
}
