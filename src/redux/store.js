import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';

// Utility to check if in development mode
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  console.group('Redux Store Initialization');
  console.log('Configuring store with reducers:', { auth: 'authReducer', profile: 'profileReducer' });
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer
  }
});

if (isDev) {
  console.log('Store configured successfully');
  console.groupEnd();
}