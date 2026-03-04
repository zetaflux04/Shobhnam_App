import { Platform } from 'react-native';

/**
 * API base URL for backend.
 * - Android emulator: 10.0.2.2 (localhost from host)
 * - iOS simulator: localhost
 * - Physical device: use your machine's LAN IP (e.g. 192.168.1.x)
 * - Production: set via env or app config
 */
const getApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();
