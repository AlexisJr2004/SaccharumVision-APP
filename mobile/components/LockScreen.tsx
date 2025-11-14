import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const { colors } = useTheme();

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Image source={require('../assets/images/favicon.png')} style={styles.logo} />
        <Text style={[styles.title, { color: colors.text }]}>AgroScan</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Ingresa tu PIN</Text>
        {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
      </View>

      <View style={styles.pinDisplay}>
        {[0,1,2,3,4,5].map(i => (
          <View key={i} style={[styles.dot, 
            { borderColor: colors.border },
            i < pin.length && { backgroundColor: colors.primary, borderColor: colors.primary }
          ]} />
        ))}
      </View>

      <View style={styles.numpad}>
        {[1,2,3,4,5,6,7,8,9].map(num => (
          <TouchableOpacity key={num} style={[styles.numBtn, { backgroundColor: colors.surface }]} 
            onPress={() => handleNumberPress(String(num))}>
            <Text style={[styles.numText, { color: colors.text }]}>{num}</Text>
          </TouchableOpacity>
        ))}
        
        {showBiometric ? (
          <TouchableOpacity style={[styles.numBtn, { backgroundColor: colors.surface }]} onPress={tryBiometric}>
            <Ionicons name="finger-print" size={32} color={colors.primary} />
          </TouchableOpacity>
        ) : <View style={styles.numBtn} />}

        <TouchableOpacity style={[styles.numBtn, { backgroundColor: colors.surface }]} 
          onPress={() => handleNumberPress('0')}>
          <Text style={[styles.numText, { color: colors.text }]}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.numBtn, { backgroundColor: colors.surface }]} 
          onPress={() => setPin(pin.slice(0, -1))}>
          <Ionicons name="backspace-outline" size={28} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 40,
  },
  numBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  numText: {
    fontSize: 28,
    fontWeight: '600',
  },
});