import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Star, Heart, Youtube } from 'lucide-react';
import { recipeService } from '../services/authService';
import { useGamification } from '../contexts/GamificationContext';
import { recipes, Recipe } from '../data/recipes';
import RecipeModal from './RecipeModal';

interface RecipeRecommendationsProps {
  mood: string;
  nutrients: string[];
  refreshIndex?: number;
  dietChoice?: 'veg' | 'nonveg';
}

type Nutrition = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  vitamins: string[];
};

const RecipeRecommendations: React.FC<RecipeRecommendationsProps> = ({ mood, nutrients, refreshIndex = 0, dietChoice = 'veg' }) => {
  const getYoutubeUrl = (title: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} recipe`)}`;
  const [sections, setSections] = useState<Record<'breakfast' | 'lunch' | 'snacks' | 'dinner', Recipe[]>>({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: []
  });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { awardViewRecipe } = useGamification();
  const [searchTerm, setSearchTerm] = useState('');
  const [dietFilter, setDietFilter] = useState<'veg' | 'nonveg' | 'both'>('both');

  useEffect(() => {
    setLoading(true);
    const pickByDiet = (pair: { veg: Recipe[]; nonveg: Recipe[] }) => {
      if (dietFilter === 'both') return [...pair.veg, ...pair.nonveg];
      return pair[dietFilter];
    };
    const pool = {
      breakfast: pickByDiet(recipes.breakfast),
      lunch: pickByDiet(recipes.lunch),
      snacks: pickByDiet(recipes.snacks),
      dinner: pickByDiet(recipes.dinner),
    } as Record<'breakfast' | 'lunch' | 'snacks' | 'dinner', Recipe[]>;

    const term = searchTerm.trim().toLowerCase();
    const match = (r: Recipe) => {
      if (!term) return true;
      if (r.title.toLowerCase().includes(term)) return true;
      if (r.description.toLowerCase().includes(term)) return true;
      if ((r.ingredients || []).some(i => i.toLowerCase().includes(term))) return true;
      return false;
    };

    // Filter recipes based on dietary choice and search term


    setSections({
      breakfast: pool.breakfast.filter(match),
      lunch: pool.lunch.filter(match),
      snacks: pool.snacks.filter(match),
      dinner: pool.dinner.filter(match),
    });
    setLoading(false);
  }, [dietChoice, searchTerm, dietFilter]);

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      await recipeService.saveRecipe(recipe);
      if (process.env.NODE_ENV !== 'production') {
        const suffix = (() => {
          try {
            const raw = localStorage.getItem('devCurrentUser');
            if (raw) {
              const u = JSON.parse(raw);
              const id = u?.id || u?.email;
              if (id) return `__${String(id)}`;
            }
          } catch { }
          return '__anon';
        })();
        const key = `savedRecipesFull${suffix}`;
        const fullStore = JSON.parse(localStorage.getItem(key) || '[]');
        if (!fullStore.find((r: any) => r.id === recipe.id)) {
          fullStore.push({ ...recipe, savedAt: new Date().toISOString() });
          localStorage.setItem(key, JSON.stringify(fullStore));
        }
      }
      setSections(prev => {
        const next: typeof prev = { breakfast: [], lunch: [], snacks: [], dinner: [] };
        (['breakfast', 'lunch', 'snacks', 'dinner'] as const).forEach(mt => {
          next[mt] = prev[mt].map(r => r.id === recipe.id ? { ...r, saved: true } : r);
        });
        return next;
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-300 bg-green-500/20 border border-green-500/30';
      case 'Medium': return 'text-amber-300 bg-amber-500/20 border border-amber-500/30';
      case 'Hard': return 'text-red-300 bg-red-500/20 border border-red-500/30';
      default: return 'text-gray-300 bg-gray-500/20 border border-gray-500/30';
    }
  };

  const estimateNutrition = (recipe: Recipe): Nutrition => {
    const tags = (recipe.nutrients || []).map(n => String(n).toUpperCase());
    // Base macros
    let protein = tags.includes('PROTEIN') ? 22 : 10;
    let carbs = tags.includes('COMPLEX_CARBS') ? 50 : 30;
    let fat = tags.includes('HEALTHY_FATS') ? 16 : 8;
    // Adjust iron/fiber meals a bit
    if (tags.includes('IRON')) protein += 2;
    if (tags.includes('FIBER')) carbs += 5;
    const calories = Math.round(protein * 4 + carbs * 4 + fat * 9);
    const vitamins: string[] = [];
    if (tags.includes('VITAMINS')) vitamins.push('A', 'C');
    if (tags.includes('IRON')) vitamins.push('Iron');
    if (tags.includes('OMEGA_3')) vitamins.push('Omega-3');
    if (tags.includes('B_VITAMINS')) vitamins.push('B-Complex');
    return { calories, protein_g: protein, carbs_g: carbs, fat_g: fat, vitamins };
  };

  if (loading) {
    return (
      <div className="glass-card p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-2">🥗</span>
          Recipe Recommendations
        </h3>

        <p className="text-gray-300 mb-4">
          Browse all matching recipes for your diet. Use search to find a specific dish or ingredient.
        </p>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="inline-flex rounded-lg overflow-hidden border border-white/10">
            <button
              className={`px-3 py-2 text-sm transition-colors ${dietFilter === 'both' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              onClick={() => setDietFilter('both')}
            >Both</button>
            <button
              className={`px-3 py-2 text-sm border-l border-white/10 transition-colors ${dietFilter === 'veg' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              onClick={() => setDietFilter('veg')}
            >Veg</button>
            <button
              className={`px-3 py-2 text-sm border-l border-white/10 transition-colors ${dietFilter === 'nonveg' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              onClick={() => setDietFilter('nonveg')}
            >Non-veg</button>
          </div>
          <div className="flex-1">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipes or ingredients (e.g., dosa, chicken, paneer)"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Meal Sections */}
        {(['breakfast', 'lunch', 'snacks', 'dinner'] as const).map((mt) => (
          <div key={mt} className="mb-10">
            <h4 className="text-xl font-semibold text-white mb-4 capitalize">{mt}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections[mt].map((recipe, index) => (
                <motion.div
                  onClick={() => { setSelectedRecipe(recipe); try { awardViewRecipe(recipe.id); } catch (_) { } }}
                  key={recipe.id}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:bg-white/10 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-white">{recipe.title}</h5>
                      <div className="flex items-center text-amber-400">
                        <Star className="h-4 w-4 mr-1" />
                        <span className="text-sm">{recipe.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center"><Clock className="h-4 w-4 mr-1" />{recipe.time}m</div>
                        <div className="flex items-center"><Users className="h-4 w-4 mr-1" />{recipe.servings}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>{recipe.difficulty}</div>
                    </div>
                    {(() => {
                      const n = estimateNutrition(recipe);
                      return (
                        <div className="text-xs text-gray-500 mb-2">≈ {n.calories} kcal • Protein {n.protein_g}g • Carbs {n.carbs_g}g • Fat {n.fat_g}g</div>
                      );
                    })()}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {recipe.nutrients.map((nutrient, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-medium"
                          >
                            {nutrient}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={getYoutubeUrl(recipe.title)}
                          title="Watch on YouTube"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center text-red-600 hover:text-red-700 text-xs font-medium"
                        >
                          <Youtube className="h-4 w-4 mr-1" />
                          Watch
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveRecipe(recipe);
                          }}
                          className={`p-1 rounded-full transition-colors duration-200 ${recipe.saved
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-400 hover:text-red-500'
                            }`}
                        >
                          <Heart className={`h-4 w-4 ${recipe.saved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {sections[mt].length === 0 && (
                <div className="text-gray-500 italic">No {mt} suggestions available.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onSave={handleSaveRecipe}
        />
      )}
    </>
  );
};

export default RecipeRecommendations;
