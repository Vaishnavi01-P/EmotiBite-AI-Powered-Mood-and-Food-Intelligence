import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Heart, BarChart3, Settings, LogOut, User } from 'lucide-react';
import { ReminderProvider, useReminders } from '../contexts/ReminderContext';

interface LayoutProps {
  children: React.ReactNode;
}

const ReminderCenter: React.FC = () => {
  const { reminders, dismiss } = useReminders();
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {reminders.map(r => (
        <div key={r.id} className={`max-w-sm glass-card p-3 text-sm text-gray-100 ${r.kind === 'warning' ? 'border-red-500/30 bg-red-900/20' : r.kind === 'tip' ? 'border-blue-500/30 bg-blue-900/20' : 'border-gray-500/30'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="text-gray-200">
              <div>{r.message}</div>
              {r.action && (
                <div className="mt-2">
                  <Link to={r.action.to} onClick={() => dismiss(r.id)} className="inline-block px-2 py-1 text-xs rounded bg-purple-600 text-white hover:bg-purple-700 shadow-md">
                    {r.action.label}
                  </Link>
                </div>
              )}
            </div>
            <button onClick={() => dismiss(r.id)} className="text-gray-400 hover:text-white transition-colors">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <ReminderProvider>
      <div className="min-h-screen bg-transparent">
        {/* Header */}
        <header className="glass shadow-glow border-b border-white/10 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2 group">
                  <Brain className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <span className="text-xl font-bold text-white tracking-tight">EmotiBite</span>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-8">
                <Link
                  to="/"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/')
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <User className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/dashboard')
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/saved"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/saved')
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Saved</span>
                </Link>
                <Link
                  to="/pantry"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/pantry')
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Pantry</span>
                </Link>
                <Link
                  to="/foodie-snap"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/foodie-snap')
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Foodie Snap</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/admin')
                      ? 'bg-white/10 text-white shadow-inner'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-base text-gray-300">
                  Welcome, <span className="font-medium text-white">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 text-base btn-primary shadow-glow"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <ReminderCenter />
      </div>
    </ReminderProvider>
  );
};

export default Layout;
