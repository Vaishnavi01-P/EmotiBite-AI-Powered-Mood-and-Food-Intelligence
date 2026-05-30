import React from 'react';
import PantrySuggest from '../components/PantrySuggest';
import { useSearchParams } from 'react-router-dom';

const Pantry: React.FC = () => {
  const [params] = useSearchParams();
  const mood = params.get('mood') || 'calm';
  const diet = (params.get('diet') as 'veg' | 'nonveg') || 'veg';

  return (
    <div className="max-w-3xl mx-auto glass-card p-6">
      <h2 className="text-2xl font-bold text-white mb-2">Pantry-Based Suggestions</h2>
      <p className="text-gray-300 mb-6">Tell us what you have, and we’ll match quick recipes for your mood.</p>
      <PantrySuggest mood={mood} dietChoice={diet} />
    </div>
  );
};

export default Pantry;
