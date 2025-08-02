import { io } from 'socket.io-client';
import { BASE_URL } from '../constants/config';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
  }

  // Connect to WebSocket server
  connect(token) {
    if (this.socket && this.isConnected) {
      console.log('WebSocket: Already connected');
      return;
    }

    try {
      console.log('WebSocket: Connecting to server...');
      
      // Create socket connection with authentication
      this.socket = io(BASE_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        timeout: 20000
      });

      // Connection event handlers
      this.socket.on('connect', () => {
        console.log('WebSocket: Connected successfully');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connection_established', { userId: this.getUserIdFromToken(token) });
      });

      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket: Disconnected', reason);
        this.isConnected = false;
        
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          this.socket.connect();
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket: Connection error', error);
        this.isConnected = false;
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            console.log(`WebSocket: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            this.socket.connect();
          }, this.reconnectDelay * this.reconnectAttempts);
        } else {
          console.error('WebSocket: Max reconnection attempts reached');
        }
      });

      // Notification event handlers
      this.socket.on('new_notification', (data) => {
        console.log('WebSocket: New notification received', data);
        this.handleNewNotification(data);
      });

      this.socket.on('unread_count_update', (data) => {
        console.log('WebSocket: Unread count update received', data);
        this.handleUnreadCountUpdate(data);
      });

      // Custom event handlers
      this.socket.on('notification_read', (data) => {
        console.log('WebSocket: Notification read update', data);
        this.handleNotificationRead(data);
      });

      this.socket.on('notification_deleted', (data) => {
        console.log('WebSocket: Notification deleted update', data);
        this.handleNotificationDeleted(data);
      });

    } catch (error) {
      console.error('WebSocket: Connection failed', error);
    }
  }

  // Disconnect from WebSocket server
  disconnect() {
    if (this.socket) {
      console.log('WebSocket: Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Emit event to server
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket: Cannot emit event, not connected');
    }
  }

  // Join a room
  joinRoom(room) {
    this.emit('join_room', room);
  }

  // Leave a room
  leaveRoom(room) {
    this.emit('leave_room', room);
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Handle new notification
  handleNewNotification(data) {
    const callbacks = this.listeners.get('new_notification') || [];
    callbacks.forEach(callback => callback(data));
  }

  // Handle unread count update
  handleUnreadCountUpdate(data) {
    const callbacks = this.listeners.get('unread_count_update') || [];
    callbacks.forEach(callback => callback(data));
  }

  // Handle notification read update
  handleNotificationRead(data) {
    const callbacks = this.listeners.get('notification_read') || [];
    callbacks.forEach(callback => callback(data));
  }

  // Handle notification deleted update
  handleNotificationDeleted(data) {
    const callbacks = this.listeners.get('notification_deleted') || [];
    callbacks.forEach(callback => callback(data));
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }

  // Extract user ID from JWT token
  getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (error) {
      console.error('WebSocket: Error parsing token', error);
      return null;
    }
  }

  // Send notification read status
  markNotificationAsRead(notificationId) {
    this.emit('mark_notification_read', { notificationId });
  }

  // Send notification delete request
  deleteNotification(notificationId) {
    this.emit('delete_notification', { notificationId });
  }

  // Request unread count
  requestUnreadCount() {
    this.emit('get_unread_count', {});
  }

  // Ping server to check connection
  ping() {
    this.emit('ping', { timestamp: Date.now() });
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 