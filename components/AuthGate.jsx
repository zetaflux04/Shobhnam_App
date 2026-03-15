import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '../context/AuthContext';

const AUTH_PUBLIC_ROOTS = new Set(['index', 'onboarding', 'login']);
const ARTIST_PREAUTH_ROUTES = new Set(['', 'onboarding', 'phone', 'otp']);
const AUTHENTICATED_HOME_ROUTE = '/(tabs)/service';

function getRouteAccess(segments) {
  if (!segments || segments.length === 0) {
    return { isPublic: true, isAuthEntryRoute: true };
  }
  const first = segments[0];

  if (AUTH_PUBLIC_ROOTS.has(first)) {
    return { isPublic: true, isAuthEntryRoute: true };
  }

  if (first === 'artist') {
    const second = segments[1] ?? '';
    if (ARTIST_PREAUTH_ROUTES.has(second)) {
      return { isPublic: true, isAuthEntryRoute: true };
    }
    return { isPublic: false, isAuthEntryRoute: false };
  }

  return { isPublic: false, isAuthEntryRoute: false };
}

export function AuthGate({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const { isPublic, isAuthEntryRoute } = getRouteAccess(segments);

    if (!isAuthenticated && !isPublic) {
      router.replace('/login/name');
      return;
    }

    if (isAuthenticated && isAuthEntryRoute) {
      router.replace(AUTHENTICATED_HOME_ROUTE);
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return children;
}
