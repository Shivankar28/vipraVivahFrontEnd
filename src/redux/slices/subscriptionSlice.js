import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIConnector from "../../api/APIConnector";

export const getSubscriptionStatus = createAsyncThunk(
  "subscription/getSubscriptionStatus",
  async (token, { rejectWithValue }) => {
    try {
      return await APIConnector.getSubscriptionStatus(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createOrder = createAsyncThunk(
  "subscription/createOrder",
  async (token, { rejectWithValue }) => {
    try {
      return await APIConnector.createOrder(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const upgradeToPremium = createAsyncThunk(
  "subscription/upgradeToPremium",
  async ({ token, paymentData }, { rejectWithValue }) => {
    try {
      return await APIConnector.upgradeToPremium(token, paymentData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    status: null,
    loading: false,
    error: null,
    upgradeLoading: false,
    upgradeSuccess: false,
    plan: "free",
    order: null,
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
        if (action.payload?.data?.subscription) {
          state.plan = action.payload.data.subscription.plan;
        }
      })
      .addCase(getSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
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
        if (action.payload?.data?.subscription) {
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
