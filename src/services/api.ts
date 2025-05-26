import axios, { AxiosError } from 'axios';
import { User, ImportResult } from '../types/user';
import { config } from '../config/env';
import { mockUserApi } from './mockApi';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
          window.location.href = '/403';
          break;
        case 404:
          // Handle not found
          window.location.href = '/404';
          break;
        case 500:
          // Handle server error
          window.location.href = '/500';
          break;
      }
    }
    return Promise.reject(error);
  }
);

export const userApi = {
  importUsers: async (users: User[]): Promise<ImportResult> => {
    if (config.isDevelopment || config.enableMockApi) {
      return mockUserApi.importUsers(users);
    }

    try {
      const response = await api.post('/users/import', { users });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to import users');
      }
      throw error;
    }
  },
  
  validateUsers: async (users: User[]): Promise<ImportResult> => {
    if (config.isDevelopment || config.enableMockApi) {
      return mockUserApi.validateUsers(users);
    }

    try {
      const response = await api.post('/users/validate', { users });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to validate users');
      }
      throw error;
    }
  },
};

export default api; 