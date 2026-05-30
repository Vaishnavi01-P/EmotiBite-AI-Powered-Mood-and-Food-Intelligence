import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Heart, Apple, Chrome } from 'lucide-react';
import FloatingEmojis from '../components/FloatingEmojis';
import { getTimeOfDay, timeGreeting, gradientForTime } from '../utils/timeUtils';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const timeOfDay = useMemo(() => getTimeOfDay(), []);
  const gradient = useMemo(() => gradientForTime(timeOfDay), [timeOfDay]);
  const dynamicPrompt = useMemo(() => {
    switch (timeOfDay) {
      case 'morning':
        return 'Good Morning! 🌞 Start your day with a happy bite.';
      case 'afternoon':
        return 'Good Afternoon! 🌤 Fuel your mood with smart food choices.';
      case 'evening':
        return 'Good Evening! 🌙 Reflect and relax with your favorite meals.';
      default:
        return 'Create your account to start your AI-driven emotional wellness and nutrition journey.';
    }
  }, [timeOfDay]);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;
    return score;
  }, [password]);

  const strengthEmoji = useMemo(() => {
    if (passwordStrength <= 2) return '😬';
    if (passwordStrength <= 4) return '🙂';
    return '😍';
  }, [passwordStrength]);

  const quotes = useMemo(
    () => [
      'Your mood today can change tomorrow — track it wisely!',
      'Good food, good mood, good life 🍏💛',
      'Small steps daily lead to big mood wins ✨',
    ],
    []
  );
  const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], [quotes]);

  const triggerConfetti = () => {
    const emojis = ['🎉', '✨', '🍏', '🌈', '💛'];
    for (let i = 0; i < 20; i++) {
      const span = document.createElement('span');
      span.className = 'confetti-piece';
      span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const dx = (Math.random() - 0.5) * 300;
      span.style.setProperty('--dx', `${dx}px`);
      span.style.left = `${Math.random() * 100}vw`;
      span.style.fontSize = `${Math.floor(Math.random() * 14) + 14}px`;
      document.body.appendChild(span);
      setTimeout(() => span.remove(), 1800);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signup(name, email, password);
      triggerConfetti();
      setTimeout(() => navigate('/login'), 900);
    } catch (err: any) {
      setError(err?.message || err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden`}>
      <FloatingEmojis />
      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join EmotiBite Today ✨🍏</h1>
          <p className="text-gray-300">{timeGreeting(timeOfDay)}</p>
        </div>

        {/* Signup Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your full name"
                required
              />
              {name && (
                <p className="mt-1 text-sm text-purple-400">Nice to meet you, {name}! 😊</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Create a secure password"
                required
              />
              <p className="mt-1 text-sm text-gray-400">Strength: <span className="font-medium">{strengthEmoji}</span></p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Heart className="h-5 w-5 mr-2" />
                  Sign Up
                </>
              )}
            </button>
            {/* Social logins (UI only) */}

          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">🎯 Fun Fact: Logging moods daily improves self-awareness and helps EmotiBite give smarter food suggestions.</p>
            <p className="text-gray-400 mt-2">Tip: Choose meals that match your vibe for better mood tracking 🍇🥗.</p>
            <p className="text-gray-400 mt-4">
              Already have an account?{' '}
              <Link
                to="/login"
                title="Back to your mood journey!"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
              >
                Sign In →
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">{randomQuote}</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
