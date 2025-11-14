// app/(tabs)/history.tsx - Historial de Predicciones
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import i18n from '../../services/i18n';
import { useTheme } from '../../contexts/ThemeContext';

interface PredictionHistory {
  id: string;
  imageUri: string;
  prediction: string;
  confidence: number;
  date: string;
  time: string;
}

export default function HistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    loadHistory();
    
    // Suscribirse a cambios de idioma
    const unsubscribe = i18n.subscribe(() => {
      forceUpdate(prev => prev + 1);
    });
    
    return () => unsubscribe();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('prediction_history');
      if (historyData) {
        const parsed = JSON.parse(historyData);
        setHistory(parsed.reverse()); // Más recientes primero
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('prediction_history');
      setHistory([]);
    } catch (error) {
      console.error('Error limpiando historial:', error);
    }
  };

  const openDetailModal = (item: PredictionHistory) => {
    // Navegar a la pantalla de detalle en lugar de abrir modal
    router.push({
      pathname: '/history-detail',
      params: {
        id: item.id,
        imageUri: item.imageUri,
        prediction: item.prediction,
        confidence: item.confidence.toString(),
        date: item.date,
        time: item.time
      }
    });
  };

  const getDiseaseEmoji = (disease: string) => {
    const emojis: { [key: string]: string } = {
      'Healthy': '🌱',
      'Mosaic': '🦠',
      'RedRot': '🍂',
      'Rust': '🔶',
      'Yellow': '⚠️'
    };
    return emojis[disease] || '📊';
  };

  const getDiseaseColor = (disease: string) => {
    const colors: { [key: string]: string } = {
      'Healthy': '#4CAF50',
      'Mosaic': '#FF9800',
      'RedRot': '#F44336',
      'Rust': '#FF5722',
      'Yellow': '#FFC107'
    };
    return colors[disease] || '#666';
  };

  // Calcular estadísticas
  const calculateStats = () => {
    const stats: { [key: string]: number } = {};
    history.forEach(item => {
      stats[item.prediction] = (stats[item.prediction] || 0) + 1;
    });
    return stats;
  };

  const renderStats = () => {
    if (history.length === 0) return null;

    const stats = calculateStats();
    const maxCount = Math.max(...Object.values(stats));
    const entries = Object.entries(stats).sort((a, b) => b[1] - a[1]);

    return (
      <View style={[styles.statsSection, { backgroundColor: colors.card + 'CC', borderColor: colors.border + '99', shadowColor: colors.shadowColor }]}>
        <Text style={[styles.statsTitle, { color: colors.text }]}>📊 {i18n.t('history.statistics')}</Text>
        {entries.map(([disease, count]) => {
          const percentage = (count / history.length) * 100;
          const barWidth = (count / maxCount) * 100;
          
          return (
            <View key={disease} style={styles.statRow}>
              <View style={styles.statLabel}>
                <Text style={styles.statEmoji}>{getDiseaseEmoji(disease)}</Text>
                <Text style={[styles.statName, { color: colors.text }]}>{disease}</Text>
              </View>
              <View style={[styles.statBarContainer, { backgroundColor: colors.border + '40' }]}>
                <View 
                  style={[
                    styles.statBar, 
                    { 
                      width: `${barWidth}%`,
                      backgroundColor: getDiseaseColor(disease)
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.statCount, { color: colors.textSecondary }]}>
                {count} <Text style={[styles.statPercent, { color: colors.border }]}>({percentage.toFixed(0)}%)</Text>
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item }: { item: PredictionHistory }) => (
    <TouchableOpacity 
      style={[styles.historyCard, { backgroundColor: colors.card + 'CC', borderColor: colors.border + '99', shadowColor: colors.shadowColor }]}
      activeOpacity={0.7}
      onPress={() => openDetailModal(item)}
    >
      <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.emoji}>{getDiseaseEmoji(item.prediction)}</Text>
          <View style={styles.headerText}>
            <Text style={[styles.diseaseName, { color: colors.text }]}>{item.prediction}</Text>
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>{item.date} • {item.time}</Text>
          </View>
        </View>
        
        <View style={styles.confidenceContainer}>
          <View style={[styles.confidenceBar, { backgroundColor: colors.border + '40' }]}>
            <View 
              style={[
                styles.confidenceFill, 
                { 
                  width: `${item.confidence * 100}%`,
                  backgroundColor: getDiseaseColor(item.prediction)
                }
              ]} 
            />
          </View>
          <Text style={[styles.confidenceText, { color: colors.textSecondary }]}>
            {(item.confidence * 100).toFixed(1)}%
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.border} />
    </TouchableOpacity>
  );

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
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{i18n.t('history.title')}</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            {history.length > 0 && (
              <TouchableOpacity 
                style={[styles.clearIconButton, { backgroundColor: colors.card }]}
                onPress={clearHistory}
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

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingText, { color: colors.text }]}>{i18n.t('history.hello')},{' \n'}AgroScan 🌱</Text>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, styles.tabInactive, { backgroundColor: colors.card }]}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={[styles.tabText, { color: colors.textSecondary }]}>{i18n.t('home.dashboard')}</Text>
            </TouchableOpacity>
            
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tabActive}
            >
              <Text style={styles.tabTextActive}>{i18n.t('history.title')}</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Main Content */}
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={80} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>{i18n.t('history.noHistory')}</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {i18n.t('history.noHistoryDesc')}
          </Text>
        </View>
      ) : (
        <>
          {renderStats()}
          
          <View style={styles.listHeader}>
            <View>
              <Text style={[styles.listTitle, { color: colors.text }]}>{history.length} {i18n.t('history.scans')}</Text>
              <Text style={[styles.listSubtitle, { color: colors.textSecondary }]}>{i18n.t('history.historyOf')}</Text>
            </View>
            
            <View style={styles.listActions}>
              <TouchableOpacity 
                style={[styles.refreshButton, { backgroundColor: colors.card }]}
                onPress={onRefresh}
              >
                <Text style={[styles.refreshButtonText, { color: colors.text }]}>{i18n.t('history.refresh')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.clearButton, { backgroundColor: '#FEF2F2' }]}
                onPress={clearHistory}
              >
                <Text style={styles.clearButtonText}>{i18n.t('history.clear')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
              />
            }
          />
        </>
      )}
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
    marginBottom: 32,
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
  greetingSection: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 38,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabInactive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  listActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
  historyCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    marginTop: 2,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confidenceBar: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    width: 50,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
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
  statsSection: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 128,
  },
  statEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  statName: {
    fontSize: 14,
    fontWeight: '600',
  },
  statBarContainer: {
    flex: 1,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  statBar: {
    height: '100%',
    borderRadius: 12,
  },
  statCount: {
    fontSize: 14,
    fontWeight: '600',
    width: 80,
    textAlign: 'right',
  },
  statPercent: {
    fontSize: 12,
  },
});
