/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface WorkoutItem {
  id: string;
  name: string;
  duration: number; // in minutes
  caloriesBurned: number;
  notes?: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    snacks: FoodItem[];
    dinner: FoodItem[];
  };
  waterIntake: number; // in ml
  steps: number;
  workouts: WorkoutItem[];
  completed: boolean;
}

export type GenderType = 'male' | 'female' | 'unspecified';

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  gender: GenderType;
  height: number; // in cm
  weight: number; // in kg
  targetWeight: number; // in kg
  bodyFatPercentage: number; // percent string or number
  muscleMassEstimate: number; // percent or kg
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  dietaryPreference: 'none' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean';
  allergies: string;
  workoutFrequency: number; // sessions per week
  sleepDuration: number; // hours per night
  fatDistribution: 'android' | 'gynoid' | 'uniform' | 'chest_belly' | 'hips_thighs';
  fitnessGoal: 'lose_fat' | 'gain_muscle' | 'maintain' | 'improve_cardio' | 'rehab';
}

export interface AIInsight {
  weightLossForecast4Weeks: string;
  muscleGainPrediction: string;
  calorieBalanceFeedback: string;
  workoutRecommendations: string[];
  recoverySuggestions: string;
  summaryText: string;
}

export interface MetabolicStats {
  proteinGoal: number;
  carbsGoal: number;
  fatsGoal: number;
  fiberGoal: number;
  potassiumGoal: number;
  magnesiumGoal: number;
  sodiumGoal: number;
  calciumGoal: number;
  ironGoal: number;
  waterGoal: number;
  
  proteinConsumed: number;
  carbsConsumed: number;
  fatsConsumed: number;
  fiberConsumed: number;
  potassiumConsumed: number;
  magnesiumConsumed: number;
  sodiumConsumed: number;
  calciumConsumed: number;
  ironConsumed: number;
  waterConsumed: number;
  
  aiFeedbackSummary: string;
  deficiencies: string[];
  warnings: string[];
}
