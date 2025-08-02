import React, { useState, useEffect } from 'react';
import { Bell, X, Heart, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, getUnreadCount, markNotificationsAsRead, deleteNotification, clearAllNotifications } from '../redux/slices/notificationSlice';
import { setNotificationSystem } from '../utils/notificationUtils';
import { useWebSocket } from '../context/WebSocketContext';

const NotificationSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  
  // Get notifications from Redux store
  const { notifications, unreadCount, loading } = useSelector((state) => state.notification);
  const token = localStorage.getItem('token');
  const { isConnected } = useWebSocket();

  // Load notifications from backend on component mount
  useEffect(() => {
    if (token) {
      dispatch(getNotifications({ token }));
      dispatch(getUnreadCount(token));
    }
    
    // Register this notification system with the utils
    setNotificationSystem({
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAllNotifications
    });
  }, [dispatch, token]);

  // Refresh notifications when dropdown is opened
  useEffect(() => {
    if (isOpen && token) {
      dispatch(getNotifications({ token }));
      dispatch(getUnreadCount(token));
    }
  }, [isOpen, dispatch, token]);

  // Add a new notification (local only for immediate feedback)
  const addNotification = (type, message, data = {}) => {
    // This is now handled by the backend, but we can show immediate feedback
    console.log('Notification added:', { type, message, data });
  };

  // Remove a notification
  const removeNotification = async (id) => {
    if (token) {
      await dispatch(deleteNotification({ token, notificationId: id }));
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    if (token) {
      await dispatch(markNotificationsAsRead({ token, notificationIds: [id] }));
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (token) {
      await dispatch(markNotificationsAsRead({ token }));
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    if (token) {
      await dispatch(clearAllNotifications(token));
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'match':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      markAsRead(notification._id);
    }
    
    // Handle navigation based on notification type
    if (notification.data?.profileId) {
      window.location.href = `/profile/${notification.data.profileId}`;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all duration-200 ${
          darkMode 
            ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-xl border z-50 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          {/* Header */}
          <div className={`p-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className={`text-sm ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAllNotifications}
                  className={`text-sm ${
                    darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
                  }`}
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={`p-6 text-center ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 transition-colors duration-200 cursor-pointer ${
                      !notification.read 
                        ? darkMode ? 'bg-blue-900/20' : 'bg-blue-50' 
                        : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs mt-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(notification.createdAt)}
                        </p>
                        {notification.data && (
                          <div className="mt-2">
                            {notification.data.profileId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/profile/${notification.data.profileId}`;
                                }}
                                className={`text-xs ${
                                  darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                }`}
                              >
                                View Profile
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification._id);
                          }}
                          className={`p-1 rounded-full transition-colors ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global notification methods - expose to window for external use */}
      {typeof window !== 'undefined' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.notificationSystem = {
                addNotification: ${addNotification.toString()},
                removeNotification: ${removeNotification.toString()},
                markAsRead: ${markAsRead.toString()},
                markAllAsRead: ${markAllAsRead.toString()},
                clearAllNotifications: ${clearAllNotifications.toString()}
              };
            `
          }}
        />
      )}
    </div>
  );
};

export default NotificationSystem; 