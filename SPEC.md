# MotonX — Тренировки с душой

## Concept & Vision
MotonX — минималистичное приложение для тренировок с таймером. Чистый, тёмный дизайн с яркими акцентами. Ощущение премиального фитнес-приложения, но с характером. Простота важнее всего: увидел тренировку → нажал старт → получил результат.

## Design Language

**Aesthetic:** Dark luxury meets athletic energy. Глубокие тёмные тона с контрастными оранжевыми акцентами. Неiropunk минимализм.

**Colors:**
- Background: #0a0a0b (почти чёрный)
- Surface: #141416, #1c1c1f
- Border: #2a2a2e
- Text: #fafafa, #a1a1aa, #71717a
- Accent: #f97316 (orange-500)
- Accent hover: #fb923c
- Blue (rest): #3b82f6

**Typography:** Inter (Google Fonts), system-ui fallback

**Motion:**
- Spring animations (cubic-bezier(0.34, 1.56, 0.64, 1))
- Micro-interactions на всех кнопках
- Staggered list animations (100ms delay)
- Smooth page transitions
- Pulse glow на акцентных элементах

## Layout & Structure

**Landing:** Hero сразу по центру → минимальные фичи → CTA. Без лишнего скролла.

**Workouts:** Tab-навигация (Бесплатные / PRO). Карточки с emoji, метаданными. Locked состояние для PRO без покупки.

**Timer:** Fullscreen, круговой прогресс, упражнение + передышка чередуются.

**Payment:** Модальное окно с link на dalink.to, после оплаты возврат с status=pending → экран "Ожидание подтверждения..."

## Features & Interactions

### Auth
- Login / Register (username + password)
- Данные в localStorage
- Session persistence

### Workouts (Free — 6 штук)
- Утренний заряд, Сила рук, Кардио, Ноги, Кор, Растяжка

### Workouts (PRO — 6 штук)
- Монстр сила, Выносливость, Скорость, Интенсив, Торс, Спринт

### Timer
- Автоматический таймер с паузой/продолжением
- Визуальный прогресс (круг)
- Следующее упражнение внизу
- Финальный экран победы

### Payment
- Ссылка на dalink.to/mull12312312312
- После возврата ?payment=pending показывает экран ожидания
- Проверка статуса оплаты через localStorage флаг
- Ручная активация PRO после подтверждения

## Technical
- React + Vite + Tailwind
- Vercel ready
- localStorage для auth + payment status