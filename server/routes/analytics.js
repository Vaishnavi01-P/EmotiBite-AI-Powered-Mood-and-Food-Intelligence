const express = require('express');
const MoodEntry = require('../models/MoodEntry');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Goal = require('../models/Goal');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get mood statistics
    const moodStats = await MoodEntry.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' }
        }
      }
    ]);

    const totalEntries = await MoodEntry.countDocuments({
      user: req.user._id,
      createdAt: { $gte: startDate }
    });

    const avgIntensity = await MoodEntry.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          avgIntensity: { $avg: '$intensity' }
        }
      }
    ]);

    // Get recent entries
    const recentEntries = await MoodEntry.find({
      user: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-voiceData -aiAnalysis');

    // Get user goals
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      totalEntries,
      averageIntensity: Math.round(avgIntensity[0]?.avgIntensity || 0),
      emotionsTracked: moodStats.length,
      emotionBreakdown: moodStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      recentEntries,
      goals
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Get admin analytics
router.get('/admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Get mood entry statistics
    const totalEntries = await MoodEntry.countDocuments();

    const emotionStats = await MoodEntry.aggregate([
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get recipe statistics
    const totalRecipes = await Recipe.countDocuments({ isActive: true });
    const savedRecipes = await Recipe.aggregate([
      {
        $project: {
          savedCount: { $size: '$savedBy' }
        }
      },
      {
        $group: {
          _id: null,
          totalSaved: { $sum: '$savedCount' }
        }
      }
    ]);

    // System health (mock data)
    const systemHealth = {
      uptime: '99.9%',
      responseTime: 120,
      errorRate: 0.1
    };

    res.json({
      totalUsers,
      totalEntries,
      activeUsers,
      emotionStats,
      totalRecipes,
      totalSavedRecipes: savedRecipes[0]?.totalSaved || 0,
      systemHealth
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ message: 'Error fetching admin analytics' });
  }
});

// Get mood trends over time
router.get('/trends', authMiddleware, async (req, res) => {
  try {
    const { days = 30, mood } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const matchQuery = {
      user: req.user._id,
      createdAt: { $gte: startDate }
    };

    if (mood) {
      matchQuery.mood = mood;
    }

    const trends = await MoodEntry.aggregate([
      {
        $match: matchQuery
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            mood: '$mood'
          },
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    res.json({ trends });
  } catch (error) {
    console.error('Mood trends error:', error);
    res.status(500).json({ message: 'Error fetching mood trends' });
  }
});

// Get nutrition insights
router.get('/nutrition', authMiddleware, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const nutritionStats = await MoodEntry.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $unwind: '$nutrients'
      },
      {
        $group: {
          _id: '$nutrients',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({ nutritionStats });
  } catch (error) {
    console.error('Nutrition insights error:', error);
    res.status(500).json({ message: 'Error fetching nutrition insights' });
  }
});

// Get user activity summary
router.get('/activity', authMiddleware, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activity = await MoodEntry.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          entries: { $sum: 1 },
          moods: { $addToSet: '$mood' },
          avgIntensity: { $avg: '$intensity' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    res.json({ activity });
  } catch (error) {
    console.error('Activity summary error:', error);
    res.status(500).json({ message: 'Error fetching activity summary' });
  }
});

module.exports = router;
