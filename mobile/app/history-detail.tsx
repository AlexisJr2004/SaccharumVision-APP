// app/history-detail.tsx - Detalle del análisis del historial
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import modelService from '../services/modelService';
import i18n from '../services/i18n';
import { useTheme } from '../contexts/ThemeContext';

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id, imageUri, prediction, confidence, date, time } = useLocalSearchParams();
  const [, forceUpdate] = useState(0);
  const viewShotRef = useRef(null);
  
  const disease = modelService.getDiseaseInfo(prediction as string);
  const conf = parseFloat(confidence as string);

  useEffect(() => {
    // Suscribirse a cambios de idioma
    const unsubscribe = i18n.subscribe(() => {
      forceUpdate(prev => prev + 1);
    });
    
    return () => unsubscribe();
  }, []);

  const shareResults = async () => {
    try {
      if (!viewShotRef.current) return;
      
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 0.9,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `AgroScan - ${disease.name} (${(conf * 100).toFixed(1)}%)`,
        });
      }
    } catch (error) {
      console.error('Error compartiendo resultados:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Decorative blur backgrounds */}
      <View style={[styles.decorativeBlur, styles.decorativeTop]} />
      <View style={[styles.decorativeBlur, styles.decorativeBottom]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Detalle del Análisis</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View ref={viewShotRef} collapsable={false} style={{ backgroundColor: colors.background }}>
          {/* Image Section */}
          <View style={[styles.imageContainer, { backgroundColor: colors.card + 'CC', borderColor: colors.border + '99', shadowColor: colors.shadowColor }]}>
            <Image source={{ uri: imageUri as string }} style={styles.image} resizeMode="cover" />
            <View style={styles.dateBadge}>
              <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
              <Text style={styles.dateText}>{date} • {time}</Text>
            </View>
          </View>

          {/* Main Result Card */}
          <View style={[styles.resultCard, { backgroundColor: colors.card + 'CC', borderColor: colors.border + '99', shadowColor: colors.shadowColor }]}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultEmoji}>{disease.emoji}</Text>
              <View style={styles.resultInfo}>
                <Text style={[styles.resultName, { color: colors.text }]}>{disease.name}</Text>
                <Text style={[styles.resultSeverity, { color: colors.textSecondary }]}>
                  Severidad: <Text style={[styles.severityText, { color: disease.color }]}>
                    {disease.severity}
                  </Text>
                </Text>
              </View>
            </View>

            <View style={[styles.confidenceSection, { borderTopColor: colors.border + '40' }]}>
              <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>Nivel de Confianza</Text>
              <View style={styles.confidenceBarContainer}>
                <View style={[styles.confidenceBar, { backgroundColor: colors.border + '40' }]}>
                  <View 
                    style={[
                      styles.confidenceFill, 
                      { width: `${conf * 100}%`, backgroundColor: disease.color }
                    ]} 
                  />
                </View>
                <Text style={[styles.confidencePercent, { color: colors.text }]}>{(conf * 100).toFixed(1)}%</Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📋 Descripción</Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.card + 'CC', borderColor: colors.border + '99', shadowColor: colors.shadowColor }]}>
              <Text style={[styles.description, { color: colors.textSecondary }]}>{disease.description}</Text>
            </View>
          </View>

          {/* Recommendations Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>💡 Recomendaciones</Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.card + 'CC', borderColor: colors.border + '99', shadowColor: colors.shadowColor }]}>
              {disease.recommendations.map((rec: string, index: number) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={[styles.recommendationText, { color: colors.textSecondary }]}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.card + 'CC', borderColor: colors.border + '99', shadowColor: colors.shadowColor }]}>
              <Ionicons name="flash" size={28} color="#10B981" />
              <Text style={[styles.statValue, { color: colors.text }]}>{(conf * 100).toFixed(0)}%</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Confianza</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.card + 'CC', borderColor: colors.border + '99', shadowColor: colors.shadowColor }]}>
              <Ionicons name="shield-checkmark" size={28} color="#3B82F6" />
              <Text style={[styles.statValue, { color: colors.text }]}>IA</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>ResNet50</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.card + 'CC', borderColor: colors.border + '99', shadowColor: colors.shadowColor }]}>
              <Ionicons name="eye" size={28} color="#F97316" />
              <Text style={[styles.statValue, { color: colors.text }]}>TTA</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Precisión</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/camera?mode=camera')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Ionicons name="camera" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Nuevo Análisis</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton, { backgroundColor: colors.card, borderColor: '#10B981' }]}
              onPress={shareResults}
              activeOpacity={0.8}
            >
              <Ionicons name="share-social" size={20} color="#10B981" />
              <Text style={styles.shareButtonText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    margin: 20,
    marginBottom: 20,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    height: 288,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dateBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 16,
  },
  resultEmoji: {
    fontSize: 60,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultSeverity: {
    fontSize: 15,
  },
  severityText: {
    fontWeight: '600',
  },
  confidenceSection: {
    paddingTop: 24,
    borderTopWidth: 1,
  },
  confidenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  confidenceBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
  confidencePercent: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 60,
    textAlign: 'right',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 8,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginTop: 8,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shareButtonText: {
    color: '#10B981',
    fontSize: 15,
    fontWeight: '600',
  },
});
