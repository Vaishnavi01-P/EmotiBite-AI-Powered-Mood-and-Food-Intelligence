import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Heart } from 'lucide-react';
import FloatingEmojis from '../components/FloatingEmojis';
import { getTimeOfDay, timeGreeting, gradientForTime } from '../utils/timeUtils';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const timeOfDay = useMemo(() => getTimeOfDay(), []);
  const gradient = useMemo(() => gradientForTime(timeOfDay), [timeOfDay]);
  const dynamicPrompt = useMemo(() => timeGreeting(timeOfDay), [timeOfDay]);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const passwordStrong = useMemo(() => {
    const len = password.length >= 8;
    const mix = /[A-Z]/.test(password) && /[a-z]/.test(password);
    const num = /\d/.test(password);
    const special = /[^A-Za-z0-9]/.test(password);
    return len && mix && (num || special);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || err?.response?.data?.message || 'Login failed');
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
          <h1 className="text-3xl font-bold text-white mb-1">Welcome to EmotiBite 🍎🌈</h1>
          <p className="text-gray-300">Sign in to continue your personalized mood and food journey.</p>
          <p className="text-sm text-purple-200 mt-2">{dynamicPrompt}</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email / Username
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-10 placeholder-gray-500"
                placeholder="Enter your email or username"
                required
              />
              <div className="mt-1 text-sm">
                <span className="inline-block mr-2">{emailValid ? '😊' : '🙂'}</span>
                <span className="text-gray-500">{emailValid ? 'Looks good!' : 'We’ll validate as you type'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-10 placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
              <div className="mt-1 text-sm">
                <span className="inline-block mr-2">{passwordStrong ? '🔒' : '🔑'}</span>
                <span className="text-gray-500">{passwordStrong ? 'Strong password' : 'Use 8+ chars, Aa + number/symbol'}</span>
              </div>
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
                  Sign In
                </>
              )}
            </button>


            {/* Helper links */}
            <div className="flex items-center justify-between text-sm">
              <a href="#" title="No worries, we’ll help you reset it." className="text-purple-400 hover:text-purple-300">Forgot your password?</a>
              <Link to="/signup" title="Start your mood & food journey!" className="text-purple-400 hover:text-purple-300">New to EmotiBite? Sign Up →</Link>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">💡 Pro Tip: Daily check-ins help EmotiBite provide smarter food recommendations!</p>
            <p className="text-gray-400 mt-2">Your emotions + EmotiBite = Personalized meals that match your vibe 🍓🥑.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Your emotional nutrition guide
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
