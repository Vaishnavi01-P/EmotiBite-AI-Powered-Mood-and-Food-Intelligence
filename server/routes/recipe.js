const express = require('express');
const Recipe = require('../models/Recipe');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get recipe recommendations
router.post('/recommend', authMiddleware, async (req, res) => {
  try {
    const { mood, nutrients, mealType, cuisine = 'indian' } = req.body;

    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }

    // Build query for recipe recommendations
    const query = {
      isActive: true,
      moodTags: mood,
      cuisine
    };

    if (nutrients && nutrients.length > 0) {
      query.nutrients = { $in: nutrients };
    }

    if (mealType) {
      query.mealType = mealType;
    }

    const recipes = await Recipe.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .limit(6)
      .select('-instructions -ingredients');

    res.json({ recipes });
  } catch (error) {
    console.error('Recipe recommendation error:', error);
    res.status(500).json({ message: 'Error getting recipe recommendations' });
  }
});

// Get recipe details
router.get('/:recipeId', authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.params;
    let recipe = null;
    try {
      recipe = await Recipe.findById(recipeId);
    } catch (_) {}
    if (!recipe) {
      recipe = await Recipe.findOne({ externalId: recipeId });
    }
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ recipe });
  } catch (error) {
    console.error('Recipe details error:', error);
    res.status(500).json({ message: 'Error fetching recipe details' });
  }
});

// Save recipe to user's favorites
router.post('/:recipeId/save', authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const payload = req.body || {};
    
    let recipe = null;
    try {
      recipe = await Recipe.findById(recipeId);
    } catch (_) {}
    if (!recipe) {
      recipe = await Recipe.findOne({ externalId: recipeId });
    }
    
    if (!recipe) {
      const doc = new Recipe({
        externalId: recipeId,
        title: payload.title || 'Saved Recipe',
        description: payload.description || '',
        time: payload.time || 0,
        servings: payload.servings || 0,
        difficulty: payload.difficulty || 'Easy',
        rating: typeof payload.rating === 'number' ? payload.rating : 0,
        ingredients: Array.isArray(payload.ingredients) ? payload.ingredients.map((s) => ({ name: s })) : [],
        instructions: Array.isArray(payload.instructions) ? payload.instructions.map((s, i) => ({ step: i + 1, instruction: s })) : [],
        nutrients: Array.isArray(payload.nutrients) ? payload.nutrients : [],
        moodTags: Array.isArray(payload.moodTags) ? payload.moodTags : [],
        mealType: payload.mealType || null,
        cuisine: payload.cuisine || 'indian'
      });
      recipe = await doc.save();
    }

    // Check if already saved
    const already = (recipe.savedBy || []).some(userId => userId.toString() === req.user._id.toString());
    if (already) {
      return res.status(400).json({ message: 'Recipe already saved' });
    }

    recipe.savedBy.push(req.user._id);
    await recipe.save();

    res.json({ message: 'Recipe saved successfully' });
  } catch (error) {
    console.error('Save recipe error:', error);
    res.status(500).json({ message: 'Error saving recipe' });
  }
});

// Remove recipe from user's favorites
router.delete('/:recipeId/save', authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    let recipe = null;
    try {
      recipe = await Recipe.findById(recipeId);
    } catch (_) {}
    if (!recipe) {
      recipe = await Recipe.findOne({ externalId: recipeId });
    }
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipe.savedBy = (recipe.savedBy || []).filter(
      userId => userId.toString() !== req.user._id.toString()
    );
    await recipe.save();

    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    console.error('Remove recipe error:', error);
    res.status(500).json({ message: 'Error removing recipe' });
  }
});

// Get user's saved recipes
router.get('/saved/list', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const recipes = await Recipe.find({
      savedBy: req.user._id,
      isActive: true
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-instructions -ingredients');

    const total = await Recipe.countDocuments({
      savedBy: req.user._id,
      isActive: true
    });

    res.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Saved recipes error:', error);
    res.status(500).json({ message: 'Error fetching saved recipes' });
  }
});

// Rate recipe
router.post('/:recipeId/rate', authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const recipe = await Recipe.findById(recipeId);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Update rating (simple average for now)
    const newRating = ((recipe.rating * recipe.savedBy.length) + rating) / (recipe.savedBy.length + 1);
    recipe.rating = Math.round(newRating * 10) / 10;
    
    await recipe.save();

    res.json({ message: 'Recipe rated successfully', newRating: recipe.rating });
  } catch (error) {
    console.error('Rate recipe error:', error);
    res.status(500).json({ message: 'Error rating recipe' });
  }
});

// Search recipes
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q, mood, difficulty, time, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true };
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (mood) {
      query.moodTags = mood;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (time) {
      query.time = { $lte: parseInt(time) };
    }

    const recipes = await Recipe.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-instructions -ingredients');

    const total = await Recipe.countDocuments(query);

    res.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Search recipes error:', error);
    res.status(500).json({ message: 'Error searching recipes' });
  }
});

module.exports = router;
