// Home Screen - AgroScan Modern Design
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modelService from '../../services/modelService';
import i18n from '../../services/i18n';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const chartCardRef = React.useRef<View>(null);
  const [modelReady, setModelReady] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [, forceUpdate] = useState(0);
  const { colors, theme } = useTheme();

  useEffect(() => {
    initializeModel();
    loadScanCount();
    
    const unsubscribe = i18n.subscribe(() => {
      forceUpdate(prev => prev + 1);
    });
    
    // Recargar contador cuando la pantalla obtiene foco
    const focusListener = navigation.addListener('focus', () => {
      loadScanCount();
    });
    
    return () => {
      unsubscribe();
      focusListener();
    };
  }, []);

  const initializeModel = async () => {
    const loaded = await modelService.loadModel();
    setModelReady(loaded);
  };

  const loadScanCount = async () => {
    try {
      const historyData = await AsyncStorage.getItem('prediction_history');
      if (historyData) {
        const history = JSON.parse(historyData);
        setScanCount(history.length);
        
        // Calcular escaneos por día de los últimos 7 días
        const last7Days = calculateLast7Days(history);
        setWeeklyData(last7Days);
      } else {
        setScanCount(0);
        setWeeklyData([0, 0, 0, 0, 0, 0, 0]);
      }
    } catch (error) {
      console.error('Error cargando contador de escaneos:', error);
      setScanCount(0);
      setWeeklyData([0, 0, 0, 0, 0, 0, 0]);
    }
  };

  const calculateLast7Days = (history: any[]) => {
    // Crear array para los últimos 7 días (índice 0 = hace 6 días, índice 6 = hoy)
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    history.forEach((item) => {
      try {
        // Parsear la fecha del historial (formato: "DD/MM/YYYY")
        const [day, month, year] = item.date.split('/').map(Number);
        const scanDate = new Date(year, month - 1, day);
        scanDate.setHours(0, 0, 0, 0);

        // Calcular diferencia en días
        const diffTime = today.getTime() - scanDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Si está dentro de los últimos 7 días, incrementar contador
        if (diffDays >= 0 && diffDays < 7) {
          const index = 6 - diffDays; // Invertir para que el día más reciente sea el último
          counts[index]++;
        }
      } catch (error) {
        console.error('Error parseando fecha:', error);
      }
    });

    return counts;
  };

  const scrollToChart = () => {
    chartCardRef.current?.measureLayout(
      scrollViewRef.current as any,
      (x, y) => {
        scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
      },
      () => {}
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      
      {/* Decorative Elements */}
      <View style={[styles.decorativeBlur, styles.decorativeTop]} />
      <View style={[styles.decorativeBlur, styles.decorativeBottom]} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              {/* Logo and Dashboard */}
              <View style={styles.logoSection}>
                <LinearGradient
                  colors={['#34D399', '#059669']}
                  style={[styles.logoGradient, { shadowColor: '#34D399' }]}
                >
                  <Ionicons name="sparkles" size={20} color="white" />
                </LinearGradient>
                <Text style={[styles.dashboardText, { color: colors.textSecondary }]}>
                  {i18n.t('home.dashboard')}
                </Text>
              </View>
              
              {/* Right Icons */}
              <View style={styles.rightIcons}>
                <TouchableOpacity 
                  style={[styles.iconButton, { backgroundColor: colors.surface }]}
                  onPress={() => router.push('/notifications')}
                >
                  <Ionicons name="notifications-outline" size={20} color={colors.text} />
                  <View style={[styles.notificationDot, { borderColor: colors.surface }]} />
                </TouchableOpacity>
                <LinearGradient
                  colors={['#34D399', '#3B82F6']}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>AG</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Greeting */}
            <View style={styles.greetingSection}>
              <Text style={[styles.greetingText, { color: colors.text }]}>
                {i18n.t('home.hello')},{' \n'}AgroScan 🌱
              </Text>
              <View style={styles.tabRow}>
                <TouchableOpacity 
                  style={[styles.tab, { backgroundColor: colors.surface }]}
                  onPress={scrollToChart}
                >
                  <Text style={[styles.tabText, { color: colors.textSecondary }]}>
                    {i18n.t('home.overview')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    style={[styles.activeTab, { shadowColor: '#3B82F6' }]}
                  >
                    <Text style={styles.activeTabText}>
                      {i18n.t('home.dashboard')}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.moreButton, { backgroundColor: colors.surface }]}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Tasks Card - Análisis */}
            <View 
              style={[
                styles.card, 
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <View style={styles.analysisRow}>
                    <View style={styles.analysisBadge}>
                      <Text style={styles.analysisBadgeText}>{scanCount}</Text>
                    </View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                      {i18n.t('home.analysis')}
                    </Text>
                  </View>
                  <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                    {i18n.t('home.analysisPerformed')} {scanCount} {scanCount === 1 ? i18n.t('home.scan') : i18n.t('home.scans')}{' \n'}{i18n.t('home.thisWeek')} 🎯
                  </Text>
                </View>
                
                {/* Progress Circle */}
                <View style={styles.progressCircle}>
                  <View style={styles.progressBg} />
                  <Ionicons name="camera" size={32} color="#3B82F6" />
                </View>
              </View>
              
              <TouchableOpacity onPress={() => {
                // Navegar a la pantalla de cámara en la raíz (fuera de tabs)
                navigation.getParent()?.navigate('camera' as never);
              }}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={[styles.scanButton, { shadowColor: '#10B981' }]}
                >
                  <Text style={styles.scanButtonText}>{i18n.t('home.newScan')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Chart Card */}
            <View 
              ref={chartCardRef}
              style={[
                styles.card, 
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
            >
              <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
                {i18n.t('home.completedAnalysis')}
              </Text>
              
              {/* Chart Bars */}
              <View style={styles.chartContainer}>
                {weeklyData.map((count, index) => {
                  // Calcular altura proporcional (mínimo 16px, máximo 128px)
                  const maxCount = Math.max(...weeklyData, 1); // Evitar división por 0
                  const height = count === 0 ? 16 : Math.max(16, (count / maxCount) * 128);
                  
                  return (
                    <View key={index} style={styles.barWrapper}>
                      <LinearGradient
                        colors={['#10B981', '#34D399']}
                        style={[
                          styles.bar,
                          { height: height },
                          // Destacar la barra de hoy (último día)
                          index === 6 && count > 0 && { 
                            shadowColor: '#10B981', 
                            shadowOpacity: 0.4, 
                            shadowRadius: 8,
                            shadowOffset: { width: 0, height: 2 }
                          }
                        ]}
                      />
                      {/* Mostrar número si hay escaneos */}
                      {count > 0 && (
                        <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                          {count}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
              
              {/* Stats */}
              <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
                <View>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {scanCount} {scanCount === 1 ? i18n.t('home.scan') : i18n.t('home.scans')}
                  </Text>
                </View>
                <View>
                  <Text style={styles.accuracyValue}>
                    98% {i18n.t('home.accuracy')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Detectable Diseases */}
            <View 
              style={[
                styles.card, 
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
            >
              <View style={styles.diseaseHeader}>
                <Text style={[styles.diseaseTitle, { color: colors.text }]}>
                  {i18n.t('home.detectableDiseases')}
                </Text>
              </View>
              
              {/* Disease Grid */}
              <View style={styles.diseaseGrid}>
                <View style={styles.diseaseRow}>
                  <DiseaseCard 
                    title={i18n.t('home.healthy')}
                    accuracy="98%"
                    icon="checkmark"
                    bgColor="#ECFDF5"
                    iconBg="#10B98120"
                    iconColor="#10B981"
                    textColor="#10B981"
                    borderColor="#10B981"
                  />
                  <DiseaseCard 
                    title={i18n.t('home.mosaic')}
                    accuracy="95%"
                    icon="warning"
                    bgColor="#FFF7ED"
                    iconBg="#F9731620"
                    iconColor="#F97316"
                    textColor="#F97316"
                    borderColor="#F97316"
                  />
                </View>
                
                <View style={styles.diseaseRow}>
                  <DiseaseCard 
                    title={i18n.t('home.redRot')}
                    accuracy="96%"
                    icon="close"
                    bgColor="#FEF2F2"
                    iconBg="#EF444420"
                    iconColor="#EF4444"
                    textColor="#EF4444"
                    borderColor="#EF4444"
                  />
                  <DiseaseCard 
                    title={i18n.t('home.rust')}
                    accuracy="94%"
                    icon="alert-circle"
                    bgColor="#FFFBEB"
                    iconBg="#F59E0B20"
                    iconColor="#F59E0B"
                    textColor="#F59E0B"
                    borderColor="#F59E0B"
                  />
                </View>
              </View>
              
              {/* Yellow Disease - Full Width */}
              <View style={[
                styles.yellowCard,
                {
                  backgroundColor: theme === 'dark' ? colors.card : '#FEFCE8',
                  borderColor: theme === 'dark' ? '#F59E0B' + '60' : '#FDE047',
                  borderWidth: theme === 'dark' ? 2 : 1,
                }
              ]}>
                <View style={styles.yellowCardContent}>
                  <View style={styles.yellowIconWrapper}>
                    <Ionicons name="alert-circle" size={20} color="#F59E0B" />
                  </View>
                  <View style={styles.yellowTextWrapper}>
                    <Text style={[styles.yellowTitle, { color: colors.text }]}>
                      {i18n.t('home.yellowing')}
                    </Text>
                    <Text style={styles.yellowAccuracy}>
                      93% {i18n.t('home.precision')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Disease Card Component
function DiseaseCard({ 
  title, 
  accuracy, 
  icon, 
  bgColor, 
  iconBg, 
  iconColor, 
  textColor,
  borderColor 
}: { 
  title: string; 
  accuracy: string; 
  icon: any; 
  bgColor: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
  borderColor: string;
}) {
  const { colors, theme } = useTheme();
  
  // Ajustar colores para modo oscuro
  const cardBg = theme === 'dark' ? colors.card : bgColor;
  const cardBorder = theme === 'dark' ? borderColor + '60' : borderColor + '40';
  
  return (
    <TouchableOpacity 
      style={[
        styles.diseaseCard,
        { 
          backgroundColor: cardBg,
          borderColor: cardBorder,
          borderWidth: theme === 'dark' ? 2 : 1,
        }
      ]}
    >
      <View style={[styles.diseaseIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[styles.diseaseCardTitle, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.diseaseCardAccuracy, { color: textColor }]}>
        {accuracy} {i18n.t('home.precision')}
      </Text>
    </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  logoSection: {
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dashboardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: '#F43F5E',
    borderRadius: 4,
    borderWidth: 2,
  },
  avatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  greetingSection: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabRow: {
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
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  activeTabText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    paddingBottom: 96,
    gap: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardInfo: {
    flex: 1,
  },
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  analysisBadge: {
    width: 32,
    height: 32,
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisBadgeText: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  progressCircle: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBg: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: '#DBEAFE',
    borderRadius: 40,
    opacity: 0.3,
  },
  scanButton: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  chartTitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 128,
    gap: 8,
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  accuracyValue: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 20,
  },
  diseaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  diseaseTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  viewAllText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  diseaseGrid: {
    gap: 12,
    marginBottom: 16,
  },
  diseaseRow: {
    flexDirection: 'row',
    gap: 12,
  },
  diseaseCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  diseaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  diseaseCardTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  diseaseCardAccuracy: {
    fontSize: 12,
    marginTop: 4,
  },
  yellowCard: {
    borderRadius: 16,
    padding: 16,
  },
  yellowCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  yellowIconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#FDE04720',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yellowTextWrapper: {
    flex: 1,
  },
  yellowTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  yellowAccuracy: {
    color: '#F59E0B',
    fontSize: 12,
    marginTop: 2,
  },
});
