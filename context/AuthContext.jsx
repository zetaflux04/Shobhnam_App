import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import api, { getAuthToken, getUserType, setAuthToken, setUnauthorizedHandler, setUserType } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserTypeState] = useState(null); // 'user' | 'artist'
  const [accessToken, setAccessTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!accessToken;
  const isArtist = userType === 'artist';

  const login = useCallback(async (userData, token, type = 'user') => {
    await setAuthToken(token);
    await setUserType(type);
    setAccessTokenState(token);
    setUser(userData);
    setUserTypeState(type);
  }, []);

  const logout = useCallback(async () => {
    await setAuthToken(null);
    await setUserType(null);
    setAccessTokenState(null);
    setUser(null);
    setUserTypeState(null);
    router.replace('/');
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    const init = async () => {
      try {
        const stored = await getAuthToken();
        const storedType = await getUserType();
        if (!stored) {
          setIsLoading(false);
          return;
        }
        await setAuthToken(stored);
        const endpoint = storedType === 'artist' ? '/artists/me' : '/users/me';
        const res = await api.get(endpoint);
        if (res.data?.data) {
          setUser(res.data.data);
          setAccessTokenState(stored);
          setUserTypeState(storedType || 'user');
        } else {
          await setAuthToken(null);
          await setUserType(null);
        }
      } catch {
        await setAuthToken(null);
        await setUserType(null);
        setUser(null);
        setAccessTokenState(null);
        setUserTypeState(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const value = useMemo(
    () => ({
      user,
      userType,
      accessToken,
      isLoading,
      isAuthenticated,
      isArtist,
      login,
      logout,
    }),
    [user, userType, accessToken, isLoading, isAuthenticated, isArtist, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
