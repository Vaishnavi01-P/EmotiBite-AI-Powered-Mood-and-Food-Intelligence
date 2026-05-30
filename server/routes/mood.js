const express = require('express');
const MoodEntry = require('../models/MoodEntry');
const { authMiddleware } = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// Analyze mood
router.post('/analyze', authMiddleware, async (req, res) => {
  try {
    const { text, voiceData } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Mood text is required' });
    }

    // Call AI service for mood analysis
    let aiResponse;
    try {
      aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/analyze`, {
        text,
        voiceData
      });
    } catch (aiError) {
      console.error('AI service error:', aiError);
      // Fallback to mock analysis
      aiResponse = {
        data: {
          mood: 'stressed',
          intensity: 75,
          confidence: 80,
          nutrients: ['MAGNESIUM', 'VITAMIN_B', 'OMEGA_3', 'POTASSIUM'],
          recommendations: [
            {
              meal: 'breakfast',
              foods: [
                { name: 'Poha', description: 'Light, iron-rich flattened rice with peanuts', rating: 5 },
                { name: 'Idli with Sambar', description: 'Fermented rice cakes with protein-rich lentil stew', rating: 5 },
                { name: 'Upma', description: 'Semolina cooked with veggies for complex carbs', rating: 4 }
              ]
            },
            {
              meal: 'lunch',
              foods: [
                { name: 'Dal Tadka with Brown Rice', description: 'Protein and complex carbs for steady energy', rating: 5 },
                { name: 'Grilled Paneer Bowl', description: 'High protein with veggies and healthy fats', rating: 4 }
              ]
            },
            {
              meal: 'snacks',
              foods: [
                { name: 'Sprouts Chaat', description: 'Plant protein and fiber, mood-stabilizing nutrients', rating: 5 },
                { name: 'Roasted Chana', description: 'Protein and fiber for satiety', rating: 4 }
              ]
            },
            {
              meal: 'dinner',
              foods: [
                { name: 'Palak Paneer with Roti', description: 'Iron and protein to reduce fatigue', rating: 5 },
                { name: 'Veg Khichdi', description: 'Light, comforting complete meal with good carbs and protein', rating: 4 }
              ]
            }
          ]
        }
      };
    }

    const { mood, intensity, confidence, nutrients, recommendations } = aiResponse.data;
    const iVal = typeof intensity === 'number' ? intensity : 0;
    const cVal = typeof confidence === 'number' ? confidence : 0;
    const intensityPct = Math.max(0, Math.min(100, iVal <= 1 ? iVal * 100 : iVal));
    const confidencePct = Math.max(0, Math.min(100, cVal <= 1 ? cVal * 100 : cVal));
    const lowerText = String(text || '').toLowerCase();
    const isAnxious = ['anxious','worried','nervous','presentation','exam','on edge','restless','panic','fearful'].some(k => lowerText.includes(k));
    const isStressed = ['stressed','overwhelmed','deadline','pressure','urgent','rush','under pressure'].some(k => lowerText.includes(k));
    let finalMood = mood;
    let finalIntensity = intensityPct;
    if (isAnxious && (finalMood === 'sad' || finalMood === 'neutral')) {
      finalMood = 'anxious';
      finalIntensity = Math.max(finalIntensity, 60);
    } else if (isStressed && finalMood !== 'anxious') {
      finalMood = 'stressed';
      finalIntensity = Math.max(finalIntensity, 70);
    }

    finalIntensity = Math.round(Math.max(5, Math.min(95, finalIntensity)));
    const rawConf = Math.max(0, Math.min(1, cVal <= 1 ? cVal : cVal / 100));
    const finalConfidence = Math.round(Math.max(45, Math.min(90, 50 + ((rawConf - 0.5) * 80))));

    // Save mood entry to database
    const moodEntry = new MoodEntry({
      user: req.user._id,
      text: text.trim(),
      voiceData,
      mood: finalMood,
      intensity: finalIntensity,
      confidence: finalConfidence,
      nutrients,
      recommendations,
      aiAnalysis: aiResponse.data
    });

    await moodEntry.save();

    res.json({
      id: moodEntry._id,
      mood: finalMood,
      intensity: finalIntensity,
      confidence: finalConfidence,
      text: text.trim(),
      nutrients,
      recommendations
    });
  } catch (error) {
    console.error('Mood analysis error:', error);
    res.status(500).json({ message: 'Error analyzing mood' });
  }
});

// Get mood history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, mood } = req.query;
    
    const query = { user: req.user._id };
    if (mood) {
      query.mood = mood;
    }

    const entries = await MoodEntry.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-voiceData -aiAnalysis');

    const total = await MoodEntry.countDocuments(query);

    res.json({
      entries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Mood history error:', error);
    res.status(500).json({ message: 'Error fetching mood history' });
  }
});

// Get mood statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await MoodEntry.aggregate([
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
          avgIntensity: { $avg: '$intensity' },
          avgConfidence: { $avg: '$confidence' }
        }
      },
      {
        $sort: { count: -1 }
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

    res.json({
      totalEntries,
      avgIntensity: avgIntensity[0]?.avgIntensity || 0,
      emotionBreakdown: stats,
      period: `${days} days`
    });
  } catch (error) {
    console.error('Mood stats error:', error);
    res.status(500).json({ message: 'Error fetching mood statistics' });
  }
});

// Download mood report
router.get('/download/:moodId', authMiddleware, async (req, res) => {
  try {
    const { moodId } = req.params;
    
    const moodEntry = await MoodEntry.findOne({
      _id: moodId,
      user: req.user._id
    });

    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    // Generate PDF report (mock for now)
    const reportData = {
      title: 'Mood Analysis Report',
      date: moodEntry.createdAt,
      mood: moodEntry.mood,
      intensity: moodEntry.intensity,
      confidence: moodEntry.confidence,
      text: moodEntry.text,
      nutrients: moodEntry.nutrients,
      recommendations: moodEntry.recommendations
    };

    // For now, return JSON data. In production, you'd generate a PDF
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=mood-report-${moodId}.json`);
    res.json(reportData);
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({ message: 'Error downloading report' });
  }
});

// Delete mood entry
router.delete('/:moodId', authMiddleware, async (req, res) => {
  try {
    const { moodId } = req.params;
    
    const moodEntry = await MoodEntry.findOneAndDelete({
      _id: moodId,
      user: req.user._id
    });

    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({ message: 'Error deleting mood entry' });
  }
});

module.exports = router;
