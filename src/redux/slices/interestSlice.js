import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIConnector from '../../api/APIConnector';

// Utility: check if in development


// --- Async Thunks ---

export const createLike = createAsyncThunk(
  'interest/createLike',
  async ({ token, likedId }, { rejectWithValue }) => {
    try {
      console.log('createLike: Dispatching API request', { likedId });
      const response = await APIConnector.createLike(token, likedId);
      console.log('createLike: API response', response);
      return response;
    } catch (error) {
      console.log('createLike: API error', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const unlike = createAsyncThunk(
  'interest/unlike',
  async ({ token, likedId }, { rejectWithValue }) => {
    try {
      console.log('unlike: Dispatching API request', { likedId });
      const response = await APIConnector.unlike(token, likedId);
      console.log('unlike: API response', response);
      return response;
    } catch (error) {
      console.log('unlike: API error', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUsersWhoLikedMe = createAsyncThunk(
  'interest/getUsersWhoLikedMe',
  async (token, { rejectWithValue }) => {
    try {
      console.log('getUsersWhoLikedMe: Dispatching API request');
      const response = await APIConnector.getUsersWhoLikedMe(token);
      console.log('getUsersWhoLikedMe: API response', { count: response.users.length });
      return response.users;
    } catch (error) {
      console.log('getUsersWhoLikedMe: API error', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUsersILiked = createAsyncThunk(
  'interest/getUsersILiked',
  async (token, { rejectWithValue }) => {
    try {
      console.log('getUsersILiked: Dispatching API request');
      const response = await APIConnector.getUsersILiked(token);
      console.log('getUsersILiked: API response', { count: response.users.length });
      return response.users;
    } catch (error) {
      console.log('getUsersILiked: API error', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- Slice ---

const interestSlice = createSlice({
  name: 'interest',
  initialState: {
    likedMe: [],
    iLiked: [],
    likeLoading: false,
    unlikeLoading: false,
    likedMeLoading: false,
    iLikedLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createLike
      .addCase(createLike.pending, (state) => {
        state.likeLoading = true;
        state.error = null;
        console.log('createLike: pending');
      })
      .addCase(createLike.fulfilled, (state, action) => {
        state.likeLoading = false;
        state.error = null;
        console.log('createLike: fulfilled', { payload: action.payload });
        console.log('createLike: iLiked before update', state.iLiked);
        // You can optionally push the liked user into state.iLiked if needed
      })
      .addCase(createLike.rejected, (state, action) => {
        state.likeLoading = false;
        state.error = action.payload || action.error.message;
        console.log('createLike: rejected', action);
      })

      // unlike
      .addCase(unlike.pending, (state) => {
        state.unlikeLoading = true;
        state.error = null;
        console.log('unlike: pending');
      })
      .addCase(unlike.fulfilled, (state, action) => {
        state.unlikeLoading = false;
        state.error = null;
        console.log('unlike: fulfilled', { payload: action.payload });
        console.log('unlike: iLiked before update', state.iLiked);
        // You can optionally filter out the unliked user from state.iLiked here
      })
      .addCase(unlike.rejected, (state, action) => {
        state.unlikeLoading = false;
        state.error = action.payload || action.error.message;
        console.log('unlike: rejected', action);
      })

      // getUsersWhoLikedMe
      .addCase(getUsersWhoLikedMe.pending, (state) => {
        state.likedMeLoading = true;
        state.error = null;
        console.log('getUsersWhoLikedMe: pending');
      })
      .addCase(getUsersWhoLikedMe.fulfilled, (state, action) => {
        state.likedMeLoading = false;
        state.likedMe = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
        console.log('getUsersWhoLikedMe: fulfilled', { likedMe: state.likedMe });
      })
      .addCase(getUsersWhoLikedMe.rejected, (state, action) => {
        state.likedMeLoading = false;
        state.error = action.payload || action.error.message;
        console.log('getUsersWhoLikedMe: rejected', action);
      })

      // getUsersILiked
      .addCase(getUsersILiked.pending, (state) => {
        state.iLikedLoading = true;
        state.error = null;
        console.log('getUsersILiked: pending');
      })
      .addCase(getUsersILiked.fulfilled, (state, action) => {
        state.iLikedLoading = false;
        state.iLiked = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
        console.log('getUsersILiked: fulfilled', { iLiked: state.iLiked });
      })
      .addCase(getUsersILiked.rejected, (state, action) => {
        state.iLikedLoading = false;
        state.error = action.payload || action.error.message;
        console.log('getUsersILiked: rejected', action);
      });
  },
});

export default interestSlice.reducer; 
