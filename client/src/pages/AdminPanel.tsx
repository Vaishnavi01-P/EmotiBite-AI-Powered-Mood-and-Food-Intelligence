import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, BarChart3, Shield, Bell, TrendingUp, Activity } from 'lucide-react';
import { analyticsService } from '../services/authService';

interface AdminData {
  totalUsers: number;
  totalEntries: number;
  activeUsers: number;
  emotionStats: { [key: string]: { count: number; avgIntensity: number } };
  systemHealth: {
    uptime: string;
    responseTime: number;
    errorRate: number;
  };
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getAdminAnalytics();
      setAdminData(response);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Mock data for demo
      setAdminData({
        totalUsers: 25,
        totalEntries: 156,
        activeUsers: 18,
        emotionStats: {
          stressed: { count: 45, avgIntensity: 72 },
          happy: { count: 32, avgIntensity: 68 },
          anxious: { count: 28, avgIntensity: 75 },
          tired: { count: 25, avgIntensity: 65 },
          calm: { count: 26, avgIntensity: 60 }
        },
        systemHealth: {
          uptime: '99.9%',
          responseTime: 120,
          errorRate: 0.1
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      stressed: 'text-red-400',
      happy: 'text-amber-400',
      anxious: 'text-pink-400',
      tired: 'text-violet-400',
      calm: 'text-emerald-400',
      sad: 'text-blue-400',
      excited: 'text-orange-400'
    };
    return colors[emotion] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-white/10 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center space-x-1">
            <Activity className="h-4 w-4 text-green-400" />
            <span>System Online</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span>Uptime: {adminData?.systemHealth.uptime}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-white/5 rounded-lg p-1 border border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* System Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {adminData?.totalUsers}
              </div>
              <div className="text-sm text-gray-400">👥 Total Users</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-400" />
                </div>
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {adminData?.totalEntries}
              </div>
              <div className="text-sm text-gray-400">📝 Total Entries</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-400" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {adminData?.activeUsers}
              </div>
              <div className="text-sm text-gray-400">🔥 Active Users (7d)</div>
            </motion.div>
          </div>

          {/* Emotion Statistics */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Emotion Statistics</h3>
            <div className="space-y-4">
              {Object.entries(adminData?.emotionStats || {}).map(([emotion, stats]) => (
                <div key={emotion} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center space-x-3">
                    <span className={`font-semibold ${getEmotionColor(emotion)}`}>
                      {emotion}
                    </span>
                    <span className="text-gray-400">{stats.count} entries</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400">
                      Avg Intensity: <span className="font-semibold text-white">{stats.avgIntensity}%</span>
                    </div>
                    <div className="w-32 bg-white/10 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(stats.count / (adminData?.totalEntries || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {adminData?.systemHealth.uptime}
                </div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {adminData?.systemHealth.responseTime}ms
                </div>
                <div className="text-sm text-gray-400">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {adminData?.systemHealth.errorRate}%
                </div>
                <div className="text-sm text-gray-400">Error Rate</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">User Management</h3>
          <div className="text-center py-12 text-gray-500">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">User management features coming soon...</p>
          </div>
        </motion.div>
      )}

      {activeTab === 'moderation' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Content Moderation</h3>
          <div className="text-center py-12 text-gray-500">
            <Shield className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">Moderation tools coming soon...</p>
          </div>
        </motion.div>
      )}

      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Notifications</h3>
          <div className="text-center py-12 text-gray-500">
            <Bell className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">Notification management coming soon...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPanel;
