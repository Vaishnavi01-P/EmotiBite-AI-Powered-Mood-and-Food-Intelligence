import React, { useMemo, useState } from 'react';
import { recipes, Recipe } from '../data/recipes';
import RecipeModal from './RecipeModal';
import { useGamification } from '../contexts/GamificationContext';

interface PantrySuggestProps {
  mood: string;
  dietChoice: 'veg' | 'nonveg';
}

type RecipeWithMeal = Recipe & { meal: string };

const PantrySuggest: React.FC<PantrySuggestProps> = ({ mood, dietChoice }) => {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { awardViewRecipe } = useGamification();

  const all: RecipeWithMeal[] = useMemo(() => {
    const attach = (list: Recipe[], meal: string) => list.map(r => ({ ...r, meal }));

    return [
      ...attach(recipes.breakfast.veg, 'breakfast'),
      ...attach(recipes.breakfast.nonveg, 'breakfast'),
      ...attach(recipes.lunch.veg, 'lunch'),
      ...attach(recipes.lunch.nonveg, 'lunch'),
      ...attach(recipes.snacks.veg, 'snacks'),
      ...attach(recipes.snacks.nonveg, 'snacks'),
      ...attach(recipes.dinner.veg, 'dinner'),
      ...attach(recipes.dinner.nonveg, 'dinner'),
    ];
  }, []);

  const normalize = (s: string) => s.toLowerCase().trim();
  const NONVEG = ['chicken', 'egg', 'eggs', 'fish', 'mutton', 'prawn', 'prawns', 'meat'];
  const STOPWORDS = new Set(['spice', 'spices', 'oil', 'salt', 'water', 'veggie', 'seasoning', 'masala', 'powder']);

  const ALIASES: Record<string, string[]> = {
    curd: ['yogurt', 'curd'],
    dahi: ['yogurt'],
    poha: ['flattened rice', 'poha'],
    rava: ['semolina', 'rava', 'sooji', 'suji'],
    sooji: ['semolina'],
    suji: ['semolina'],
    atta: ['wheat flour'],
    flour: ['wheat flour', 'flour'],
    bun: ['bread', 'bun'],
    bread: ['bread'],
    chapati: ['wheat flour', 'chapati'],
    roti: ['wheat flour', 'roti'],
    naan: ['wheat flour', 'naan'],
    paratha: ['wheat flour', 'paratha'],
    veggies: ['mixed vegetables', 'vegetables'],
    vegetables: ['mixed vegetables', 'vegetables'],
    tomato: ['tomato'],
    onion: ['onion'],
    potato: ['potato'],
    rice: ['rice'],
    dal: ['dal', 'toor dal', 'urad dal'],
    paneer: ['paneer', 'cheese'],
    cheese: ['cheese', 'paneer'],
    yogurt: ['yogurt', 'curd'],
    egg: ['egg', 'eggs'],
    eggs: ['eggs', 'egg'],
    chicken: ['chicken'],
    fish: ['fish'],
  };
  const isRecipeVeg = (r: RecipeWithMeal) => r.ingredients.every(ing => !NONVEG.some(nv => ing.toLowerCase().includes(nv)));

  const suggestions = useMemo(() => {
    const haveRaw = query.map(normalize).filter(Boolean).filter(t => !STOPWORDS.has(t));
    const have = Array.from(new Set(haveRaw.flatMap(t => ALIASES[t] || [t])));
    if (!have.length) return [] as RecipeWithMeal[];

    const nonVegTokens = have.filter(h => NONVEG.includes(h));

    const score = (r: RecipeWithMeal) => {
      const ing = r.ingredients.map(normalize);

      // If query contains any non-veg tokens, require at least one to be present in recipe
      if (nonVegTokens.length > 0) {
        const hasRequiredNV = nonVegTokens.some(nv => ing.some(i => i.includes(nv)));
        if (!hasRequiredNV) return 0;
        if (isRecipeVeg(r)) return 0; // don't suggest veg recipes when non-veg explicitly requested
      }

      // Match ingredients: token is satisfied if present in ingredients OR in title
      const title = r.title.toLowerCase();
      const tokenSatisfied = (h: string) => ing.some(i => i.includes(h) || h.includes(i)) || title.includes(h);
      const matches = have.filter(tokenSatisfied);
      const overlap = matches.length;
      // Require a majority match (>= 66% of typed tokens). For single token, require 1.
      const minReq = have.length > 1 ? Math.max(1, Math.ceil(have.length * 0.66)) : 1;
      if (overlap < minReq) return 0;

      // Weight: strong match on exact tokens + bonus for title keyword presence
      const titleBonus = have.some(mk => title.includes(mk)) ? 5 : 0;

      return overlap * 10 + titleBonus;
    };

    const ranked = [...all]
      .map(r => ({ r, s: score(r) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map(x => x.r);

    if (ranked.length > 0) return ranked;

    // Fallback stage 2: relax to 50% majority requirement
    const relaxed = [...all]
      .map(r => {
        const ing = r.ingredients.map(normalize);
        const title = r.title.toLowerCase();
        const tokenSatisfied = (h: string) => ing.some(i => i.includes(h) || h.includes(i)) || title.includes(h);
        const overlap = have.filter(tokenSatisfied).length;
        const minReq = have.length > 1 ? Math.max(1, Math.floor(have.length * 0.5)) : 1;
        if (overlap < minReq) return { r, s: 0 };
        const titleBonus = have.some(mk => title.includes(mk)) ? 5 : 0;
        return { r, s: overlap * 10 + titleBonus };
      })
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map(x => x.r);
    if (relaxed.length > 0) return relaxed;

    // Fallback stage 3: any overlap >=1
    const any = all.filter(r => {
      const ing = r.ingredients.map(normalize);
      const title = r.title.toLowerCase();
      return have.some(h => ing.some(i => i.includes(h) || h.includes(i)) || title.includes(h));
    }).slice(0, 3);
    return any;
  }, [query, all, mood]);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    try { awardViewRecipe(recipe.id); } catch (_) { }
  };

  return (
    <>
      <div className="glass-card p-6 mt-6">
        <h3 className="text-xl font-semibold text-white mb-2">Pantry-Based Suggestions</h3>
        <p className="text-gray-300 mb-4">Type one or more items you have (comma-separated). We’ll suggest recipes that use most of what you typed.</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            value={input}
            onChange={e => {
              const val = e.target.value;
              setInput(val);
              const parts = val.split(',').map(s => s.trim()).filter(Boolean);
              setQuery(parts);
            }}
            placeholder="e.g., bread, cheese, tomato"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>


        {suggestions.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-white mb-3">Suggested for your mood “{mood}”</h4>
            <div className="space-y-3">
              {suggestions.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleRecipeClick(r)}
                  className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer hover:shadow-lg"
                >
                  <div>
                    <div className="font-medium text-white">{r.title}</div>
                    <div className="text-xs text-gray-400">Matches your pantry: {query.join(', ')}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">{r.meal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestions.length === 0 && query.length > 0 && (
          <div className="text-sm text-gray-400">No matches yet. Try core items used in the recipes, e.g., "chicken, rice, yogurt" or "semolina, mustard, curry leaves".</div>
        )}
      </div>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </>
  );
};

export default PantrySuggest;

