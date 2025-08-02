// notificationUtils.js

// Global notification system reference
let notificationSystem = null;

// Set the notification system reference
export const setNotificationSystem = (system) => {
  notificationSystem = system;
};

// Get the notification system reference
export const getNotificationSystem = () => {
  return notificationSystem;
};

// Add a notification
export const addNotification = (type, message, data = {}) => {
  if (notificationSystem && notificationSystem.addNotification) {
    notificationSystem.addNotification(type, message, data);
  } else if (typeof window !== 'undefined' && window.notificationSystem) {
    window.notificationSystem.addNotification(type, message, data);
  } else {
    // Fallback: show a simple alert
    console.log(`Notification: ${message}`);
  }
  
  // Note: Backend notifications are now handled automatically by the server
  // This function is mainly for immediate UI feedback
};

// Remove a notification
export const removeNotification = (id) => {
  if (notificationSystem && notificationSystem.removeNotification) {
    notificationSystem.removeNotification(id);
  } else if (typeof window !== 'undefined' && window.notificationSystem) {
    window.notificationSystem.removeNotification(id);
  }
};

// Mark notification as read
export const markAsRead = (id) => {
  if (notificationSystem && notificationSystem.markAsRead) {
    notificationSystem.markAsRead(id);
  } else if (typeof window !== 'undefined' && window.notificationSystem) {
    window.notificationSystem.markAsRead(id);
  }
};

// Mark all notifications as read
export const markAllAsRead = () => {
  if (notificationSystem && notificationSystem.markAllAsRead) {
    notificationSystem.markAllAsRead();
  } else if (typeof window !== 'undefined' && window.notificationSystem) {
    window.notificationSystem.markAllAsRead();
  }
};

// Clear all notifications
export const clearAllNotifications = () => {
  if (notificationSystem && notificationSystem.clearAllNotifications) {
    notificationSystem.clearAllNotifications();
  } else if (typeof window !== 'undefined' && window.notificationSystem) {
    window.notificationSystem.clearAllNotifications();
  }
};

// Predefined notification types
export const NotificationTypes = {
  LIKE: 'like',
  MATCH: 'match',
  MESSAGE: 'message',
  SYSTEM: 'system',
  PROFILE_VIEW: 'profile_view',
  SUBSCRIPTION: 'subscription'
};

// Predefined notification messages
export const NotificationMessages = {
  PROFILE_LIKED: (profileName) => `${profileName} liked your profile!`,
  MUTUAL_LIKE: (profileName) => `It's a match! ${profileName} also liked you back!`,
  NEW_MESSAGE: (senderName) => `New message from ${senderName}`,
  PROFILE_VIEWED: (viewerName) => `${viewerName} viewed your profile`,
  SUBSCRIPTION_UPGRADED: 'Your subscription has been upgraded to Premium!',
  SUBSCRIPTION_EXPIRED: 'Your Premium subscription has expired',
  WELCOME: 'Welcome to विप्रVivah! Start exploring profiles.',
  PROFILE_UPDATED: 'Your profile has been updated successfully!',
  PROFILE_CREATED: 'Your profile has been created successfully!'
};

// Helper functions for common notifications
export const notifyProfileLiked = (profileName, profileId) => {
  addNotification(
    NotificationTypes.LIKE,
    NotificationMessages.PROFILE_LIKED(profileName),
    { profileId, profileName }
  );
};

export const notifyMutualLike = (profileName, profileId) => {
  addNotification(
    NotificationTypes.MATCH,
    NotificationMessages.MUTUAL_LIKE(profileName),
    { profileId, profileName }
  );
};

export const notifyNewMessage = (senderName, senderId) => {
  addNotification(
    NotificationTypes.MESSAGE,
    NotificationMessages.NEW_MESSAGE(senderName),
    { senderId, senderName }
  );
};

export const notifyProfileViewed = (viewerName, viewerId) => {
  addNotification(
    NotificationTypes.PROFILE_VIEW,
    NotificationMessages.PROFILE_VIEWED(viewerName),
    { viewerId, viewerName }
  );
};

export const notifySubscriptionUpgraded = () => {
  addNotification(
    NotificationTypes.SUBSCRIPTION,
    NotificationMessages.SUBSCRIPTION_UPGRADED
  );
};

export const notifySubscriptionExpired = () => {
  addNotification(
    NotificationTypes.SUBSCRIPTION,
    NotificationMessages.SUBSCRIPTION_EXPIRED
  );
};

export const notifyWelcome = () => {
  addNotification(
    NotificationTypes.SYSTEM,
    NotificationMessages.WELCOME
  );
};

export const notifyProfileUpdated = () => {
  addNotification(
    NotificationTypes.SYSTEM,
    NotificationMessages.PROFILE_UPDATED
  );
};

export const notifyProfileCreated = () => {
  addNotification(
    NotificationTypes.SYSTEM,
    NotificationMessages.PROFILE_CREATED
  );
};

// Custom notification with custom data
export const notifyCustom = (type, message, data = {}) => {
  addNotification(type, message, data);
};

// Batch notifications (for multiple events)
export const notifyBatch = (notifications) => {
  notifications.forEach(({ type, message, data }) => {
    addNotification(type, message, data);
  });
};

// Notification with action buttons
export const notifyWithAction = (type, message, data = {}, actions = []) => {
  addNotification(type, message, { ...data, actions });
};

export default {
  addNotification,
  removeNotification,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
  setNotificationSystem,
  getNotificationSystem,
  NotificationTypes,
  NotificationMessages,
  notifyProfileLiked,
  notifyMutualLike,
  notifyNewMessage,
  notifyProfileViewed,
  notifySubscriptionUpgraded,
  notifySubscriptionExpired,
  notifyWelcome,
  notifyProfileUpdated,
  notifyProfileCreated,
  notifyCustom,
  notifyBatch,
  notifyWithAction
}; 