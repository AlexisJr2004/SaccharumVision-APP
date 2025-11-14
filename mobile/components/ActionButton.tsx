// components/ActionButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ActionButtonProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
  style?: any;
}

export default function ActionButton({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  color, 
  style = null 
}: ActionButtonProps) {
  const { colors } = useTheme();
  const buttonColor = color || colors.primary;

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          backgroundColor: buttonColor,
          shadowColor: colors.shadowColor,
        }, 
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={32} color="#fff" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    fontWeight: '500',
  },
});
