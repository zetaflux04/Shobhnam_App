import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '../context/AuthContext';

function isPublicRoute(segments) {
  if (!segments || segments.length === 0) return true;
  const first = segments[0];
  if (first === 'index' || first === 'onboarding') return true;
  if (first === 'login') return true;
  // Artist flow: phone, otp, details, success, address, location-search, location-map - all public during registration
  if (first === 'artist') return true;
  return false;
}

export function AuthGate({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isPublic = isPublicRoute(segments);

    if (!isAuthenticated && !isPublic) {
      router.replace('/login/name');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return children;
}
