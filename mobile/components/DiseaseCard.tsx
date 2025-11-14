// components/DiseaseCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DiseaseCard({ disease, confidence }) {
  return (
    <View style={[styles.card, { borderLeftColor: disease.color }]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{disease.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.diseaseName}>{disease.name}</Text>
          <Text style={[styles.severity, { color: disease.color }]}>
            Severidad: {disease.severity}
          </Text>
        </View>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>
            {(confidence * 100).toFixed(1)}%
          </Text>
        </View>
      </View>
      
      <Text style={styles.description}>{disease.description}</Text>
      
      <View style={styles.recommendationsContainer}>
        <Text style={styles.recommendationsTitle}>📋 Recomendaciones:</Text>
        {disease.recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  severity: {
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceBadge: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  confidenceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  recommendationsContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    color: '#2E7D32',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});
