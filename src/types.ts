export interface User {
  username: string;
  password: string;
  isPremium: boolean;
  subscriptionTier?: 'free' | 'standard' | 'pro'; // Новое поле
  isAdmin?: boolean;
}

export interface WorkoutStep {
  name: string;
  duration: number; // seconds
  type: 'exercise' | 'rest';
}

export interface Workout {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  premium: boolean;
  tier?: 'free' | 'standard' | 'pro'; // Новое поле для уровня доступа
  emoji: string;
  steps: WorkoutStep[];
}
