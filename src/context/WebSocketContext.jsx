import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addLocalNotification } from '../redux/slices/notificationSlice';
import websocketService from '../services/websocketService';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  });
  const dispatch = useDispatch();

  // Initialize WebSocket connection
  const connect = (token) => {
    if (!token) {
      console.log('WebSocket: No token provided, skipping connection');
      return;
    }

    try {
      console.log('WebSocket: Initializing connection...');
      
      // Connect to WebSocket server
      websocketService.connect(token);
      
      // Set up event listeners
      setupEventListeners();
      
    } catch (error) {
      console.error('WebSocket: Connection initialization failed', error);
    }
  };

  // Disconnect from WebSocket
  const disconnect = () => {
    console.log('WebSocket: Disconnecting...');
    websocketService.disconnect();
    setIsConnected(false);
    setConnectionStatus({
      isConnected: false,
      reconnectAttempts: 0,
      maxReconnectAttempts: 5
    });
  };

  // Set up WebSocket event listeners
  const setupEventListeners = () => {
    // Connection status updates
    const updateConnectionStatus = () => {
      const status = websocketService.getConnectionStatus();
      setConnectionStatus(status);
      setIsConnected(status.isConnected);
    };

    // Set up interval to check connection status
    const statusInterval = setInterval(updateConnectionStatus, 5000);

    // New notification handler
    const handleNewNotification = (data) => {
      console.log('WebSocket: New notification received in context', data);
      
      // Add notification to Redux store
      dispatch(addLocalNotification({
        type: data.data.type,
        message: data.data.message,
        data: data.data.data
      }));
      
      // Show toast notification (optional)
      showToastNotification(data.data.message);
    };

    // Unread count update handler
    const handleUnreadCountUpdate = (data) => {
      console.log('WebSocket: Unread count update received in context', data);
      // The Redux store will handle this automatically
    };

    // Register event listeners
    websocketService.on('new_notification', handleNewNotification);
    websocketService.on('unread_count_update', handleUnreadCountUpdate);

    // Cleanup function
    return () => {
      clearInterval(statusInterval);
      websocketService.off('new_notification', handleNewNotification);
      websocketService.off('unread_count_update', handleUnreadCountUpdate);
    };
  };

  // Show toast notification (optional)
  const showToastNotification = (message) => {
    // You can implement a toast notification system here
    // For now, we'll just log it
    console.log('Toast Notification:', message);
    
    // Example: You could use a toast library like react-toastify
    // toast.success(message, {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    // });
  };

  // Join a room
  const joinRoom = (room) => {
    websocketService.joinRoom(room);
  };

  // Leave a room
  const leaveRoom = (room) => {
    websocketService.leaveRoom(room);
  };

  // Emit custom event
  const emit = (event, data) => {
    websocketService.emit(event, data);
  };

  // Get connection status
  const getConnectionStatus = () => {
    return websocketService.getConnectionStatus();
  };

  // Auto-connect when token is available
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (token && isLoggedIn === 'true') {
      connect(token);
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);

  // Listen for login/logout events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'isLoggedIn') {
        const token = localStorage.getItem('token');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (token && isLoggedIn === 'true') {
          connect(token);
        } else {
          disconnect();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    emit,
    getConnectionStatus
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}; 