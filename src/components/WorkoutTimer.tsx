import { useState, useEffect, useRef } from 'react';
import { Workout } from '../types';

interface Props {
  workout: Workout;
  onClose: () => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function WorkoutTimer({ workout, onClose }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(workout.steps[0].duration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = workout.steps[stepIndex];
  const total = workout.steps.length;
  const progress = ((step.duration - timeLeft) / step.duration) * 100;
  const isRest = step.type === 'rest';
  const nextStep = stepIndex + 1 < total ? workout.steps[stepIndex + 1] : null;

  useEffect(() => {
    if (running && !done) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            if (stepIndex + 1 >= total) {
              setDone(true);
              setRunning(false);
            } else {
              const next = stepIndex + 1;
              setStepIndex(next);
              setTimeLeft(workout.steps[next].duration);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, done, stepIndex, total, workout.steps]);

  // Auto start
  useEffect(() => {
    const timer = setTimeout(() => setRunning(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (stepIndex + 1 >= total) {
      setDone(true);
      setRunning(false);
    } else {
      setStepIndex(s => s + 1);
      setTimeLeft(workout.steps[stepIndex + 1].duration);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6">
        <div className="text-7xl mb-6">🏆</div>
        <h1 className="text-4xl font-black tracking-tight">ГОТОВО</h1>
        <p className="text-zinc-500 mt-2 mb-10">{workout.title} завершена</p>
        <button onClick={onClose} className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl btn-press">
          На главную
        </button>
      </div>
    );
  }

  const color = isRest ? '#3b82f6' : '#f97316';

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={onClose} className="text-zinc-500 text-sm hover:text-white transition-colors">
          ✕
        </button>
        <span className="text-sm font-semibold text-zinc-400">{stepIndex + 1}/{total}</span>
        <div className="w-10" />
      </div>

      {/* Progress */}
      <div className="px-6 mb-8">
        <div className="flex gap-1">
          {workout.steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${i < stepIndex ? 'bg-orange-500' : i === stepIndex ? color : 'bg-zinc-800'}`}
            />
          ))}
        </div>
      </div>

      {/* Step label */}
      <div className="px-6 mb-6">
        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
          isRest ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'
        }`}>
          {isRest ? 'Отдых' : 'Упражнение'}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h2 className="text-2xl font-black text-center mb-10 leading-tight">{step.name}</h2>

        {/* Circle timer */}
        <div className="relative w-56 h-56 mb-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#18181b" strokeWidth="5" />
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setRunning(!running)}
            className={`w-16 h-16 rounded-full font-black text-2xl flex items-center justify-center transition-all btn-press shadow-lg ${
              running ? 'bg-zinc-800 text-white' : `${isRest ? 'bg-blue-500' : 'bg-orange-500'} text-white`
            }`}
          >
            {running ? '⏸' : '▶'}
          </button>
          <button onClick={handleSkip} className="text-zinc-500 text-sm font-medium hover:text-white transition-colors">
            Пропустить →
          </button>
        </div>
      </div>

      {/* Next step */}
      {nextStep && (
        <div className="px-6 pb-8">
          <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-zinc-500 text-xs">Следующее</span>
            <span className="text-sm font-medium">{nextStep.name}</span>
            <span className="text-zinc-500 text-xs">{formatTime(nextStep.duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
}