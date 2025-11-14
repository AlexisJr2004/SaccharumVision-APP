import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Calcular altura dinámica basada en safe area
  // Si hay espacio inferior (gestos), usar más padding
  // Si no hay espacio (botones táctiles), usar menos padding
  const hasBottomInset = insets.bottom > 0;
  const tabBarHeight = hasBottomInset ? 68 + insets.bottom : 68;
  const paddingBottom = hasBottomInset ? insets.bottom : 8;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.card + 'CC',
          borderTopColor: colors.border + '99',
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: paddingBottom,
          paddingTop: 8,
          paddingHorizontal: 24,
          shadowColor: colors.shadowColor,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              { backgroundColor: focused ? '#3B82F6' + '20' : colors.border + '20' }
            ]}>
              <Ionicons 
                name="grid" 
                size={20} 
                color={focused ? '#3B82F6' : colors.textSecondary} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              { backgroundColor: focused ? '#3B82F6' + '20' : colors.border + '20' }
            ]}>
              <Ionicons 
                name="analytics" 
                size={20} 
                color={focused ? '#3B82F6' : colors.textSecondary} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Cámara',
          tabBarIcon: ({ focused }) => (
            <View style={styles.cameraButtonContainer}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cameraButton}
              >
                <Ionicons name="camera" size={24} color="#FFFFFF" />
              </LinearGradient>
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            // Navegar a la pantalla de cámara en la raíz (fuera de tabs)
            navigation.getParent()?.navigate('camera' as never);
          },
        })}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              { backgroundColor: focused ? '#3B82F6' + '20' : colors.border + '20' }
            ]}>
              <Ionicons 
                name="notifications" 
                size={20} 
                color={focused ? '#3B82F6' : colors.textSecondary} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              { backgroundColor: focused ? '#3B82F6' + '20' : colors.border + '20' }
            ]}>
              <Ionicons 
                name="person" 
                size={20} 
                color={focused ? '#3B82F6' : colors.textSecondary} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButtonContainer: {
    width: 56,
    height: 56,
    marginTop: -24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
