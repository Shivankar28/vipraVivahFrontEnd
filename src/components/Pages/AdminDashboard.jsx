import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  UserCheck, 
  FileText, 
  CreditCard, 
  Heart, 
  Bell, 
  TrendingUp, 
  BarChart3
} from 'lucide-react';
import { getDashboardStats } from '../../redux/slices/adminSlice';
import { useTheme } from '../../context/ThemeContext';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  const { dashboardStats, loading, error } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Load dashboard stats
    dispatch(getDashboardStats());
  }, [dispatch]);

  const statsCards = [
    {
      title: 'Total Users',
      value: dashboardStats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: dashboardStats?.recentUsers || 0,
      changeText: 'new this week',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Verified Users',
      value: dashboardStats?.verifiedUsers || 0,
      icon: UserCheck,
      color: 'bg-green-500',
      change: dashboardStats?.verificationRate || 0,
      changeText: '% verification rate',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Profiles Created',
      value: dashboardStats?.profilesCreated || 0,
      icon: FileText,
      color: 'bg-purple-500',
      change: dashboardStats?.profileCompletionRate || 0,
      changeText: '% completion rate',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Active Subscriptions',
      value: dashboardStats?.activeSubscriptions || 0,
      icon: CreditCard,
      color: 'bg-yellow-500',
      change: dashboardStats?.premiumSubscriptions || 0,
      changeText: 'premium users',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Interests',
      value: dashboardStats?.totalInterests || 0,
      icon: Heart,
      color: 'bg-pink-500',
      change: dashboardStats?.recentProfiles || 0,
      changeText: 'new profiles this week',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    {
      title: 'Notifications',
      value: dashboardStats?.totalNotifications || 0,
      icon: Bell,
      color: 'bg-indigo-500',
      change: 0,
      changeText: 'total sent',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ];

  const formatPercentage = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return '0.00';
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Dashboard Overview
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.changeText.includes('%') ? `${formatPercentage(stat.change)} ${stat.changeText}` : `${stat.change} ${stat.changeText}`}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} text-white flex-shrink-0`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">New user registrations this week</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">{dashboardStats?.recentUsers || 0}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">New profiles created this week</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">{dashboardStats?.recentProfiles || 0}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Premium subscriptions</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">{dashboardStats?.premiumSubscriptions || 0}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
