import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, ImportResult } from '../types/user';
import { userApi } from '../services/api';

export interface UserState {
  importResult: ImportResult | null;
  isLoading: boolean;
  error: string | null;
  validationResult: ImportResult | null;
}

const initialState: UserState = {
  importResult: null,
  isLoading: false,
  error: null,
  validationResult: null,
};

export const validateUsers = createAsyncThunk(
  'users/validate',
  async (users: User[]) => {
    return await userApi.validateUsers(users);
  }
);

export const importUsers = createAsyncThunk(
  'users/import',
  async (users: User[]) => {
    return await userApi.importUsers(users);
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearImportResult: (state) => {
      state.importResult = null;
      state.error = null;
    },
    clearValidationResult: (state) => {
      state.validationResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.validationResult = action.payload;
      })
      .addCase(validateUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Validation failed';
      })
      .addCase(importUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(importUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.importResult = action.payload;
      })
      .addCase(importUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Import failed';
      });
  },
});

export const { clearImportResult, clearValidationResult } = userSlice.actions;
export default userSlice.reducer; 