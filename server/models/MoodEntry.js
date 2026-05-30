const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Mood text is required'],
    maxlength: [1000, 'Mood text cannot be more than 1000 characters']
  },
  voiceData: {
    type: String, // Base64 encoded audio data
    default: null
  },
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'stressed', 'anxious', 'tired', 'calm', 'excited', 'angry', 'worried', 'peaceful']
  },
  intensity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  nutrients: [{
    type: String,
    enum: ['MAGNESIUM', 'VITAMIN_B', 'OMEGA_3', 'POTASSIUM', 'IRON', 'FOLATE', 'ANTIOXIDANTS', 'PROTEIN', 'COMPLEX_CARBS', 'HEALTHY_FATS']
  }],
  recommendations: [{
    meal: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks']
    },
    foods: [{
      name: String,
      description: String,
      rating: Number
    }]
  }],
  aiAnalysis: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for better query performance
moodEntrySchema.index({ user: 1, createdAt: -1 });
moodEntrySchema.index({ mood: 1 });
moodEntrySchema.index({ createdAt: -1 });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
