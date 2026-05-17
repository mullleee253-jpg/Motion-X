import { Workout } from '../types';

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
    steps: [
      { name: 'Разминка', duration: 180, type: 'exercise' },
      { name: 'Отдых', duration: 60, type: 'rest' },
      { name: 'Основной блок', duration: 300, type: 'exercise' },
      { name: 'Отдых', duration: 60, type: 'rest' },
      { name: 'Интенсив', duration: 240, type: 'exercise' },
      { name: 'Заминка', duration: 180, type: 'rest' },
    ],
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
