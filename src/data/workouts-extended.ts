import { Workout } from '../types';

// Реальные упражнения для каждого уровня
const exercises = {
  free: [
    { name: 'Приседания x20', duration: 180 },
    { name: 'Отжимания x15', duration: 120 },
    { name: 'Планка 60 сек', duration: 60 },
    { name: 'Выпады x16', duration: 180 },
    { name: 'Скручивания x25', duration: 120 },
    { name: 'Бег на месте', duration: 180 },
    { name: 'Прыжки x30', duration: 120 },
    { name: 'Растяжка ног', duration: 180 },
    { name: 'Подъёмы на носки x30', duration: 120 },
    { name: 'Наклоны вперёд', duration: 120 },
    { name: 'Круговые движения руками', duration: 120 },
    { name: 'Ходьба на месте', duration: 180 },
  ],
  standard: [
    { name: 'Бёрпи x15', duration: 240 },
    { name: 'Высокие колени x40', duration: 180 },
    { name: 'Скалолаз x30', duration: 180 },
    { name: 'Выпрыгивания x20', duration: 180 },
    { name: 'Планка с поворотом', duration: 120 },
    { name: 'Отжимания широким хватом x20', duration: 180 },
    { name: 'Болгарские выпады x15', duration: 240 },
    { name: 'Русский твист x40', duration: 180 },
    { name: 'Велосипед x40', duration: 180 },
    { name: 'Подъёмы ног x25', duration: 180 },
    { name: 'Трицепс дайпы x20', duration: 180 },
    { name: 'Ягодичный мост x25', duration: 180 },
  ],
  pro: [
    { name: 'Бёрпи с отжиманием x20', duration: 300 },
    { name: 'Прыжки на ящик x15', duration: 240 },
    { name: 'Пистолетики x10', duration: 240 },
    { name: 'Отжимания с хлопком x15', duration: 180 },
    { name: 'Планка 2 минуты', duration: 120 },
    { name: 'Взрывные отжимания x20', duration: 240 },
    { name: 'Спринт 100% 30 сек', duration: 180 },
    { name: 'Подъёмы ног в висе x20', duration: 180 },
    { name: 'Супермен x30', duration: 180 },
    { name: 'Берпи x30', duration: 300 },
    { name: 'Скалолаз x50', duration: 240 },
    { name: 'Приседания x50', duration: 300 },
  ],
};

// Уникальные названия тренировок
const workoutNames = {
  free: [
    'Утренний заряд', 'Лёгкий старт', 'Базовая сила', 'Простое кардио',
    'Растяжка и тонус', 'Разминка тела', 'Мягкая нагрузка', 'Активация мышц',
    'Пробуждение', 'Энергия утра', 'Лёгкая активность', 'Базовый комплекс',
    'Простая тренировка', 'Начальный уровень', 'Разогрев', 'Тонус тела',
    'Лёгкий фитнес', 'Базовое движение', 'Простые упражнения', 'Старт дня'
  ],
  standard: [
    'Интенсив', 'Силовой блок', 'HIIT сессия', 'Функциональная',
    'Кардио взрыв', 'Мощная база', 'Средний уровень', 'Активная тренировка',
    'Динамика', 'Сила и выносливость'
  ],
  pro: [
    'Экстрим', 'Максимум', 'Хардкор', 'Спартанец',
    'Зверь режим', 'Адская тренировка', 'Предел возможностей', 'Титан',
    'Железная воля', 'Монстр сила', 'Выносливость MAX', 'Огонь',
    'Взрывная мощь', 'Легенда', 'Чемпион', 'Воин',
    'Непобедимый', 'Сверхчеловек', 'Абсолют', 'Финальный босс'
  ],
};

const emojis = {
  free: ['🌅', '🧘', '💪', '🏃', '🌊', '☀️', '🌸', '🍃'],
  standard: ['🔥', '💎', '⚡', '🎯', '💥', '🚀', '⭐', '🏆'],
  pro: ['👹', '🦍', '🛡️', '🌋', '⚔️', '💀', '🔱', '👑'],
};

// Генератор тренировок
const generateWorkout = (id: number, tier: 'free' | 'standard' | 'pro'): Workout => {
  const tierExercises = exercises[tier];
  const names = workoutNames[tier];
  const emojiList = emojis[tier];
  
  const name = names[(id - 1) % names.length];
  const emoji = emojiList[(id - 1) % emojiList.length];
  
  // Генерируем уникальные шаги для каждой тренировки
  const steps = [];
  const numExercises = tier === 'free' ? 4 : tier === 'standard' ? 5 : 6;
  const startIndex = ((id - 1) * 3) % tierExercises.length;
  
  for (let i = 0; i < numExercises; i++) {
    const exerciseIndex = (startIndex + i) % tierExercises.length;
    const exercise = tierExercises[exerciseIndex];
    steps.push({ name: exercise.name, duration: exercise.duration, type: 'exercise' as const });
    if (i < numExercises - 1) {
      steps.push({ name: 'Отдых', duration: 60, type: 'rest' as const });
    }
  }
  
  const levels = {
    free: ['Легкий', 'Начальный', 'Базовый'],
    standard: ['Средний', 'Продвинутый', 'Интенсивный'],
    pro: ['Хардкор', 'Экстрим', 'Профессиональный'],
  };
  
  const categories = {
    free: ['Разминка', 'Кардио', 'Сила', 'Растяжка'],
    standard: ['Кардио', 'Сила', 'HIIT', 'Функциональная'],
    pro: ['Сила', 'Выносливость', 'HIIT', 'Экстрим'],
  };
  
  const level = levels[tier][(id - 1) % levels[tier].length];
  const category = categories[tier][(id - 1) % categories[tier].length];
  const tierNames = { free: 'FREE', standard: 'STANDARD', pro: 'PRO' };
  
  return {
    id,
    title: name,
    description: `Программа уровня ${tierNames[tier]}. ${level} уровень сложности.`,
    duration: tier === 'free' ? '20 мин' : tier === 'standard' ? '30 мин' : '45 мин',
    level,
    category,
    premium: tier !== 'free',
    tier,
    emoji,
    steps,
  };
};

export const workouts: Workout[] = [
  // FREE: 20 тренировок (ID 1-20)
  ...Array.from({ length: 20 }, (_, i) => generateWorkout(i + 1, 'free')),
  
  // STANDARD: 10 дополнительных тренировок (ID 21-30)
  ...Array.from({ length: 10 }, (_, i) => generateWorkout(i + 21, 'standard')),
  
  // PRO: 20 дополнительных тренировок (ID 31-50)
  ...Array.from({ length: 20 }, (_, i) => generateWorkout(i + 31, 'pro')),
];
