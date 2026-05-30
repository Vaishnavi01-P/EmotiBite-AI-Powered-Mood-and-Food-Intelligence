import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, ChefHat, Star, Download, Youtube, Heart } from 'lucide-react';
import { Recipe } from '../data/recipes';
import { recipeService, mealLogService } from '../services/authService';
import { useGamification } from '../contexts/GamificationContext';

interface RecipeModalProps {
    recipe: Recipe;
    onClose: () => void;
    onSave?: (recipe: Recipe) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, onSave }) => {
    const { awardHealthyMeal } = useGamification();

    const getYoutubeUrl = (title: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} recipe`)}`;

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-300 bg-green-500/20 border border-green-500/30';
            case 'Medium': return 'text-amber-300 bg-amber-500/20 border border-amber-500/30';
            case 'Hard': return 'text-red-300 bg-red-500/20 border border-red-500/30';
            default: return 'text-gray-300 bg-gray-500/20 border border-gray-500/30';
        }
    };

    const [fullRecipe, setFullRecipe] = React.useState<Recipe>(recipe);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchDetails = async () => {
            if (!recipe.ingredients?.length || !recipe.instructions?.length || recipe.ingredients.length <= 1) {
                setLoading(true);
                try {
                    const result = await recipeService.getRecipeDetails(recipe.id);
                    if (result) {
                        setFullRecipe(result);
                    }
                } catch (error) {
                    console.error('Failed to fetch recipe details:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setFullRecipe(recipe);
            }
        };
        fetchDetails();
    }, [recipe]);

    const handleStartCooking = () => {
        try { awardHealthyMeal(fullRecipe.id); } catch (_) { }
        const lines: string[] = [];
        lines.push(`# ${fullRecipe.title}`);
        lines.push('');
        lines.push(`Time: ${fullRecipe.time}m | Servings: ${fullRecipe.servings} | Difficulty: ${fullRecipe.difficulty}`);
        // ... (rest uses fullRecipe)
        lines.push(`Rating: ${fullRecipe.rating}`);
        lines.push('');
        lines.push('Ingredients:');
        (fullRecipe.ingredients || []).forEach((ing, i) => lines.push(`${i + 1}. ${ing}`));
        lines.push('');
        lines.push('Instructions:');
        (fullRecipe.instructions || []).forEach((step, i) => lines.push(`${i + 1}. ${step}`));
        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fullRecipe.title.replace(/\s+/g, '_').toLowerCase()}_recipe.txt`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const handleLogEaten = async () => {
        const moodAfter = window.prompt('How did you feel after eating? (e.g., happy, calm, stressed, anxious, tired)') || '';
        try {
            await mealLogService.logMeal({
                recipeId: fullRecipe.id,
                title: fullRecipe.title,
                nutrients: fullRecipe.nutrients,
                moodBefore: 'unknown',
                moodAfter: moodAfter.trim().toLowerCase() || undefined,
            });
            alert('Meal logged successfully');
        } catch (e) {
            alert('Could not log meal');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-start p-4 pt-20 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{fullRecipe.title}</h3>
                            <p className="text-gray-300">{fullRecipe.description}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Recipe Image */}
                    <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-6">
                        <ChefHat className="h-20 w-20 text-purple-400" />
                    </div>

                    {/* Recipe Info */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                            <Clock className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                            <div className="text-sm text-gray-400">Time</div>
                            <div className="font-semibold text-white">{fullRecipe.time}m</div>
                        </div>
                        <div className="text-center">
                            <Users className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                            <div className="text-sm text-gray-400">Servings</div>
                            <div className="font-semibold text-white">{fullRecipe.servings}</div>
                        </div>
                        <div className="text-center">
                            <div className={`h-6 w-6 mx-auto mb-1 rounded-full flex items-center justify-center text-xs font-bold border ${getDifficultyColor(fullRecipe.difficulty)}`}>
                                {fullRecipe.difficulty === 'Easy' ? 'E' : fullRecipe.difficulty === 'Medium' ? 'M' : 'H'}
                            </div>
                            <div className="text-sm text-gray-400">Difficulty</div>
                            <div className="font-semibold text-white">{fullRecipe.difficulty}</div>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${i < Math.floor(fullRecipe.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                        }`}
                                />
                            ))}
                            <span className="ml-2 font-semibold">{fullRecipe.rating}</span>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <span className="mr-2">🥘</span>
                            Ingredients
                        </h4>
                        {loading ? (
                            <div className="text-gray-400 italic">Loading ingredients...</div>
                        ) : (
                            <ul className="space-y-2">
                                {(fullRecipe.ingredients || []).map((ingredient, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <ChefHat className="h-5 w-5 mr-2" />
                            Instructions
                        </h4>
                        {loading ? (
                            <div className="text-gray-400 italic">Loading instructions...</div>
                        ) : (
                            <ol className="space-y-3">
                                {(fullRecipe.instructions || []).map((instruction, index) => (
                                    <li key={index} className="flex items-start text-gray-300">
                                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                                            {index + 1}
                                        </span>
                                        {instruction}
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>

                    {/* Key Nutrients */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <span className="mr-2">💊</span>
                            Key Nutrients
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {(fullRecipe.nutrients || []).map((nutrient, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-medium"
                                >
                                    {nutrient}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        {onSave && (
                            <button
                                onClick={() => onSave(fullRecipe)}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${fullRecipe.saved
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                                    : 'bg-white/10 text-gray-300 border border-white/10 hover:bg-white/20'
                                    }`}
                            >
                                <Heart className={`h-5 w-5 ${fullRecipe.saved ? 'fill-current' : ''}`} />
                                <span>{fullRecipe.saved ? 'Saved' : 'Save Recipe'}</span>
                            </button>
                        )}

                        <button onClick={handleStartCooking} className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
                            <Download className="h-5 w-5" />
                            <span>Start Cooking</span>
                        </button>

                        <a
                            href={getYoutubeUrl(fullRecipe.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 border border-red-500/30 text-red-400 rounded-lg font-medium hover:bg-red-500/10 transition-all duration-200"
                        >
                            <Youtube className="h-5 w-5" />
                            <span>Watch on YouTube</span>
                        </a>

                        <button onClick={handleLogEaten} className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 border border-green-500/30 text-green-400 rounded-lg font-medium hover:bg-green-500/10 transition-all duration-200">
                            <span>Log as eaten</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RecipeModal;
