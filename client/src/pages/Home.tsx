import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Search } from 'lucide-react';
import VoiceRecorder from '../components/VoiceRecorder';
import MoodAnalysis from '../components/MoodAnalysis';
import MoodResults from '../components/MoodResults';
import RecipeRecommendations from '../components/RecipeRecommendations';
import PantrySuggest from '../components/PantrySuggest';
import { moodService, moodLogService } from '../services/authService';
import { useGamification } from '../contexts/GamificationContext';
import { useReminders } from '../contexts/ReminderContext';

type AnalysisStep = 'input' | 'analyzing' | 'results';

interface MoodData {
  mood: string;
  intensity: number;
  confidence: number;
  text: string;
  nutrients: string[];
  recommendations: any[];
}

const Home: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('input');
  const [moodText, setMoodText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [dietChoice, setDietChoice] = useState<'veg' | 'nonveg' | ''>('');
  const [voiceData, setVoiceData] = useState<string | null>(null);
  const { awardMoodLog, awardVoiceUse } = useGamification();
  const { push } = useReminders();
  const shownMindfulForThisResult = useRef(false);



  const quickPrompts = [
    "I'm feeling stressed about work deadlines",
    "I'm happy and excited about today",
    "I'm tired and need some rest",
    "I'm anxious about an upcoming presentation",
    "I'm feeling calm and peaceful"
  ];

  const handleAnalyzeMood = async () => {
    if (!moodText.trim()) return;

    setLoading(true);
    setCurrentStep('analyzing');

    try {
      // Use stored voiceData if available
      const response = await moodService.analyzeMood(moodText, voiceData || undefined);
      setMoodData(response);
      // Log mood for history/impact tracking (Phase 1)
      try { await moodLogService.logMood(response.mood, response.intensity, moodText); } catch (_) { }
      // Gamification: award coins and update streak/badges
      try { awardMoodLog(response.mood); } catch (_) { }
      setCurrentStep('results');
    } catch (error) {
      console.error('Error analyzing mood:', error);
      setCurrentStep('input');
    } finally {
      setLoading(false);
    }
  };

  // Ensure mindful prompts are visible immediately on results page
  useEffect(() => {
    if (currentStep === 'results' && moodData && !shownMindfulForThisResult.current) {
      push({ kind: 'tip', message: 'Before your meal, take 3 deep breaths. Inhale slowly… exhale fully.' });
      push({ kind: 'tip', message: 'Eat mindfully: slow down and savor every bite.' });
      shownMindfulForThisResult.current = true;
    }
    if (currentStep !== 'results') {
      shownMindfulForThisResult.current = false;
    }
  }, [currentStep, moodData, push]);

  const handleVoiceResult = (transcript: string, vData?: string) => {
    setMoodText(transcript);
    if (vData) {
      setVoiceData(vData);
    }
    // Gamification: voice used
    try { awardVoiceUse(); } catch (_) { }
  };

  const handleQuickPrompt = (prompt: string) => {
    setMoodText(prompt);
  };

  const handleNewAnalysis = () => {
    setCurrentStep('input');
    setMoodText('');
    setMoodData(null);
  };

  const handleRefreshRecommendations = () => {
    setRefreshIndex((i) => i + 1);
  };

  const handleDownloadReport = async () => {
    if (!moodData) return;
    try {
      // Build a simple text report suitable for Notepad
      const lines: string[] = [];
      lines.push('Mood Analysis Report');
      lines.push(`Date: ${new Date().toLocaleString()}`);
      lines.push('');
      lines.push(`Mood: ${moodData.mood}`);
      lines.push(`Intensity: ${moodData.intensity}%`);
      lines.push(`Confidence: ${moodData.confidence}%`);
      lines.push('');
      lines.push('Your Text:');
      lines.push(`"${moodData.text}"`);
      lines.push('');
      lines.push('Key Nutrients:');
      moodData.nutrients.forEach((n, i) => lines.push(`${i + 1}. ${n}`));
      lines.push('');
      lines.push('Recommendations (Summary):');
      moodData.recommendations?.forEach((rec: any) => {
        lines.push(`- ${rec.meal ? rec.meal.toUpperCase() : 'MEAL'}`);
        rec.foods?.forEach((f: any, idx: number) => {
          lines.push(`   ${idx + 1}. ${f.name} - ${f.description ?? ''}`);
        });
      });
      const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mood-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8 glass-card p-4">
        <div className="flex items-center justify-center space-x-8">
          {['Input', 'Analysis', 'Results'].map((step, index) => {
            const stepNumber = index + 1;
            const isActive =
              (stepNumber === 1 && currentStep === 'input') ||
              (stepNumber === 2 && currentStep === 'analyzing') ||
              (stepNumber === 3 && currentStep === 'results');
            const isCompleted =
              (stepNumber === 1 && ['analyzing', 'results'].includes(currentStep)) ||
              (stepNumber === 2 && currentStep === 'results');

            return (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : isActive
                    ? 'bg-purple-500 border-purple-500 text-white'
                    : 'border-white/20 text-gray-400'
                  }`}>
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span className={`ml-2 text-lg font-medium ${isActive ? 'text-purple-300' : isCompleted ? 'text-green-400' : 'text-gray-400'
                  }`}>
                  {step}
                </span>
                {index < 2 && (
                  <div className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${isCompleted ? 'bg-green-500' : 'bg-white/10'
                    }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Brain className="h-12 w-12 text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                How are you feeling today? 💭
              </h1>
              <p className="text-gray-300 text-lg">
                Share your emotions and I'll suggest foods that can help improve your mood
              </p>
            </div>

            {/* Input Methods */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Text Input */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-300 font-medium">
                  <span className="text-2xl">✍️</span>
                  <span>Type Your Feelings</span>
                </div>
                <textarea
                  value={moodText}
                  onChange={(e) => setMoodText(e.target.value)}
                  className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                />
              </div>

              {/* Voice Recording */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-300 font-medium">
                  <span className="text-2xl">🎤</span>
                  <span>Voice Recording</span>
                </div>
                <VoiceRecorder
                  onResult={handleVoiceResult}
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                />
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="mb-8">
              <p className="text-gray-400 mb-4">💬 Or choose a quick prompt:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-lg transition-all duration-200 text-sm text-gray-300 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Diet selection (required) */}
            <div className="mb-8">
              <p className="text-gray-300 mb-2">Select your food type for today</p>
              <div className="inline-flex rounded-lg border border-white/10 overflow-hidden">
                <button
                  onClick={() => setDietChoice('veg')}
                  className={`px-4 py-2 text-sm transition-colors ${dietChoice === 'veg' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                >
                  Veg
                </button>
                <button
                  onClick={() => setDietChoice('nonveg')}
                  className={`px-4 py-2 text-sm border-l border-white/10 transition-colors ${dietChoice === 'nonveg' ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                >
                  Non-veg
                </button>
              </div>
              {dietChoice === '' && (
                <div className="ml-4 inline-block text-sm text-amber-300 bg-amber-500/20 border border-amber-500/30 rounded px-3 py-2">Please choose Veg or Non-veg</div>
              )}
            </div>

            {/* Analyze Button */}
            <div className="text-center">
              <button
                onClick={handleAnalyzeMood}
                disabled={!moodText.trim() || loading || dietChoice === ''}
                className="btn-primary text-white px-8 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto shadow-glow"
              >
                <Search className="h-5 w-5" />
                <span>Analyze My Mood</span>
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 'analyzing' && (
          <MoodAnalysis />
        )}

        {currentStep === 'results' && moodData && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MoodResults
              moodData={moodData}
              onNewAnalysis={handleNewAnalysis}
              onDownloadReport={handleDownloadReport}
              refreshIndex={refreshIndex}
              onRefreshRecommendations={handleRefreshRecommendations}
              dietChoice={(dietChoice || 'veg') as 'veg' | 'nonveg'}
            />
            <RecipeRecommendations mood={moodData.mood} nutrients={moodData.nutrients} refreshIndex={refreshIndex} dietChoice={(dietChoice || 'veg') as 'veg' | 'nonveg'} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
