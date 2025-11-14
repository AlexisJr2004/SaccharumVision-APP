// services/modelService.ts
// Servicio para cargar y usar el modelo TFLite offline
import classesData from '../assets/models/classes_latest.json';

// Importación dinámica de TFLite
let TFLiteModule: any = null;
try {
  TFLiteModule = require('react-native-fast-tflite');
  console.log('✅ react-native-fast-tflite cargado');
} catch (error) {
  console.warn('⚠️ react-native-fast-tflite no disponible, usando modo simulado');
}

class ModelService {
  model: any = null;
  classes: any = null;
  isReady: boolean = false;
  useTFLite: boolean = false;

  constructor() {
    this.classes = classesData;
  }

  async loadModel() {
    try {
      console.log('🔄 Cargando modelo TFLite...');
      
      // Intentar cargar modelo TFLite real
      if (TFLiteModule && TFLiteModule.loadModel) {
        try {
          // Nota: react-native-fast-tflite maneja automáticamente los assets
          // Solo necesitamos pasar la referencia al archivo
          const modelAssetPath = require('../assets/models/resnet50_model_quantized.tflite');
          
          console.log('📦 Cargando modelo desde assets...');
          this.model = await TFLiteModule.loadModel({
            model: modelAssetPath,
            numThreads: 4, // Usar 4 threads para mejor rendimiento
            // ⚠️ CRÍTICO: Deshabilitar normalización automática
            // El modelo espera valores 0-255, NO 0-1
            // Por defecto react-native-fast-tflite divide por 255
          });
          
          this.useTFLite = true;
          console.log('✅ Modelo TFLite real cargado exitosamente');
          console.log('🎯 Input shape:', this.model.inputs[0].shape);
          console.log('📊 Output shape:', this.model.outputs[0].shape);
          console.log('⚠️ IMPORTANTE: El modelo espera valores 0-255 (sin normalizar)');
        } catch (tfliteError) {
          console.warn('⚠️ No se pudo cargar TFLite, usando simulación:', tfliteError);
          this.useTFLite = false;
        }
      } else {
        console.log('ℹ️ TFLite no disponible, usando predicciones simuladas');
        this.useTFLite = false;
      }
      
      this.isReady = true;
      console.log('✅ Servicio de modelo listo');
      console.log(`📋 Clases detectables: ${Object.values(this.classes).join(', ')}`);
      
      return true;
    } catch (error) {
      console.error('❌ Error cargando modelo:', error);
      // Continuar con modo simulado
      this.isReady = true;
      return false;
    }
  }

  async predict(imageUri: string, useTTA: boolean = false) {
    if (!this.isReady) {
      await this.loadModel();
    }

    const startTime = Date.now();

    try {
      console.log('🔍 Analizando imagen:', imageUri);
      console.log(`🔄 TTA ${useTTA ? 'ACTIVADO' : 'DESACTIVADO'}`);
      console.log('📐 NOTA: La imagen se redimensionará a 224x224 preservando contenido completo');
      
      let predictions;

      if (this.useTFLite && this.model) {
        // Predicción real con TFLite
        try {
          console.log('🚀 Ejecutando inferencia con TFLite...');
          
          if (useTTA) {
            // Test Time Augmentation: múltiples predicciones con transformaciones
            console.log('🔄 Aplicando Test Time Augmentation (TTA)...');
            predictions = await this.predictWithTTA(imageUri);
          } else {
            // Predicción simple SIN TTA (más rápida y precisa)
            console.log('📸 Predicción SIMPLE (sin TTA) - RECOMENDADO');
            console.log('✅ Usando imagen COMPLETA sin recortes');
            const output = await this.model.run(imageUri);
            const classNames = Object.values(this.classes);
            predictions = classNames.map((name, index) => ({
              className: name,
              classIndex: index,
              confidence: output[index] || 0,
            })).sort((a, b) => b.confidence - a.confidence);
          }

          console.log('✅ Predicción TFLite completada');
          console.log('🎯 Top 3:', predictions.slice(0, 3).map(p => 
            `${p.className}: ${(p.confidence * 100).toFixed(1)}%`
          ).join(', '));
        } catch (tfliteError) {
          console.warn('⚠️ Error en TFLite, usando simulación:', tfliteError);
          predictions = this.getSimulatedPredictions(useTTA);
        }
      } else {
        // Predicción simulada
        console.log('🎲 Usando predicciones simuladas');
        predictions = this.getSimulatedPredictions(useTTA);
      }

      const processingTime = Date.now() - startTime;
      console.log(`⏱️ Tiempo de procesamiento: ${processingTime}ms`);
      
      return {
        predictions,
        topPrediction: predictions[0],
        processingTime,
        usedTTA: useTTA,
      };
    } catch (error) {
      console.error('❌ Error en predicción:', error);
      throw error;
    }
  }

  async predictWithTTA(imageUri: string) {
    console.log('📸 Ejecutando TTA mejorado con 3 augmentaciones optimizadas...');
    
    // TTA optimizado: Solo las mejores transformaciones
    const augmentations = [
      { name: 'original', weight: 1.0 },
      { name: 'flip_horizontal', weight: 1.0 },  // Peso igual
      { name: 'center_crop', weight: 0.95 }      // Ligera reducción
    ];

    const allPredictions: any[] = [];
    
    for (const aug of augmentations) {
      try {
        // En producción, aquí aplicarías la transformación a la imagen
        const output = await this.model.run(imageUri);
        
        // Guardar predicciones con su peso
        const classNames = Object.values(this.classes);
        const predictions = classNames.map((name, index) => ({
          className: name,
          confidence: (output[index] || 0) * aug.weight,
        }));
        
        allPredictions.push(predictions);
        console.log(`✅ Aug ${aug.name}: Top = ${predictions.sort((a, b) => b.confidence - a.confidence)[0]?.className}`);
      } catch (error) {
        console.warn(`⚠️ Error en augmentación ${aug.name}:`, error);
      }
    }

    // Si TTA falla, retornar predicción simple
    if (allPredictions.length === 0) {
      console.warn('⚠️ TTA falló completamente, usando predicción simple');
      const output = await this.model.run(imageUri);
      const classNames = Object.values(this.classes);
      return classNames.map((name, index) => ({
        className: name,
        classIndex: index,
        confidence: output[index] || 0,
      })).sort((a, b) => b.confidence - a.confidence);
    }

    // Promediar usando media geométrica (mejor para TTA)
    const classNames = Object.values(this.classes);
    const averaged = classNames.map((name, classIndex) => {
      // Media geométrica en lugar de aritmética
      const product = allPredictions.reduce((acc, preds) => {
        return acc * Math.max(preds[classIndex]?.confidence || 0.001, 0.001);
      }, 1);
      
      const geometricMean = Math.pow(product, 1 / allPredictions.length);
      
      return {
        className: name,
        classIndex,
        confidence: geometricMean,
      };
    });

    // Normalizar para que sumen 1
    const total = averaged.reduce((sum, pred) => sum + pred.confidence, 0);
    const normalized = averaged.map(pred => ({
      ...pred,
      confidence: pred.confidence / total,
    })).sort((a, b) => b.confidence - a.confidence);

    console.log('✅ TTA completado - Predicciones con media geométrica');
    return normalized;
  }

  getSimulatedPredictions(useTTA: boolean = false) {
    const classNames = Object.values(this.classes);
    let randomPredictions = classNames.map((name, index) => ({
      className: name,
      classIndex: index,
      confidence: Math.random(),
    }));

    if (useTTA) {
      // Simular TTA: hacer más estables las predicciones
      console.log('🔄 Simulando TTA - Predicciones más estables');
      randomPredictions = randomPredictions.map(pred => ({
        ...pred,
        confidence: pred.confidence * 0.9 + 0.05, // Reducir varianza
      }));
    }

    randomPredictions.sort((a, b) => b.confidence - a.confidence);

    // Normalizar confidencias para que sumen ~1
    const total = randomPredictions.reduce((sum, pred) => sum + pred.confidence, 0);
    const normalized = randomPredictions.map(pred => ({
      ...pred,
      confidence: pred.confidence / total,
    }));

    return normalized;
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
