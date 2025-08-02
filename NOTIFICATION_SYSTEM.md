# 🔔 Notification System Documentation

## Overview

The notification system provides real-time notifications for various user actions in the विप्रVivah application. It includes a bell icon in the header that shows unread notification count and a dropdown with all notifications.

## 🚀 Features

### Core Features
- **Real-time Notifications**: Instant notifications for user actions
- **Unread Count Badge**: Shows number of unread notifications
- **Persistent Storage**: Notifications saved in localStorage
- **Auto-dismiss**: Notifications auto-remove after 5 seconds
- **Dark Mode Support**: Fully compatible with dark/light themes
- **Responsive Design**: Works on all screen sizes

### Notification Types
- **Like Notifications**: When someone likes your profile
- **Match Notifications**: When there's a mutual like
- **Message Notifications**: For new messages (future feature)
- **System Notifications**: Welcome messages, profile updates, etc.
- **Subscription Notifications**: Premium upgrades, expirations
- **Profile View Notifications**: When someone views your profile

## 📁 File Structure

```
src/
├── components/
│   ├── NotificationSystem.jsx          # Main notification component
│   └── Header.jsx                      # Header with notification bell
├── utils/
│   └── notificationUtils.js            # Notification utility functions
└── components/Pages/
    ├── ExploreProfiles.jsx             # Triggers like notifications
    ├── ViewProfile.jsx                 # Triggers like notifications
    ├── MatrimonyRegistration.jsx       # Triggers profile notifications
    └── Login.jsx                       # Triggers welcome notifications
```

## 🛠️ Usage

### Basic Usage

```javascript
import { notifyProfileLiked, notifyCustom } from '../utils/notificationUtils';

// Trigger a profile like notification
notifyProfileLiked('John Doe', 'profile123');

// Trigger a custom notification
notifyCustom('like', 'Custom message', { profileId: '123' });
```

### Available Functions

#### Predefined Notifications
```javascript
// Profile interactions
notifyProfileLiked(profileName, profileId);
notifyMutualLike(profileName, profileId);
notifyProfileViewed(viewerName, viewerId);

// System notifications
notifyWelcome();
notifyProfileCreated();
notifyProfileUpdated();

// Subscription notifications
notifySubscriptionUpgraded();
notifySubscriptionExpired();

// Message notifications (future)
notifyNewMessage(senderName, senderId);
```

#### Custom Notifications
```javascript
// Custom notification with data
notifyCustom('like', 'Someone liked your profile!', { profileId: '123' });

// Batch notifications
notifyBatch([
  { type: 'like', message: 'Profile liked', data: { id: '1' } },
  { type: 'match', message: 'It\'s a match!', data: { id: '2' } }
]);

// Notification with actions
notifyWithAction('like', 'Profile liked', { profileId: '123' }, [
  { label: 'View Profile', action: () => navigate('/profile/123') }
]);
```

### Notification Types

```javascript
import { NotificationTypes } from '../utils/notificationUtils';

// Available types
NotificationTypes.LIKE           // Profile like
NotificationTypes.MATCH          // Mutual like
NotificationTypes.MESSAGE        // New message
NotificationTypes.SYSTEM         // System notification
NotificationTypes.PROFILE_VIEW   // Profile view
NotificationTypes.SUBSCRIPTION   // Subscription events
```

### Notification Messages

```javascript
import { NotificationMessages } from '../utils/notificationUtils';

// Predefined messages
NotificationMessages.PROFILE_LIKED('John Doe')     // "John Doe liked your profile!"
NotificationMessages.MUTUAL_LIKE('Jane Smith')     // "It's a match! Jane Smith also liked you back!"
NotificationMessages.WELCOME                       // "Welcome to विप्रVivah! Start exploring profiles."
```

## 🎨 UI Components

### Notification Bell
- Located in the header
- Shows unread count badge
- Opens dropdown on click
- Supports dark/light themes

### Notification Dropdown
- **Header**: Title with "Mark all read" and "Clear all" buttons
- **List**: Scrollable list of notifications
- **Empty State**: Shows when no notifications exist
- **Individual Notifications**: 
  - Icon based on type
  - Message text
  - Timestamp
  - Action buttons (if applicable)
  - Close button

### Notification Item Structure
```javascript
{
  id: Date.now(),
  type: 'like',                    // Notification type
  message: 'John liked your profile!',
  data: { profileId: '123' },     // Additional data
  timestamp: '2024-01-01T00:00:00Z',
  read: false                      // Read status
}
```

## 🔧 Integration Points

### 1. Profile Like Notifications
**Location**: `ExploreProfiles.jsx`, `ViewProfile.jsx`
```javascript
// When user likes a profile
await dispatch(createLike({ token, likedId: profileId }));
const profileName = `${profile.firstName} ${profile.lastName}`;
notifyProfileLiked(profileName, profileId);
```

### 2. Profile Creation/Update Notifications
**Location**: `MatrimonyRegistration.jsx`
```javascript
// After successful profile save
if (isProfileFlag) {
  notifyProfileUpdated();
} else {
  notifyProfileCreated();
}
```

### 3. Welcome Notifications
**Location**: `Login.jsx`
```javascript
// After successful login
notifyWelcome();
```

### 4. Subscription Notifications
**Location**: `SubscriptionPage.jsx` (future)
```javascript
// After subscription upgrade
notifySubscriptionUpgraded();
```

## 🎯 Implementation Details

### Storage
- Notifications stored in `localStorage` as JSON
- Key: `'notifications'`
- Auto-save on every change
- Auto-load on component mount

### Auto-cleanup
- Notifications auto-remove after 5 seconds
- Manual removal via close button
- "Clear all" functionality
- "Mark all read" functionality

### Performance
- Efficient rendering with React hooks
- Minimal re-renders
- Optimized for large notification lists
- Debounced updates

## 🧪 Testing

### Development Testing
A test button is available on the homepage in development mode:
```javascript
// Only shows in development
{process.env.NODE_ENV === 'development' && (
  <button onClick={() => notifyCustom(NotificationTypes.LIKE, 'Test notification!')}>
    Test Notification
  </button>
)}
```

### Manual Testing
1. **Like a Profile**: Go to Explore Profiles and like a profile
2. **Create Profile**: Complete profile registration
3. **Login**: Login to see welcome notification
4. **Test Button**: Use the test button on homepage (dev only)

## 🔮 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live notifications
- **Push Notifications**: Browser push notifications
- **Email Notifications**: Email alerts for important events
- **Notification Preferences**: User settings for notification types
- **Rich Notifications**: Images, buttons, and interactive elements
- **Notification History**: Persistent notification history
- **Sound Alerts**: Audio notifications
- **Vibration**: Mobile vibration alerts

### API Integration
```javascript
// Future WebSocket integration
socket.on('notification', (data) => {
  notifyCustom(data.type, data.message, data.payload);
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Notifications not showing**
   - Check if NotificationSystem is imported in Header
   - Verify notificationUtils is properly imported
   - Check browser console for errors

2. **Notifications not persisting**
   - Check localStorage availability
   - Verify JSON parsing/stringifying
   - Check for storage quota exceeded

3. **Performance issues**
   - Limit notification count (max 50)
   - Implement virtual scrolling for large lists
   - Add debouncing for rapid notifications

### Debug Mode
```javascript
// Enable debug logging
const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  console.log('Notification triggered:', { type, message, data });
}
```

## 📝 Best Practices

1. **Use Predefined Functions**: Use `notifyProfileLiked()` instead of `notifyCustom()`
2. **Include Relevant Data**: Always include `profileId` for profile-related notifications
3. **Clear Messages**: Write clear, user-friendly notification messages
4. **Test Thoroughly**: Test notifications in both light and dark modes
5. **Handle Errors**: Always wrap notification calls in try-catch blocks
6. **Performance**: Don't trigger too many notifications at once

## 🔒 Security Considerations

- Notifications are client-side only
- No sensitive data in notifications
- Sanitize user input in notification messages
- Validate notification data before display

## 📊 Analytics Integration

```javascript
// Track notification interactions
const trackNotification = (action, notificationType) => {
  // Analytics tracking code
  console.log('Notification action:', action, notificationType);
};
```

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Maintainer**: Development Team 