// app/(tabs)/notifications.tsx - Pantalla de notificaciones
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import i18n from '../../services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  icon: keyof typeof Ionicons.glyphMap;
  date: string;
  time: string;
  read: boolean;
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const [, forceUpdate] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
    
    const unsubscribe = i18n.subscribe(() => {
      forceUpdate(prev => prev + 1);
    });
    
    return () => unsubscribe();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem('app_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        // Crear notificación inicial sobre la versión 5.0.0
        const initialNotification: Notification = {
          id: '1',
          title: '🎉 Bienvenido a AgroScan 5.0.0',
          message: '¡Nueva versión disponible! Esta actualización incluye:\n\n✨ Sistema de actualizaciones OTA\n🎨 Modales modernos y elegantes\n🔒 Mejoras en seguridad (PIN y biometría)\n🌙 Modo oscuro mejorado\n📊 Mejor visualización de estadísticas\n\n¡Disfruta de la nueva experiencia AgroScan!',
          type: 'success',
          icon: 'rocket',
          date: new Date().toLocaleDateString('es-ES'),
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          read: false,
        };
        
        const initialNotifications = [initialNotification];
        await AsyncStorage.setItem('app_notifications', JSON.stringify(initialNotifications));
        setNotifications(initialNotifications);
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await AsyncStorage.removeItem('app_notifications');
      setNotifications([]);
    } catch (error) {
      console.error('Error limpiando notificaciones:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const updated = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      setNotifications(updated);
      await AsyncStorage.setItem('app_notifications', JSON.stringify(updated));
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'info':
      default:
        return '#3B82F6';
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#D1FAE5';
      case 'warning':
        return '#FEF3C7';
      case 'info':
      default:
        return '#DBEAFE';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Decorative blur backgrounds */}
      <View style={[styles.decorativeBlur, styles.decorativeTop]} />
      <View style={[styles.decorativeBlur, styles.decorativeBottom]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#34D399', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
            </LinearGradient>
            <View>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Notificaciones</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            {notifications.length > 0 && (
              <TouchableOpacity 
                style={[styles.clearIconButton, { backgroundColor: colors.card }]}
                onPress={clearAllNotifications}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
            
            <LinearGradient
              colors={['#34D399', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>AG</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.titleText, { color: colors.text }]}>
            Notificaciones 🔔
          </Text>
          {notifications.length > 0 && (
            <Text style={[styles.countText, { color: colors.textSecondary }]}>
              {notifications.filter(n => !n.read).length} sin leer
            </Text>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={80} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Sin notificaciones</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Aquí aparecerán las notificaciones importantes sobre tus análisis y el estado de tus plantas.
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  {
                    backgroundColor: colors.card + 'CC',
                    borderColor: colors.border + '99',
                    shadowColor: colors.shadowColor,
                  },
                  !notification.read && { borderLeftWidth: 4, borderLeftColor: getTypeColor(notification.type) }
                ]}
                onPress={() => markAsRead(notification.id)}
                activeOpacity={0.7}
              >
                <View style={styles.notificationContent}>
                  <View style={[styles.notificationIcon, { backgroundColor: getTypeBgColor(notification.type) }]}>
                    <Ionicons name={notification.icon} size={24} color={getTypeColor(notification.type)} />
                  </View>
                  
                  <View style={styles.notificationText}>
                    <Text style={[styles.notificationTitle, { color: colors.text }]}>
                      {notification.title}
                    </Text>
                    <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
                      {notification.message}
                    </Text>
                    <Text style={[styles.notificationDate, { color: colors.border }]}>
                      {notification.date} • {notification.time}
                    </Text>
                  </View>
                </View>
                
                {!notification.read && (
                  <View style={[styles.unreadDot, { backgroundColor: getTypeColor(notification.type) }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeBlur: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    opacity: 0.2,
  },
  decorativeTop: {
    top: 80,
    right: 40,
    backgroundColor: '#34D399',
  },
  decorativeBottom: {
    bottom: 160,
    left: 40,
    backgroundColor: '#3B82F6',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    position: 'relative',
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoGradient: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  titleSection: {
    marginBottom: 8,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  notificationsList: {
    paddingBottom: 32,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
});
