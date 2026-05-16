export interface User {
  username: string;
  password: string;
  isPremium: boolean;
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
  emoji: string;
  steps: WorkoutStep[];
}
