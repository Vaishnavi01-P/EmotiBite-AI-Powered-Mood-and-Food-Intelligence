const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const MealLog = require('../models/MealLog');
const MoodLog = require('../models/MoodLog');

const router = express.Router();

// Map moods to numeric scores for simple deltas
const moodScore = (m) => {
  const key = String(m || '').toLowerCase();
  switch (key) {
    case 'happy': return 80;
    case 'calm': return 70;
    case 'excited': return 75;
    case 'peaceful': return 72;
    case 'tired': return 40;
    case 'anxious': return 30;
    case 'stressed': return 20;
    case 'sad': return 25;
    default: return 50;
  }
};

// GET /api/impact/summary?range=7d
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const range = String(req.query.range || '7d');
    const now = new Date();
    const days = range.endsWith('d') ? parseInt(range) : 7;
    const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const meals = await MealLog.find({ userId: req.user._id, createdAt: { $gte: from } }).lean();

    // Aggregate nutrient -> mood delta
    const nutrientAgg = {};
    for (const meal of meals) {
      const before = moodScore(meal.moodBefore);
      const after = moodScore(meal.moodAfter);
      const hasDelta = Number.isFinite(before) && Number.isFinite(after);
      const delta = hasDelta ? after - before : 0;
      const nutrients = Array.isArray(meal.nutrients) ? meal.nutrients : [];
      for (const n of nutrients) {
        const key = String(n).toUpperCase();
        if (!nutrientAgg[key]) nutrientAgg[key] = { totalDelta: 0, count: 0 };
        if (hasDelta) {
          nutrientAgg[key].totalDelta += delta;
          nutrientAgg[key].count += 1;
        }
      }
    }

    const nutrientImpact = Object.entries(nutrientAgg).map(([nutrient, v]) => ({
      nutrient,
      avgDelta: v.count ? Math.round((v.totalDelta / v.count) * 10) / 10 : 0,
      samples: v.count
    })).sort((a, b) => b.avgDelta - a.avgDelta);

    // Mood trend (for graph): last N days mood average per day from MoodLog
    const moods = await MoodLog.find({ userId: req.user._id, createdAt: { $gte: from } })
      .sort({ createdAt: 1 })
      .lean();

    const byDay = {};
    for (const m of moods) {
      const d = new Date(m.createdAt);
      const dayKey = d.toISOString().slice(0, 10);
      if (!byDay[dayKey]) byDay[dayKey] = { total: 0, count: 0 };
      byDay[dayKey].total += moodScore(m.mood);
      byDay[dayKey].count += 1;
    }
    const moodTrend = Object.entries(byDay)
      .map(([day, v]) => ({ day, score: Math.round((v.total / Math.max(v.count, 1)) * 10) / 10 }))
      .sort((a, b) => a.day.localeCompare(b.day));

    res.json({
      range: { from, to: now },
      nutrientImpact,
      moodTrend,
    });
  } catch (err) {
    console.error('Impact summary error:', err);
    res.status(500).json({ message: 'Error computing impact summary' });
  }
});

module.exports = router;
