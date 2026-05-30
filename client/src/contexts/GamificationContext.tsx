import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type GamificationEvent = 'mood' | 'voice' | 'healthyMeal' | 'challenge' | 'viewRecipe';

export interface GamificationState {
  coins: number;
  badges: string[];
  level: string;
  streakDays: number;
  lastLogDate: string | null; // ISO date (yyyy-mm-dd)
  history: { date: string; event: GamificationEvent; meta?: any }[];
  seenRecipes: string[]; // unique ids
  lastEarnedMessage?: string;
}

interface GamificationContextValue extends GamificationState {
  awardMoodLog: (mood: string) => void;
  awardVoiceUse: () => void;
  awardHealthyMeal: (recipeId: string) => void;
  awardViewRecipe: (recipeId: string) => void;
  completeChallenge: (id: string, title: string) => void;
}

const defaultState: GamificationState = {
  coins: 0,
  badges: [],
  level: 'Beginner',
  streakDays: 0,
  lastLogDate: null,
  history: [],
  seenRecipes: [],
  lastEarnedMessage: undefined,
};

const GamificationContext = createContext<GamificationContextValue | undefined>(undefined);

function isoDateOnly(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function computeLevel(coins: number): string {
  if (coins >= 1000) return 'Mood Master';
  if (coins >= 500) return 'Energy Pro';
  if (coins >= 250) return 'Calm Guru';
  if (coins >= 100) return 'Happy Feaster';
  return 'Beginner';
}

function withinLastDays(dateISO: string, days: number): boolean {
  const now = new Date();
  const then = new Date(dateISO);
  const diff = (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= days;
}

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GamificationState>(() => {
    try {
      const suffix = (() => {
        try {
          const rawUser = localStorage.getItem('devCurrentUser');
          if (rawUser) {
            const u = JSON.parse(rawUser);
            const id = u?.id || u?.email;
            if (id) return `__${String(id)}`;
          }
        } catch {}
        return '__anon';
      })();
      const key = `gamificationState${suffix}`;
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return defaultState;
  });

  useEffect(() => {
    const suffix = (() => {
      try {
        const rawUser = localStorage.getItem('devCurrentUser');
        if (rawUser) {
          const u = JSON.parse(rawUser);
          const id = u?.id || u?.email;
          if (id) return `__${String(id)}`;
        }
      } catch {}
      return '__anon';
    })();
    const key = `gamificationState${suffix}`;
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  const evaluateBadges = (next: GamificationState): string[] => {
    const badges = new Set(next.badges);

    // Happy Eater: 5 happy moods in last 14 days
    const happyCount = next.history.filter(h => h.event === 'mood' && h.meta?.mood?.toLowerCase() === 'happy' && withinLastDays(h.date, 14)).length;
    if (happyCount >= 5) badges.add('Happy Eater');

    // Calm Chef: 5 calming foods chosen (treat veg meals as calming for now)
    const calmFoodCount = next.history.filter(h => h.event === 'healthyMeal' && h.meta?.diet === 'veg' && withinLastDays(h.date, 60)).length;
    if (calmFoodCount >= 5) badges.add('Calm Chef');

    // Healthy Hero: 7 healthy meals in last 14 days
    const healthyMeals14 = next.history.filter(h => h.event === 'healthyMeal' && withinLastDays(h.date, 14)).length;
    if (healthyMeals14 >= 7) badges.add('Healthy Hero');

    // Mood Master (badge): streak >= 10
    if (next.streakDays >= 10) badges.add('Mood Master');

    // Food Explorer: 10 different recipes viewed/cooked
    if (new Set(next.seenRecipes).size >= 10) badges.add('Food Explorer');

    return Array.from(badges);
  };

  const pushEvent = (evt: GamificationEvent, meta?: any, coinsDelta = 0, earnedMsg?: string) => {
    setState(prev => {
      const today = isoDateOnly();
      const history = [...prev.history, { date: today, event: evt, meta }];
      const coins = prev.coins + coinsDelta;
      const level = computeLevel(coins);
      const next: GamificationState = { ...prev, coins, level, history, lastEarnedMessage: earnedMsg ?? prev.lastEarnedMessage };
      next.badges = evaluateBadges(next);
      return next;
    });
  };

  const value: GamificationContextValue = useMemo(() => ({
    ...state,
    awardMoodLog: (mood: string) => {
      setState(prev => {
        const today = isoDateOnly();
        let streakDays = prev.streakDays;
        if (prev.lastLogDate === today) {
          // same day, keep streak
        } else if (prev.lastLogDate) {
          const last = new Date(prev.lastLogDate);
          const yday = new Date();
          yday.setDate(yday.getDate() - 1);
          const lastIsYesterday = last.toDateString() === yday.toDateString();
          streakDays = lastIsYesterday ? prev.streakDays + 1 : 1;
        } else {
          streakDays = 1;
        }

        const history = [...prev.history, { date: today, event: 'mood' as GamificationEvent, meta: { mood } }];
        const coins = prev.coins + 5; // +5 for logging mood
        const level = computeLevel(coins);
        let lastEarnedMessage = prev.lastEarnedMessage;
        if (streakDays && (streakDays % 5 === 0)) {
          lastEarnedMessage = `You've kept a ${streakDays}-day mood streak!`;
        }

        const next: GamificationState = {
          ...prev,
          coins,
          level,
          streakDays,
          lastLogDate: today,
          history,
          lastEarnedMessage,
        };
        next.badges = evaluateBadges(next);
        return next;
      });
    },
    awardVoiceUse: () => pushEvent('voice', undefined, 5, 'Voice mood used: +5 MoodCoins'),
    awardHealthyMeal: (recipeId: string) => pushEvent('healthyMeal', { recipeId }, 10, 'Healthy meal: +10 MoodCoins'),
    awardViewRecipe: (recipeId: string) => {
      setState(prev => {
        const today = isoDateOnly();
        const seen = new Set(prev.seenRecipes);
        seen.add(recipeId);
        const history = [...prev.history, { date: today, event: 'viewRecipe' as GamificationEvent, meta: { recipeId } }];
        const next: GamificationState = { ...prev, seenRecipes: Array.from(seen), history };
        next.badges = evaluateBadges(next);
        return next;
      });
    },
    completeChallenge: (id: string, title: string) => pushEvent('challenge', { id, title }, 20, `Challenge complete: +20 MoodCoins`),
  }), [state]);

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider');
  return ctx;
}
