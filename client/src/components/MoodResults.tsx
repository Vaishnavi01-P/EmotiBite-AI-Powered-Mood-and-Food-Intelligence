import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Download, Heart, Star } from 'lucide-react';
import { recipes as allRecipes } from '../data/recipes';

interface MoodData {
  mood: string;
  intensity: number;
  confidence: number;
  text: string;
  nutrients: string[];
  recommendations: any[];
}

interface SimpleFood {
  name: string;
  description: string;
  rating: number;
}

interface MoodResultsProps {
  moodData: MoodData;
  onNewAnalysis: () => void;
  onDownloadReport: () => void;
  refreshIndex?: number;
  onRefreshRecommendations?: () => void;
  dietChoice?: 'veg' | 'nonveg';
}

const MoodResults: React.FC<MoodResultsProps> = ({
  moodData,
  onNewAnalysis,
  onDownloadReport,
  refreshIndex = 0,
  onRefreshRecommendations,
  dietChoice = 'veg'
}) => {
  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      stressed: '😰',
      happy: '😊',
      anxious: '😟',
      tired: '😴',
      calm: '😌',
      sad: '😢',
      excited: '🤩',
      angry: '😠',
      worried: '😟',
      peaceful: '😌'
    };
    return moodEmojis[mood.toLowerCase()] || '😐';
  };

  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: string } = {
      stressed: 'text-red-400',
      happy: 'text-amber-400',
      anxious: 'text-pink-400',
      tired: 'text-violet-400',
      calm: 'text-emerald-400',
      sad: 'text-blue-400',
      excited: 'text-orange-400',
      angry: 'text-red-500',
      worried: 'text-pink-500',
      peaceful: 'text-emerald-500'
    };
    return moodColors[mood.toLowerCase()] || 'text-gray-400';
  };

  const toPct = (v: number | string) => {
    const num = Number(v);
    if (!isFinite(num)) return 0;
    const scaled = num <= 1 ? num * 100 : num;
    const clamped = Math.max(0, Math.min(100, scaled));
    return Math.round(clamped);
  };

  const mealRecommendations: { meal: string; emoji: string; foods: SimpleFood[] }[] = (() => {
    const moodNutrients: Record<string, string[]> = {
      stressed: ['MAGNESIUM', 'VITAMIN_B', 'OMEGA_3', 'POTASSIUM'],
      happy: ['VITAMIN_B', 'VITAMIN_D', 'SELENIUM', 'TRYPTOPHAN'],
      anxious: ['MAGNESIUM', 'OMEGA_3', 'ZINC'],
      tired: ['IRON', 'VITAMIN_B', 'COMPLEX_CARBS'],
      calm: ['TRYPTOPHAN', 'MAGNESIUM', 'PROTEIN'],
      sad: ['OMEGA_3', 'VITAMIN_D', 'VITAMIN_B'],
      excited: ['COMPLEX_CARBS', 'VITAMIN_B'],
      angry: ['MAGNESIUM', 'VITAMIN_C']
    };

    const targetNutrients = moodNutrients[moodData.mood.toLowerCase()] || ['PROTEIN', 'VITAMIN_B'];

    const pickFoods = (mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner'): SimpleFood[] => {
      const pool = allRecipes[mealType][dietChoice];
      const moodKey = moodData.mood.toLowerCase();

      // Weighting logic
      const scoredPool = pool.map(r => {
        let score = 0;

        // Priority 1: Direct Mood Tag Match (High)
        if (r.moodTags?.some(tag => tag.toLowerCase() === moodKey)) {
          score += 20;
        }

        // Priority 2: Nutrient density match (Medium)
        const matchingNutrients = r.nutrients.filter(n => targetNutrients.includes(n.toUpperCase()));
        score += matchingNutrients.length * 5;

        // Priority 3: Any nutrient match (Low)
        if (matchingNutrients.length > 0) {
          score += 2;
        }

        return { recipe: r, score };
      });

      // Filter and Sort
      const matches = scoredPool
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

      const candidates = matches.length > 0 ? matches : scoredPool.map(r => ({ recipe: r.recipe, score: 0 }));

      // Get top-tier candidates (e.g., within 5 points of the maximum score or top 3)
      const maxScore = candidates[0].score;
      const topTier = candidates.filter(c => c.score >= maxScore - 5 || c.score === maxScore);

      const finalPool = topTier.map(m => m.recipe);

      // Select items with variety
      // Use mood signature + mealType for stable but distinct starting index
      const seed = (moodKey + mealType).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const startIdx = (seed + refreshIndex) % finalPool.length;

      // Pick the single best unique item
      const r = finalPool[startIdx];
      return r ? [{
        name: r.title,
        description: r.description,
        rating: r.rating
      }] : [];
    };

    return [
      { meal: 'Breakfast', emoji: '🌞', foods: pickFoods('breakfast') },
      { meal: 'Lunch', emoji: '🍛', foods: pickFoods('lunch') },
      { meal: 'Snacks', emoji: '🍪', foods: pickFoods('snacks') },
      { meal: 'Dinner', emoji: '🌙', foods: pickFoods('dinner') }
    ];
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Mood Analysis Results */}
      <div className="glass-card p-8">
        {/* Mood Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getMoodEmoji(moodData.mood)}</div>
          <h2 className={`text-3xl font-bold ${getMoodColor(moodData.mood)} mb-2`}>
            You're feeling {moodData.mood}
          </h2>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{toPct(moodData.intensity)}%</div>
              <div className="text-sm text-gray-400">Intensity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{toPct(moodData.confidence)}%</div>
              <div className="text-sm text-gray-400">Confidence</div>
            </div>
          </div>

          {/* Original Text */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
            <p className="text-gray-300 italic">"{moodData.text}"</p>
          </div>
        </div>

        {/* Food Recommendations */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">🍽️</span>
            Your Personalized Food Recommendations
          </h3>

          <div className="mb-6">
            <p className="text-gray-300 mb-2">
              💡 When you're {moodData.mood}, your body may benefit from:
            </p>
            <div className="flex flex-wrap gap-2">
              {moodData.nutrients.map((nutrient, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-medium"
                >
                  {nutrient.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Meal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mealRecommendations.map((meal, index) => (
              <motion.div
                key={meal.meal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
              >
                <div className="text-center mb-3">
                  <div className="text-2xl mb-1">{meal.emoji}</div>
                  <h4 className="font-semibold text-white">{meal.meal}</h4>
                </div>

                <div className="space-y-2">
                  {meal.foods.map((food, foodIndex) => (
                    <div key={foodIndex} className="text-sm">
                      <div className="font-medium text-gray-200">{food.name}</div>
                      <div className="text-gray-400 text-xs">{food.description}</div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={`h-3 w-3 ${starIndex < food.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why These Foods */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-blue-300 mb-2 flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Why These Foods?
          </h4>
          <p className="text-blue-200">
            {moodData.mood === 'stressed' &&
              "Stress can deplete magnesium and B vitamins; omega-3s support stress resilience and potassium helps regulate blood pressure."
            }
            {moodData.mood === 'happy' &&
              "Maintaining stable blood sugar and getting adequate B vitamins helps sustain positive mood and energy levels."
            }
            {moodData.mood === 'anxious' &&
              "Magnesium and omega-3 fatty acids have calming effects on the nervous system and can help reduce anxiety symptoms."
            }
            {moodData.mood === 'tired' &&
              "Iron deficiency can cause fatigue; complex carbohydrates provide sustained energy and B vitamins support metabolism."
            }
            {moodData.mood === 'calm' &&
              "Foods rich in tryptophan and magnesium promote relaxation and support the production of calming neurotransmitters."
            }
          </p>
          <div className="mt-4">
            <button
              onClick={onRefreshRecommendations}
              className="px-4 py-2 text-sm border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              When you don’t like our picks, click here to see other foods
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNewAnalysis}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-lg font-medium transition-colors duration-200"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Analyze Another Mood</span>
          </button>

          <button
            onClick={onDownloadReport}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200"
          >
            <Download className="h-5 w-5" />
            <span>Download Report</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MoodResults;
