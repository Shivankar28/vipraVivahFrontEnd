// profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIConnector from '../../api/APIConnector';
import { createProfileFormData, handleApiError } from '../../api/APIUtils';

// Utility to check if in development mode
const isDev = process.env.NODE_ENV === 'development';

// Async Thunks
export const createUpdateProfile = createAsyncThunk(
  'profile/createUpdate',
  async ({ token, profileData, profilePhoto }, { rejectWithValue }) => {
    if (isDev) console.log('profile/createUpdate: Initiating profile create/update with token:', token);
    try {
      const formData = createProfileFormData(profileData, profilePhoto);
      const response = await APIConnector.createUpdateProfile(token, formData);
      if (isDev) console.log('profile/createUpdate: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('profile/createUpdate: API error:', error);
      return rejectWithValue(error);
    }
  }
);

export const getProfile = createAsyncThunk(
  'profile/get',
  async (token, { rejectWithValue }) => {
    if (isDev) console.log('profile/get: Fetching profile with token:', token);
    try {
      const response = await APIConnector.getProfile(token);
      if (isDev) console.log('profile/get: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('profile/get: API error:', error);
      return rejectWithValue(error);
    }
  }
);

export const exploreProfiles = createAsyncThunk(
  'profile/explore',
  async ({ params, token }, { rejectWithValue }) => {
    if (isDev) console.log('profile/explore: Exploring profiles with params:', params, 'token:', token);
    try {
      const response = await APIConnector.exploreProfiles(params, token);
      if (isDev) console.log('profile/explore: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('profile/explore: API error:', error);
      return rejectWithValue(error);
    }
  }
);

export const getProfileById = createAsyncThunk(
  'profile/getById',
  async ({ id, token }, { rejectWithValue }) => {
    if (isDev) console.log('profile/getById: Fetching profile with id:', id, 'token:', token);
    try {
      const response = await APIConnector.getProfileById(id, token);
      if (isDev) console.log('profile/getById: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('profile/getById: API error:', error);
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  profile: null,
  profiles: [],
  selectedProfile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      if (isDev) {
        console.group('profile/clearProfile');
        console.log('Before clear - State:', state);
        console.log('Clearing profile state');
      }
      state.profile = null;
      state.profiles = [];
      state.selectedProfile = null;
      state.error = null;
      if (isDev) {
        console.log('After clear - State:', state);
        console.groupEnd();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create/Update Profile
      .addCase(createUpdateProfile.pending, (state) => {
        if (isDev) {
          console.group('profile/createUpdate: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(createUpdateProfile.fulfilled, (state, action) => {
        if (isDev) {
          console.group('profile/createUpdate: fulfilled');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.profile = action.payload.data?.profile || null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(createUpdateProfile.rejected, (state, action) => {
        if (isDev) {
          console.group('profile/createUpdate: rejected');
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
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        if (isDev) {
          console.group('profile/get: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        if (isDev) {
          console.group('profile/get: fulfilled');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.profile = action.payload.data?.profile || null;
        console.log('ProfileSlice: Profile data stored in Redux:', state.profile);
        console.log('ProfileSlice: Key fields in stored profile:', {
          HighestQualification: state.profile?.HighestQualification,
          universityCollege: state.profile?.universityCollege,
          instaUrl: state.profile?.instaUrl,
          facebookUrl: state.profile?.facebookUrl,
          linkedinUrl: state.profile?.linkedinUrl,
          idCardName: state.profile?.idCardName,
          idCardNo: state.profile?.idCardNo
        });
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        if (isDev) {
          console.group('profile/get: rejected');
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
      // Explore Profiles
      .addCase(exploreProfiles.pending, (state) => {
        if (isDev) {
          console.group('profile/explore: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(exploreProfiles.fulfilled, (state, action) => {
        if (isDev) {
          console.group('profile/explore: fulfilled');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.profiles = action.payload.data?.profiles || [];
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(exploreProfiles.rejected, (state, action) => {
        if (isDev) {
          console.group('profile/explore: rejected');
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
      // Get Profile By ID
      .addCase(getProfileById.pending, (state) => {
        if (isDev) {
          console.group('profile/getById: pending');
          console.log('Initial State:', state);
        }
        state.loading = true;
        state.error = null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(getProfileById.fulfilled, (state, action) => {
        if (isDev) {
          console.group('profile/getById: fulfilled');
          console.log('Initial State:', state);
          console.log('Action Payload:', action.payload);
        }
        state.loading = false;
        state.selectedProfile = action.payload.data?.profile || null;
        if (isDev) {
          console.log('Updated State:', state);
          console.groupEnd();
        }
      })
      .addCase(getProfileById.rejected, (state, action) => {
        if (isDev) {
          console.group('profile/getById: rejected');
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
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
