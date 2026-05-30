/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, DayLog, AIInsight, MetabolicStats } from '../types';

interface AppContextType {
  token: string | null;
  user: { id: string; email: string; profile: UserProfile } | null;
  userLogs: Record<string, DayLog>;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  aiInsights: AIInsight | null;
  isAiInsightLoading: boolean;
  metabolicStats: MetabolicStats | null;
  isMetabolicLoading: boolean;
  activeStreak: number;
  
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  updateLogsForDate: (date: string, logData: Partial<DayLog>) => Promise<boolean>;
  deleteFoodItem: (date: string, mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner', itemId: string) => Promise<void>;
  deleteWorkoutItem: (date: string, workoutId: string) => Promise<void>;
  fetchAiInsights: () => Promise<void>;
  fetchMetabolicAnalysis: () => Promise<void>;
  estimateFoodWithAi: (foodInput: string) => Promise<{ foodName: string; quantity: string; calories: number; protein: number; carbs: number; fats: number } | null>;
  estimateWorkoutWithAi: (activityName: string, duration: number) => Promise<{ activityName: string; duration: number; caloriesBurned: number } | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('bodysync_jwt_token'));
  const [user, setUser] = useState<{ id: string; email: string; profile: UserProfile } | null>(null);
  const [userLogs, setUserLogs] = useState<Record<string, DayLog>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // AI health analysis loading hooks
  const [aiInsights, setAiInsights] = useState<AIInsight | null>(null);
  const [isAiInsightLoading, setIsAiInsightLoading] = useState(false);
  const [metabolicStats, setMetabolicStats] = useState<MetabolicStats | null>(null);
  const [isMetabolicLoading, setIsMetabolicLoading] = useState(false);
  const [activeStreak, setActiveStreak] = useState(3); // Defaults to a healthy 3, calculated live below

  // Dynamic streaks counter
  useEffect(() => {
    if (Object.keys(userLogs).length > 0) {
      // Find successive active logged days before or matching today
      const dates = Object.keys(userLogs).sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
      let streak = 0;
      let checkDate = new Date();
      
      for (let i = 0; i < 30; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (userLogs[dateStr] && (userLogs[dateStr].completed || userLogs[dateStr].waterIntake > 0)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          // Allow 1 day grace
          if (i === 0) {
            checkDate.setDate(checkDate.getDate() - 1);
            const dateStrPrev = checkDate.toISOString().split('T')[0];
            if (userLogs[dateStrPrev]) {
              continue;
            }
          }
          break;
        }
      }
      setActiveStreak(Math.max(3, streak));
    }
  }, [userLogs]);

  // Load user on startup
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser({ id: data.id, email: data.email, profile: data.profile });
          setUserLogs(data.logs || {});
        } else {
          // Token expired
          logout();
        }
      } catch (err) {
        console.error('Failed to load user session', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  // Auth logins
  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.error || 'Login attempt failed.');
        return false;
      }
      localStorage.setItem('bodysync_jwt_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Server connection timed out.');
      return false;
    }
  };

  // Auth register
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.error || 'Registration failed.');
        return false;
      }
      localStorage.setItem('bodysync_jwt_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Server connection failed.');
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('bodysync_jwt_token');
    setToken(null);
    setUser(null);
    setUserLogs({});
    setAiInsights(null);
    setMetabolicStats(null);
  };

  // Update bio profile details
  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!token) return false;
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setUser(prev => prev ? { ...prev, profile: updatedProfile } : null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to sync profile change on disk', err);
      return false;
    }
  };

  // Update logs for a specific calendar date (optimistic GUI loading)
  const updateLogsForDate = async (date: string, updatedDay: Partial<DayLog>): Promise<boolean> => {
    if (!token) return false;
    
    // Build combined record
    const baseDay = userLogs[date] || {
      date,
      meals: { breakfast: [], lunch: [], snacks: [], dinner: [] },
      waterIntake: 0,
      steps: 0,
      workouts: [],
      completed: true
    };

    const combined: DayLog = {
      ...baseDay,
      ...updatedDay,
      meals: {
        breakfast: updatedDay.meals?.breakfast || baseDay.meals.breakfast,
        lunch: updatedDay.meals?.lunch || baseDay.meals.lunch,
        snacks: updatedDay.meals?.snacks || baseDay.meals.snacks,
        dinner: updatedDay.meals?.dinner || baseDay.meals.dinner,
      }
    };

    // Optimistic UI update
    setUserLogs(prev => ({
      ...prev,
      [date]: combined
    }));

    try {
      const response = await fetch('/api/logs/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(combined)
      });
      if (!response.ok) {
        // Rollback on non-ok statuses
        console.error('Server flatly rejected log submission');
        return false;
      }
      const data = await response.json();
      setUserLogs(prev => ({
        ...prev,
        [date]: data
      }));
      return true;
    } catch (err) {
      console.error('Failed syncing logs structure to Express server', err);
      return false;
    }
  };

  // Delete a food item by log index
  const deleteFoodItem = async (date: string, mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner', itemId: string) => {
    if (!token) return;
    
    // Optimistic delete
    if (userLogs[date]) {
      const updatedMeals = { ...userLogs[date].meals };
      updatedMeals[mealType] = updatedMeals[mealType].filter(item => item.id !== itemId);
      setUserLogs(prev => ({
        ...prev,
        [date]: { ...prev[date], meals: updatedMeals }
      }));
    }

    try {
      await fetch('/api/logs/delete-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date, mealType, itemId })
      });
    } catch (error) {
      console.error('Error deleting log item:', error);
    }
  };

  // Delete workout log
  const deleteWorkoutItem = async (date: string, workoutId: string) => {
    if (!token) return;

    // Optimistic delete
    if (userLogs[date]) {
      const updatedWorkouts = userLogs[date].workouts.filter(w => w.id !== workoutId);
      setUserLogs(prev => ({
        ...prev,
        [date]: { ...prev[date], workouts: updatedWorkouts }
      }));
    }

    try {
      await fetch('/api/logs/delete-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date, workoutId })
      });
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  // Fetch smart AI Insights from microservices
  const fetchAiInsights = async () => {
    if (!token) return;
    setIsAiInsightLoading(true);
    try {
      const response = await fetch('/api/ai/insights', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAiInsights(data);
      }
    } catch (err) {
      console.error('Failed to parse AI dynamic health projections', err);
    } finally {
      setIsAiInsightLoading(false);
    }
  };

  // Fetch metabolic in depth macronutrient report
  const fetchMetabolicAnalysis = async () => {
    if (!token) return;
    setIsMetabolicLoading(true);
    try {
      const response = await fetch('/api/ai/metabolic-analysis', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMetabolicStats(data);
      }
    } catch (err) {
      console.error('Failed to parse metabolic health report', err);
    } finally {
      setIsMetabolicLoading(false);
    }
  };

  // Estimate food composition based on arbitrary phrases parsed via Gemini AI
  const estimateFoodWithAi = async (foodInput: string) => {
    if (!token) return null;
    try {
      const response = await fetch('/api/ai/food-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ foodInput })
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (err) {
      console.error('Err calling Gemini macro parsing:', err);
      return null;
    }
  };

  // Estimate workout calories burned based on training action and duration via Gemini AI
  const estimateWorkoutWithAi = async (activityName: string, duration: number) => {
    if (!token) return null;
    try {
      const response = await fetch('/api/ai/workout-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ activityName, duration })
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (err) {
      console.error('Err calling Gemini workout burner parsing:', err);
      return null;
    }
  };

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        userLogs,
        isAuthenticated: !!token,
        isLoading,
        authError,
        aiInsights,
        isAiInsightLoading,
        metabolicStats,
        isMetabolicLoading,
        activeStreak,
        
        login,
        register,
        logout,
        updateProfile,
        updateLogsForDate,
        deleteFoodItem,
        deleteWorkoutItem,
        fetchAiInsights,
        fetchMetabolicAnalysis,
        estimateFoodWithAi,
        estimateWorkoutWithAi,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be accessed strictly within an AppProvider wrapper');
  return context;
}
