// app/camera.tsx - Modern Camera Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Camera, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import modelService from '../services/modelService';
import i18n from '../services/i18n';
import { useTheme } from '../contexts/ThemeContext';
import CustomAlert from '../components/CustomAlert';

export default function CameraScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams();
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useTTA, setUseTTA] = useState(false);
  const [showTTAInfo, setShowTTAInfo] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    requestPermissions();
    
    const unsubscribe = i18n.subscribe(() => {
      forceUpdate(prev => prev + 1);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (mode === 'gallery') {
      pickImage();
    }
  }, [mode]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1.0, // ✅ Máxima calidad (100%)
        allowsEditing: false, // ✅ SIN recorte forzado - imagen completa
        // ❌ NO usar aspect ratio - capturar imagen completa
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1.0, // ✅ Máxima calidad (100%)
        allowsEditing: false, // ✅ SIN recorte forzado - imagen completa
        // ❌ NO usar aspect ratio - seleccionar imagen completa
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      } else {
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
      router.back();
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const result = await modelService.predict(selectedImage, useTTA);
      
      router.push({
        pathname: '/results',
        params: {
          imageUri: selectedImage,
          predictions: JSON.stringify(result.predictions),
          processingTime: result.processingTime,
          usedTTA: result.usedTTA ? 'true' : 'false',
        },
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo analizar la imagen');
      console.error('Error en análisis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Decorative Elements */}
        <View style={[styles.decorativeBlur, styles.decorativeTop]} />
        <View style={[styles.decorativeBlur, styles.decorativeBottom]} />
        
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.permissionContainer}>
            <View style={styles.permissionIcon}>
              <Ionicons name="camera-outline" size={48} color="#10B981" />
            </View>
            <Text style={[styles.permissionTitle, { color: colors.text }]}>
              Permisos Requeridos
            </Text>
            <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
              Necesitamos acceso a la cámara y galería para analizar las plantas
            </Text>
            <TouchableOpacity onPress={requestPermissions}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.permissionButton}
              >
                <Text style={styles.permissionButtonText}>Conceder Permisos</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative Elements */}
      <View style={[styles.decorativeBlur, styles.decorativeTop]} />
      <View style={[styles.decorativeBlur, styles.decorativeBottom]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.backButton, { backgroundColor: colors.card }]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {selectedImage ? 'Imagen Seleccionada' : 'Capturar Imagen'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {selectedImage ? (
          // Preview Screen
          <View style={styles.content}>
            <View 
              style={[
                styles.previewCard,
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
            >
              <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />
            </View>

            {/* TTA Toggle Card */}
            <View 
              style={[
                styles.ttaCard,
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
            >
              <View style={styles.ttaContent}>
                <View style={styles.ttaLeft}>
                  <View style={styles.ttaIconWrapper}>
                    <Ionicons name="settings-outline" size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.ttaTextWrapper}>
                    <View style={styles.ttaTitleRow}>
                      <Text style={[styles.ttaTitle, { color: colors.text }]}>TTA</Text>
                      <Text style={[styles.ttaStatus, { color: colors.textSecondary }]}>
                        {useTTA ? '(Activado)' : '(Desactivado)'}
                      </Text>
                      <TouchableOpacity onPress={() => setShowTTAInfo(true)}>
                        <Ionicons name="information-circle-outline" size={16} color="#3B82F6" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.ttaSubtitle}>
                      Test Time Augmentation
                    </Text>
                  </View>
                </View>
                <Switch
                  value={useTTA}
                  onValueChange={setUseTTA}
                  trackColor={{ false: '#E2E8F0', true: '#60A5FA' }}
                  thumbColor={useTTA ? '#3B82F6' : '#F1F5F9'}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.retakeButton, { shadowColor: colors.shadowColor }]}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.retakeButtonText}>Repetir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={analyzeImage}
                disabled={isAnalyzing}
                style={[styles.analyzeButtonWrapper, { flex: 1 }]}
              >
                <LinearGradient
                  colors={isAnalyzing ? ['#6B7280', '#4B5563'] : ['#10B981', '#059669']}
                  style={[styles.analyzeButton, { shadowColor: '#10B981' }]}
                >
                  {isAnalyzing ? (
                    <>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={styles.analyzeButtonText}>
                        {useTTA ? 'Analizando con TTA...' : 'Analizando...'}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="search" size={20} color="#fff" />
                      <Text style={styles.analyzeButtonText}>Analizar</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Capture Options Screen
          <View style={styles.content}>
            <View 
              style={[
                styles.captureCard,
                { 
                  backgroundColor: colors.card + 'CC',
                  borderColor: colors.border + '99',
                  shadowColor: colors.shadowColor,
                }
              ]}
            >
              <LinearGradient
                colors={['#D1FAE5', '#A7F3D0']}
                style={styles.cameraIconWrapper}
              >
                <Ionicons name="camera" size={48} color="#059669" />
              </LinearGradient>

              <Text style={[styles.captureTitle, { color: colors.text }]}>
                Analizar Planta
              </Text>
              <Text style={[styles.captureSubtitle, { color: colors.textSecondary }]}>
                Captura o selecciona una imagen para detectar enfermedades
              </Text>

              <View style={styles.captureButtons}>
                <TouchableOpacity onPress={takePhoto}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={[styles.primaryCaptureButton, { shadowColor: '#10B981' }]}
                  >
                    <Ionicons name="camera" size={20} color="#fff" />
                    <Text style={styles.primaryCaptureButtonText}>Tomar Foto</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.secondaryCaptureButton, { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border
                  }]}
                  onPress={pickImage}
                >
                  <Ionicons name="images" size={20} color={colors.text} />
                  <Text style={[styles.secondaryCaptureButtonText, { color: colors.text }]}>
                    Seleccionar de Galería
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* TTA Info Modal */}
        <CustomAlert
          visible={showTTAInfo}
          onClose={() => setShowTTAInfo(false)}
          title="⚠️ Test Time Augmentation"
          message="NOTA IMPORTANTE: El TTA actual NO está aplicando transformaciones reales.\n\n❌ Desactivado (RECOMENDADO): Predicción precisa y rápida\n⚠️ Activado: Ejecuta 3 predicciones sin transformar imagen (no mejora precisión)\n\n💡 Para TTA real, se requiere implementar expo-image-manipulator.\n\nVer PREDICTION_FIX.md para más detalles."
          type="warning"
          icon="warning"
          confirmText="Entendido"
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  // Capture Options Styles
  captureCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cameraIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  captureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  captureSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
  },
  captureButtons: {
    width: '100%',
    gap: 12,
  },
  primaryCaptureButton: {
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
  primaryCaptureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryCaptureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryCaptureButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Preview Styles
  previewCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
  },
  // TTA Card Styles
  ttaCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  ttaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ttaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  ttaIconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ttaTextWrapper: {
    flex: 1,
  },
  ttaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ttaTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  ttaStatus: {
    fontSize: 12,
  },
  ttaSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#64748B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButtonWrapper: {
    flex: 1,
  },
  analyzeButton: {
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
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Permission Styles
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  permissionIcon: {
    width: 96,
    height: 96,
    backgroundColor: '#D1FAE5',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
