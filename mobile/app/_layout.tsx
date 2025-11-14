import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import LockScreen from '@/components/LockScreen';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Variable global para el tiempo
let lastActiveTime = 0;

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
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
  const [isLocked, setIsLocked] = useState(false);
  const [securityEnabled, setSecurityEnabled] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const appState = useRef(AppState.currentState);

  // Verificar si tiene seguridad habilitada al iniciar
  useEffect(() => {
    checkSecuritySettings();
  }, []);

  // Escuchar cambios en el estado de la app (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [securityEnabled]);

  const checkSecuritySettings = async () => {
    try {
      const pinEnabled = await AsyncStorage.getItem('pin_enabled');
      const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
      const hasSecurity = pinEnabled === 'true' || biometricEnabled === 'true';
      
      console.log('Security check:', { pinEnabled, biometricEnabled, hasSecurity });
      
      setSecurityEnabled(hasSecurity);
      
      // Solo bloquear si tiene seguridad habilitada
      if (hasSecurity) {
        setIsLocked(true);
      } else {
        setIsLocked(false);
      }
      
      setIsCheckingAuth(false);
    } catch (error) {
      console.error('Error verificando seguridad:', error);
      setSecurityEnabled(false);
      setIsLocked(false);
      setIsCheckingAuth(false);
    }
  };

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const currentTime = Date.now();
    const timeSinceActive = currentTime - lastActiveTime;
    
    console.log('AppState change:', {
      from: appState.current,
      to: nextAppState,
      timeSinceActive,
      securityEnabled
    });
    
    // Si la app pasa a background, NO bloquear inmediatamente
    // Solo marcamos que pasó a background
    if (
      appState.current === 'active' &&
      (nextAppState === 'background' || nextAppState === 'inactive')
    ) {
      // NO bloqueamos aquí, solo guardamos el tiempo
      lastActiveTime = currentTime;
    }
    
    // Cuando la app vuelve a foreground desde background
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      const timeInBackground = currentTime - lastActiveTime;
      
      // Solo bloquear si estuvo en background más de 5 segundos
      // Esto da tiempo suficiente para usar cámara/galería sin que bloquee
      if (securityEnabled && timeInBackground > 5000) {
        console.log('Locking - time in background:', timeInBackground);
        setIsLocked(true);
      } else {
        console.log('NOT locking - quick return or no security:', timeInBackground);
      }
      
      // Actualizar el tiempo de última actividad
      lastActiveTime = currentTime;
    }
    
    appState.current = nextAppState;
  };

  const handleUnlock = () => {
    setIsLocked(false);
    lastActiveTime = Date.now(); // Actualizar el tiempo cuando desbloquea
  };

  // Mostrar nada mientras verifica autenticación inicial
  if (isCheckingAuth) {
    return null;
  }

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isLocked && securityEnabled ? (
        <LockScreen onUnlock={handleUnlock} />
      ) : (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="camera" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="results" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="history-detail" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="terms" options={{ headerShown: false, animation: 'slide_from_right' }} />
        </Stack>
      )}
    </NavigationThemeProvider>
  );
}
