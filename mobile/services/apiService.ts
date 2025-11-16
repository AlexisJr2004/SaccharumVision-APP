// services/apiService.ts
// Servicio para conectar con la API remota del modelo

interface PredictionResult {
  className: string;
  classIndex: number;
  confidence: number;
}

interface APIResponse {
  success: boolean;
  predictions: PredictionResult[];
  topPrediction: PredictionResult;
  usedTTA?: boolean;
  modelInfo?: {
    version: string;
    inputSize: number;
  };
}

class APIService {
  // 🔥 URL de tu API en Hugging Face
  // Tu Space: https://huggingface.co/spaces/ALEXIS2004/saccharumvision-api
  private API_URL = 'https://alexis2004-saccharumvision-api.hf.space';
  
  // Timeout para requests (30 segundos)
  private TIMEOUT = 30000;

  /**
   * Configura la URL de la API
   * Llama esto desde settings si quieres que sea configurable
   */
  setAPIUrl(url: string) {
    this.API_URL = url.replace(/\/$/, ''); // Remover trailing slash
    console.log('🔧 API URL configurada:', this.API_URL);
  }

  /**
   * Verifica si el servidor está disponible
   */
  async checkHealth(): Promise<boolean> {
    try {
      console.log('🏥 Verificando salud del servidor...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.API_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Servidor saludable:', data);
        return data.model_loaded === true;
      }

      console.warn('⚠️ Servidor respondió con error:', response.status);
      return false;
    } catch (error: any) {
      // No log de error completo para evitar spam en consola
      if (error.name === 'AbortError') {
        console.warn('⚠️ Timeout al verificar servidor');
      } else if (error.message?.includes('Network request failed')) {
        console.warn('⚠️ Sin conexión de red');
      } else {
        console.warn('⚠️ Error verificando servidor:', error.message);
      }
      return false;
    }
  }

  /**
   * Predice enfermedad de una imagen usando la API remota
   * @param imageUri URI local de la imagen
   * @param useTTA Si se debe usar Test Time Augmentation
   */
  async predict(
    imageUri: string,
    useTTA: boolean = false
  ): Promise<APIResponse> {
    const startTime = Date.now();

    try {
      console.log('🔍 Enviando imagen a API remota...');
      console.log('📸 URI:', imageUri);
      console.log('🔧 TTA:', useTTA ? 'Activado' : 'Desactivado');

      const endpoint = '/predict';
      const formData = new FormData();
      
      // Crear objeto file desde la URI
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const fileType = this.getImageMimeType(filename);
      
      // @ts-ignore - React Native soporta esto
      formData.append('file', {
        uri: imageUri,
        type: fileType,
        name: filename,
      });
      
      // Agregar parámetro TTA
      formData.append('use_tta', useTTA.toString());

      // Configurar timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      // Hacer request
      const response = await fetch(`${this.API_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          // No establecer Content-Type, FormData lo hace automáticamente
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API error: ${response.status} - ${errorText || response.statusText}`
        );
      }

      const data: APIResponse = await response.json();

      const processingTime = Date.now() - startTime;
      console.log(`⏱️ Tiempo total: ${processingTime}ms`);
      console.log('✅ Predicción exitosa');
      console.log(
        `🎯 Top: ${data.topPrediction.className} (${(
          data.topPrediction.confidence * 100
        ).toFixed(1)}%)`
      );

      return data;
    } catch (error: any) {
      console.error('❌ Error en API prediction:', error);

      // Manejar tipos de errores específicos
      if (error.name === 'AbortError') {
        throw new Error(
          'Tiempo agotado - El servidor tardó demasiado en responder'
        );
      }

      if (error.message.includes('Network request failed')) {
        throw new Error(
          'Error de red - Verifica tu conexión a internet'
        );
      }

      throw new Error(
        `Error en predicción: ${error.message || 'Error desconocido'}`
      );
    }
  }

  /**
   * Obtiene el MIME type de una imagen según su extensión
   */
  private getImageMimeType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    const mimeTypes: { [key: string]: string } = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      bmp: 'image/bmp',
    };

    return mimeTypes[extension || 'jpg'] || 'image/jpeg';
  }

  /**
   * Test de conectividad - útil para debugging
   */
  async testConnection(): Promise<{
    reachable: boolean;
    latency: number;
    modelLoaded: boolean;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.API_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        return {
          reachable: true,
          latency,
          modelLoaded: data.model_loaded || false,
        };
      }

      return {
        reachable: true,
        latency,
        modelLoaded: false,
        error: `HTTP ${response.status}`,
      };
    } catch (error: any) {
      return {
        reachable: false,
        latency: Date.now() - startTime,
        modelLoaded: false,
        error: error.message,
      };
    }
  }
}

export default new APIService();
