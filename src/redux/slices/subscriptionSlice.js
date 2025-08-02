import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIConnector from '../../api/APIConnector';

export const getSubscriptionStatus = createAsyncThunk(
  'subscription/getSubscriptionStatus',
  async (token, { rejectWithValue }) => {
    try {
      return await APIConnector.getSubscriptionStatus(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const upgradeToPremium = createAsyncThunk(
  'subscription/upgradeToPremium',
  async (token, { rejectWithValue }) => {
    try {
      return await APIConnector.upgradeToPremium(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    status: null,
    loading: false,
    error: null,
    upgradeLoading: false,
    upgradeSuccess: false,
    plan: 'free',
  },
  reducers: {
    resetUpgradeSuccess(state) {
      state.upgradeSuccess = false;
    },
    setPlan(state, action) {
      state.plan = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
        state.error = null;
        // Set plan based on backend response
        if (action.payload && action.payload.data && action.payload.data.subscription) {
          state.plan = action.payload.data.subscription.plan;
        }
      })
      .addCase(getSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(upgradeToPremium.pending, (state) => {
        state.upgradeLoading = true;
        state.error = null;
        state.upgradeSuccess = false;
      })
      .addCase(upgradeToPremium.fulfilled, (state, action) => {
        state.upgradeLoading = false;
        state.upgradeSuccess = true;
        state.status = action.payload;
        state.error = null;
        // Set plan based on backend response
        if (action.payload && action.payload.data && action.payload.data.subscription) {
          state.plan = action.payload.data.subscription.plan;
        }
      })
      .addCase(upgradeToPremium.rejected, (state, action) => {
        state.upgradeLoading = false;
        state.upgradeSuccess = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetUpgradeSuccess, setPlan } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 