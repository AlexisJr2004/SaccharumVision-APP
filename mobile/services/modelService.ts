// services/modelService.ts
// Servicio simplificado - SOLO API REMOTA
import classesData from '../assets/models/classes_latest.json';
import apiService from './apiService';
import NetInfo from '@react-native-community/netinfo';

class ModelService {
  classes: any = null;
  isReady: boolean = false;
  remoteAvailable: boolean = false;
  private initializationPromise: Promise<boolean> | null = null;

  constructor() {
    this.classes = classesData;
  }

  /**
   * Configura la URL de la API remota
   */
  setAPIUrl(url: string) {
    apiService.setAPIUrl(url);
  }

  /**
   * Verifica si hay conexión a internet
   */
  private async checkInternetConnection(): Promise<boolean> {
    try {
      const netInfo = await NetInfo.fetch();
      return netInfo.isConnected === true && netInfo.isInternetReachable !== false;
    } catch (error) {
      console.warn('⚠️ No se pudo verificar conectividad, asumiendo sin conexión');
      return false;
    }
  }

  /**
   * Inicializa el servicio verificando la API remota
   */
  async loadModel() {
    // Si ya hay una inicialización en progreso, retornar esa promesa
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initializeModel();
    return this.initializationPromise;
  }

  private async _initializeModel(): Promise<boolean> {
    try {
      console.log('🔄 Inicializando servicio de modelo...');
      
      // Verificar conectividad primero
      const hasInternet = await this.checkInternetConnection();
      
      if (!hasInternet) {
        console.warn('⚠️ Sin conexión a internet');
        this.remoteAvailable = false;
        this.isReady = true;
        return false;
      }
      
      console.log('🌐 Verificando API remota...');
      this.remoteAvailable = await apiService.checkHealth();
      
      if (this.remoteAvailable) {
        console.log('✅ API remota disponible');
      } else {
        console.warn('⚠️ API remota no disponible');
      }
      
      this.isReady = true;
      console.log('✅ Servicio de modelo listo');
      console.log(`📋 Clases detectables: ${Object.values(this.classes).join(', ')}`);
      
      return this.remoteAvailable;
    } catch (error) {
      console.error('❌ Error inicializando modelo:', error);
      this.isReady = true;
      this.remoteAvailable = false;
      return false;
    } finally {
      this.initializationPromise = null;
    }
  }

  /**
   * Predice enfermedad usando la API remota
   * @param imageUri URI de la imagen a analizar
   * @param useTTA Si se debe usar Test Time Augmentation para mayor precisión
   */
  async predict(imageUri: string, useTTA: boolean = false) {
    if (!this.isReady) {
      await this.loadModel();
    }

    const startTime = Date.now();

    try {
      console.log('🔍 Analizando imagen:', imageUri);
      console.log('🔧 TTA:', useTTA ? 'Activado ⚡' : 'Desactivado');
      
      // Verificar conectividad antes de intentar
      const hasInternet = await this.checkInternetConnection();
      if (!hasInternet) {
        throw new Error('Sin conexión a internet. Esta aplicación requiere conexión para realizar predicciones.');
      }

      if (!this.remoteAvailable) {
        // Reintentar verificar API
        console.log('🔄 Reintentando conexión con API...');
        this.remoteAvailable = await apiService.checkHealth();
        
        if (!this.remoteAvailable) {
          throw new Error('El servidor de predicciones no está disponible. Por favor, intenta nuevamente en unos momentos.');
        }
      }

      console.log('🌐 Usando: API Remota' + (useTTA ? ' con TTA' : ''));
      const response = await apiService.predict(imageUri, useTTA);
      const predictions = response.predictions;

      const processingTime = Date.now() - startTime;
      console.log(`⏱️ Tiempo de procesamiento: ${processingTime}ms`);
      console.log('🎯 Top 3:', predictions.slice(0, 3).map(p => 
        `${p.className}: ${(p.confidence * 100).toFixed(1)}%`
      ).join(', '));
      
      return {
        predictions,
        topPrediction: predictions[0],
        processingTime,
        modelType: '🌐 API Remota',
        usedTTA: response.usedTTA || false,
      };
    } catch (error: any) {
      console.error('❌ Error en predicción:', error);
      
      // Marcar API como no disponible para futuros intentos
      this.remoteAvailable = false;
      
      // Relanzar error con mensaje más descriptivo
      if (error.message) {
        throw error;
      }
      throw new Error('Error desconocido al realizar la predicción. Verifica tu conexión e intenta nuevamente.');
    }
  }



  getDiseaseInfo(className: string) {
    const diseaseDatabase: { [key: string]: any } = {
      'Healthy': {
        name: 'Planta Saludable',
        emoji: '🌱',
        description: 'La planta de maíz está en excelente estado de salud.',
        severity: 'Ninguna',
        color: '#4CAF50',
        recommendations: [
          'Continuar con el plan de cuidados actual',
          'Mantener monitoreo regular',
          'Prevenir entrada de plagas'
        ]
      },
      'Mosaic': {
        name: 'Mosaico del Maíz',
        emoji: '🦠',
        description: 'Enfermedad viral que causa patrones de mosaico en las hojas.',
        severity: 'Media',
        color: '#FF9800',
        recommendations: [
          'Eliminar plantas infectadas',
          'Controlar insectos vectores',
          'Usar variedades resistentes',
          'Desinfectar herramientas'
        ]
      },
      'RedRot': {
        name: 'Pudrición Roja',
        emoji: '🍂',
        description: 'Enfermedad fungica que causa pudrición en tallos y hojas.',
        severity: 'Alta',
        color: '#F44336',
        recommendations: [
          'Aplicar fungicida apropiado',
          'Mejorar drenaje del suelo',
          'Reducir humedad excesiva',
          'Eliminar residuos infectados'
        ]
      },
      'Rust': {
        name: 'Roya del Maíz',
        emoji: '🔶',
        description: 'Enfermedad fungica que causa pústulas de color óxido.',
        severity: 'Media-Alta',
        color: '#FF5722',
        recommendations: [
          'Aplicar fungicida sistémico',
          'Mejorar circulación de aire',
          'Rotar cultivos',
          'Monitorear clima húmedo'
        ]
      },
      'Yellow': {
        name: 'Amarillamiento',
        emoji: '⚠️',
        description: 'Síntoma de deficiencia nutricional o estrés hídrico.',
        severity: 'Media',
        color: '#FFC107',
        recommendations: [
          'Analizar suelo',
          'Verificar riego',
          'Aplicar fertilizante nitrogenado',
          'Revisar pH del suelo'
        ]
      }
    };

    return diseaseDatabase[className] || diseaseDatabase['Healthy'];
  }
}

export default new ModelService();
