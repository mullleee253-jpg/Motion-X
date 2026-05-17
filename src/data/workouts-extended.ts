import { Workout } from '../types';

// Реальные упражнения для каждого уровня
const exercises = {
  free: [
    { name: 'Приседания', duration: 180 },
    { name: 'Отжимания', duration: 120 },
    { name: 'Планка', duration: 60 },
    { name: 'Выпады', duration: 180 },
    { name: 'Скручивания', duration: 120 },
    { name: 'Бег на месте', duration: 180 },
    { name: 'Прыжки', duration: 120 },
    { name: 'Растяжка', duration: 180 },
  ],
  standard: [
    { name: 'Бёрпи', duration: 240 },
    { name: 'Высокие колени', duration: 180 },
    { name: 'Скалолаз', duration: 180 },
    { name: 'Выпрыгивания', duration: 180 },
    { name: 'Планка с поворотом', duration: 120 },
    { name: 'Отжимания широким хватом', duration: 180 },
    { name: 'Болгарские выпады', duration: 240 },
    { name: 'Русский твист', duration: 180 },
  ],
  pro: [
    { name: 'Бёрпи с отжиманием', duration: 300 },
    { name: 'Прыжки на ящик', duration: 240 },
    { name: 'Пистолетики', duration: 240 },
    { name: 'Отжимания на одной руке', duration: 180 },
    { name: 'Планка 2 минуты', duration: 120 },
    { name: 'Взрывные отжимания', duration: 240 },
    { name: 'Спринт 100%', duration: 180 },
    { name: 'Подъёмы ног в висе', duration: 180 },
  ],
};

// Генератор тренировок для быстрого создания
const generateWorkout = (id: number, tier: 'free' | 'standard' | 'pro'): Workout => {
  const templates = {
    free: [
      { title: 'Базовое кардио', emoji: '🏃', level: 'Легкий', category: 'Кардио' },
      { title: 'Простая растяжка', emoji: '🧘', level: 'Легкий', category: 'Растяжка' },
      { title: 'Легкая сила', emoji: '💪', level: 'Легкий', category: 'Сила' },
      { title: 'Утренняя зарядка', emoji: '🌅', level: 'Легкий', category: 'Разминка' },
    ],
    standard: [
      { title: 'Интенсив кардио', emoji: '🔥', level: 'Средний', category: 'Кардио' },
      { title: 'Силовая база', emoji: '💎', level: 'Средний', category: 'Сила' },
      { title: 'HIIT тренировка', emoji: '⚡', level: 'Средний', category: 'HIIT' },
      { title: 'Функциональная', emoji: '🎯', level: 'Средний', category: 'Функциональная' },
    ],
    pro: [
      { title: 'Экстрим сила', emoji: '👹', level: 'Хардкор', category: 'Сила' },
      { title: 'Выносливость MAX', emoji: '🦍', level: 'Экстрим', category: 'Выносливость' },
      { title: 'Спартанская', emoji: '🛡️', level: 'Экстрим', category: 'Сила' },
      { title: 'Адский HIIT', emoji: '🌋', level: 'Экстрим', category: 'HIIT' },
    ],
  };

  const template = templates[tier][id % templates[tier].length];
  const tierNames = { free: 'FREE', standard: 'STANDARD', pro: 'PRO' };
  const tierExercises = exercises[tier];
  
  // Генерируем реальные шаги тренировки
  const steps = [];
  const numExercises = tier === 'free' ? 4 : tier === 'standard' ? 5 : 6;
  
  for (let i = 0; i < numExercises; i++) {
    const exercise = tierExercises[i % tierExercises.length];
    steps.push({ name: exercise.name, duration: exercise.duration, type: 'exercise' as const });
    if (i < numExercises - 1) {
      steps.push({ name: 'Отдых', duration: 60, type: 'rest' as const });
    }
  }
  
  return {
    id,
    title: `${template.title} #${id}`,
    description: `Программа уровня ${tierNames[tier]}. ${template.level} уровень сложности.`,
    duration: tier === 'free' ? '20 мин' : tier === 'standard' ? '30 мин' : '45 мин',
    level: template.level,
    category: template.category,
    premium: tier !== 'free',
    tier,
    emoji: template.emoji,
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
