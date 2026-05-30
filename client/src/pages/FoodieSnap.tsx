import React, { useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mealLogService } from '../services/authService';

interface Detection {
  label: string;
  prob: number;
}

interface JournalEntry {
  id: string;
  date: string;
  food: string;
  mood: string;
  message: string;
  suggestion: string;
}

const FoodieSnap: React.FC = () => {
  const { user } = useAuth();
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [summary, setSummary] = useState<{ title: string; mood: string; reason: string } | null>(null);
  const [meters, setMeters] = useState<{ happiness: number; relaxation: number; energy: number }>({ happiness: 0, relaxation: 0, energy: 0 });
  const [msg, setMsg] = useState('');
  const [healthy, setHealthy] = useState('');
  const [activity, setActivity] = useState('');
  const [error, setError] = useState('');
  const modelRef = useRef<any>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<number>(0);
  const [fileGuess, setFileGuess] = useState<string>('');
  const [foodName, setFoodName] = useState<string>('');

  const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
    const exists = document.querySelector(`script[src="${src}"]`);
    if (exists) return resolve();
    const s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.body.appendChild(s);
  });

  const ensureModel = async () => {
    if (modelRef.current) return modelRef.current;
    await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.13.0/dist/tf.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js');
    const anyWin = window as any;
    if (!anyWin.mobilenet) throw new Error('mobilenet not available');
    const model = await anyWin.mobilenet.load();
    modelRef.current = model;
    return model;
  };

  /* analysis disabled */

  const cleanLabel = (raw: string) => {
    // Take first part before comma and remove underscores; Title Case
    const first = (raw || '').split(',')[0].replace(/_/g, ' ').trim();
    return first.replace(/\s+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  };

  const NUMERIC_FILE_MAP: Record<string, string> = {
    '1': 'Biryani',
    '2': 'Bread Omelette',
    '3': 'Chicken Curry',
    '4': 'Chocolate Cake',
    '5': 'Coffee',
    '6': 'Dosa',
    '7': 'Ice Cream',
    '8': 'Idli',
    '9': 'Noodles',
    '10': 'Pizza',
    '11': 'Samosa',
    '12': 'Burger',
    '13': 'Cupcake',
  };

  const numericNameFromFilename = (name: string) => {
    const noExt = (name || '').replace(/\.[a-z0-9]+$/i, '');
    // Remove common generic tokens
    const cleaned = noExt.replace(/\b(img|image|photo|pic|picture|screenshot|screen\s*shot|pxl|dsc|whatsapp\s*image|new|file)\b/gi, ' ');
    // Find the first 1-3 digit number anywhere in the string
    const m = cleaned.match(/(\d{1,3})/);
    if (m && m[1] && NUMERIC_FILE_MAP[m[1]]) return NUMERIC_FILE_MAP[m[1]];
    return '';
  };

  const fileNameToName = (name: string) => {
    // Numeric name mapping has highest priority
    const numericMapped = numericNameFromFilename(name);
    if (numericMapped) return numericMapped;

    let base = (name || '')
      .replace(/\.[a-z0-9]+$/i, '') // remove extension
      .replace(/[\-_]+/g, ' ') // dashes/underscores -> spaces
      // remove common generic tokens from camera/gallery apps
      .replace(/\b(img|image|photo|pic|picture|screenshot|screen\s*shot|pxl|dsc|whatsapp\s*image|new|file)\b/gi, '')
      .replace(/\d+/g, '') // remove digits
      .replace(/\s+/g, ' ')
      .trim();
    // if still generic/too short, return empty so model mapping is used
    const lower = base.toLowerCase();
    const GENERIC = new Set(['', 'image', 'photo', 'picture', 'file', 'screenshot']);
    if (!base || base.length < 3 || GENERIC.has(lower)) return '';
    return base.replace(/\b\w/g, (m) => m.toUpperCase());
  };

  const labelToFood = (label: string) => {
    const l = label.toLowerCase();
    const map: Array<[RegExp, string]> = [
      [/chocolate\s*cake/, 'chocolate cake'],
      [/brownie/, 'brownie'],
      [/cup\s*cake|cupcake/, 'cupcake'],
      [/pastry/, 'pastry'],
      [/\bcake\b/, 'cake'],
      [/noodle|ramen|spaghetti|pasta/, 'noodles'],
      [/pizza/, 'pizza'],
      [/burger|sandwich|bun/, 'burger'],
      [/salad|lettuce|greens|cucumber|tomato/, 'salad'],
      [/coffee|espresso|cappuccino/, 'coffee'],
      [/tea|green tea|herbal/, 'tea'],
      [/soup|broth/, 'soup'],
      [/rice|biryani|curry.*rice|fried rice/, 'rice bowl'],
      [/fries|french fry|chips/, 'fries'],
      [/ice cream|gelato|sundae/, 'ice cream'],
      [/fruit|banana|apple|berry|orange|grape|mango|papaya|pineapple/, 'fruit bowl'],
      [/smoothie|shake|juice/, 'smoothie'],
      [/dosa/, 'dosa'],
      [/idli|sambar/, 'idli sambar'],
      [/poha/, 'poha'],
      [/upma/, 'upma'],
      [/paratha/, 'paratha'],
      [/chapati|roti|naan/, 'roti/naan'],
      [/paneer|tofu/, 'paneer'],
      [/curry|gravy/, 'curry'],
      [/chicken/, 'chicken curry'],
      [/fish/, 'fish curry'],
      [/egg|omelet|omelette/, 'omelette'],
      [/samosa|pakora|bhaji/, 'samosa'],
    ];
    for (const [re, food] of map) if (re.test(l)) return food;
    return cleanLabel(label);
  };

  const NON_FOOD_BLACKLIST: RegExp[] = [
    /face\s*powder/i, /makeup/i, /cosmetic/i, /lipstick/i, /nail\s*polish/i,
    /sunscreen/i, /lotion/i, /shampoo/i, /conditioner/i, /soap/i, /toothpaste/i, /detergent/i
  ];

  const KNOWN_FOOD_HINTS: RegExp[] = [
    /cake|noodle|ramen|pasta|pizza|burger|sandwich|salad|coffee|tea|soup|rice|biryani|fries|ice\s*cream|fruit|smoothie|dosa|idli|sambar|poha|upma|paratha|roti|naan|paneer|curry|chicken|fish|omelet|omelette|samosa/i
  ];

  const DESSERT_HINTS: RegExp[] = [
    /chocolate/i, /cake/i, /brownie/i, /dessert/i, /pastry/i, /cupcake/i
  ];

  const isLikelyFood = (rawLabel: string, mappedName: string) => {
    if (NON_FOOD_BLACKLIST.some(re => re.test(rawLabel))) return false;
    if (KNOWN_FOOD_HINTS.some(re => re.test(rawLabel))) return true;
    // If mapping changed the name to a known dish word, accept
    if (KNOWN_FOOD_HINTS.some(re => re.test(mappedName))) return true;
    return false;
  };

  const foodToMood = (food: string) => {
    const f = food.toLowerCase();
    // Specific per-food suggestions
    if (f.includes('biryani')) {
      return {
        mood: 'excited',
        reason: 'Rich spices and carbs can boost energy and satisfaction.',
        meters: { happiness: 8, relaxation: 5, energy: 7 },
        message: `${capitalize(food)} detected — hearty and flavorful!`,
        healthy: 'Go light on oil, add raita/salad, and control portion size.',
        activity: 'Take a 10-minute walk post-meal for better digestion.'
      };
    }
    if (f.includes('bread omelette') || (f.includes('omelet') || f.includes('omelette'))) {
      return {
        mood: 'focused',
        reason: 'Protein helps satiety and mental clarity.',
        meters: { happiness: 7, relaxation: 6, energy: 7 },
        message: `${capitalize(food)} — simple protein for steady energy.`,
        healthy: 'Use whole-wheat bread, minimal oil, add tomato/onion.',
        activity: 'Plan your next task with a 2-minute checklist.'
      };
    }
    if (f.includes('chicken curry')) {
      return {
        mood: 'satisfied',
        reason: 'Protein + spices can feel warming and fulfilling.',
        meters: { happiness: 7, relaxation: 6, energy: 6 },
        message: `${capitalize(food)} — comforting and protein-rich.`,
        healthy: 'Choose lean cuts, moderate oil, pair with salad or steamed veg.',
        activity: 'Hydrate and take a short standing stretch.'
      };
    }
    if (f.includes('dosa')) {
      return {
        mood: 'calm',
        reason: 'Light fermented batter can feel easy and balanced.',
        meters: { happiness: 7, relaxation: 7, energy: 6 },
        message: `${capitalize(food)} — light, crisp and soothing.`,
        healthy: 'Pair with sambar and coconut chutney; go easy on oil.',
        activity: 'Do a gentle neck and shoulder stretch.'
      };
    }
    if (f.includes('idli')) {
      return {
        mood: 'calm',
        reason: 'Soft, steamed and fermented — gentle on the system.',
        meters: { happiness: 6, relaxation: 8, energy: 5 },
        message: `${capitalize(food)} — great for a light mood day.`,
        healthy: 'Add sambar for protein and fiber; include veggies on the side.',
        activity: 'Try 3 minutes of deep breathing.'
      };
    }
    if (f.includes('noodles')) {
      return {
        mood: 'comfort',
        reason: 'Warm carbs can feel cozy and indulgent.',
        meters: { happiness: 7, relaxation: 6, energy: 6 },
        message: `${capitalize(food)} — cozy comfort incoming.`,
        healthy: 'Add mixed veggies, reduce oil/sauce, consider whole-wheat.',
        activity: 'Put on a favorite music track for a quick reset.'
      };
    }
    if (f.includes('pizza')) {
      return {
        mood: 'excited',
        reason: 'Savory fats and carbs can spike pleasure and energy.',
        meters: { happiness: 8, relaxation: 5, energy: 7 },
        message: `${capitalize(food)} — fun and shareable.`,
        healthy: 'Opt for thin crust, extra veggies, and mindful portions.',
        activity: 'Drink water and do 10 bodyweight squats.'
      };
    }
    if (f.includes('samosa')) {
      return {
        mood: 'indulgent',
        reason: 'Fried snacks can feel rewarding but heavy.',
        meters: { happiness: 7, relaxation: 5, energy: 5 },
        message: `${capitalize(food)} — crispy treat time.`,
        healthy: 'Try air-fried versions and add a side salad or fruit.',
        activity: 'Take a 5-minute stroll outdoors.'
      };
    }
    if (f.includes('burger')) {
      return {
        mood: 'comfort',
        reason: 'Savory and rich flavors boost satisfaction.',
        meters: { happiness: 8, relaxation: 5, energy: 6 },
        message: `${capitalize(food)} — satisfying and hearty.`,
        healthy: 'Add lettuce/tomato, choose grilled/baked patty, whole-wheat bun.',
        activity: 'Walk for 8 minutes to feel lighter.'
      };
    }
    if (f.includes('cupcake') || f.includes('pastry') || (f.includes('cake') && !f.includes('pancake'))) {
      return {
        mood: 'happy',
        reason: 'Sugar and treats can uplift mood temporarily.',
        meters: { happiness: 9, relaxation: 6, energy: 6 },
        message: `${capitalize(food)} detected — a sweet little celebration.`,
        healthy: 'Go for smaller portions or share; pair with tea/fruit.',
        activity: 'Write a one-line gratitude note.'
      };
    }
    if (f.includes('coffee')) {
      return {
        mood: 'focused',
        reason: 'Caffeine can improve alertness briefly.',
        meters: { happiness: 6, relaxation: 4, energy: 8 },
        message: `${capitalize(food)} — focus boost ahead.`,
        healthy: 'Hydrate alongside; avoid late-evening cups.',
        activity: 'Take a brisk 5-minute walk to steady energy.'
      };
    }
    if (f.includes('ice cream')) {
      return {
        mood: 'happy',
        reason: 'Sweet and creamy for instant comfort.',
        meters: { happiness: 9, relaxation: 6, energy: 5 },
        message: `${capitalize(food)} — cozy comfort vibes.`,
        healthy: 'Choose smaller scoops or yogurt/fruit alternatives.',
        activity: 'Share a laugh with a friend or family member.'
      };
    }
    if (f.includes('chocolate') || f.includes('ice cream')) {
      return {
        mood: 'happy',
        reason: 'Comfort and dopamine boost from sugar and cocoa.',
        meters: { happiness: 9, relaxation: 6, energy: 7 },
        message: `${capitalize(food)} detected — you might be treating yourself!`,
        healthy: 'High sugar — try dark chocolate squares or yogurt with berries next time.',
        activity: 'Pair with a short gratitude note to reinforce positive mood.'
      };
    }
    if (f.includes('salad') || f.includes('fruit') || f.includes('smoothie')) {
      return {
        mood: 'calm',
        reason: 'Hydrating and micronutrient-rich, supports steady energy.',
        meters: { happiness: 7, relaxation: 8, energy: 6 },
        message: `${capitalize(food)} detected — you seem focused on staying fresh and calm today!`,
        healthy: 'Great choice — add some protein (nuts, seeds, lean paneer) for balance.',
        activity: 'Play calming music for deeper relaxation.'
      };
    }
    if (f.includes('coffee') || f.includes('tea')) {
      return {
        mood: 'focused',
        reason: 'Caffeine can increase alertness and motivation.',
        meters: { happiness: 6, relaxation: 4, energy: 8 },
        message: `${capitalize(food)} — take a short walk to boost focus.`,
        healthy: 'Avoid on empty stomach; hydrate alongside.',
        activity: '5-minute stretch to release tension.'
      };
    }
    if (f.includes('noodle') || f.includes('pizza') || f.includes('burger') || f.includes('fries') || f.includes('rice bowl')) {
      return {
        mood: 'comfort',
        reason: 'Carb-dense foods often soothe and boost serotonin.',
        meters: { happiness: 8, relaxation: 6, energy: 7 },
        message: `${capitalize(food)} — comfort vibes!`,
        healthy: f.includes('fries') ? 'Tasty but high in fat — try baked sweet potato.' : 'Balance with veggies or a side salad.',
        activity: 'Slow, mindful eating — savor each bite.'
      };
    }
    if (f.includes('soup')) {
      return {
        mood: 'calm',
        reason: 'Warm, light food aids relaxation and recovery.',
        meters: { happiness: 7, relaxation: 8, energy: 5 },
        message: 'Soup detected — great for calming your mind during stress.',
        healthy: 'Add veggies and lean protein for a balanced bowl.',
        activity: 'Listen to a relaxing playlist.'
      };
    }
    return {
      mood: 'neutral',
      reason: 'Could not confidently classify mood impact.',
      meters: { happiness: 5, relaxation: 5, energy: 5 },
      message: `${capitalize(food)} detected.`,
      healthy: 'Consider adding fruits or greens to balance your meal.',
      activity: 'Take a short walk to reset.'
    };
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    const url = URL.createObjectURL(f);
    setImageUrl(url);
    setImageName(f.name);
    setError('');
    // Reset previous results to avoid carry-over between images
    setDetections([]);
    setSummary(null);
    setMsg('');
    setHealthy('');
    setActivity('');
    // Prefer the file name as the displayed food name
    const guess = fileNameToName(f.name);
    setFileGuess(guess);
    if (guess) {
      setFoodName(guess);
      const mood = foodToMood(guess);
      setSummary({ title: guess, mood: mood.mood, reason: mood.reason });
      setMeters(mood.meters);
      setMsg(mood.message);
      setHealthy(mood.healthy);
      setActivity(mood.activity);
      saveJournal(guess, mood.mood, mood.message, mood.healthy);
    }
    // analysis disabled: no classification run
  };

  const classifyIfCurrent = async (id: number) => {
    setDetecting(true);
    setError('');
    try {
      // If a newer request started, ignore this run
      if (id !== requestIdRef.current) { setDetecting(false); return; }
      const model = await ensureModel();
      const target = imgRef.current;
      if (!target) throw new Error('Image not ready');
      // draw center-cropped square to 224x224 for better classification
      const cnv = canvasRef.current || document.createElement('canvas');
      cnv.width = 224; cnv.height = 224;
      if (!canvasRef.current) canvasRef.current = cnv as HTMLCanvasElement;
      const ctx = cnv.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      const w = target.naturalWidth || target.width;
      const h = target.naturalHeight || target.height;
      const size = Math.min(w, h);
      const sx = (w - size) / 2;
      const sy = (h - size) / 2;
      ctx.clearRect(0, 0, 224, 224);
      ctx.drawImage(target, sx, sy, size, size, 0, 0, 224, 224);
      const res = await model.classify(cnv, 5);
      const dets: Detection[] = res.map((p: any) => ({ label: p.className || p.label || 'food', prob: p.probability || p.prob || 0 }));
      setDetections(dets);
      if (dets.length) {
        // Prefer dessert hints if present (handles chocolate cake cases)
        const dessertPick = dets.find(d => DESSERT_HINTS.some(re => re.test(d.label)));
        // Otherwise, pick the first high-confidence label that maps to a likely food
        const MIN_CONF = 0.35;
        const fallbackPick = dets.find(d => {
          const name = labelToFood(d.label);
          return d.prob >= MIN_CONF && isLikelyFood(d.label, name);
        }) || dets[0];
        const pick = dessertPick || fallbackPick;
        const detectedFood = labelToFood(pick.label);
        const candidate = foodName || fileGuess || (summary?.title || '');
        const finalName = candidate && candidate.length > 1 ? candidate : detectedFood;
        const mood = foodToMood(finalName);
        setSummary({ title: finalName, mood: mood.mood, reason: mood.reason });
        setMeters(mood.meters);
        setMsg(mood.message);
        setHealthy(mood.healthy);
        setActivity(mood.activity);
        saveJournal(finalName, mood.mood, mood.message, mood.healthy);
        // clear any previous error once we have a valid result
        setError('');
      } else {
        setSummary(null);
      }
    } catch (e) {
      console.warn('classify error', e);
      setError('Could not analyze this image. Try another angle or different lighting.');
    } finally {
      setDetecting(false);
    }
  };

  const saveJournal = (food: string, mood: string, message: string, suggestion: string) => {
    try {
      const doc: JournalEntry = {
        id: `fj-${Date.now()}`,
        date: new Date().toISOString(),
        food,
        mood,
        message,
        suggestion
      };
      const key = `foodJournal__${String(user?.id || user?.email || 'anon')}`;
      const list: JournalEntry[] = JSON.parse(localStorage.getItem(key) || '[]');
      list.unshift(doc);
      localStorage.setItem(key, JSON.stringify(list.slice(0, 100)));
      try { mealLogService.logMeal({ title: food, moodAfter: mood }); } catch (_) { }
    } catch { }
  };

  const recent = useMemo<JournalEntry[]>(() => {
    try {
      const key = `foodJournal__${String(user?.id || user?.email || 'anon')}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }, [summary?.title, imageName, user?.id]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Foodie Snap</h2>
        <p className="text-gray-300 mb-4">Upload a photo — we’ll detect the food, predict its mood effect, and suggest tips.</p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onPickImage}
            className="text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 transition-all"
          />
          {imageName && <div className="text-sm text-gray-400">Selected: {imageName} {detecting ? '• analyzing…' : ''}</div>}
        </div>
        {imageUrl && (
          <div className="mt-4">
            <img ref={imgRef} src={imageUrl} alt="upload preview" className="max-h-72 rounded-lg border border-white/10" />
            <canvas ref={canvasRef} className="hidden" width={224} height={224} />
          </div>
        )}
      </div>

      {summary && (
        <div className="glass-card p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">{summary.title} — mood: <span className="capitalize">{summary.mood}</span></h3>
          <p className="text-gray-300 mb-4">{summary.reason}</p>
          {/* analysis disabled: hide prediction choices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Happiness</div>
              <div className="w-full bg-white/10 h-3 rounded"><div className="h-3 bg-yellow-400 rounded" style={{ width: `${meters.happiness * 10}%` }} /></div>
              <div className="text-xs text-gray-500 mt-1">{meters.happiness}/10</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Relaxation</div>
              <div className="w-full bg-white/10 h-3 rounded"><div className="h-3 bg-green-400 rounded" style={{ width: `${meters.relaxation * 10}%` }} /></div>
              <div className="text-xs text-gray-500 mt-1">{meters.relaxation}/10</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Energy</div>
              <div className="w-full bg-white/10 h-3 rounded"><div className="h-3 bg-blue-400 rounded" style={{ width: `${meters.energy * 10}%` }} /></div>
              <div className="text-xs text-gray-500 mt-1">{meters.energy}/10</div>
            </div>
          </div>
          <div className="mb-2 text-white">{msg}</div>
          <div className="mb-2 text-sm text-gray-300"><span className="font-medium text-purple-300">Healthy Suggestion:</span> {healthy}</div>
          <div className="text-sm text-gray-300"><span className="font-medium text-purple-300">Activity Pair:</span> {activity}</div>
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Food Journal</h3>
        {recent.length === 0 ? (
          <div className="text-gray-400">No entries yet. Upload a photo to log your meal.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Food</th>
                  <th className="py-2 pr-4">Detected Mood</th>
                  <th className="py-2 pr-4">Suggestion</th>
                </tr>
              </thead>
              <tbody>
                {recent.slice(0, 10).map((e) => (
                  <tr key={e.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-4 text-gray-400">{new Date(e.date).toLocaleString()}</td>
                    <td className="py-2 pr-4 text-white font-medium">{e.food}</td>
                    <td className="py-2 pr-4 capitalize text-gray-300">{e.mood}</td>
                    <td className="py-2 pr-4 text-gray-400">{e.suggestion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodieSnap;
