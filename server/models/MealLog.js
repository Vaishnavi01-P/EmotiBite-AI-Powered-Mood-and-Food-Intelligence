const mongoose = require('mongoose');

const MealLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    title: { type: String },
    nutrients: [{ type: String }],
    moodBefore: { type: String },
    moodAfter: { type: String },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('MealLog', MealLogSchema);
