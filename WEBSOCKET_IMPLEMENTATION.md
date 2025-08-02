# 🔌 WebSocket Implementation Documentation

## Overview

The WebSocket implementation provides real-time communication between the frontend and backend for instant notification delivery. It includes automatic connection management, reconnection logic, and seamless integration with the notification system.

## 🏗️ Architecture

### Frontend Components
```
src/
├── services/
│   └── websocketService.js          # WebSocket service singleton
├── context/
│   └── WebSocketContext.jsx         # React context for WebSocket
├── components/
│   ├── Header.jsx                   # WebSocket connection indicator
│   └── NotificationSystem.jsx       # Real-time notification display
└── App.jsx                          # WebSocket provider wrapper
```

### Backend Integration
```
vipraVivahBackend/
├── server.js                        # Socket.IO server setup
├── controllers/
│   └── notificationController.js    # Real-time notification emission
└── models/
    └── Notification.js              # Database notification model
```

## 🚀 Features

### Core Features
- **Real-time Notifications**: Instant delivery of notifications
- **Automatic Reconnection**: Handles connection drops gracefully
- **Authentication**: JWT token-based WebSocket authentication
- **Connection Status**: Visual indicator of WebSocket connection
- **Event Management**: Centralized event handling system
- **Error Handling**: Robust error handling and recovery

### Technical Features
- **Socket.IO**: Reliable WebSocket implementation
- **React Context**: Global WebSocket state management
- **Redux Integration**: Seamless notification state updates
- **Auto-reconnection**: Exponential backoff reconnection strategy
- **Connection Monitoring**: Real-time connection status tracking

## 🔧 Implementation Details

### 1. WebSocket Service (`services/websocketService.js`)

```javascript
// Key Features:
- Singleton pattern for global access
- Automatic reconnection with exponential backoff
- Event listener management
- Connection status tracking
- JWT token authentication
- Error handling and recovery
```

### 2. WebSocket Context (`context/WebSocketContext.jsx`)

```javascript
// Key Features:
- React Context for global WebSocket state
- Automatic connection management
- Event listener setup and cleanup
- Redux integration for notifications
- Connection status updates
```

### 3. Backend Integration (`server.js`)

```javascript
// Key Features:
- Socket.IO server setup with CORS
- JWT authentication middleware
- User-specific room management
- Global io instance for notification emission
```

## 🔄 Real-time Flow

### 1. Connection Establishment
```javascript
// Frontend connects with JWT token
websocketService.connect(token);

// Backend authenticates and assigns user to room
socket.join(`user_${userId}`);
```

### 2. Notification Creation
```javascript
// Backend creates notification in database
const notification = await Notification.createNotification(data);

// Emit real-time notification to user
global.io.to(`user_${recipientId}`).emit('new_notification', {
  type: 'notification',
  data: notification
});
```

### 3. Frontend Reception
```javascript
// Frontend receives notification
socket.on('new_notification', (data) => {
  // Update Redux store
  dispatch(addLocalNotification(data));
  
  // Show toast notification
  showToastNotification(data.message);
});
```

## 📡 WebSocket Events

### Server to Client Events
```javascript
// New notification received
'socket.on('new_notification', data)'

// Unread count updated
'socket.on('unread_count_update', data)'

// Notification marked as read
'socket.on('notification_read', data)'

// Notification deleted
'socket.on('notification_deleted', data)'
```

### Client to Server Events
```javascript
// Join a room
'socket.emit('join_room', room)'

// Leave a room
'socket.emit('leave_room', room)'

// Mark notification as read
'socket.emit('mark_notification_read', { notificationId })'

// Delete notification
'socket.emit('delete_notification', { notificationId })'

// Request unread count
'socket.emit('get_unread_count', {})'
```

## 🔐 Authentication

### JWT Token Authentication
```javascript
// Frontend sends token in connection
const socket = io(BASE_URL, {
  auth: { token }
});

// Backend validates token
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  socket.userId = decoded.id;
  next();
});
```

### User-specific Rooms
```javascript
// Each user gets their own room
socket.join(`user_${socket.userId}`);

// Notifications sent to specific user
global.io.to(`user_${recipientId}`).emit('new_notification', data);
```

## 🔄 Reconnection Strategy

### Automatic Reconnection
```javascript
// Exponential backoff reconnection
const reconnectDelay = 1000 * Math.pow(2, reconnectAttempts);

setTimeout(() => {
  socket.connect();
}, reconnectDelay);
```

### Connection Status Tracking
```javascript
// Real-time connection status
const getConnectionStatus = () => ({
  isConnected: this.isConnected,
  reconnectAttempts: this.reconnectAttempts,
  maxReconnectAttempts: this.maxReconnectAttempts
});
```

## 🎨 UI Integration

### Connection Indicator
```javascript
// Visual connection status in header
{isConnected ? (
  <Wifi className="w-4 h-4 text-green-400" title="Connected" />
) : (
  <WifiOff className="w-4 h-4 text-gray-400" title="Disconnected" />
)}
```

### Real-time Notifications
```javascript
// Instant notification display
socket.on('new_notification', (data) => {
  // Update notification list immediately
  // Show toast notification
  // Update unread count
});
```

## 📊 Performance Features

### Connection Optimization
- **Persistent Connections**: Maintains connection across page navigation
- **Event Debouncing**: Prevents excessive event emissions
- **Memory Management**: Proper cleanup of event listeners
- **Error Recovery**: Automatic recovery from connection issues

### Scalability
- **User-specific Rooms**: Efficient message routing
- **Connection Pooling**: Shared connections for multiple components
- **Event Filtering**: Only relevant events sent to users
- **Load Balancing**: Ready for horizontal scaling

## 🧪 Testing

### Connection Testing
```javascript
// Test WebSocket connection
const testConnection = () => {
  websocketService.connect(token);
  console.log('Connection status:', websocketService.getConnectionStatus());
};
```

### Event Testing
```javascript
// Test notification reception
websocketService.on('new_notification', (data) => {
  console.log('Test notification received:', data);
});
```

## 🔮 Future Enhancements

### Planned Features
- **Push Notifications**: Browser push notifications
- **Message Broadcasting**: System-wide announcements
- **Typing Indicators**: Real-time typing status
- **Online Status**: User online/offline indicators
- **File Transfer**: Real-time file sharing
- **Voice/Video**: WebRTC integration

### Advanced Features
```javascript
// Future WebRTC integration
const startVideoCall = (userId) => {
  socket.emit('start_video_call', { targetUserId: userId });
};

// Future file transfer
const sendFile = (file, recipientId) => {
  socket.emit('send_file', { file, recipientId });
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Failures**
   - Check JWT token validity
   - Verify server is running
   - Check CORS configuration
   - Monitor network connectivity

2. **Authentication Errors**
   - Ensure token is properly formatted
   - Check JWT secret configuration
   - Verify token expiration

3. **Event Not Received**
   - Check event listener registration
   - Verify room membership
   - Monitor server logs

### Debug Mode
```javascript
// Enable detailed logging
const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  console.log('WebSocket event:', event, data);
}
```

## 📝 Best Practices

### Development
1. **Always Clean Up**: Remove event listeners on component unmount
2. **Handle Errors**: Implement proper error handling for all events
3. **Monitor Connection**: Track connection status for debugging
4. **Test Thoroughly**: Test all WebSocket scenarios
5. **Optimize Events**: Only emit necessary events

### Production
1. **Connection Monitoring**: Track WebSocket connection health
2. **Error Logging**: Log all WebSocket errors
3. **Performance Monitoring**: Monitor WebSocket performance
4. **Security Audits**: Regular security reviews
5. **Backup Strategies**: Fallback for WebSocket failures

## 🔧 Configuration

### Environment Variables
```bash
# WebSocket settings
WEBSOCKET_PORT=3000
WEBSOCKET_CORS_ORIGIN=http://localhost:5173
WEBSOCKET_MAX_RECONNECT_ATTEMPTS=5
WEBSOCKET_RECONNECT_DELAY=1000
```

### Client Configuration
```javascript
// WebSocket client settings
const socketConfig = {
  auth: { token },
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
};
```

## 📊 Monitoring

### Metrics to Track
- WebSocket connection count
- Event emission frequency
- Reconnection attempts
- Error rates
- Message delivery success rate

### Health Checks
```javascript
// WebSocket health check
const healthCheck = () => {
  const status = websocketService.getConnectionStatus();
  return {
    isConnected: status.isConnected,
    reconnectAttempts: status.reconnectAttempts,
    timestamp: Date.now()
  };
};
```

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Maintainer**: Frontend Development Team 