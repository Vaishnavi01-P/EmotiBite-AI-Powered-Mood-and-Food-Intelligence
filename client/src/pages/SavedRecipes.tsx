import React, { useEffect, useState } from 'react';
import { ChefHat, Clock, Users, Heart, Trash2, Star } from 'lucide-react';
import { recipeService } from '../services/authService';

interface RecipeLite {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  time?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  rating?: number;
  nutrients?: string[];
  savedAt?: string;
}

interface RecipeFull extends RecipeLite {
  ingredients?: string[];
  instructions?: string[];
}

const SavedRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeFull | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [selectedError, setSelectedError] = useState('');

  const loadSaved = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await recipeService.getSavedRecipes(1, 100);
      // For backend response shape { recipes: [...] }
      const list = (data?.recipes ?? []) as RecipeLite[];
      setRecipes(list);
    } catch (e: any) {
      setError(e?.message || 'Failed to load saved recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await recipeService.removeSavedRecipe(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      // best-effort UI update
      setRecipes(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleOpenRecipe = async (recipe: RecipeLite) => {
    setSelectedError('');
    // If full details already present (dev fallback), open directly
    const maybeFull = recipe as RecipeFull;
    if (maybeFull.ingredients && maybeFull.instructions) {
      setSelectedRecipe(maybeFull);
      return;
    }
    // Otherwise fetch details
    setSelectedLoading(true);
    try {
      const data = await recipeService.getRecipeDetails(recipe.id);
      const full: RecipeFull = {
        ...recipe,
        title: data?.title ?? recipe.title,
        description: data?.description ?? recipe.description,
        time: data?.time ?? recipe.time,
        servings: data?.servings ?? recipe.servings,
        difficulty: data?.difficulty ?? recipe.difficulty,
        rating: data?.rating ?? recipe.rating,
        nutrients: data?.nutrients ?? recipe.nutrients,
        ingredients: data?.ingredients || [],
        instructions: data?.instructions || []
      };
      setSelectedRecipe(full);
    } catch (e: any) {
      setSelectedError(e?.message || 'Could not load recipe details');
    } finally {
      setSelectedLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <ChefHat className="h-6 w-6 mr-2" />
        Saved Recipes
      </h3>
      {error && (
        <div className="mb-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg px-4 py-3">{error}</div>
      )}
      {recipes.length === 0 ? (
        <div className="text-gray-400">No recipes saved yet. Save recipes from recommendations to see them here.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              onClick={() => handleOpenRecipe(recipe)}
            >
              <div className="h-40 bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center border-b border-white/5">
                <ChefHat className="h-14 w-14 text-purple-400" />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white mb-1">{recipe.title || 'Saved Recipe'}</h4>
                {recipe.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <div className="flex items-center space-x-4">
                    {typeof recipe.time === 'number' && (
                      <div className="flex items-center"><Clock className="h-4 w-4 mr-1" />{recipe.time}m</div>
                    )}
                    {typeof recipe.servings === 'number' && (
                      <div className="flex items-center"><Users className="h-4 w-4 mr-1" />{recipe.servings}</div>
                    )}
                  </div>
                  {recipe.difficulty && (
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300 border border-white/10">{recipe.difficulty}</div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {recipe.savedAt ? new Date(recipe.savedAt).toLocaleString() : ''}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(recipe.id); }}
                      className="px-2 py-1 text-xs border border-white/10 text-gray-400 rounded hover:bg-white/10 hover:text-white flex items-center transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Details Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedRecipe.title || 'Recipe'}</h3>
                  {selectedError && (
                    <div className="mt-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg px-3 py-2 text-sm">{selectedError}</div>
                  )}
                </div>
                <button onClick={() => setSelectedRecipe(null)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>

              <div className="h-40 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg flex items-center justify-center mb-6 border border-white/5">
                <ChefHat className="h-16 w-16 text-purple-400" />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <Clock className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm text-gray-400">Time</div>
                  <div className="font-semibold text-white">{selectedRecipe.time ?? '-'}</div>
                </div>
                <div className="text-center">
                  <Users className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm text-gray-400">Servings</div>
                  <div className="font-semibold text-white">{selectedRecipe.servings ?? '-'}</div>
                </div>
                <div className="text-center">
                  <div className="h-6 w-6 mx-auto mb-1 rounded-full flex items-center justify-center text-xs font-bold bg-white/10 text-white border border-white/10">
                    {selectedRecipe.difficulty ? (selectedRecipe.difficulty === 'Easy' ? 'E' : selectedRecipe.difficulty === 'Medium' ? 'M' : 'H') : '?'}
                  </div>
                  <div className="text-sm text-gray-400">Difficulty</div>
                  <div className="font-semibold text-white">{selectedRecipe.difficulty ?? '-'}</div>
                </div>
              </div>

              {typeof selectedRecipe.rating === 'number' && (
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(selectedRecipe.rating || 0) ? 'text-amber-400 fill-current' : 'text-gray-600'}`}
                      />
                    ))}
                    <span className="ml-2 font-semibold text-white">{selectedRecipe.rating}</span>
                  </div>
                </div>
              )}

              {selectedRecipe.description && (
                <p className="text-gray-300 mb-6">{selectedRecipe.description}</p>
              )}

              {/* Ingredients */}
              {selectedLoading && (
                <div className="text-gray-400 mb-4">Loading details...</div>
              )}
              {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">🥘</span>
                    Ingredients
                  </h4>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <ChefHat className="h-5 w-5 mr-2" />
                    Instructions
                  </h4>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Nutrients */}
              {selectedRecipe.nutrients && selectedRecipe.nutrients.length > 0 && (
                <div className="mb-2">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">💊</span>
                    Key Nutrients
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.nutrients.map((nutrient, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-medium">
                        {nutrient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
