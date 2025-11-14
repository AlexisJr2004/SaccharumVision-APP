// components/CustomAlert.tsx - Modal de Alerta Personalizado
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  icon?: keyof typeof Ionicons.glyphMap;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

export default function CustomAlert({
  visible,
  onClose,
  title,
  message,
  type = 'success',
  icon,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm,
  showCancel = false,
}: CustomAlertProps) {
  const { colors } = useTheme();

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: (icon || 'checkmark-circle') as keyof typeof Ionicons.glyphMap,
          iconColor: '#10B981',
          gradientColors: ['#34D399', '#10B981'] as const,
          bgColor: '#D1FAE5',
        };
      case 'error':
        return {
          icon: (icon || 'close-circle') as keyof typeof Ionicons.glyphMap,
          iconColor: '#EF4444',
          gradientColors: ['#F87171', '#EF4444'] as const,
          bgColor: '#FEE2E2',
        };
      case 'warning':
        return {
          icon: (icon || 'warning') as keyof typeof Ionicons.glyphMap,
          iconColor: '#F59E0B',
          gradientColors: ['#FBBF24', '#F59E0B'] as const,
          bgColor: '#FEF3C7',
        };
      case 'info':
        return {
          icon: (icon || 'information-circle') as keyof typeof Ionicons.glyphMap,
          iconColor: '#3B82F6',
          gradientColors: ['#60A5FA', '#3B82F6'] as const,
          bgColor: '#DBEAFE',
        };
      default:
        return {
          icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
          iconColor: '#10B981',
          gradientColors: ['#34D399', '#10B981'] as const,
          bgColor: '#D1FAE5',
        };
    }
  };

  const config = getTypeConfig();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertContainer, { backgroundColor: colors.card }]}>
          {/* Icono decorativo */}
          <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
            <Ionicons name={config.icon} size={48} color={config.iconColor} />
          </View>

          {/* Título */}
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

          {/* Mensaje */}
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={onClose}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.confirmButtonWrapper, showCancel && styles.confirmButtonHalf]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={config.gradientColors}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonWrapper: {
    flex: 1,
  },
  confirmButtonHalf: {
    flex: 1,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
