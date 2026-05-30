const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    type: String,
    default: null
  },
  time: {
    type: Number,
    required: true,
    min: [1, 'Time must be at least 1 minute']
  },
  servings: {
    type: Number,
    required: true,
    min: [1, 'Servings must be at least 1']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    amount: String,
    unit: String
  }],
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    instruction: {
      type: String,
      required: true
    }
  }],
  nutrients: [{
    type: String,
    enum: ['MAGNESIUM', 'VITAMIN_B', 'OMEGA_3', 'POTASSIUM', 'IRON', 'FOLATE', 'ANTIOXIDANTS', 'PROTEIN', 'COMPLEX_CARBS', 'HEALTHY_FATS']
  }],
  moodTags: [{
    type: String,
    enum: ['happy', 'sad', 'stressed', 'anxious', 'tired', 'calm', 'excited', 'angry', 'worried', 'peaceful']
  }],
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'snacks', 'dinner'],
    default: null
  },
  cuisine: {
    type: String,
    enum: ['indian', 'continental', 'italian', 'chinese', 'thai', 'japanese', 'mediterranean', 'mexican', 'other'],
    default: 'indian'
  },
  externalId: {
    type: String,
    default: null,
    index: true,
    unique: false
  },
  dietaryInfo: {
    vegetarian: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    dairyFree: { type: Boolean, default: false },
    nutFree: { type: Boolean, default: false }
  },
  calories: {
    type: Number,
    min: 0
  },
  protein: {
    type: Number,
    min: 0
  },
  carbs: {
    type: Number,
    min: 0
  },
  fat: {
    type: Number,
    min: 0
  },
  fiber: {
    type: Number,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
recipeSchema.index({ moodTags: 1 });
recipeSchema.index({ nutrients: 1 });
recipeSchema.index({ rating: -1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ mealType: 1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ externalId: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);
