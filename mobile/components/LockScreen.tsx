import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState('');
  const [showBiometric, setShowBiometric] = useState(false);
  const [error, setError] = useState('');
  const [attemptedBiometric, setAttemptedBiometric] = useState(false);
  const { colors, theme } = useTheme();
  const colorScheme = theme;

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = async () => {
    try {
      // Verificar configuración de biometría
      const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const hasBiometric = compatible && enrolled && biometricEnabled === 'true';
      
      setShowBiometric(hasBiometric);
      
      // Si tiene biometría habilitada, intentar autenticar automáticamente
      if (hasBiometric && !attemptedBiometric) {
        setAttemptedBiometric(true);
        setTimeout(() => tryBiometric(), 500); // Pequeño delay para que se vea la pantalla
      }
    } catch (error) {
      console.error('Error inicializando seguridad:', error);
    }
  };

  const tryBiometric = async () => {
    if (!showBiometric) return;
    
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Desbloquear AgroScan',
        cancelLabel: 'Usar PIN',
        fallbackLabel: 'Usar PIN',
      });
      
      if (result.success) {
        onUnlock();
      }
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
    }
  };

  const handleNumberPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');
      
      if (newPin.length >= 4) {
        setTimeout(() => verifyPin(newPin), 300);
      }
    }
  };

  const verifyPin = async (enteredPin: string) => {
    try {
      const storedPin = await SecureStore.getItemAsync('app_pin');
      if (enteredPin === storedPin) {
        onUnlock();
      } else if (enteredPin.length >= (storedPin?.length || 4)) {
        setError('PIN incorrecto');
        setPin('');
      }
    } catch {
      setPin('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Fondo blur */}
      <BlurView intensity={100} style={StyleSheet.absoluteFill} tint={colorScheme === 'dark' ? 'dark' : 'light'} />
      
      {/* Overlay semi-transparente */}
      <View style={[styles.overlay, { backgroundColor: colors.background + 'E6' }]} />

      {/* Decorative blurs */}
      <View style={[styles.decorativeBlur, styles.decorativeTop]} />
      <View style={[styles.decorativeBlur, styles.decorativeBottom]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#34D399', '#059669']}
            style={styles.logoGradient}
          >
            <Ionicons name="leaf" size={48} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.title, { color: colors.text }]}>AgroScan</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Ingresa tu PIN para continuar</Text>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.pinDisplay}>
          {[0,1,2,3,4,5].map(i => (
            <View key={i} style={[
              styles.dot, 
              { 
                borderColor: colors.border,
                backgroundColor: i < pin.length ? '#10B981' : 'transparent',
              }
            ]} />
          ))}
        </View>

        <View style={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <TouchableOpacity 
              key={num} 
              style={[styles.numBtn, { backgroundColor: colors.card + 'CC' }]} 
              onPress={() => handleNumberPress(String(num))}
              activeOpacity={0.7}
            >
              <Text style={[styles.numText, { color: colors.text }]}>{num}</Text>
            </TouchableOpacity>
          ))}
          
          {showBiometric ? (
            <TouchableOpacity 
              style={[styles.numBtn, styles.biometricBtn, { backgroundColor: colors.card + 'CC' }]} 
              onPress={tryBiometric}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#34D399', '#10B981']}
                style={styles.biometricGradient}
              >
                <Ionicons name="finger-print" size={32} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          ) : <View style={styles.numBtn} />}

          <TouchableOpacity 
            style={[styles.numBtn, { backgroundColor: colors.card + 'CC' }]} 
            onPress={() => handleNumberPress('0')}
            activeOpacity={0.7}
          >
            <Text style={[styles.numText, { color: colors.text }]}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.numBtn, { backgroundColor: colors.card + 'CC' }]} 
            onPress={() => setPin(pin.slice(0, -1))}
            activeOpacity={0.7}
          >
            <Ionicons name="backspace-outline" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeBlur: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.3,
  },
  decorativeTop: {
    top: 100,
    right: -40,
    backgroundColor: '#34D399',
  },
  decorativeBottom: {
    bottom: 100,
    left: -40,
    backgroundColor: '#3B82F6',
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
  },
  logoGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  error: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 32,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  numBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  numText: {
    fontSize: 28,
    fontWeight: '600',
  },
  biometricBtn: {
    padding: 0,
    overflow: 'hidden',
  },
  biometricGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});