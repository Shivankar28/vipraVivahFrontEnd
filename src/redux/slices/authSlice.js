import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIConnector from '../../api/APIConnector';
import { handleApiError } from '../../api/APIUtils';

// Utility to check if in development mode
const isDev = process.env.NODE_ENV === 'development';

// Async Thunks
export const signup = createAsyncThunk(
  'auth/signup',
  async (data, { rejectWithValue }) => {
    if (isDev) console.log('auth/signup: Initiating signup with data:', data);
    const response = await APIConnector.signup(data);
    if (response.error) {
      if (isDev) console.error('auth/signup: API error:', response.error);
      return rejectWithValue(response.error);
    }
    if (isDev) console.log('auth/signup: API success:', response);
    return response;
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    if (isDev) console.log('auth/login: Initiating login with data:', data);
    const response = await APIConnector.login(data);
    if (response.error) {
      if (isDev) console.error('auth/login: API error:', response.error);
      return rejectWithValue(response.error);
    }
    if (isDev) console.log('auth/login: API success:', response);
    return response;
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data, { rejectWithValue }) => {
    if (isDev) console.log('auth/verifyOtp: Initiating OTP verification with data:', data);
    const response = await APIConnector.verifyOtp(data);
    if (response.error) {
      if (isDev) console.error('auth/verifyOtp: API error:', response.error);
      return rejectWithValue(response.error);
    }
    if (isDev) console.log('auth/verifyOtp: API success:', response);
    return response;
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    if (isDev) console.log('auth/forgotPassword: Initiating forgot password with data:', data);
    const response = await APIConnector.forgotPassword(data);
    if (response.error) {
      if (isDev) console.error('auth/forgotPassword: API error:', response.error);
      return rejectWithValue(response.error);
    }
    if (isDev) console.log('auth/forgotPassword: API success:', response);
    return response;
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    if (isDev) console.log('auth/resetPassword: Initiating reset password with data:', data);
    const response = await APIConnector.resetPassword(data);
    if (response.error) {
      if (isDev) console.error('auth/resetPassword: API error:', response.error);
      return rejectWithValue(response.error);
    }
    if (isDev) console.log('auth/resetPassword: API success:', response);
    return response;
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (data, { rejectWithValue }) => {
    if (isDev) console.log('auth/resendOtp: Initiating resend OTP with data:', data);
    const response = await APIConnector.resendOtp(data);
    if (response.error) {
      if (isDev) console.error('auth/resendOtp: API error:', response.error);
      return rejectWithValue(response.error);
    }
    if (isDev) console.log('auth/resendOtp: API success:', response);
    return response;
  }
);

export const getAuthProfile = createAsyncThunk(
  'auth/getProfile',
  async (token, { rejectWithValue }) => {
    if (isDev) console.log('auth/getProfile: Fetching auth profile with token:', token);
    const response = await APIConnector.getAuthProfile(token);
    if (response.error) {
      if (isDev) console.error('auth/getProfile: API error:', response.error);
      return rejectWithValue(response.error);
    }
    if (isDev) console.log('auth/getProfile: API success:', response);
    return response;
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      if (isDev) {
        console.group('auth/logout');
        console.log('Before logout - State:', state);
        console.log('Clearing auth state');
      }
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (isDev) {
        console.log('After logout - State:', state);
        console.groupEnd();
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        if (isDev) {
          console.group('auth/signup: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(signup.fulfilled, (state, action) => {
        if (isDev) {
          console.group('auth/signup: fulfilled');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        if (action.payload.data) {
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
          state.isAuthenticated = true;
        }
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(signup.rejected, (state, action) => {
        if (isDev) {
          console.group('auth/signup: rejected');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.error = handleApiError(action.payload);
        if (isDev) {
          console.error('Error:', state.error);
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      // Login
      .addCase(login.pending, (state) => {
        if (isDev) {
          console.group('auth/login: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        if (isDev) {
          console.group('auth/login: fulfilled');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        if (action.payload.data) {
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
          state.isAuthenticated = true;
        }
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(login.rejected, (state, action) => {
        if (isDev) {
          console.group('auth/login: rejected');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.error = handleApiError(action.payload);
        if (isDev) {
          console.error('Error:', state.error);
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        if (isDev) {
          console.group('auth/verifyOtp: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        if (isDev) {
          console.group('auth/verifyOtp: fulfilled');
          console.log('Initial State:', state);
        }
        state.loading = false;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        if (isDev) {
          console.group('auth/verifyOtp: rejected');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.error = handleApiError(action.payload);
        if (isDev) {
          console.error('Error:', state.error);
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        if (isDev) {
          console.group('auth/forgotPassword: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        if (isDev) {
          console.group('auth/forgotPassword: fulfilled');
          console.log('Initial State:', state);
        }
        state.loading = false;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        if (isDev) {
          console.group('auth/forgotPassword: rejected');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.error = handleApiError(action.payload);
        if (isDev) {
          console.error('Error:', state.error);
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        if (isDev) {
          console.group('auth/resetPassword: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(resetPassword.fulfilled, (state) => {
        if (isDev) {
          console.group('auth/resetPassword: fulfilled');
          console.log('Initial State:', state);
        }
        state.loading = false;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        if (isDev) {
          console.group('auth/resetPassword: rejected');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.error = handleApiError(action.payload);
        if (isDev) {
          console.error('Error:', state.error);
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        if (isDev) {
          console.group('auth/resendOtp: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(resendOtp.fulfilled, (state) => {
        if (isDev) {
          console.group('auth/resendOtp: fulfilled');
          console.log('Initial State:', state);
        }
        state.loading = false;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(resendOtp.rejected, (state, action) => {
        if (isDev) {
          console.group('auth/resendOtp: rejected');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.error = handleApiError(action.payload);
        if (isDev) {
          console.error('Error:', state.error);
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      // Get Auth Profile
      .addCase(getAuthProfile.pending, (state) => {
        if (isDev) {
          console.group('auth/getProfile: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(getAuthProfile.fulfilled, (state, action) => {
        if (isDev) {
          console.group('auth/getProfile: fulfilled');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        if (action.payload.data) {
          state.user = action.payload.data.user;
        }
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(getAuthProfile.rejected, (state, action) => {
        if (isDev) {
          console.group('auth/getProfile: rejected');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.error = handleApiError(action.payload);
        if (isDev) {
          console.error('Error:', state.error);
          console.log('Updated State:', state);
          console.groupEnd();
        }
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
