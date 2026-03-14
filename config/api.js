import { Platform } from 'react-native';

/**
 * API base URL for backend.
 * - Android emulator: 10.0.2.2 (localhost from host)
 * - iOS simulator: localhost
 * - Physical device: use your machine's LAN IP (e.g. 192.168.1.x)
 * - Production: set via env or app config
 */
const getApiBaseUrl = () => {
  const envApiUrl =
    typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL
      ? process.env.EXPO_PUBLIC_API_URL.trim()
      : '';

  if (envApiUrl) {
    // Normalize to avoid accidental double slashes in request paths.
    return envApiUrl.replace(/\/+$/, '');
  }

  if (!__DEV__) {
    // Fail fast in release builds instead of silently pointing to emulator localhost.
    return '';
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Production-aware network error message.
 * - Production (HTTPS): generic connectivity message
 * - Local dev (HTTP): IP, Wi-Fi, backend running hints
 */
export const getNetworkErrorMessage = () => {
  if (!API_BASE_URL) {
    return 'App configuration error: EXPO_PUBLIC_API_URL is missing in this release build. Rebuild with the correct EAS env for this profile.';
  }

  if (API_BASE_URL.startsWith('https://')) {
    return 'Cannot reach server. Check your internet connection and try again. If the problem persists, the server may be temporarily unavailable.';
  }
  return `Cannot reach server at ${API_BASE_URL}. Check: (1) Backend is running in Shobhnam_Backend, (2) EXPO_PUBLIC_API_URL in .env matches your computer's IP, (3) Phone and computer on same Wi-Fi.`;
};
