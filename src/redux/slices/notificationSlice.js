import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIConnector from '../../api/APIConnector';

// Utility to check if in development mode
const isDev = process.env.NODE_ENV === 'development';

// Async Thunks
export const getNotifications = createAsyncThunk(
  'notification/getNotifications',
  async ({ token, params = {} }, { rejectWithValue }) => {
    if (isDev) console.log('notification/getNotifications: Fetching notifications with params:', params);
    try {
      const response = await APIConnector.getNotifications(token, params);
      if (isDev) console.log('notification/getNotifications: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('notification/getNotifications: API error:', error);
      return rejectWithValue(error);
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  'notification/getUnreadCount',
  async (token, { rejectWithValue }) => {
    if (isDev) console.log('notification/getUnreadCount: Fetching unread count');
    try {
      const response = await APIConnector.getUnreadCount(token);
      if (isDev) console.log('notification/getUnreadCount: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('notification/getUnreadCount: API error:', error);
      return rejectWithValue(error);
    }
  }
);

export const markNotificationsAsRead = createAsyncThunk(
  'notification/markAsRead',
  async ({ token, notificationIds = null }, { rejectWithValue }) => {
    if (isDev) console.log('notification/markAsRead: Marking notifications as read:', notificationIds);
    try {
      const response = await APIConnector.markNotificationsAsRead(token, notificationIds);
      if (isDev) console.log('notification/markAsRead: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('notification/markAsRead: API error:', error);
      return rejectWithValue(error);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async ({ token, notificationId }, { rejectWithValue }) => {
    if (isDev) console.log('notification/deleteNotification: Deleting notification:', notificationId);
    try {
      const response = await APIConnector.deleteNotification(token, notificationId);
      if (isDev) console.log('notification/deleteNotification: API success:', response);
      return { notificationId, response };
    } catch (error) {
      if (isDev) console.error('notification/deleteNotification: API error:', error);
      return rejectWithValue(error);
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  'notification/clearAll',
  async (token, { rejectWithValue }) => {
    if (isDev) console.log('notification/clearAll: Clearing all notifications');
    try {
      const response = await APIConnector.clearAllNotifications(token);
      if (isDev) console.log('notification/clearAll: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('notification/clearAll: API error:', error);
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  }
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      if (isDev) {
        console.group('notification/clearNotifications');
        console.log('Before clear - State:', state);
        console.log('Clearing notification state');
      }
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
      if (isDev) {
        console.log('After clear - State:', state);
        console.groupEnd();
      }
    },
    addLocalNotification: (state, action) => {
      const { type, message, data = {} } = action.payload;
      const newNotification = {
        id: Date.now(),
        type,
        message,
        data,
        timestamp: new Date().toISOString(),
        read: false
      };
      state.notifications.unshift(newNotification);
      state.unreadCount += 1;
    },
    removeLocalNotification: (state, action) => {
      const { id } = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== id);
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    markLocalNotificationAsRead: (state, action) => {
      const { id } = action.payload;
      const notification = state.notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Notifications
      .addCase(getNotifications.pending, (state) => {
        if (isDev) {
          console.group('notification/getNotifications: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        if (isDev) {
          console.group('notification/getNotifications: fulfilled');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.notifications = action.payload.data?.notifications || [];
        state.unreadCount = action.payload.data?.unreadCount || 0;
        state.pagination = action.payload.data?.pagination || state.pagination;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(getNotifications.rejected, (state, action) => {
        if (isDev) {
          console.group('notification/getNotifications: rejected');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch notifications';
        if (isDev) {
          console.error('Error:', state.error);
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      // Get Unread Count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        if (isDev) {
          console.group('notification/getUnreadCount: fulfilled');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.unreadCount = action.payload.data?.unreadCount || 0;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      // Mark as Read
      .addCase(markNotificationsAsRead.fulfilled, (state, action) => {
        if (isDev) {
          console.group('notification/markAsRead: fulfilled');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        // Mark all notifications as read if no specific IDs provided
        if (!action.payload.data?.notificationIds) {
          state.notifications.forEach(n => n.read = true);
          state.unreadCount = 0;
        }
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        if (isDev) {
          console.group('notification/deleteNotification: fulfilled');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        const { notificationId } = action.payload;
        state.notifications = state.notifications.filter(n => n._id !== notificationId);
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      // Clear All Notifications
      .addCase(clearAllNotifications.fulfilled, (state) => {
        if (isDev) {
          console.group('notification/clearAll: fulfilled');
          console.log('Initial State:', state);
        }
        state.notifications = [];
        state.unreadCount = 0;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      });
  }
});

export const { 
  clearNotifications, 
  addLocalNotification, 
  removeLocalNotification, 
  markLocalNotificationAsRead 
} = notificationSlice.actions;

export default notificationSlice.reducer; 