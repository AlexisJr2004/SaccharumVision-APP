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
      dashboard: 'Dashboard',
      hello: 'Hola',
      overview: 'Vista General',
      analysis: 'Análisis',
      analysisPerformed: 'Has realizado',
      scan: 'escaneo',
      scans: 'escaneos',
      thisWeek: 'esta semana',
      newScan: 'Nuevo Escaneo',
      completedAnalysis: 'Análisis completados - Últimos 7 días',
      healthy: 'Saludable',
      mosaic: 'Mosaico',
      redRot: 'Podredumbre',
      rust: 'Roya',
      yellowing: 'Amarillamiento',
      precision: 'precisión',
    },
    history: {
      title: 'Historial',
      analysesPerformed: 'análisis realizados',
      clear: 'Limpiar',
      noHistory: 'Sin historial',
      noHistoryDesc: 'Aún no hay predicciones guardadas. Realiza un escaneo para ver resultados aquí.',
      statistics: 'Estadísticas',
      scans: 'escaneos',
      historyOf: 'Historial de predicciones',
      refresh: 'Actualizar',
      hello: 'Hola',
      detailTitle: 'Detalle del Análisis',
      severity: 'Severidad',
      confidenceLevel: 'Nivel de Confianza',
      description: 'Descripción',
      recommendations: 'Recomendaciones',
      confidence: 'Confianza',
      precision: 'Precisión',
      newAnalysis: 'Nuevo Análisis',
      share: 'Compartir',
    },
    notifications: {
      title: 'Notificaciones',
      noNotifications: 'Sin notificaciones',
      noNotificationsDesc: 'Aquí aparecerán las notificaciones importantes sobre tus análisis y el estado de tus plantas.',
      unread: 'sin leer',
      welcomeTitle: '🎉 Bienvenido a AgroScan 5.0.0',
      welcomeMessage: '¡Nueva versión disponible! Esta actualización incluye:\n\n✨ Sistema de actualizaciones OTA\n🎨 Modales modernos y elegantes\n🔒 Mejoras en seguridad (PIN y biometría)\n🌙 Modo oscuro mejorado\n📊 Mejor visualización de estadísticas\n\n¡Disfruta de la nueva experiencia AgroScan!',
      translationsTitle: '🌐 Sistema de Traducciones Disponible',
      translationsMessage: '¡Ahora AgroScan habla tu idioma!\n\n🇪🇸 Español\n🇺🇸 English\n\nCambia el idioma desde Configuración > Idioma. Todas las pantallas se actualizarán instantáneamente sin necesidad de reiniciar la app.\n\n✨ Traducciones completas en toda la aplicación\n🔄 Cambio de idioma en tiempo real\n📱 Interfaz totalmente localizada',
    },
    settings: {
      title: 'Configuración',
      security: 'Seguridad',
      biometric: 'Biometría',
      biometricDesc: 'Desbloquear con huella o rostro',
      notAvailable: 'No disponible en este dispositivo',
      pinSecurity: 'PIN de seguridad',
      pinSecurityDesc: 'Proteger app con código PIN',
      appearance: 'Apariencia',
      darkMode: 'Modo Oscuro',
      darkModeDesc: 'Tema oscuro para la aplicación',
      themeChanged: 'Tema actualizado correctamente',
      language: 'Idioma',
      languageDesc: 'Cambiar idioma de la aplicación',
      languageChanged: 'Idioma actualizado. Los cambios se aplicarán inmediatamente',
      about: 'Acerca de',
      version: 'Versión',
      terms: 'Términos y condiciones',
    },
    terms: {
      title: 'Términos y Condiciones',
      lastUpdated: 'Última actualización: Noviembre 2025',
      section1Title: 'Aceptación de los Términos',
      section1Content: 'Al descargar, instalar o utilizar AgroScan ("la Aplicación"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, no utilice la Aplicación.',
      section2Title: 'Descripción del Servicio',
      section2Content: 'AgroScan es una aplicación móvil de detección de enfermedades en hojas de maíz mediante inteligencia artificial. La aplicación utiliza tecnología de aprendizaje automático para analizar imágenes y proporcionar diagnósticos preliminares.',
      section3Title: 'Uso de la Aplicación',
      section3_1Title: '3.1 Propósito Informativo:',
      section3_1Content: ' Los diagnósticos proporcionados por AgroScan son exclusivamente informativos y no deben considerarse como asesoramiento profesional definitivo.',
      section3_2Title: '3.2 Funcionamiento Offline:',
      section3_2Content: ' La aplicación funciona completamente offline una vez instalada. No requiere conexión a internet para realizar análisis.',
      section3_3Title: '3.3 Precisión:',
      section3_3Content: ' Si bien el modelo de IA ha sido entrenado con alta precisión (~98%), los resultados pueden variar según la calidad de la imagen y las condiciones de captura.',
      section4Title: 'Privacidad y Datos',
      section4_1Title: '4.1 Datos Locales:',
      section4_1Content: ' Todas las imágenes y análisis se almacenan localmente en su dispositivo. No se envían datos a servidores externos.',
      section4_2Title: '4.2 Permisos:',
      section4_2Content: ' La aplicación requiere acceso a la cámara y galería únicamente para capturar y seleccionar imágenes de análisis.',
      section4_3Title: '4.3 Biometría y PIN:',
      section4_3Content: ' Los datos de autenticación (PIN, huella dactilar) se almacenan de forma segura y cifrada en su dispositivo.',
      section5Title: 'Limitación de Responsabilidad',
      section5Intro: 'AgroScan y sus desarrolladores no se hacen responsables por:',
      section5Item1: 'Decisiones tomadas basadas en los diagnósticos de la aplicación',
      section5Item2: 'Pérdidas económicas derivadas del uso de la aplicación',
      section5Item3: 'Diagnósticos incorrectos o imprecisos',
      section5Item4: 'Problemas técnicos o mal funcionamiento del dispositivo',
      section6Title: 'Recomendaciones',
      section6Intro: 'Se recomienda encarecidamente:',
      section6Item1: 'Consultar con un agrónomo o especialista antes de tomar decisiones importantes',
      section6Item2: 'Utilizar la aplicación como herramienta complementaria, no sustitutiva',
      section6Item3: 'Tomar fotos de buena calidad con iluminación adecuada',
      section6Item4: 'Mantener la aplicación actualizada a la última versión',
      section7Title: 'Propiedad Intelectual',
      section7Content: 'Todo el contenido de la aplicación, incluyendo el modelo de IA, diseño, código y documentación, está protegido por derechos de autor y es propiedad de los desarrolladores de AgroScan.',
      section8Title: 'Actualizaciones',
      section8Content: 'Nos reservamos el derecho de actualizar estos términos en cualquier momento. Las actualizaciones importantes se notificarán a través de la aplicación.',
      section9Title: 'Contacto',
      section9Content: 'Para preguntas, sugerencias o reportar problemas, puede contactarnos a través de los canales oficiales de soporte de AgroScan.',
      footerText: 'Al usar AgroScan, usted reconoce haber leído, entendido y aceptado estos términos y condiciones.',
    },
    camera: {
      imageSelected: 'Imagen Seleccionada',
      captureImage: 'Capturar Imagen',
      permissionsRequired: 'Permisos Requeridos',
      permissionsDesc: 'Necesitamos acceso a la cámara y galería para analizar las plantas',
      grantPermissions: 'Conceder Permisos',
      analyzePlant: 'Analizar Planta',
      captureDesc: 'Captura o selecciona una imagen para detectar enfermedades',
      takePhoto: 'Tomar Foto',
      selectFromGallery: 'Seleccionar de Galería',
      retry: 'Repetir',
      analyze: 'Analizar',
      analyzing: 'Analizando...',
      analyzingTTA: 'Analizando con TTA...',
      error: 'Error',
      photoError: 'No se pudo tomar la foto',
      galleryError: 'No se pudo seleccionar la imagen',
      analysisError: 'No se pudo analizar la imagen',
      ttaActivated: '(Activado)',
      ttaDeactivated: '(Desactivado)',
      ttaInfoTitle: '⚠️ Test Time Augmentation',
      ttaInfoMessage: 'NOTA IMPORTANTE: El TTA actual NO está aplicando transformaciones reales.\n\n❌ Desactivado (RECOMENDADO): Predicción precisa y rápida\n⚠️ Activado: Ejecuta 3 predicciones sin transformar imagen (no mejora precisión)\n\n💡 Para TTA real, se requiere implementar expo-image-manipulator.\n\nVer PREDICTION_FIX.md para más detalles.',
      understood: 'Entendido',
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
      confidenceLevel: 'Confianza del Diagnóstico',
      confidence: 'Confianza',
      precision: 'Precisión',
      recommendedAction: 'Acción Recomendada',
      analysisCompleted: 'Análisis Completado',
      ttaActivated: 'TTA Activado',
      fastMode: 'Modo Rápido',
      time: 'Tiempo',
      viewFullDetails: 'Ver Detalles Completos',
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
      dashboard: 'Dashboard',
      hello: 'Hello',
      overview: 'Overview',
      analysis: 'Analysis',
      analysisPerformed: 'You have performed',
      scan: 'scan',
      scans: 'scans',
      thisWeek: 'this week',
      newScan: 'New Scan',
      completedAnalysis: 'Completed Analyses - Last 7 days',
      healthy: 'Healthy',
      mosaic: 'Mosaic',
      redRot: 'Red Rot',
      rust: 'Rust',
      yellowing: 'Yellowing',
      precision: 'precision',
    },
    history: {
      title: 'History',
      analysesPerformed: 'analyses performed',
      clear: 'Clear',
      noHistory: 'No history',
      noHistoryDesc: 'No predictions saved yet. Perform a scan to see results here.',
      statistics: 'Statistics',
      scans: 'scans',
      historyOf: 'Prediction history',
      refresh: 'Refresh',
      hello: 'Hello',
      detailTitle: 'Analysis Detail',
      severity: 'Severity',
      confidenceLevel: 'Confidence Level',
      description: 'Description',
      recommendations: 'Recommendations',
      confidence: 'Confidence',
      precision: 'Precision',
      newAnalysis: 'New Analysis',
      share: 'Share',
    },
    notifications: {
      title: 'Notifications',
      noNotifications: 'No notifications',
      noNotificationsDesc: 'Important notifications about your analyses and plant status will appear here.',
      unread: 'unread',
      welcomeTitle: '🎉 Welcome to AgroScan 5.0.0',
      welcomeMessage: 'New version available! This update includes:\n\n✨ OTA update system\n🎨 Modern and elegant modals\n🔒 Security improvements (PIN and biometrics)\n🌙 Improved dark mode\n📊 Better statistics visualization\n\nEnjoy the new AgroScan experience!',
      translationsTitle: '🌐 Translation System Available',
      translationsMessage: 'Now AgroScan speaks your language!\n\n🇪🇸 Español\n🇺🇸 English\n\nChange language from Settings > Language. All screens will update instantly without restarting the app.\n\n✨ Complete translations throughout the app\n🔄 Real-time language switching\n📱 Fully localized interface',
    },
    settings: {
      title: 'Settings',
      security: 'Security',
      biometric: 'Biometric',
      biometricDesc: 'Unlock with fingerprint or face',
      notAvailable: 'Not available on this device',
      pinSecurity: 'PIN security',
      pinSecurityDesc: 'Protect app with PIN code',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Dark theme for the app',
      themeChanged: 'Theme updated successfully',
      language: 'Language',
      languageDesc: 'Change app language',
      languageChanged: 'Language updated. Changes will apply immediately',
      about: 'About',
      version: 'Version',
      terms: 'Terms and conditions',
    },
    terms: {
      title: 'Terms and Conditions',
      lastUpdated: 'Last updated: November 2025',
      section1Title: 'Acceptance of Terms',
      section1Content: 'By downloading, installing, or using AgroScan ("the Application"), you agree to be bound by these Terms and Conditions. If you do not agree with any of these terms, do not use the Application.',
      section2Title: 'Service Description',
      section2Content: 'AgroScan is a mobile application for detecting diseases in corn leaves using artificial intelligence. The application uses machine learning technology to analyze images and provide preliminary diagnoses.',
      section3Title: 'Application Use',
      section3_1Title: '3.1 Informational Purpose:',
      section3_1Content: ' The diagnoses provided by AgroScan are for informational purposes only and should not be considered as definitive professional advice.',
      section3_2Title: '3.2 Offline Operation:',
      section3_2Content: ' The application works completely offline once installed. It does not require an internet connection to perform analyses.',
      section3_3Title: '3.3 Accuracy:',
      section3_3Content: ' Although the AI model has been trained with high accuracy (~98%), results may vary depending on image quality and capture conditions.',
      section4Title: 'Privacy and Data',
      section4_1Title: '4.1 Local Data:',
      section4_1Content: ' All images and analyses are stored locally on your device. No data is sent to external servers.',
      section4_2Title: '4.2 Permissions:',
      section4_2Content: ' The application requires access to camera and gallery only to capture and select analysis images.',
      section4_3Title: '4.3 Biometry and PIN:',
      section4_3Content: ' Authentication data (PIN, fingerprint) is stored securely and encrypted on your device.',
      section5Title: 'Limitation of Liability',
      section5Intro: 'AgroScan and its developers are not responsible for:',
      section5Item1: 'Decisions made based on application diagnoses',
      section5Item2: 'Economic losses derived from the use of the application',
      section5Item3: 'Incorrect or inaccurate diagnoses',
      section5Item4: 'Technical problems or device malfunction',
      section6Title: 'Recommendations',
      section6Intro: 'It is strongly recommended to:',
      section6Item1: 'Consult with an agronomist or specialist before making important decisions',
      section6Item2: 'Use the application as a complementary tool, not a substitute',
      section6Item3: 'Take good quality photos with adequate lighting',
      section6Item4: 'Keep the application updated to the latest version',
      section7Title: 'Intellectual Property',
      section7Content: 'All application content, including the AI model, design, code, and documentation, is protected by copyright and is the property of AgroScan developers.',
      section8Title: 'Updates',
      section8Content: 'We reserve the right to update these terms at any time. Important updates will be notified through the application.',
      section9Title: 'Contact',
      section9Content: 'For questions, suggestions, or to report problems, you can contact us through AgroScan\'s official support channels.',
      footerText: 'By using AgroScan, you acknowledge that you have read, understood, and accepted these terms and conditions.',
    },
    camera: {
      imageSelected: 'Image Selected',
      captureImage: 'Capture Image',
      permissionsRequired: 'Permissions Required',
      permissionsDesc: 'We need access to camera and gallery to analyze plants',
      grantPermissions: 'Grant Permissions',
      analyzePlant: 'Analyze Plant',
      captureDesc: 'Capture or select an image to detect diseases',
      takePhoto: 'Take Photo',
      selectFromGallery: 'Select from Gallery',
      retry: 'Retry',
      analyze: 'Analyze',
      analyzing: 'Analyzing...',
      analyzingTTA: 'Analyzing with TTA...',
      error: 'Error',
      photoError: 'Could not take the photo',
      galleryError: 'Could not select the image',
      analysisError: 'Could not analyze the image',
      ttaActivated: '(Activated)',
      ttaDeactivated: '(Deactivated)',
      ttaInfoTitle: '⚠️ Test Time Augmentation',
      ttaInfoMessage: 'IMPORTANT NOTE: Current TTA is NOT applying real transformations.\n\n❌ Deactivated (RECOMMENDED): Accurate and fast prediction\n⚠️ Activated: Runs 3 predictions without transforming image (does not improve accuracy)\n\n💡 For real TTA, expo-image-manipulator implementation is required.\n\nSee PREDICTION_FIX.md for more details.',
      understood: 'Understood',
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
      confidenceLevel: 'Diagnosis Confidence',
      confidence: 'Confidence',
      precision: 'Precision',
      recommendedAction: 'Recommended Action',
      analysisCompleted: 'Analysis Completed',
      ttaActivated: 'TTA Activated',
      fastMode: 'Fast Mode',
      time: 'Time',
      viewFullDetails: 'View Full Details',
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
