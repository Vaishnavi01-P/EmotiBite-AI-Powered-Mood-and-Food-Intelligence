const express = require('express');
const MoodLog = require('../models/MoodLog');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Log a mood
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { mood, intensity, text } = req.body;
    if (!mood) return res.status(400).json({ message: 'Mood is required' });

    const doc = await MoodLog.create({
      userId: req.user._id,
      mood: String(mood).toLowerCase(),
      intensity: typeof intensity === 'number' ? intensity : undefined,
      text: text || ''
    });

    res.json({ message: 'Mood logged', moodLog: doc });
  } catch (err) {
    console.error('Log mood error:', err);
    res.status(500).json({ message: 'Error logging mood' });
  }
});

// Get mood history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10), 1), 200);

    const [items, total] = await Promise.all([
      MoodLog.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      MoodLog.countDocuments({ userId: req.user._id })
    ]);

    res.json({ moods: items, total, currentPage: page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ message: 'Error fetching mood history' });
  }
});

module.exports = router;
