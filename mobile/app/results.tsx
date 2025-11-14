// app/results.tsx - Modern Results Screen
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import modelService from '../services/modelService';
import i18n from '../services/i18n';
import { useTheme } from '../contexts/ThemeContext';

interface PredictionHistory {
  id: string;
  imageUri: string;
  prediction: string;
  confidence: number;
  date: string;
  time: string;
}

export default function ResultsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { imageUri, predictions: predictionsJson, processingTime, usedTTA } = useLocalSearchParams();
  const [, forceUpdate] = useState(0);
  const viewShotRef = useRef(null);
  
  // Animaciones
  const confidenceBarAnim = useRef(new Animated.Value(0)).current;
  const statsOpacityAnim = useRef(new Animated.Value(0)).current;
  
  const predictions = JSON.parse(predictionsJson as string);
  const topPrediction = predictions[0];
  const disease = modelService.getDiseaseInfo(topPrediction.className);

  useEffect(() => {
    saveToHistory();
    
    // Animar barra de confianza
    Animated.timing(confidenceBarAnim, {
      toValue: topPrediction.confidence,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Animar stats
    Animated.timing(statsOpacityAnim, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();
    
    const unsubscribe = i18n.subscribe(() => {
      forceUpdate(prev => prev + 1);
    });
    
    return () => unsubscribe();
  }, []);

  const saveToHistory = async () => {
    try {
      const now = new Date();
      const newEntry: PredictionHistory = {
        id: Date.now().toString(),
        imageUri: imageUri as string,
        prediction: disease.name,
        confidence: topPrediction.confidence,
        date: now.toLocaleDateString('es-ES'),
        time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };

      const existingData = await AsyncStorage.getItem('prediction_history');
      const history: PredictionHistory[] = existingData ? JSON.parse(existingData) : [];
      
      history.unshift(newEntry); // Agregar al inicio
      await AsyncStorage.setItem('prediction_history', JSON.stringify(history));
    } catch (error) {
      console.error('Error guardando en historial:', error);
    }
  };

  const shareResults = async () => {
    try {
      if (!viewShotRef.current) return;
      
      // Capturar screenshot de los resultados
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 0.9,
      });

      // Verificar si sharing está disponible
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `AgroScan - ${disease.name} (${(topPrediction.confidence * 100).toFixed(1)}%)`,
        });
      } else {
        console.log('Sharing no disponible en este dispositivo');
      }
    } catch (error) {
      console.error('Error compartiendo resultados:', error);
    }
  };

  const confidenceBarWidth = confidenceBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative Elements */}
      <View style={[styles.decorativeBlur, styles.decorativeTop]} />
      <View style={[styles.decorativeBlur, styles.decorativeBottom]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.backButton, { backgroundColor: colors.card }]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {i18n.t('results.title')}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View ref={viewShotRef} collapsable={false}>
            {/* Image Section */}
            <View 
              style={[
                styles.imageCard,
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
            >
              <Image source={{ uri: imageUri as string }} style={styles.image} resizeMode="cover" />
              <View style={styles.processingBadge}>
                <Ionicons name="time-outline" size={16} color="#fff" />
                <Text style={styles.processingText}>
                  {Math.round(Number(processingTime))}ms
                </Text>
              </View>
            </View>

            {/* Main Result */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🎯 {i18n.t('results.mainDiagnosis')}
              </Text>
              <View 
                style={[
                  styles.mainResultCard,
                  { 
                    backgroundColor: colors.card + 'CC',
                    borderColor: colors.border + '99',
                    shadowColor: colors.shadowColor,
                  }
                ]}
              >
                <View style={styles.diseaseHeader}>
                  <Text style={styles.diseaseEmoji}>{disease.emoji}</Text>
                  <View style={styles.diseaseInfo}>
                    <Text style={[styles.diseaseName, { color: colors.text }]}>
                      {disease.name}
                    </Text>
                    <Text style={[styles.diseaseSeverity, { color: colors.textSecondary }]}>
                      {i18n.t('results.severity')}: <Text style={[styles.severityValue, { color: disease.color }]}>
                        {disease.severity || 'Media'}
                      </Text>
                    </Text>
                    <Text style={[styles.diseaseDescription, { color: colors.textSecondary }]}>
                      {disease.description}
                    </Text>
                  </View>
                </View>

                {/* Confidence Bar */}
                <View style={[styles.confidenceSection, { borderTopColor: colors.border }]}>
                  <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
                    {i18n.t('results.confidenceLevel')}
                  </Text>
                  <View style={styles.confidenceRow}>
                    <View style={[styles.confidenceBarContainer, { backgroundColor: colors.border }]}>
                      <Animated.View 
                        style={[
                          styles.confidenceBarFill,
                          { 
                            width: confidenceBarWidth,
                            backgroundColor: disease.color,
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.confidencePercent, { color: colors.text }]}>
                      {(topPrediction.confidence * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>

                {/* Quick Recommendation */}
                <View style={[styles.recommendationSection, { borderTopColor: colors.border }]}>
                  <View style={styles.recommendationHeader}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={[styles.recommendationTitle, { color: colors.text }]}>
                      {i18n.t('results.recommendedAction')}
                    </Text>
                  </View>
                  <Text style={[styles.recommendationText, { color: colors.textSecondary }]}>
                    {disease.treatment || 'Consultar con especialista para tratamiento específico'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Other Predictions */}
            {predictions.length > 1 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  🔍 {i18n.t('results.otherPossibilities')}
                </Text>
                {predictions.slice(1, 3).map((pred: any, index: number) => {
                  const diseaseInfo = modelService.getDiseaseInfo(pred.className);
                  return (
                    <View 
                      key={index}
                      style={[
                        styles.alternativeCard,
                        { 
                          backgroundColor: colors.card + 'CC',
                          borderColor: colors.border + '99',
                          shadowColor: colors.shadowColor,
                        }
                      ]}
                    >
                      <Text style={styles.alternativeEmoji}>{diseaseInfo.emoji}</Text>
                      <View style={styles.alternativeInfo}>
                        <Text style={[styles.alternativeName, { color: colors.text }]}>
                          {diseaseInfo.name}
                        </Text>
                        <View style={[styles.alternativeBarContainer, { backgroundColor: colors.border }]}>
                          <View 
                            style={[
                              styles.alternativeBarFill,
                              { 
                                width: `${pred.confidence * 100}%`,
                                backgroundColor: diseaseInfo.color,
                              }
                            ]} 
                          />
                        </View>
                      </View>
                      <Text style={[styles.alternativePercent, { color: colors.textSecondary }]}>
                        {(pred.confidence * 100).toFixed(1)}%
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Stats Summary */}
            <Animated.View style={{ opacity: statsOpacityAnim }}>
              <LinearGradient
                colors={['#D1FAE5', '#DBEAFE']}
                style={styles.statsCard}
              >
                <View style={styles.statsHeader}>
                  <View style={styles.statsHeaderLeft}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text style={[styles.statsTitle, { color: colors.text }]}>
                      {i18n.t('results.analysisCompleted')}
                    </Text>
                  </View>
                  <View style={styles.ttaBadge}>
                    <Text style={styles.ttaBadgeText}>
                      {usedTTA === 'true' ? i18n.t('results.ttaActivated') : i18n.t('results.fastMode')}
                    </Text>
                  </View>
                </View>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {(topPrediction.confidence * 100).toFixed(0)}%
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      {i18n.t('results.precision')}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#3B82F6' }]}>IA</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      ResNet50
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#9333EA' }]}>
                      {Number(processingTime) < 1000 
                        ? `${Math.round(Number(processingTime))}ms`
                        : `${(Number(processingTime) / 1000).toFixed(1)}s`
                      }
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      {i18n.t('results.time')}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButtonWrapper}
                onPress={() => router.replace('/')}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={[styles.actionButton, { shadowColor: '#10B981' }]}
                >
                  <Ionicons name="add-circle" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>{i18n.t('results.newAnalysis')}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.shareButton,
                  { 
                    backgroundColor: colors.card,
                    borderColor: '#10B981',
                  }
                ]}
                onPress={shareResults}
              >
                <Ionicons name="share-social" size={20} color="#10B981" />
                <Text style={[styles.actionButtonText, { color: '#10B981' }]}>
                  {i18n.t('results.share')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* View Details Button */}
            <TouchableOpacity 
              style={[styles.detailsButton, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/history' as any)}
            >
              <Ionicons name="information-circle" size={20} color={colors.text} />
              <Text style={[styles.detailsButtonText, { color: colors.text }]}>
                {i18n.t('results.viewFullDetails')}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 32 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeBlur: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.2,
  },
  decorativeTop: {
    top: 80,
    right: 40,
    width: 128,
    height: 128,
    backgroundColor: '#34D399',
  },
  decorativeBottom: {
    bottom: 160,
    left: 40,
    width: 160,
    height: 160,
    backgroundColor: '#3B82F6',
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  imageCard: {
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 288,
  },
  processingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  processingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 8,
  },
  mainResultCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  diseaseHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  diseaseEmoji: {
    fontSize: 60,
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  diseaseSeverity: {
    fontSize: 14,
    marginBottom: 8,
  },
  severityValue: {
    fontWeight: '600',
  },
  diseaseDescription: {
    fontSize: 13,
    lineHeight: 20,
  },
  confidenceSection: {
    paddingTop: 20,
    borderTopWidth: 1,
  },
  confidenceLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  confidenceBarContainer: {
    flex: 1,
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  confidencePercent: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 64,
    textAlign: 'right',
  },
  recommendationSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  recommendationText: {
    fontSize: 13,
    lineHeight: 20,
  },
  alternativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  alternativeEmoji: {
    fontSize: 40,
  },
  alternativeInfo: {
    flex: 1,
  },
  alternativeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  alternativeBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  alternativeBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  alternativePercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  ttaBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ttaBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButtonWrapper: {
    flex: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButton: {
    borderWidth: 2,
    shadowOpacity: 0.1,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
