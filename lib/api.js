import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config/api';

const TOKEN_KEY = 'shobhnam_access_token';
const USER_TYPE_KEY = 'shobhnam_user_type';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token, handle FormData
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // SecureStore may fail on web
    }
    // For FormData, remove Content-Type so axios sets multipart/form-data with boundary.
    // In React Native, axios may mishandle FormData; transformRequest ensures it's sent as-is.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      config.transformRequest = [(data) => data];
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor: handle 401
let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && onUnauthorized) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_TYPE_KEY);
      onUnauthorized();
    }
    return Promise.reject(err);
  }
);

export const setAuthToken = async (token) => {
  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

export const getAuthToken = () => SecureStore.getItemAsync(TOKEN_KEY);

export const setUserType = async (userType) => {
  if (userType) {
    await SecureStore.setItemAsync(USER_TYPE_KEY, userType);
  } else {
    await SecureStore.deleteItemAsync(USER_TYPE_KEY);
  }
};

export const getUserType = () => SecureStore.getItemAsync(USER_TYPE_KEY);

export default api;
