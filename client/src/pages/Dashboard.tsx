import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Plus, Calendar, Award } from 'lucide-react';
import { analyticsService, impactService, moodLogService, goalsService } from '../services/authService';
import { useGamification } from '../contexts/GamificationContext';

interface DashboardData {
  totalEntries: number;
  averageIntensity: number;
  emotionsTracked: number;
  emotionBreakdown: { [key: string]: number };
  recentEntries: any[];
  goals: Goal[];
}

interface Goal {
  id: string;
  title: string;
  description: string;
  target: string;
  targetValue?: number;
  progress: number;
  status: 'in_progress' | 'completed' | 'not_started';
}

interface GoalItemProps {
  goal: Goal;
  onUpdate: (id: string, delta: number) => void;
  getStatusColor: (status: string) => string;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onUpdate, getStatusColor }) => {
  const currentTarget = goal.targetValue || 7;
  const progressPercent = Math.min(100, Math.max(0, (goal.progress / currentTarget) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-white">{goal.title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
          {goal.status === 'in_progress' ? '🔄 In Progress' :
            goal.status === 'completed' ? '✅ Completed' : '⏳ Not Started'}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-3">{goal.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">Target: {goal.target}</span>
        <div className="flex flex-col space-y-3 w-full sm:w-auto">
          <div className="flex items-center justify-between sm:justify-end space-x-4">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdate(goal.id, -1);
                }}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-50"
                disabled={goal.progress <= 0}
                title="Undo Check-In"
              >
                <svg className="pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <span className="text-sm font-medium text-gray-300 w-12 text-center">
                {goal.progress}/{currentTarget}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdate(goal.id, 1);
                }}
                className="p-1 rounded bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50"
                disabled={goal.progress >= currentTarget}
                title="Mark Check-In"
              >
                <svg className="pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${goal.status === 'completed' ? 'bg-green-500' : 'bg-purple-500'}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [moodTrend, setMoodTrend] = useState<{ day: string; score: number }[]>([]);
  const [nutrientImpact, setNutrientImpact] = useState<{ nutrient: string; avgDelta: number; samples: number }[]>([]);
  const { coins, badges, level, streakDays, lastEarnedMessage } = useGamification();

  useEffect(() => {
    fetchDashboardData();
    fetchImpact();
    fetchMoodHistory();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await analyticsService.getDashboardData();
      if (response && typeof response.totalEntries === 'number' && response.totalEntries > 0) {
        setDashboardData({
          ...response,
          goals: (response.goals || []).map((g: any) => ({ ...g, id: g._id || g.id }))
        });
        return;
      }

      const hist = await moodLogService.history(1, 500);
      const moods = Array.isArray(hist?.moods) ? hist.moods : [];
      const totalEntries = moods.length;
      const byEmotion: Record<string, number> = {};
      const score = (m: string) => {
        const s = (m || '').toLowerCase();
        if (s === 'happy') return 80;
        if (s === 'calm') return 70;
        if (s === 'excited') return 75;
        if (s === 'tired') return 40;
        if (s === 'anxious') return 30;
        if (s === 'stressed') return 20;
        if (s === 'sad') return 25;
        return 50;
      };
      let totalScore = 0;
      let intensities: number[] = [];
      moods.forEach((m: any) => {
        const key = (m.mood || '').toLowerCase();
        byEmotion[key] = (byEmotion[key] || 0) + 1;
        if (typeof m.intensity === 'number') intensities.push(m.intensity);
        totalScore += score(m.mood);
      });
      const emotionsTracked = Object.keys(byEmotion).filter(Boolean).length;
      const averageIntensity = intensities.length
        ? Math.round(intensities.reduce((a, b) => a + b, 0) / intensities.length)
        : (totalEntries ? Math.round(totalScore / totalEntries) : 0);

      setDashboardData({
        totalEntries,
        averageIntensity,
        emotionsTracked,
        emotionBreakdown: byEmotion,
        recentEntries: moods.slice(0, 10),
        goals: (response.goals || []).map((g: any) => ({ ...g, id: g._id || g.id }))
      });
    } catch (_) {
      try {
        const hist = await moodLogService.history(1, 500);
        const moods = Array.isArray(hist?.moods) ? hist.moods : [];
        const totalEntries = moods.length;
        const byEmotion: Record<string, number> = {};
        let intensities: number[] = [];
        moods.forEach((m: any) => {
          const key = (m.mood || '').toLowerCase();
          byEmotion[key] = (byEmotion[key] || 0) + 1;
          if (typeof m.intensity === 'number') intensities.push(m.intensity);
        });
        const emotionsTracked = Object.keys(byEmotion).filter(Boolean).length;
        const averageIntensity = intensities.length
          ? Math.round(intensities.reduce((a, b) => a + b, 0) / intensities.length)
          : 0;
        setDashboardData({
          totalEntries,
          averageIntensity,
          emotionsTracked,
          emotionBreakdown: byEmotion,
          recentEntries: moods.slice(0, 10),
          goals: []
        });
      } catch (err) {
        setDashboardData({
          totalEntries: 0,
          averageIntensity: 0,
          emotionsTracked: 0,
          emotionBreakdown: {},
          recentEntries: [],
          goals: []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getEmotionHex = (emotion: string) => {
    const map: { [k: string]: string } = {
      stressed: '#f87171', // red-400
      happy: '#fbbf24',    // amber-400
      anxious: '#f472b6',  // pink-400
      tired: '#a78bfa',    // violet-400
      calm: '#34d399',     // emerald-400
      sad: '#60a5fa',      // blue-400
      excited: '#fb923c',  // orange-400
    };
    return map[emotion] || '#9ca3af'; // gray-400
  };

  const fetchImpact = async () => {
    try {
      const data = await impactService.summary('7d');
      setMoodTrend(data.moodTrend || []);
      setNutrientImpact(data.nutrientImpact || []);
    } catch (e) {
      setMoodTrend([]);
      setNutrientImpact([]);
    }
  };

  const fetchMoodHistory = async () => {
    try {
      const hist = await moodLogService.history(1, 200);
      if (!hist?.moods?.length) return;
      // If backend didn't provide trend, compute a simple per-day average locally
      const byDay: Record<string, { total: number; count: number }> = {};
      const score = (m: string) => {
        const s = (m || '').toLowerCase();
        if (s === 'happy') return 80;
        if (s === 'calm') return 70;
        if (s === 'excited') return 75;
        if (s === 'tired') return 40;
        if (s === 'anxious') return 30;
        if (s === 'stressed') return 20;
        if (s === 'sad') return 25;
        return 50;
      };
      hist.moods.forEach((m: any) => {
        const day = new Date(m.createdAt).toISOString().slice(0, 10);
        if (!byDay[day]) byDay[day] = { total: 0, count: 0 };
        byDay[day].total += score(m.mood);
        byDay[day].count += 1;
      });
      const trend = Object.entries(byDay)
        .map(([day, v]) => ({ day, score: Math.round((v.total / Math.max(1, v.count)) * 10) / 10 }))
        .sort((a, b) => a.day.localeCompare(b.day));
      if (!moodTrend.length) setMoodTrend(trend);
    } catch (_) { }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await goalsService.createGoal({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        target: formData.get('target') as string,
        targetValue: parseInt(formData.get('targetValue') as string) || 7
      });
      setShowAddGoal(false);
      fetchDashboardData(); // Refresh list
    } catch (error) {
      console.error('Failed to create goal', error);
      alert('Failed to create goal');
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      stressed: 'bg-red-500/20 text-red-200 border border-red-500/30',
      happy: 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30',
      anxious: 'bg-pink-500/20 text-pink-200 border border-pink-500/30',
      tired: 'bg-purple-500/20 text-purple-200 border border-purple-500/30',
      calm: 'bg-green-500/20 text-green-200 border border-green-500/30',
      sad: 'bg-blue-500/20 text-blue-200 border border-blue-500/30',
      excited: 'bg-orange-500/20 text-orange-200 border border-orange-500/30'
    };
    return colors[emotion] || 'bg-gray-500/20 text-gray-200 border border-gray-500/30';
  };

  const handleProgressUpdate = async (goalId: string, delta: number) => {
    if (!dashboardData?.goals) return;
    const goal = dashboardData.goals.find(g => g.id === goalId);
    if (!goal) return;

    const currentTarget = goal.targetValue || 7;
    const newProgress = Math.max(0, Math.min(currentTarget, goal.progress + delta));

    if (newProgress === goal.progress) return; // No change

    const newStatus: Goal['status'] = newProgress >= currentTarget ? 'completed' : (newProgress > 0 ? 'in_progress' : 'not_started');

    // Optimistic update
    const updatedGoal = { ...goal, progress: newProgress, status: newStatus };
    setDashboardData(prev => prev ? {
      ...prev,
      goals: prev.goals.map(g => g.id === goal.id ? updatedGoal : g)
    } : null);

    try {
      await goalsService.updateGoal(goal.id, { progress: newProgress, status: newStatus });
    } catch (error) {
      console.error('Failed to update goal progress', error);
      // Revert on failure
      fetchDashboardData();
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-200 border border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-200 border border-blue-500/30';
      case 'not_started': return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-purple-400" />
            Your Mood Analytics
          </h1>
          <p className="text-gray-300 mt-1">Last 30 Days</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {dashboardData?.totalEntries}
          </div>
          <div className="text-sm text-gray-300">Total Entries</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="soft-card shadow-glow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-sm text-gray-400">Avg</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {dashboardData?.averageIntensity}%
          </div>
          <div className="text-sm text-gray-300">Avg Intensity</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="soft-card shadow-glow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Award className="h-6 w-6 text-green-400" />
            </div>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {dashboardData?.emotionsTracked}
          </div>
          <div className="text-sm text-gray-300">Emotions Tracked</div>
        </motion.div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Emotion Breakdown</h3>
        <div className="space-y-2">
          {Object.entries(dashboardData?.emotionBreakdown || {}).map(([emotion, count]) => (
            <div key={emotion} className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(emotion)}`}>
                {emotion}
              </span>
              <span className="text-gray-300">{count} entries</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emotion Breakdown (Pie Chart) */}
      <div className="soft-card shadow-glow p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Emotion Breakdown (Pie)</h3>
        {(() => {
          const breakdown = dashboardData?.emotionBreakdown || {};
          const entries = Object.entries(breakdown);
          const total = entries.reduce((sum, [, v]) => sum + (v as number), 0) || 0;
          if (!total) return <div className="text-gray-500">No data yet.</div>;
          const radius = 80;
          const circumference = 2 * Math.PI * radius;
          let offset = 0;
          return (
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <svg width={220} height={220} viewBox="0 0 220 220">
                <g transform="translate(110,110) rotate(-90)">
                  {entries.map(([emotion, count]) => {
                    const frac = total ? (count as number) / total : 0;
                    const dash = circumference * frac;
                    const circle = (
                      <circle
                        key={emotion}
                        r={radius}
                        cx={0}
                        cy={0}
                        fill="transparent"
                        stroke={getEmotionHex(emotion)}
                        strokeWidth={30}
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += dash;
                    return circle;
                  })}
                </g>
              </svg>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {entries.map(([emotion, count]) => (
                  <div key={emotion} className="flex items-center justify-between bg-white/5 rounded px-3 py-2 border border-white/5">
                    <div className="flex items-center space-x-2">
                      <span className="inline-block w-3 h-3 rounded" style={{ background: getEmotionHex(emotion) }} />
                      <span className="text-sm text-gray-300 capitalize">{emotion}</span>
                    </div>
                    <div className="text-sm text-gray-400">{total ? Math.round(((count as number) / total) * 100) : 0}%</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Gamification Summary */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">Your Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border border-white/10 rounded-lg bg-white/5">
            <div className="text-sm text-gray-400">MoodCoins</div>
            <div className="text-2xl font-bold text-purple-400">{coins}</div>
          </div>
          <div className="p-4 border border-white/10 rounded-lg bg-white/5">
            <div className="text-sm text-gray-400">Level</div>
            <div className="text-xl font-semibold text-white">{level}</div>
          </div>
          <div className="p-4 border border-white/10 rounded-lg bg-white/5">
            <div className="text-sm text-gray-400">Mood Streak</div>
            <div className="text-xl font-semibold text-white">{streakDays} days</div>
          </div>
          <div className="p-4 border border-white/10 rounded-lg bg-white/5">
            <div className="text-sm text-gray-400">Badges</div>
            <div className="flex flex-wrap gap-2">
              {badges.length === 0 ? (
                <span className="text-gray-500 text-sm">No badges yet</span>
              ) : (
                badges.map((b) => (
                  <span key={b} className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">{b}</span>
                ))
              )}
            </div>
          </div>
        </div>
        {lastEarnedMessage && (
          <div className="mt-3 text-sm text-green-300 bg-green-500/20 border border-green-500/30 rounded px-3 py-2">{lastEarnedMessage}</div>
        )}
      </div>

      {/* Mood Improvement Graph (last 7-14 days) */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Mood Improvement (Last 7 Days)</h3>
        {moodTrend.length === 0 ? (
          <div className="text-gray-400">No mood history yet. Analyze your mood to see trends.</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <svg width={Math.max(400, moodTrend.length * 60)} height={180}>
              {/* axes */}
              <line x1={40} y1={20} x2={40} y2={150} stroke="#4b5563" />
              <line x1={40} y1={150} x2={Math.max(380, moodTrend.length * 60)} y2={150} stroke="#4b5563" />
              {(() => {
                const maxX = Math.max(380, moodTrend.length * 60);
                const points = moodTrend.map((p, i) => {
                  const x = 40 + i * ((maxX - 60) / Math.max(1, moodTrend.length - 1));
                  const y = 150 - ((p.score - 20) / 60) * 120; // map 20..80 to 150..30
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <g>
                    <polyline fill="none" stroke="#a78bfa" strokeWidth={3} points={points} />
                    {moodTrend.map((p, i) => {
                      const x = 40 + i * ((maxX - 60) / Math.max(1, moodTrend.length - 1));
                      const y = 150 - ((p.score - 20) / 60) * 120;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r={4} fill="#a78bfa" />
                          <text x={x} y={165} textAnchor="middle" className="fill-gray-400 text-[10px]">{p.day.slice(5)}</text>
                        </g>
                      );
                    })}
                  </g>
                );
              })()}
            </svg>
            <div className="mt-2 text-sm text-gray-400">Higher is better (mapped from moods to a 20–80 scale)</div>
          </div>
        )}
      </div>

      {/* Impact by Nutrient (avg mood delta) */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Impact by Nutrient (7 Days)</h3>
        {nutrientImpact.length === 0 ? (
          <div className="text-gray-400">No meal logs yet. Use "Log as eaten" to see impact here.</div>
        ) : (
          <div className="space-y-3">
            {nutrientImpact.slice(0, 8).map((n) => (
              <div key={n.nutrient} className="flex items-center">
                <div className="w-32 text-sm text-gray-300">{n.nutrient}</div>
                <div className="flex-1 bg-white/10 h-3 rounded">
                  <div
                    className={`h-3 rounded ${n.avgDelta >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ width: `${Math.min(100, Math.abs(n.avgDelta) * 5)}%` }}
                  />
                </div>
                <div className="w-24 text-right text-sm text-gray-400 ml-2">
                  {n.avgDelta >= 0 ? '+' : ''}{n.avgDelta} ({n.samples})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goals Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Target className="h-6 w-6 mr-2" />
            Goals
          </h3>
          <button
            onClick={() => setShowAddGoal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Goal</span>
          </button>
        </div>

        <div className="space-y-4">
          {dashboardData?.goals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onUpdate={handleProgressUpdate}
              getStatusColor={getGoalStatusColor}
            />
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Add New Goal</h3>
            <form className="space-y-4" onSubmit={handleCreateGoal}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Goal Title
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Stay Calm for 7 Days"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Describe your goal..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target
                </label>
                <input
                  name="target"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., calm for 7 days"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Value (Number)
                </label>
                <input
                  name="targetValue"
                  type="number"
                  min="1"
                  defaultValue="7"
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 7"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 px-4 py-2 border border-white/20 text-gray-300 rounded-lg hover:bg-white/5 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
