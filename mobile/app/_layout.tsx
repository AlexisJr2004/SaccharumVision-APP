import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { ThemeProvider } from '@/contexts/ThemeContext';
import LockScreen from '@/components/LockScreen';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const [isLocked, setIsLocked] = useState(false);
  const [securityEnabled, setSecurityEnabled] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    checkSecuritySettings();
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, []);

  const checkSecuritySettings = async () => {
    try {
      const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
      const pinEnabled = await AsyncStorage.getItem('pin_enabled');
      const hasAnySecurity = biometricEnabled === 'true' || pinEnabled === 'true';
      setSecurityEnabled(hasAnySecurity);
      
      // Si tiene seguridad habilitada, bloquear al inicio
      if (hasAnySecurity) {
        setIsLocked(true);
      }
    } catch (error) {
      console.error('Error verificando seguridad:', error);
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    // Si la app pasa a background y luego vuelve a foreground
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // Solo bloquear si tiene seguridad habilitada y no está en camera
      const isInCamera = segments.includes('camera');
      
      if (securityEnabled && !isInCamera) {
        setIsLocked(true);
      }
    }
    
    appState.current = nextAppState;
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  // Mostrar LockScreen si está bloqueado
  if (isLocked && securityEnabled) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
        <Stack.Screen name="results" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="history-detail" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="terms" options={{ headerShown: false, animation: 'slide_from_right' }} />
      </Stack>
    </NavigationThemeProvider>
  );
}
