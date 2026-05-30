const express = require('express');
const MealLog = require('../models/MealLog');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Log a meal (optionally with moodBefore/After)
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { recipeId, title, nutrients = [], moodBefore, moodAfter } = req.body;

    const doc = await MealLog.create({
      userId: req.user._id,
      recipeId: recipeId || undefined,
      title: title || undefined,
      nutrients: Array.isArray(nutrients) ? nutrients : [],
      moodBefore: moodBefore ? String(moodBefore).toLowerCase() : undefined,
      moodAfter: moodAfter ? String(moodAfter).toLowerCase() : undefined,
    });

    res.json({ message: 'Meal logged', mealLog: doc });
  } catch (err) {
    console.error('Log meal error:', err);
    res.status(500).json({ message: 'Error logging meal' });
  }
});

// Get meal history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10), 1), 200);

    const [items, total] = await Promise.all([
      MealLog.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      MealLog.countDocuments({ userId: req.user._id })
    ]);

    res.json({ meals: items, total, currentPage: page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Meal history error:', err);
    res.status(500).json({ message: 'Error fetching meal history' });
  }
});

module.exports = router;
