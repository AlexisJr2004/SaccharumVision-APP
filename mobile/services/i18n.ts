// services/i18n.ts - Sistema de internacionalización
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'es' | 'en';

const translations = {
  es: {
    home: {
      subtitle: 'Detección de Enfermedades en Maíz',
      modelReady: 'Modelo Cargado',
      modelLoading: 'Cargando...',
      howItWorks: '¿Cómo funciona?',
      step1: '1. Toma una foto de la hoja de maíz',
      step2: '2. Nuestra IA analiza la imagen',
      step3: '3. Recibe diagnóstico y recomendaciones',
      analyzePlant: 'Analizar Planta',
      takePhoto: 'Tomar Foto',
      takePhotoDesc: 'Usa la cámara para capturar',
      selectFromGallery: 'Seleccionar de Galería',
      selectFromGalleryDesc: 'Elige una foto existente',
      detectableDiseases: 'Enfermedades Detectables',
      diseases: 'Enfermedades',
      accuracy: 'Precisión',
      offline: 'Offline',
    },
    history: {
      title: 'Historial',
      analysesPerformed: 'análisis realizados',
      clear: 'Limpiar',
      noHistory: 'Sin historial',
      noHistoryDesc: 'Tus análisis aparecerán aquí',
      statistics: 'Estadísticas',
    },
    settings: {
      title: 'Configuración',
      security: '🔒 Seguridad',
      biometric: 'Biometría',
      biometricDesc: 'Desbloquear con huella o rostro',
      notAvailable: 'No disponible en este dispositivo',
      pinSecurity: 'PIN de seguridad',
      pinSecurityDesc: 'Proteger app con código PIN',
      appearance: '🎨 Apariencia',
      darkMode: 'Modo Oscuro',
      darkModeDesc: 'Tema oscuro para la aplicación',
      themeChanged: 'Tema actualizado correctamente',
      language: 'Idioma',
      languageDesc: 'Cambiar idioma de la aplicación',
      languageChanged: 'Idioma actualizado. Los cambios se aplicarán inmediatamente',
      about: 'ℹ️ Acerca de',
      version: 'Versión',
      terms: 'Términos y condiciones',
    },
    camera: {
      imageSelected: 'Imagen Seleccionada',
      captureImage: 'Capturar Imagen',
      permissionsRequired: 'Se requieren permisos de cámara y galería',
      grantPermissions: 'Otorgar Permisos',
      tapToPhoto: 'Toca para tomar una foto',
      selectImage: 'Selecciona una imagen',
      retry: 'Reintentar',
      analyze: 'Analizar',
      error: 'Error',
      photoError: 'No se pudo tomar la foto',
      galleryError: 'No se pudo seleccionar la imagen',
      analysisError: 'No se pudo analizar la imagen',
    },
    results: {
      title: 'Resultados del Análisis',
      analysisDetail: 'Detalle del Análisis',
      mainDiagnosis: 'Diagnóstico Principal',
      otherPossibilities: 'Otras Posibilidades',
      newAnalysis: 'Nuevo Análisis',
      share: 'Compartir',
      description: 'Descripción',
      recommendations: 'Recomendaciones',
      severity: 'Severidad',
      confidenceLevel: 'Nivel de confianza',
      confidence: 'Confianza',
      precision: 'Precisión',
    },
    diseases: {
      Healthy: {
        name: 'Saludable',
        description: 'La planta no muestra signos de enfermedad',
      },
      Mosaic: {
        name: 'Mosaico',
        description: 'Enfermedad viral transmitida por insectos',
      },
      RedRot: {
        name: 'Pudrición Roja',
        description: 'Enfermedad fúngica que afecta tallos y hojas',
      },
      Rust: {
        name: 'Roya',
        description: 'Enfermedad fúngica con pústulas naranjas',
      },
      Yellow: {
        name: 'Amarillamiento',
        description: 'Deficiencia nutricional o estrés hídrico',
      },
    },
  },
  en: {
    home: {
      subtitle: 'Corn Leaf Disease Detection',
      modelReady: 'Model Loaded',
      modelLoading: 'Loading...',
      howItWorks: 'How it works?',
      step1: '1. Take a photo of the corn leaf',
      step2: '2. Our AI analyzes the image',
      step3: '3. Get diagnosis and recommendations',
      analyzePlant: 'Analyze Plant',
      takePhoto: 'Take Photo',
      takePhotoDesc: 'Use camera to capture',
      selectFromGallery: 'Select from Gallery',
      selectFromGalleryDesc: 'Choose an existing photo',
      detectableDiseases: 'Detectable Diseases',
      diseases: 'Diseases',
      accuracy: 'Accuracy',
      offline: 'Offline',
    },
    history: {
      title: 'History',
      analysesPerformed: 'analyses performed',
      clear: 'Clear',
      noHistory: 'No history',
      noHistoryDesc: 'Your analyses will appear here',
      statistics: 'Statistics',
    },
    settings: {
      title: 'Settings',
      security: '🔒 Security',
      biometric: 'Biometric',
      biometricDesc: 'Unlock with fingerprint or face',
      notAvailable: 'Not available on this device',
      pinSecurity: 'PIN security',
      pinSecurityDesc: 'Protect app with PIN code',
      appearance: '🎨 Appearance',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Dark theme for the app',
      themeChanged: 'Theme updated successfully',
      language: 'Language',
      languageDesc: 'Change app language',
      languageChanged: 'Language updated. Changes will apply immediately',
      about: 'ℹ️ About',
      version: 'Version',
      terms: 'Terms and conditions',
    },
    camera: {
      imageSelected: 'Image Selected',
      captureImage: 'Capture Image',
      permissionsRequired: 'Camera and gallery permissions required',
      grantPermissions: 'Grant Permissions',
      tapToPhoto: 'Tap to take a photo',
      selectImage: 'Select an image',
      retry: 'Retry',
      analyze: 'Analyze',
      error: 'Error',
      photoError: 'Could not take the photo',
      galleryError: 'Could not select the image',
      analysisError: 'Could not analyze the image',
    },
    results: {
      title: 'Analysis Results',
      analysisDetail: 'Analysis Detail',
      mainDiagnosis: 'Main Diagnosis',
      otherPossibilities: 'Other Possibilities',
      newAnalysis: 'New Analysis',
      share: 'Share',
      description: 'Description',
      recommendations: 'Recommendations',
      severity: 'Severity',
      confidenceLevel: 'Confidence level',
      confidence: 'Confidence',
      precision: 'Precision',
    },
    diseases: {
      Healthy: {
        name: 'Healthy',
        description: 'Plant shows no signs of disease',
      },
      Mosaic: {
        name: 'Mosaic',
        description: 'Viral disease transmitted by insects',
      },
      RedRot: {
        name: 'Red Rot',
        description: 'Fungal disease affecting stems and leaves',
      },
      Rust: {
        name: 'Rust',
        description: 'Fungal disease with orange pustules',
      },
      Yellow: {
        name: 'Yellowing',
        description: 'Nutritional deficiency or water stress',
      },
    },
  },
};

class I18nService {
  private currentLanguage: Language = 'es';
  private listeners: Array<() => void> = [];

  async initialize() {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage === 'en' || savedLanguage === 'es') {
        this.currentLanguage = savedLanguage;
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  }

  t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  }

  async setLanguage(lang: Language) {
    this.currentLanguage = lang;
    try {
      await AsyncStorage.setItem('app_language', lang);
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }
}

const i18n = new I18nService();
i18n.initialize();

export default i18n;
export type { Language };
