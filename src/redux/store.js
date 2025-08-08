// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import interestReducer from './slices/interestSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import notificationReducer from './slices/notificationSlice';
import adminReducer from './slices/adminSlice';

// Utility to check if in development mode
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  console.group('Redux Store Initialization');
  console.log('Configuring store with reducers:', {
    auth: 'authReducer',
    profile: 'profileReducer',
    interest: 'interestReducer',
    subscription: 'subscriptionReducer',
    notification: 'notificationReducer',
    admin: 'adminReducer',
  });
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    interest: interestReducer,
    subscription: subscriptionReducer,
    notification: notificationReducer,
    admin: adminReducer,
  },
});

if (isDev) {
  console.log('Store configured successfully');
  console.groupEnd();
}