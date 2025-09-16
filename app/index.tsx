import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function RootScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to main app
        router.replace('/(tabs)');
      } else {
        // User is not authenticated, redirect to auth screen
        router.replace('/auth');
      }
    }
  }, [user, loading]);

  // Show loading screen while checking auth state
  return null;
}