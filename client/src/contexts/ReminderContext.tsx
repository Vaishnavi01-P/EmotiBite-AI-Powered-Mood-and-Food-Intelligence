import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { moodLogService } from '../services/authService';

export type Reminder = {
  id: string;
  message: string;
  kind: 'info' | 'tip' | 'warning';
  createdAt: number;
  action?: { label: string; to: string };
};

interface ReminderContextValue {
  reminders: Reminder[];
  dismiss: (id: string) => void;
  push: (r: Omit<Reminder, 'id' | 'createdAt'>) => void;
}

const ReminderContext = createContext<ReminderContextValue | undefined>(undefined);

const NEGATIVE_MOODS = new Set(['stressed', 'sad', 'anxious', 'angry', 'tired']);

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function slotForHour(h: number): 'breakfast' | 'lunch' | 'snacks' | 'dinner' | 'none' {
  if (h >= 6 && h <= 10) return 'breakfast';
  if (h >= 11 && h <= 15) return 'lunch';
  if (h >= 16 && h <= 18) return 'snacks';
  if (h >= 19 && h <= 22) return 'dinner';
  return 'none';
}

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const timerRef = useRef<number | null>(null);

  const dismiss = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const push = (r: Omit<Reminder, 'id' | 'createdAt'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setReminders(prev => [{ id, createdAt: Date.now(), ...r }, ...prev].slice(0, 5));
  };

  // Ensure we don't repeat the same reminder too frequently (per-user)
  const userSuffix = (() => {
    try {
      const raw = localStorage.getItem('devCurrentUser');
      if (raw) {
        const u = JSON.parse(raw);
        const id = u?.id || u?.email;
        if (id) return `__${String(id)}`;
      }
    } catch {}
    return '__anon';
  })();
  const throttleKey = (key: string) => `reminder.throttle.${key}${userSuffix}`;
  const canShow = (key: string, minutes = 120) => {
    try {
      const raw = localStorage.getItem(throttleKey(key));
      if (!raw) return true;
      const last = parseInt(raw, 10);
      return Date.now() - last > minutes * 60 * 1000;
    } catch { return true; }
  };
  const markShown = (key: string) => {
    try { localStorage.setItem(throttleKey(key), String(Date.now())); } catch {}
  };

  const mindfulSlotShownKey = (date: string, slot: string) => `reminder.mindful.${date}.${slot}${userSuffix}`;

  const runChecks = async () => {
    // 1) Mood trend: detect repeated negative moods in last 3 days
    try {
      const hist = await moodLogService.history(1, 100);
      const moods: { mood: string; createdAt: string }[] = (hist?.moods || []).map((m: any) => ({ mood: (m.mood || '').toLowerCase(), createdAt: m.createdAt }));
      const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
      const recent = moods.filter(m => new Date(m.createdAt).getTime() >= threeDaysAgo);
      const negCount = recent.filter(m => NEGATIVE_MOODS.has(m.mood)).length;
      if (negCount >= 3 && canShow('negMood', 240)) {
        push({
          kind: 'tip',
          message: "You’ve been feeling low lately. Try this calming lemon tea and a 2-minute breath: Inhale 4s, hold 2s, exhale 6s.",
          action: { label: 'Open calming recipes', to: '/' }
        });
        markShown('negMood');
      }
    } catch {}

    // 2) Daily mood check-in reminder
    try {
      const hist = await moodLogService.history(1, 20);
      const today = todayKey();
      const hasToday = (hist?.moods || []).some((m: any) => new Date(m.createdAt).toISOString().slice(0, 10) === today);
      if (!hasToday && canShow('noMoodToday', 240)) {
        push({ kind: 'info', message: "You haven’t logged your mood today. Take a moment and share how you feel.", action: { label: 'Log mood now', to: '/' } });
        markShown('noMoodToday');
      }
    } catch {}

    // 3) Mindful eating prompts before meal slots (once per slot per day)
    const now = new Date();
    const slot = slotForHour(now.getHours());
    if (slot !== 'none') {
      const key = mindfulSlotShownKey(todayKey(), slot);
      const already = localStorage.getItem(key);
      if (!already) {
        // Show two gentle prompts as two toasts
        push({ kind: 'tip', message: 'Before your meal, take 3 deep breaths. Inhale slowly… exhale fully.' });
        push({ kind: 'tip', message: 'Eat mindfully: slow down and savor every bite.' });
        try { localStorage.setItem(key, '1'); } catch {}
      }
    }
  };

  useEffect(() => {
    // Initial check and periodic re-check every 5 minutes
    runChecks();
    timerRef.current = window.setInterval(runChecks, 5 * 60 * 1000) as unknown as number;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const value = useMemo(() => ({ reminders, dismiss, push }), [reminders]);

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};

export function useReminders() {
  const ctx = useContext(ReminderContext);
  if (!ctx) throw new Error('useReminders must be used within ReminderProvider');
  return ctx;
}
