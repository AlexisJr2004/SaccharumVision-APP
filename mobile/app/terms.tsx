// app/terms.tsx - Modern Terms & Conditions Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import i18n from '../services/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

export default function TermsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsubscribe = i18n.subscribe(() => {
      forceUpdate(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

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
            {i18n.t('terms.title')}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View 
            style={[
              styles.contentCard,
              { 
                backgroundColor: colors.card + 'CC',
                borderColor: colors.border + '99',
                shadowColor: colors.shadowColor,
              }
            ]}
          >
            {/* Fecha */}
            <View style={[styles.dateSection, { borderBottomColor: colors.border }]}>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {i18n.t('terms.lastUpdated')}
              </Text>
            </View>

            {/* Sección 1 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>1</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {i18n.t('terms.section1Title')}
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                {i18n.t('terms.section1Content')}
              </Text>
            </View>

            {/* Sección 2 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>2</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {i18n.t('terms.section2Title')}
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                {i18n.t('terms.section2Content')}
              </Text>
            </View>

            {/* Sección 3 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>3</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {i18n.t('terms.section3Title')}
                </Text>
              </View>
              <View style={styles.subsectionContainer}>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>{i18n.t('terms.section3_1Title')}</Text>{i18n.t('terms.section3_1Content')}
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>{i18n.t('terms.section3_2Title')}</Text>{i18n.t('terms.section3_2Content')}
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>{i18n.t('terms.section3_3Title')}</Text>{i18n.t('terms.section3_3Content')}
                </Text>
              </View>
            </View>

            {/* Sección 4 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>4</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {i18n.t('terms.section4Title')}
                </Text>
              </View>
              <View style={styles.subsectionContainer}>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>{i18n.t('terms.section4_1Title')}</Text>{i18n.t('terms.section4_1Content')}
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>{i18n.t('terms.section4_2Title')}</Text>{i18n.t('terms.section4_2Content')}
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>{i18n.t('terms.section4_3Title')}</Text>{i18n.t('terms.section4_3Content')}
                </Text>
              </View>
            </View>

            {/* Sección 5 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>5</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {i18n.t('terms.section5Title')}
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                {i18n.t('terms.section5Intro')}
              </Text>
              <View style={styles.listContainer}>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    {i18n.t('terms.section5Item1')}
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    {i18n.t('terms.section5Item2')}
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    {i18n.t('terms.section5Item3')}
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    {i18n.t('terms.section5Item4')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Sección 6 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>6</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {i18n.t('terms.section6Title')}
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                {i18n.t('terms.section6Intro')}
              </Text>
              <View style={styles.listContainer}>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    {i18n.t('terms.section6Item1')}
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    {i18n.t('terms.section6Item2')}
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    {i18n.t('terms.section6Item3')}
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    {i18n.t('terms.section6Item4')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Sección 7 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>7</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {i18n.t('terms.section7Title')}
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                {i18n.t('terms.section7Content')}
              </Text>
            </View>

            {/* Sección 8 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>8</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {i18n.t('terms.section8Title')}
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                {i18n.t('terms.section8Content')}
              </Text>
            </View>

            {/* Sección 9 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>9</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {i18n.t('terms.section9Title')}
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                {i18n.t('terms.section9Content')}
              </Text>
            </View>

            {/* Footer Message */}
            <LinearGradient
              colors={['#D1FAE5', '#A7F3D0']}
              style={styles.footer}
            >
              <View style={styles.footerContent}>
                <Ionicons name="checkmark-circle" size={24} color="#059669" style={styles.footerIcon} />
                <Text style={[styles.footerText, { color: colors.text }]}>
                  {i18n.t('terms.footerText')}
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={{ height: 32 }} />
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
    paddingBottom: 32,
  },
  contentCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dateSection: {
    paddingBottom: 16,
    marginBottom: 24,
    borderBottomWidth: 1,
  },
  dateText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  numberBadge: {
    width: 24,
    height: 24,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  subsectionContainer: {
    gap: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
  },
  listContainer: {
    marginLeft: 16,
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
  },
  listBullet: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 3,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    borderRadius: 16,
    padding: 20,
    marginTop: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  footerContent: {
    flexDirection: 'row',
    gap: 12,
  },
  footerIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  footerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
});
