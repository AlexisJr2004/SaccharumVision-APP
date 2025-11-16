// app/(tabs)/settings.tsx - Modern Settings Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';
import i18n from '../../services/i18n';
import CustomAlert from '../../components/CustomAlert';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [hasBiometricHardware, setHasBiometricHardware] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [, forceUpdate] = useState(0);
  
  // Estados para los custom alerts
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [showDownloadedAlert, setShowDownloadedAlert] = useState(false);
  const [showDisablePinAlert, setShowDisablePinAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    icon: undefined as keyof typeof Ionicons.glyphMap | undefined,
  });

  useEffect(() => {
    checkBiometricSupport();
    loadSettings();
    
    const unsubscribe = i18n.subscribe(() => {
      forceUpdate(prev => prev + 1);
    });
    
    return () => unsubscribe();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setHasBiometricHardware(compatible);
    
    if (compatible) {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Huella dactilar');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Reconocimiento facial');
      }
    }
  };

  const loadSettings = async () => {
    try {
      const biometric = await AsyncStorage.getItem('biometric_enabled');
      const pinSetting = await AsyncStorage.getItem('pin_enabled');
      const languageSetting = await AsyncStorage.getItem('app_language');
      
      setBiometricEnabled(biometric === 'true');
      setPinEnabled(pinSetting === 'true');
      setLanguage(languageSetting === 'en' ? 'en' : 'es');
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const toggleBiometric = async (value: boolean) => {
    if (value) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirma tu identidad',
        fallbackLabel: 'Usar PIN',
      });

      if (result.success) {
        await AsyncStorage.setItem('biometric_enabled', 'true');
        setBiometricEnabled(true);
        
        setAlertConfig({
          title: '✅ Activado',
          message: 'Autenticación biométrica activada correctamente',
          type: 'success',
          icon: 'finger-print',
        });
        setShowSuccessAlert(true);
      }
    } else {
      await AsyncStorage.setItem('biometric_enabled', 'false');
      setBiometricEnabled(false);
    }
  };

  const togglePin = async (value: boolean) => {
    if (value) {
      setShowPinModal(true);
    } else {
      setShowDisablePinAlert(true);
    }
  };

  const disablePin = async () => {
    await SecureStore.deleteItemAsync('app_pin');
    await AsyncStorage.setItem('pin_enabled', 'false');
    setPinEnabled(false);
    
    setAlertConfig({
      title: '✅ PIN Desactivado',
      message: 'La seguridad por PIN ha sido desactivada correctamente',
      type: 'success',
      icon: 'lock-open',
    });
    setShowSuccessAlert(true);
  };

  const toggleDarkMode = async () => {
    toggleTheme();
    
    setTimeout(() => {
      setAlertConfig({
        title: theme === 'light' ? '🌙 Modo Oscuro Activado' : '☀️ Modo Claro Activado',
        message: theme === 'light' 
          ? 'La aplicación ahora usa un diseño oscuro elegante' 
          : 'La aplicación ahora usa un diseño claro y brillante',
        type: 'success',
        icon: theme === 'light' ? 'moon' : 'sunny',
      });
      setShowSuccessAlert(true);
    }, 300);
  };

  const changeLanguage = async () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    await i18n.setLanguage(newLang);
    
    setTimeout(() => {
      setAlertConfig({
        title: '🌐 ' + i18n.t('settings.language'),
        message: newLang === 'es' 
          ? 'Idioma cambiado a Español 🇪🇸' 
          : 'Language changed to English 🇺🇸',
        type: 'success',
        icon: 'language',
      });
      setShowSuccessAlert(true);
    }, 300);
  };

  const setupPin = async () => {
    if (pin.length < 4 || pin.length > 6) {
      Alert.alert('Error', 'El PIN debe tener entre 4 y 6 dígitos');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Error', 'Los PINs no coinciden');
      return;
    }

    try {
      await SecureStore.setItemAsync('app_pin', pin);
      await AsyncStorage.setItem('pin_enabled', 'true');
      setPinEnabled(true);
      setShowPinModal(false);
      setPin('');
      setConfirmPin('');
      
      setAlertConfig({
        title: '✅ PIN Configurado',
        message: `Tu PIN de ${pin.length} dígitos ha sido guardado de forma segura`,
        type: 'success',
        icon: 'lock-closed',
      });
      setShowSuccessAlert(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el PIN');
    }
  };

  const checkForUpdates = async () => {
    // Verificar si Updates está disponible y configurado
    if (!Updates.isEnabled) {
      setAlertConfig({
        title: '⚙️ No Disponible',
        message: 'Las actualizaciones OTA no están habilitadas. Asegúrate de usar una build de producción con EAS.',
        type: 'warning',
        icon: 'construct',
      });
      setShowSuccessAlert(true);
      return;
    }

    if (__DEV__) {
      setAlertConfig({
        title: '🔧 Modo Desarrollo',
        message: 'Las actualizaciones OTA no funcionan en modo desarrollo.\n\nPara probar esta función:\n1. Crea un build con: eas build\n2. Instala el APK en tu dispositivo\n3. Publica updates con: eas update',
        type: 'info',
        icon: 'code-slash',
      });
      setShowSuccessAlert(true);
      return;
    }

    setIsCheckingUpdate(true);

    try {
      // Verificar si hay actualizaciones disponibles
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setIsCheckingUpdate(false);
        setShowUpdateAlert(true);
      } else {
        setIsCheckingUpdate(false);
        setAlertConfig({
          title: '✨ Estás Actualizado',
          message: 'Ya tienes la última versión de AgroScan instalada.',
          type: 'success',
          icon: 'checkmark-circle',
        });
        setShowSuccessAlert(true);
      }
    } catch (error) {
      setIsCheckingUpdate(false);
      console.error('Error verificando actualizaciones:', error);
      
      setAlertConfig({
        title: '⚠️ No Disponible',
        message: 'Las actualizaciones OTA requieren una build de producción con EAS.\n\nEsta función solo funciona en:\n• Builds creados con "eas build"\n• Apps instaladas desde APK/AAB\n\nNo funciona en modo desarrollo.',
        type: 'warning',
        icon: 'alert-circle',
      });
      setShowSuccessAlert(true);
    }
  };

  const downloadUpdate = async () => {
    setShowUpdateAlert(false);
    setIsCheckingUpdate(true);

    try {
      // Descargar la actualización
      await Updates.fetchUpdateAsync();
      setIsCheckingUpdate(false);
      setShowDownloadedAlert(true);
    } catch (fetchError) {
      console.error('Error descargando actualización:', fetchError);
      setIsCheckingUpdate(false);
      
      setAlertConfig({
        title: '❌ Error de Descarga',
        message: 'No se pudo descargar la actualización. Verifica tu conexión a internet e intenta nuevamente.',
        type: 'error',
        icon: 'cloud-offline',
      });
      setShowSuccessAlert(true);
    }
  };

  const reloadApp = async () => {
    await Updates.reloadAsync();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative Elements */}
      <View style={[styles.decorativeBlur, styles.decorativeTop]} />
      <View style={[styles.decorativeBlur, styles.decorativeBottom]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header with Logo and Avatar */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <LinearGradient
              colors={['#34D399', '#059669']}
              style={styles.logoContainer}
            >
              <Ionicons name="sparkles" size={20} color="#fff" />
            </LinearGradient>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {i18n.t('settings.title')}
            </Text>
            <View style={styles.spacer} />
            <LinearGradient
              colors={['#34D399', '#3B82F6']}
              style={styles.avatarContainer}
            >
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>AG</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Greeting */}
          <View style={styles.greetingSection}>
            <Text style={[styles.greetingTitle, { color: colors.text }]}>
              {i18n.t('home.hello')},{'\n'}AgroScan 🌱
            </Text>
            <View style={styles.tabsContainer}>
              <TouchableOpacity 
                style={[styles.tabInactive, { backgroundColor: colors.card, shadowColor: colors.shadowColor }]}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={[styles.tabInactiveText, { color: colors.textSecondary }]}>
                  {i18n.t('home.dashboard')}
                </Text>
              </TouchableOpacity>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={[styles.tabActive, { shadowColor: '#3B82F6' }]}
              >
                <Text style={styles.tabActiveText}>{i18n.t('settings.title')}</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Seguridad Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {i18n.t('settings.security')}
            </Text>
            
            {/* Biometría Card */}
            <View 
              style={[
                styles.settingCard,
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconWrapper}>
                    <Ionicons name="finger-print" size={20} color="#059669" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      {biometricType || i18n.t('settings.biometric')}
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      {hasBiometricHardware 
                        ? i18n.t('settings.biometricDesc') 
                        : i18n.t('settings.notAvailable')}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={toggleBiometric}
                  trackColor={{ false: '#E2E8F0', true: '#6EE7B7' }}
                  thumbColor={biometricEnabled ? '#10B981' : '#F1F5F9'}
                  disabled={!hasBiometricHardware}
                />
              </View>
            </View>

            {/* PIN Card */}
            <View 
              style={[
                styles.settingCard,
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#DBEAFE' }]}>
                    <Ionicons name="lock-closed" size={20} color="#2563EB" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      {i18n.t('settings.pinSecurity')}
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      {i18n.t('settings.pinSecurityDesc')}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={pinEnabled}
                  onValueChange={togglePin}
                  trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                  thumbColor={pinEnabled ? '#3B82F6' : '#F1F5F9'}
                />
              </View>
            </View>
          </View>

          {/* Apariencia Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {i18n.t('settings.appearance')}
            </Text>
            
            {/* Dark Mode Card */}
            <View 
              style={[
                styles.settingCard,
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#F3E8FF' }]}>
                    <Ionicons 
                      name={theme === 'dark' ? 'moon' : 'sunny'} 
                      size={20} 
                      color="#9333EA" 
                    />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      {i18n.t('settings.darkMode')}
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      {i18n.t('settings.darkModeDesc')}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={theme === 'dark'}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: '#E2E8F0', true: '#C4B5FD' }}
                  thumbColor={theme === 'dark' ? '#9333EA' : '#F1F5F9'}
                />
              </View>
            </View>

            {/* Language Card */}
            <TouchableOpacity 
              style={[
                styles.settingCard,
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
              onPress={changeLanguage}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="language" size={20} color="#D97706" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      {i18n.t('settings.language')}
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      {i18n.t('settings.languageDesc')}
                    </Text>
                  </View>
                </View>
                <View style={styles.languageValue}>
                  <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                    {language === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Acerca de Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {i18n.t('settings.about')}
            </Text>
            
            {/* Version Card */}
            <View 
              style={[
                styles.settingCard,
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#F1F5F9' }]}>
                    <Ionicons name="information-circle" size={20} color="#64748B" />
                  </View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    {i18n.t('settings.version')}
                  </Text>
                </View>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                  5.0.0
                </Text>
              </View>
            </View>

            {/* Terms Card */}
            <TouchableOpacity 
              style={[
                styles.settingCard,
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
              onPress={() => router.push('/terms' as any)}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#F1F5F9' }]}>
                    <Ionicons name="document-text" size={20} color="#64748B" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      {i18n.t('settings.terms')}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>

            {/* Check Updates Card */}
            <TouchableOpacity 
              style={[
                styles.settingCard,
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
              onPress={checkForUpdates}
              disabled={isCheckingUpdate}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#DBEAFE' }]}>
                    <Ionicons name="sync" size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      Buscar Actualizaciones
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                      Verificar nueva versión disponible
                    </Text>
                  </View>
                </View>
                {isCheckingUpdate ? (
                  <ActivityIndicator size="small" color="#3B82F6" />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* PIN Modal */}
        <Modal
          visible={showPinModal}
          transparent
          animationType="fade"
        >
          <View style={styles.blurOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={[styles.lockIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="lock-closed" size={32} color="#3B82F6" />
              </View>
              
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {language === 'es' ? 'Configurar PIN' : 'Set up PIN'}
              </Text>
              <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                {language === 'es' ? 'Ingresa un PIN de 4-6 dígitos para proteger tu aplicación' : 'Enter a 4-6 digit PIN to protect your app'}
              </Text>

              <TextInput
                style={[styles.pinInput, { 
                  backgroundColor: colors.background + 'CC',
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                placeholder={language === 'es' ? 'Ingresa PIN' : 'Enter PIN'}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
                value={pin}
                onChangeText={setPin}
              />

              <TextInput
                style={[styles.pinInput, { 
                  backgroundColor: colors.background + 'CC',
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                placeholder={language === 'es' ? 'Confirma PIN' : 'Confirm PIN'}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
                value={confirmPin}
                onChangeText={setConfirmPin}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: colors.background }]}
                  onPress={() => {
                    setShowPinModal(false);
                    setPin('');
                    setConfirmPin('');
                  }}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                    {language === 'es' ? 'Cancelar' : 'Cancel'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={setupPin}>
                  <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    style={[styles.confirmButton, { shadowColor: '#3B82F6' }]}
                  >
                    <Text style={styles.confirmButtonText}>{language === 'es' ? 'Guardar' : 'Save'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Custom Success Alert */}
        <CustomAlert
          visible={showSuccessAlert}
          onClose={() => setShowSuccessAlert(false)}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          icon={alertConfig.icon}
          confirmText="✨ Genial"
        />

        {/* Update Available Alert */}
        <CustomAlert
          visible={showUpdateAlert}
          onClose={() => {
            setShowUpdateAlert(false);
            setIsCheckingUpdate(false);
          }}
          title="🎉 Actualización Disponible"
          message="¡Hay una nueva versión disponible! ¿Deseas descargarla e instalarla ahora?"
          type="info"
          icon="cloud-download"
          confirmText="Actualizar"
          cancelText="Más tarde"
          showCancel={true}
          onConfirm={downloadUpdate}
        />

        {/* Update Downloaded Alert */}
        <CustomAlert
          visible={showDownloadedAlert}
          onClose={() => setShowDownloadedAlert(false)}
          title="✅ Actualización Descargada"
          message="La actualización se ha descargado correctamente. La aplicación se reiniciará para aplicar los cambios."
          type="success"
          icon="refresh-circle"
          confirmText="Reiniciar Ahora"
          onConfirm={reloadApp}
        />

        {/* Disable PIN Alert */}
        <CustomAlert
          visible={showDisablePinAlert}
          onClose={() => setShowDisablePinAlert(false)}
          title="⚠️ Desactivar PIN"
          message="¿Estás seguro de desactivar el PIN de seguridad? Tu aplicación quedará sin esta protección."
          type="warning"
          icon="lock-open"
          confirmText="Desactivar"
          cancelText="Cancelar"
          showCancel={true}
          onConfirm={disablePin}
        />
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  greetingSection: {
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 36,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  tabInactive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabInactiveText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabActiveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 8,
  },
  settingCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  settingValue: {
    fontSize: 14,
    marginRight: 8,
  },
  languageValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  blurOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    alignItems: 'center',
  },
  lockIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  pinInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '600',
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
