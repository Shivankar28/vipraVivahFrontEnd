import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIConnector from '../../api/APIConnector';
import { handleApiError } from '../../api/APIUtils';

// Utility to check if in development mode
const isDev = process.env.NODE_ENV === 'development';

// Async Thunks
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    if (isDev) console.log('admin/getDashboardStats: Fetching dashboard stats');
    try {
      const token = localStorage.getItem('token');
      const response = await APIConnector.getDashboardStats(token);
      if (response.error) {
        if (isDev) console.error('admin/getDashboardStats: API error:', response.error);
        return rejectWithValue(response.error);
      }
      if (isDev) console.log('admin/getDashboardStats: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('admin/getDashboardStats: Error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (params, { rejectWithValue }) => {
    if (isDev) console.log('admin/getAllUsers: Fetching users with params:', params);
    try {
      const token = localStorage.getItem('token');
      const response = await APIConnector.getAllUsers(token, params);
      if (response.error) {
        if (isDev) console.error('admin/getAllUsers: API error:', response.error);
        return rejectWithValue(response.error);
      }
      if (isDev) console.log('admin/getAllUsers: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('admin/getAllUsers: Error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getUserById = createAsyncThunk(
  'admin/getUserById',
  async (userId, { rejectWithValue }) => {
    if (isDev) console.log('admin/getUserById: Fetching user:', userId);
    try {
      const token = localStorage.getItem('token');
      const response = await APIConnector.getUserById(token, userId);
      if (response.error) {
        if (isDev) console.error('admin/getUserById: API error:', response.error);
        return rejectWithValue(response.error);
      }
      if (isDev) console.log('admin/getUserById: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('admin/getUserById: Error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    if (isDev) console.log('admin/updateUserRole: Updating user role:', { userId, role });
    try {
      const token = localStorage.getItem('token');
      const response = await APIConnector.updateUserRole(token, userId, role);
      if (response.error) {
        if (isDev) console.error('admin/updateUserRole: API error:', response.error);
        return rejectWithValue(response.error);
      }
      if (isDev) console.log('admin/updateUserRole: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('admin/updateUserRole: Error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    if (isDev) console.log('admin/deleteUser: Deleting user:', userId);
    try {
      const token = localStorage.getItem('token');
      const response = await APIConnector.deleteUser(token, userId);
      if (response.error) {
        if (isDev) console.error('admin/deleteUser: API error:', response.error);
        return rejectWithValue(response.error);
      }
      if (isDev) console.log('admin/deleteUser: API success:', response);
      return { userId, response };
    } catch (error) {
      if (isDev) console.error('admin/deleteUser: Error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getAllProfiles = createAsyncThunk(
  'admin/getAllProfiles',
  async (params, { rejectWithValue }) => {
    if (isDev) console.log('admin/getAllProfiles: Fetching profiles with params:', params);
    try {
      const token = localStorage.getItem('token');
      const response = await APIConnector.getAllProfiles(token, params);
      if (response.error) {
        if (isDev) console.error('admin/getAllProfiles: API error:', response.error);
        return rejectWithValue(response.error);
      }
      if (isDev) console.log('admin/getAllProfiles: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('admin/getAllProfiles: Error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getAllSubscriptions = createAsyncThunk(
  'admin/getAllSubscriptions',
  async (params, { rejectWithValue }) => {
    if (isDev) console.log('admin/getAllSubscriptions: Fetching subscriptions with params:', params);
    try {
      const token = localStorage.getItem('token');
      const response = await APIConnector.getAllSubscriptions(token, params);
      if (response.error) {
        if (isDev) console.error('admin/getAllSubscriptions: API error:', response.error);
        return rejectWithValue(response.error);
      }
      if (isDev) console.log('admin/getAllSubscriptions: API success:', response);
      return response;
    } catch (error) {
      if (isDev) console.error('admin/getAllSubscriptions: Error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

const initialState = {
  dashboardStats: null,
  users: {
    list: [],
    pagination: {},
    loading: false,
    error: null
  },
  selectedUser: null,
  profiles: {
    list: [],
    pagination: {},
    loading: false,
    error: null
  },
  subscriptions: {
    list: [],
    pagination: {},
    loading: false,
    error: null
  },
  loading: false,
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearUsers: (state) => {
      state.users.list = [];
      state.users.pagination = {};
    },
    clearProfiles: (state) => {
      state.profiles.list = [];
      state.profiles.pagination = {};
    },
    clearSubscriptions: (state) => {
      state.subscriptions.list = [];
      state.subscriptions.pagination = {};
    }
  },
  extraReducers: (builder) => {
    // Dashboard Stats
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload.data;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get All Users
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.list = action.payload.data.users;
        state.users.pagination = action.payload.data.pagination;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload;
      });

    // Get User By ID
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.data;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update User Role
    builder
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        // Update user in the list if it exists
        const updatedUser = action.payload.data;
        const userIndex = state.users.list.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users.list[userIndex] = updatedUser;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete User
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        // Remove user from the list
        const { userId } = action.payload;
        state.users.list = state.users.list.filter(user => user._id !== userId);
        state.users.pagination.totalUsers -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get All Profiles
    builder
      .addCase(getAllProfiles.pending, (state) => {
        state.profiles.loading = true;
        state.profiles.error = null;
      })
      .addCase(getAllProfiles.fulfilled, (state, action) => {
        state.profiles.loading = false;
        state.profiles.list = action.payload.data.profiles;
        state.profiles.pagination = action.payload.data.pagination;
      })
      .addCase(getAllProfiles.rejected, (state, action) => {
        state.profiles.loading = false;
        state.profiles.error = action.payload;
      });

    // Get All Subscriptions
    builder
      .addCase(getAllSubscriptions.pending, (state) => {
        state.subscriptions.loading = true;
        state.subscriptions.error = null;
      })
      .addCase(getAllSubscriptions.fulfilled, (state, action) => {
        state.subscriptions.loading = false;
        state.subscriptions.list = action.payload.data.subscriptions;
        state.subscriptions.pagination = action.payload.data.pagination;
      })
      .addCase(getAllSubscriptions.rejected, (state, action) => {
        state.subscriptions.loading = false;
        state.subscriptions.error = action.payload;
      });
  }
});

export const {
  clearAdminError,
  clearSelectedUser,
  clearUsers,
  clearProfiles,
  clearSubscriptions
} = adminSlice.actions;

export default adminSlice.reducer;
