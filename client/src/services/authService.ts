import axios from 'axios';

// Use relative API path by default so the CRA dev server proxy can forward to backend and avoid CORS in development.
// If REACT_APP_API_URL is set, it will override this (useful for production or custom endpoints).
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      const hasResponse = !!error?.response;
      const hasRequest = !!error?.request;
      if (process.env.NODE_ENV !== 'production' && !hasResponse && hasRequest) {
        const devUsers = JSON.parse(localStorage.getItem('devUsers') || '[]');
        const user = devUsers.find((u: any) => String(u.email).toLowerCase() === String(email).toLowerCase());
        if (user && user.password === password) {
          const result = {
            message: 'Login successful (dev)',
            token: 'dev-mock-token',
            user: { id: user.id, name: user.name, email: user.email, role: user.role || 'user' }
          };
          localStorage.setItem('devCurrentUser', JSON.stringify(result.user));
          return result;
        }
      }
      const message = error?.response?.data?.message
        || (hasRequest ? 'Unable to reach server. Please ensure the backend is running.' : error?.message)
        || 'Login failed';
      throw new Error(message);
    }
  },

  async signup(name: string, email: string, password: string) {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      return response.data;
    } catch (error: any) {
      const hasResponse = !!error?.response;
      const hasRequest = !!error?.request;
      if (process.env.NODE_ENV !== 'production' && !hasResponse && hasRequest) {
        const devUsers = JSON.parse(localStorage.getItem('devUsers') || '[]');
        const existing = devUsers.find((u: any) => String(u.email).toLowerCase() === String(email).toLowerCase());
        if (existing) {
          throw new Error('User already exists (dev)');
        }
        const user = {
          id: `dev-user-${Date.now()}`,
          name: name || email.split('@')[0],
          email,
          password,
          role: 'user'
        };
        devUsers.push(user);
        localStorage.setItem('devUsers', JSON.stringify(devUsers));
        const result = {
          message: 'User created successfully (dev)',
          token: 'dev-mock-token',
          user: { id: user.id, name: user.name, email: user.email, role: user.role }
        };
        localStorage.setItem('devCurrentUser', JSON.stringify(result.user));
        return result;
      }
      const message = error?.response?.data?.message
        || (hasRequest ? 'Unable to reach server. Please ensure the backend is running.' : error?.message)
        || 'Signup failed';
      throw new Error(message);
    }
  },

  async verifyToken() {
    const token = localStorage.getItem('token');
    if (process.env.NODE_ENV !== 'production' && token === 'dev-mock-token') {
      const current = localStorage.getItem('devCurrentUser');
      if (current) return JSON.parse(current);
      // Fallback: pick first dev user if exists
      const devUsers = JSON.parse(localStorage.getItem('devUsers') || '[]');
      if (devUsers.length > 0) {
        const user = devUsers[0];
        return { id: user.id, name: user.name, email: user.email, role: user.role || 'user' };
      }
      throw new Error('Invalid dev token');
    }
    const response = await api.get('/auth/verify');
    return response.data.user;
  },

  async logout() {
    await api.post('/auth/logout');
  }
};

// Helper: namespace localStorage keys per dev user for data isolation
function devUserSuffix() {
  try {
    const raw = localStorage.getItem('devCurrentUser');
    if (raw) {
      const u = JSON.parse(raw);
      const id = u?.id || u?.email;
      if (id) return `__${String(id)}`;
    }
  } catch { }
  return '__anon';
}

export const moodService = {
  async analyzeMood(text: string, voiceData?: string) {
    try {
      const response = await api.post('/mood/analyze', { text, voiceData });
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        const lower = (text || '').toLowerCase();

        // Enhanced mood detection logic
        let mood = 'neutral';
        let intensity = 50;

        // Happy/Positive emotions
        if (lower.includes('happy') || lower.includes('excited') || lower.includes('great') ||
          lower.includes('wonderful') || lower.includes('joyful') || lower.includes('amazing') ||
          lower.includes('fantastic') || lower.includes('cheerful') || lower.includes('delighted') ||
          lower.includes('content') || lower.includes('optimistic') || lower.includes('positive') ||
          lower.includes('grateful') || lower.includes('satisfied') || lower.includes('elated') ||
          lower.includes('thrilled') || lower.includes('glad') || lower.includes('smiling') ||
          lower.includes('awesome') || lower.includes('good')) {
          mood = 'happy';
          intensity = 75;
        }
        // Calm/Peaceful emotions  
        else if (lower.includes('calm') || lower.includes('peaceful') || lower.includes('relaxed') ||
          lower.includes('tranquil') || lower.includes('serene') || lower.includes('centered') ||
          lower.includes('composed') || lower.includes('at ease') || lower.includes('mindful') ||
          lower.includes('unwound') || lower.includes('chill') || lower.includes('zen') ||
          lower.includes('grounded') || lower.includes('balanced') || lower.includes('soothing')) {
          mood = 'calm';
          intensity = 60;
        }
        // Anxious/Worried emotions
        else if (lower.includes('anxious') || lower.includes('worried') || lower.includes('nervous') ||
          lower.includes('presentation') || lower.includes('meeting') || lower.includes('exam') ||
          lower.includes('uneasy') || lower.includes('apprehensive') || lower.includes('tense') ||
          lower.includes('jittery') || lower.includes('panicked') || lower.includes('panic') ||
          lower.includes('fearful') || lower.includes('on edge') || lower.includes('restless')) {
          mood = 'anxious';
          intensity = 70;
        }
        // Tired/Exhausted emotions
        else if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('drained') ||
          lower.includes('sleepy') || lower.includes('worn out') || lower.includes('need rest') ||
          lower.includes('fatigued') || lower.includes('burned out') || lower.includes('burnt out') ||
          lower.includes('drowsy') || lower.includes('lethargic') || lower.includes('groggy') ||
          lower.includes('worn-out') || lower.includes('sleep-deprived') || lower.includes('low energy')) {
          mood = 'tired';
          intensity = 65;
        }
        // Sad emotions
        else if (lower.includes('sad') || lower.includes('down') || lower.includes('lonely') ||
          lower.includes('depressed') || lower.includes('upset') || lower.includes('blue') ||
          lower.includes('heartbroken') || lower.includes('sorrowful') || lower.includes('discouraged') ||
          lower.includes('downcast') || lower.includes('miserable') || lower.includes('tearful')) {
          mood = 'sad';
          intensity = 60;
        }
        // Stressed emotions (work/pressure cues)
        else if (lower.includes('stressed') || lower.includes('overwhelmed') || lower.includes('deadline') ||
          lower.includes('pressure') || lower.includes('under pressure') || lower.includes('strained') ||
          lower.includes('overloaded') || lower.includes('swamped') || lower.includes('hectic') ||
          (lower.includes('work') && (lower.includes('busy') || lower.includes('too much') || lower.includes('urgent') || lower.includes('rush')))) {
          mood = 'stressed';
          intensity = 75;
        }
        // Workload cues without explicit stress → tired/exhausted mapping
        else if (lower.includes('work') || lower.includes('works') || lower.includes('worked') || lower.includes('working')) {
          const hasLoad = lower.includes('lot') || lower.includes('lots') || lower.includes('many') || lower.includes('hours') || lower.includes('long day') || lower.includes('long hours');
          if (hasLoad) {
            mood = 'tired';
            intensity = 65;
          } else {
            mood = 'tired';
            intensity = 60;
          }
        }
        // Angry/Frustrated emotions
        else if (lower.includes('angry') || lower.includes('frustrated') || lower.includes('annoyed') ||
          lower.includes('irritated') || lower.includes('mad') || lower.includes('furious') ||
          lower.includes('rage') || lower.includes('enraged') || lower.includes('irate') ||
          lower.includes('livid') || lower.includes('pissed') || lower.includes('resentful') ||
          lower.includes('short-tempered') || lower.includes('cross') || lower.includes('hostile')) {
          mood = 'angry';
          intensity = 70;
        }
        const nutrientsByMood: Record<string, string[]> = {
          stressed: ['MAGNESIUM', 'B_VITAMINS', 'OMEGA_3'],
          happy: ['B_VITAMINS', 'COMPLEX_CARBS', 'VITAMIN_C'],
          anxious: ['MAGNESIUM', 'OMEGA_3', 'TRYPTOPHAN'],
          tired: ['IRON', 'COMPLEX_CARBS', 'B_VITAMINS'],
          calm: ['MAGNESIUM', 'TRYPTOPHAN', 'COMPLEX_CARBS'],
          sad: ['OMEGA_3', 'B_VITAMINS', 'VITAMIN_D'],
          angry: ['MAGNESIUM', 'B_VITAMINS', 'COMPLEX_CARBS'],
          neutral: ['B_VITAMINS', 'COMPLEX_CARBS', 'PROTEIN']
        };
        return {
          mood,
          intensity,
          confidence: 85,
          text,
          nutrients: nutrientsByMood[mood] || ['COMPLEX_CARBS'],
          recommendations: [
            { meal: 'Breakfast', foods: [{ name: 'Poha', description: 'Light, iron-rich flattened rice' }] },
            { meal: 'Lunch', foods: [{ name: 'Dal Tadka with Brown Rice', description: 'Protein + complex carbs' }] },
            { meal: 'Snacks', foods: [{ name: 'Sprouts Chaat', description: 'Protein and fiber' }] },
            { meal: 'Dinner', foods: [{ name: 'Veg Khichdi', description: 'Comforting dal-rice' }] }
          ]
        };
      }
      throw error;
    }
  },

  async getMoodHistory() {
    const response = await api.get('/mood/history');
    return response.data;
  },

  async downloadMoodReport(moodId: string) {
    const response = await api.get(`/mood/download/${moodId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Mood & Meal logging (Phase 1)
export const moodLogService = {
  async logMood(mood: string, intensity?: number, text?: string) {
    try {
      const res = await api.post('/moods/log', { mood, intensity, text });
      return res.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        const key = `moodLogs${devUserSuffix()}`;
        const logs = JSON.parse(localStorage.getItem(key) || '[]');
        const doc = { id: `dev-${Date.now()}`, mood, intensity, text, createdAt: new Date().toISOString() };
        logs.push(doc);
        localStorage.setItem(key, JSON.stringify(logs));
        return { message: 'Mood logged (dev)', moodLog: doc };
      }
      throw error;
    }
  },

  async history(page: number = 1, limit: number = 100) {
    // In development, if offline, return local fallback without making a network request
    if (process.env.NODE_ENV !== 'production') {
      try {
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
          const key = `moodLogs${devUserSuffix()}`;
          const logs = JSON.parse(localStorage.getItem(key) || '[]');
          return { moods: logs.reverse(), total: logs.length, currentPage: 1, totalPages: 1 };
        }
      } catch (_) {
        // If navigator is unavailable for any reason, continue to normal flow
      }
    }
    try {
      const res = await api.get('/moods/history', { params: { page, limit } });
      return res.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        const key = `moodLogs${devUserSuffix()}`;
        const logs = JSON.parse(localStorage.getItem(key) || '[]');
        return { moods: logs.reverse(), total: logs.length, currentPage: 1, totalPages: 1 };
      }
      throw error;
    }
  }
};

export const mealLogService = {
  async logMeal(input: { recipeId?: string; title?: string; nutrients?: string[]; moodBefore?: string; moodAfter?: string; }) {
    try {
      const res = await api.post('/meals/log', input);
      return res.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        const key = `mealLogs${devUserSuffix()}`;
        const logs = JSON.parse(localStorage.getItem(key) || '[]');
        const doc = { id: `dev-${Date.now()}`, ...input, createdAt: new Date().toISOString() };
        logs.push(doc);
        localStorage.setItem(key, JSON.stringify(logs));
        return { message: 'Meal logged (dev)', mealLog: doc };
      }
      throw error;
    }
  },

  async history(page: number = 1, limit: number = 100) {
    try {
      const res = await api.get('/meals/history', { params: { page, limit } });
      return res.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        const key = `mealLogs${devUserSuffix()}`;
        const logs = JSON.parse(localStorage.getItem(key) || '[]');
        return { meals: logs.reverse(), total: logs.length, currentPage: 1, totalPages: 1 };
      }
      throw error;
    }
  }
};

export const impactService = {
  async summary(range: string = '7d') {
    try {
      const res = await api.get('/impact/summary', { params: { range } });
      const data = res.data || {};
      if (process.env.NODE_ENV !== 'production') {
        const list = Array.isArray(data.nutrientImpact) ? data.nutrientImpact : [];
        if (list.length === 0) {
          const key = `mealLogs${devUserSuffix()}`;
          const mealLogs = JSON.parse(localStorage.getItem(key) || '[]');
          const now = Date.now();
          const days = String(range || '').endsWith('d') ? parseInt(String(range)) : 7;
          const from = now - days * 24 * 60 * 60 * 1000;
          const recent = mealLogs.filter((m: any) => new Date(m.createdAt).getTime() >= from);
          const score = (m: any) => {
            const s = String(m || '').toLowerCase();
            if (s === 'happy') return 80;
            if (s === 'calm') return 70;
            if (s === 'excited') return 75;
            if (s === 'tired') return 40;
            if (s === 'anxious') return 30;
            if (s === 'stressed') return 20;
            if (s === 'sad') return 25;
            return 50;
          };
          const agg: Record<string, { total: number; count: number }> = {};
          recent.forEach((m: any) => {
            const before = score(m.moodBefore);
            const after = score(m.moodAfter);
            const delta = Number.isFinite(before) && Number.isFinite(after) ? after - before : 0;
            (m.nutrients || []).forEach((n: string) => {
              const keyN = String(n).toUpperCase();
              if (!agg[keyN]) agg[keyN] = { total: 0, count: 0 };
              agg[keyN].total += delta;
              agg[keyN].count += 1;
            });
          });
          const nutrientImpact = Object.entries(agg).map(([nutrient, v]: any) => ({
            nutrient,
            avgDelta: v.count ? Math.round((v.total / v.count) * 10) / 10 : 0,
            samples: v.count
          })).sort((a: any, b: any) => b.avgDelta - a.avgDelta);
          return { ...data, nutrientImpact };
        }
      }
      return data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // Minimal client calculation from local logs
        const key = `mealLogs${devUserSuffix()}`;
        const mealLogs = JSON.parse(localStorage.getItem(key) || '[]');
        const now = Date.now();
        const days = 7;
        const from = now - days * 24 * 60 * 60 * 1000;
        const recent = mealLogs.filter((m: any) => new Date(m.createdAt).getTime() >= from);
        const score = (m: any) => {
          const s = String(m || '').toLowerCase();
          if (s === 'happy') return 80;
          if (s === 'calm') return 70;
          if (s === 'excited') return 75;
          if (s === 'tired') return 40;
          if (s === 'anxious') return 30;
          if (s === 'stressed') return 20;
          if (s === 'sad') return 25;
          return 50;
        };
        const agg: Record<string, { total: number; count: number }> = {};
        recent.forEach((m: any) => {
          const before = score(m.moodBefore);
          const after = score(m.moodAfter);
          const delta = Number.isFinite(before) && Number.isFinite(after) ? after - before : 0;
          (m.nutrients || []).forEach((n: string) => {
            const key = String(n).toUpperCase();
            if (!agg[key]) agg[key] = { total: 0, count: 0 };
            agg[key].total += delta;
            agg[key].count += 1;
          });
        });
        const nutrientImpact = Object.entries(agg).map(([nutrient, v]: any) => ({
          nutrient,
          avgDelta: v.count ? Math.round((v.total / v.count) * 10) / 10 : 0,
          samples: v.count
        })).sort((a: any, b: any) => b.avgDelta - a.avgDelta);

        return { range: {}, nutrientImpact, moodTrend: [] };
      }
      throw error;
    }
  }
};

export const recipeService = {
  async getRecipes(mood: string, nutrients: string[], mealType?: 'breakfast' | 'lunch' | 'snacks' | 'dinner', cuisine: string = 'indian') {
    const response = await api.post('/recipes/recommend', { mood, nutrients, mealType, cuisine });
    return response.data;
  },

  async getRecipeDetails(recipeId: string) {
    const response = await api.get(`/recipes/${recipeId}`);
    const r = response?.data?.recipe;
    if (!r) return null;
    const ingredients = Array.isArray(r.ingredients)
      ? r.ingredients.map((it: any) => typeof it === 'string' ? it : it?.name).filter(Boolean)
      : [];
    const instructions = Array.isArray(r.instructions)
      ? r.instructions.map((it: any) => typeof it === 'string' ? it : it?.instruction).filter(Boolean)
      : [];
    return {
      id: r._id || r.externalId,
      title: r.title,
      description: r.description,
      image: r.image,
      time: r.time,
      servings: r.servings,
      difficulty: r.difficulty,
      rating: r.rating,
      nutrients: r.nutrients || [],
      ingredients,
      instructions
    };
  },

  async saveRecipe(recipeOrId: any) {
    try {
      const recipeId = typeof recipeOrId === 'string' ? recipeOrId : recipeOrId?.id;
      const body = typeof recipeOrId === 'string' ? {} : {
        title: recipeOrId?.title,
        description: recipeOrId?.description,
        time: recipeOrId?.time,
        servings: recipeOrId?.servings,
        difficulty: recipeOrId?.difficulty,
        rating: recipeOrId?.rating,
        ingredients: recipeOrId?.ingredients,
        instructions: recipeOrId?.instructions,
        nutrients: recipeOrId?.nutrients,
        mealType: recipeOrId?.mealType,
        cuisine: 'indian'
      };
      const response = await api.post(`/recipes/${recipeId}/save`, body);
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // Dev fallback: mark saved in localStorage store
        const key = `savedRecipes${devUserSuffix()}`;
        const store = JSON.parse(localStorage.getItem(key) || '[]');
        const rid = typeof recipeOrId === 'string' ? recipeOrId : recipeOrId?.id;
        if (!store.find((r: any) => r.id === rid)) {
          store.push({ id: rid, savedAt: new Date().toISOString() });
          localStorage.setItem(key, JSON.stringify(store));
        }
        return { message: 'Recipe saved (dev fallback)' };
      }
      throw error;
    }
  },

  async getSavedRecipes(page: number = 1, limit: number = 50) {
    try {
      const response = await api.get('/recipes/saved/list', { params: { page, limit } });
      const list = Array.isArray(response?.data?.recipes) ? response.data.recipes : [];
      const mapped = list.map((r: any) => ({
        id: r._id || r.externalId,
        title: r.title,
        description: r.description,
        image: r.image,
        time: r.time,
        servings: r.servings,
        difficulty: r.difficulty,
        rating: r.rating,
        nutrients: r.nutrients,
        savedAt: r.updatedAt || r.createdAt
      }));
      return { recipes: mapped, totalPages: response?.data?.totalPages || 1, currentPage: response?.data?.currentPage || page, total: response?.data?.total ?? mapped.length };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        const fullKey = `savedRecipesFull${devUserSuffix()}`;
        const full = JSON.parse(localStorage.getItem(fullKey) || '[]');
        if (Array.isArray(full) && full.length) {
          return { recipes: full, totalPages: 1, currentPage: 1, total: full.length };
        }
        const idsKey = `savedRecipes${devUserSuffix()}`;
        const idsOnly = JSON.parse(localStorage.getItem(idsKey) || '[]');
        return { recipes: idsOnly, totalPages: 1, currentPage: 1, total: idsOnly.length };
      }
      throw error;
    }
  },

  async removeSavedRecipe(recipeId: string) {
    try {
      const response = await api.delete(`/recipes/${recipeId}/save`);
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        const idsKey = `savedRecipes${devUserSuffix()}`;
        const store = JSON.parse(localStorage.getItem(idsKey) || '[]');
        const next = store.filter((r: any) => r.id !== recipeId);
        localStorage.setItem(idsKey, JSON.stringify(next));
        const fullKey = `savedRecipesFull${devUserSuffix()}`;
        const fullStore = JSON.parse(localStorage.getItem(fullKey) || '[]');
        const fullNext = fullStore.filter((r: any) => r.id !== recipeId);
        localStorage.setItem(fullKey, JSON.stringify(fullNext));
        return { message: 'Recipe removed (dev fallback)' };
      }
      throw error;
    }
  }
};

export const analyticsService = {
  async getDashboardData() {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  async getAdminAnalytics() {
    const response = await api.get('/analytics/admin');
    return response.data;
  }
};

export const goalsService = {
  async getGoals() {
    const response = await api.get('/goals');
    return response.data;
  },

  async createGoal(goal: { title: string; description: string; target: string; targetValue?: number }) {
    const response = await api.post('/goals', goal);
    return response.data;
  },

  async updateGoal(id: string, updates: any) {
    const response = await api.patch(`/goals/${id}`, updates);
    return response.data;
  },

  async deleteGoal(id: string) {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

export default api;
