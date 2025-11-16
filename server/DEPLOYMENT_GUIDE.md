# 🚀 Guía Completa de Deployment - SaccharumVision API

## 📋 Tabla de Contenidos
1. [Resumen de Opciones](#resumen-de-opciones)
2. [Opción 1: Hugging Face Spaces (RECOMENDADO)](#opción-1-hugging-face-spaces)
3. [Opción 2: Google Colab + ngrok](#opción-2-google-colab-ngrok)
4. [Opción 3: Render.com](#opción-3-rendercom)
5. [Configuración de la App Móvil](#configuración-de-la-app-móvil)
6. [Testing y Debugging](#testing-y-debugging)
7. [Troubleshooting](#troubleshooting)

---

## 📊 Resumen de Opciones

| Opción | Costo | GPU | Persistencia | Dificultad | Recomendado |
|--------|-------|-----|--------------|------------|-------------|
| **Hugging Face Spaces** | Gratis | ✅ Sí (T4) | ✅ Permanente | ⭐⭐ Fácil | ✅ **SÍ** |
| **Google Colab + ngrok** | Gratis | ✅ Sí (T4/V100) | ❌ Temporal | ⭐⭐⭐ Media | ⚠️ Para testing |
| **Render.com** | Gratis | ❌ Solo CPU | ✅ Permanente | ⭐ Muy fácil | ⚠️ Alternativa |

---

## 🎯 Opción 1: Hugging Face Spaces (RECOMENDADO)

### ¿Por qué Hugging Face?
- ✅ **100% gratuito** con GPU T4
- ✅ Deployment permanente 24/7
- ✅ URLs públicas estables
- ✅ Logs en tiempo real
- ✅ No requiere tarjeta de crédito
- ✅ Fácil actualización del modelo

### Paso a Paso

#### 1. Crear Cuenta
```
1. Ve a https://huggingface.co/
2. Clic en "Sign Up"
3. Verifica tu email
4. ¡Listo! No se requiere pago
```

#### 2. Crear un Space
```
1. Click en tu perfil → "Spaces" → "Create new Space"
2. Configuración:
   - Name: saccharumvision-api
   - License: MIT
   - SDK: Docker
   - Hardware: CPU basic (gratis) o GPU T4 small (también gratis!)
   - Visibility: Public (recomendado) o Private
3. Clic en "Create Space"
```

#### 3. Subir Archivos

Estructura de archivos necesaria:
```
your-space/
├── app.py                    ← Código de la API (ya creado)
├── requirements.txt          ← Dependencias (ya creado)
├── Dockerfile               ← Configuración Docker (ya creado)
├── model.keras              ← TU MODELO ORIGINAL ⚠️
└── README.md                ← Documentación (opcional)
```

**IMPORTANTE**: Debes copiar los archivos de la carpeta `server/` a tu Space.

##### Opción A: Subir por Web (Fácil)
```
1. En tu Space, clic en "Files" → "Add file" → "Upload files"
2. Arrastra estos archivos desde tu carpeta `server/`:
   - app.py
   - requirements.txt
   - Dockerfile
3. IMPORTANTE: Sube también tu archivo model.keras original
4. Clic en "Commit changes to main"
```

##### Opción B: Git (Avanzado)
```powershell
# Clona tu space
git clone https://huggingface.co/spaces/TU-USUARIO/saccharumvision-api
cd saccharumvision-api

# Copia archivos
copy ..\server\app.py .
copy ..\server\requirements.txt .
copy ..\server\Dockerfile .
copy ..\ruta\a\tu\modelo\model.keras .

# Sube a HF
git add .
git commit -m "Initial API deployment"
git push
```

#### 4. Configurar Modelo

Edita `app.py` si es necesario:

```python
# Ajusta según tu modelo:

# 1. Tamaño de imagen
IMG_SIZE = 224  # Cambia si tu modelo usa otro tamaño

# 2. Clases
CLASS_NAMES = {
    0: "Healthy",
    1: "Mosaic",
    2: "RedRot",
    3: "Rust",
    4: "Yellow"
}

# 3. Preprocesamiento (CRÍTICO)
def preprocess_image(image_bytes: bytes) -> np.ndarray:
    # Opción A: Sin normalización (0-255)
    img_array = img_array
    
    # Opción B: Normalización 0-1 (más común)
    img_array = img_array.astype(np.float32) / 255.0
    
    # Opción C: ImageNet normalization
    img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
```

#### 5. Build y Deploy

Hugging Face construirá automáticamente:
```
1. Ve a tu Space
2. Verás "Building" en la esquina superior
3. Espera 5-10 minutos
4. Si hay errores, los verás en "Logs"
5. Cuando veas "Running", ¡está listo! ✅
```

#### 6. Obtener tu URL

Tu API estará en:
```
https://TU-USUARIO-saccharumvision-api.hf.space
```

Ejemplo:
```
https://alexisjr2004-saccharumvision-api.hf.space
```

#### 7. Probar API

```powershell
# Health check
curl https://TU-USUARIO-saccharumvision-api.hf.space/health

# Predicción (con una imagen)
curl -X POST https://TU-USUARIO-saccharumvision-api.hf.space/predict `
  -F "file=@corn_leaf.jpg"
```

---

## 🧪 Opción 2: Google Colab + ngrok

### ⚠️ Nota: Es temporal, se desconecta al cerrar sesión

### Ventajas
- ✅ GPU muy potente (T4, V100)
- ✅ Completamente gratis
- ✅ Setup rápido

### Desventajas
- ❌ Solo funciona mientras Colab está abierto
- ❌ Se desconecta después de inactividad
- ❌ URL cambia cada vez

### Paso a Paso

#### 1. Crear Notebook en Colab
```
1. Ve a https://colab.research.google.com/
2. File → New notebook
3. Runtime → Change runtime type → GPU (T4)
```

#### 2. Instalar Dependencias
```python
!pip install fastapi uvicorn python-multipart tensorflow pillow pyngrok
```

#### 3. Subir tu Modelo
```python
from google.colab import files

# Subir model.keras
uploaded = files.upload()
# Selecciona tu archivo model.keras
```

#### 4. Crear API
```python
# Copia el código de server/app.py aquí
# (mismo código que para Hugging Face)
```

#### 5. Configurar ngrok
```python
from pyngrok import ngrok

# Obtén tu token gratis en: https://dashboard.ngrok.com/signup
ngrok.set_auth_token("TU_TOKEN_AQUI")

# Crear túnel
public_url = ngrok.connect(7860)
print(f"🌐 API pública en: {public_url}")
```

#### 6. Ejecutar Server
```python
import uvicorn
import nest_asyncio

nest_asyncio.apply()

# Ejecutar en background
uvicorn.run(app, host="0.0.0.0", port=7860)
```

#### 7. Usar URL en tu App
```
La URL será algo como:
https://abc123def456.ngrok.io

⚠️ Esta URL cambia cada vez que ejecutas
```

---

## 🔧 Opción 3: Render.com

### Ventajas
- ✅ Gratis permanente (plan free)
- ✅ Deployment automático desde GitHub
- ✅ SSL gratis

### Desventajas
- ❌ Solo CPU (sin GPU)
- ❌ Predicciones lentas (~2-5 segundos)
- ❌ Se "duerme" después de 15 min inactivo

### Paso a Paso

#### 1. Preparar Repositorio

Crea estructura en GitHub:
```
saccharumvision-api/
├── app.py
├── requirements.txt
├── model.keras          ← Sube con Git LFS
└── README.md
```

**Git LFS para modelo grande**:
```bash
git lfs install
git lfs track "*.keras"
git add .gitattributes
git add .
git commit -m "Add model"
git push
```

#### 2. Deploy en Render
```
1. Ve a https://render.com/
2. Sign up (gratis)
3. New → Web Service
4. Connect tu repo de GitHub
5. Configuración:
   - Name: saccharumvision-api
   - Environment: Python 3
   - Build Command: pip install -r requirements.txt
   - Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
   - Plan: Free
6. Create Web Service
```

#### 3. Variables de Entorno (opcional)
```
PORT=10000 (automático)
PYTHON_VERSION=3.10
```

#### 4. URL
```
Tu API estará en:
https://saccharumvision-api.onrender.com
```

**⚠️ Nota sobre "sleeping"**:
- Después de 15 min sin requests, se "duerme"
- Primer request tarda ~30-60 segundos en "despertar"
- Requests subsecuentes son normales

---

## 📱 Configuración de la App Móvil

### 1. Configurar URL de API

Edita `services/apiService.ts`:
```typescript
// Actualiza con tu URL real de Hugging Face
private API_URL = 'https://TU-USUARIO-saccharumvision-api.hf.space';
```

O configura dinámicamente desde settings:
```typescript
// En tu pantalla de settings
import modelService from '../services/modelService';

// Permitir que usuario configure URL
modelService.setAPIUrl('https://tu-api.hf.space');
```

### 2. Configurar Modo de Modelo

```typescript
// En app/_layout.tsx o donde inicialices
import modelService from './services/modelService';

// Opción 1: Solo API remota (recomendado)
modelService.setModelType('remote');

// Opción 2: Solo local
modelService.setModelType('local');

// Opción 3: Auto (intenta remoto, fallback a local)
modelService.setModelType('auto');
```

### 3. Usar en tu App

No necesitas cambiar nada más, el código ya está preparado:

```typescript
// En camera.tsx o donde hagas predicción
import modelService from '../services/modelService';

const result = await modelService.predict(imageUri, false);

console.log('Top prediction:', result.topPrediction.className);
console.log('Confidence:', result.topPrediction.confidence);
console.log('Model used:', result.modelType); // Verás si usó API o local
```

---

## 🧪 Testing y Debugging

### Test desde Terminal

```powershell
# Health check
curl https://tu-api.hf.space/health

# Predict con imagen
curl -X POST https://tu-api.hf.space/predict `
  -F "file=@test_image.jpg" `
  | jq  # Formatea JSON
```

### Test desde App

Agrega botón de test en settings:

```typescript
const testAPI = async () => {
  const result = await apiService.testConnection();
  
  Alert.alert('Test de API', `
    Alcanzable: ${result.reachable ? '✅' : '❌'}
    Latencia: ${result.latency}ms
    Modelo cargado: ${result.modelLoaded ? '✅' : '❌'}
    ${result.error ? `Error: ${result.error}` : ''}
  `);
};
```

### Ver Logs

**Hugging Face**:
```
1. Ve a tu Space
2. Click en "Logs" (esquina superior derecha)
3. Verás todos los requests en tiempo real
```

**Colab**:
```
Los logs aparecen directamente en el notebook
```

**Render**:
```
1. Dashboard → tu servicio
2. "Logs" tab
3. Ver en tiempo real
```

---

## 🐛 Troubleshooting

### Problema: "Modelo no carga"

**Solución**:
```python
# En app.py, agrega debug:
def load_model():
    import os
    print("Archivos en directorio:", os.listdir("."))
    
    if not os.path.exists("model.keras"):
        print("❌ model.keras no encontrado!")
        return False
    
    print("✅ model.keras encontrado")
    model = tf.keras.models.load_model("model.keras")
    # ...
```

### Problema: "Predicciones incorrectas"

**Causas comunes**:
1. **Preprocesamiento incorrecto**
   ```python
   # Prueba diferentes normalizaciones:
   img_array = img_array / 255.0  # 0-1
   # O
   img_array = img_array  # 0-255
   ```

2. **Orden de clases incorrecto**
   ```python
   # Verifica que coincide con tu modelo
   CLASS_NAMES = {0: "Healthy", 1: "Mosaic", ...}
   ```

3. **Tamaño de imagen**
   ```python
   IMG_SIZE = 224  # Verifica tu modelo
   ```

### Problema: "Request timeout"

**Solución**: Aumenta timeout en app:
```typescript
// En apiService.ts
private TIMEOUT = 60000; // 60 segundos
```

### Problema: "CORS error"

Ya está solucionado en app.py, pero si persiste:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Problema: "Out of memory" en GPU

**Solución**:
```python
# Limitar memoria de TensorFlow
import tensorflow as tf

gpus = tf.config.list_physical_devices('GPU')
if gpus:
    tf.config.set_logical_device_configuration(
        gpus[0],
        [tf.config.LogicalDeviceConfiguration(memory_limit=4096)]
    )
```

---

## 📊 Monitoreo de Uso

### Hugging Face
```
1. Space → Settings → Usage
2. Ver requests/día, uso de CPU/GPU
3. Límite: Ilimitado en plan gratuito
```

### Tips de Optimización
1. **Cache de predicciones**: Guarda resultados recientes
2. **Batch processing**: Agrupa múltiples imágenes
3. **Compresión de imágenes**: Reduce tamaño antes de enviar
4. **Lazy loading**: Solo carga modelo cuando se necesita

---

## 🎯 Recomendación Final

Para producción → **Hugging Face Spaces**:
- Permanente 24/7
- GPU gratis
- URLs estables
- Fácil actualización

Para testing rápido → **Google Colab**:
- Setup en 5 minutos
- GPU potente
- Bueno para experimentar

Para backup → **Render**:
- Alternativa si HF falla
- Solo CPU pero funcional

---

## 📞 Recursos Adicionales

- [Docs Hugging Face Spaces](https://huggingface.co/docs/hub/spaces)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [TensorFlow Serving](https://www.tensorflow.org/tfx/guide/serving)
- [ngrok Docs](https://ngrok.com/docs)
- [Render Docs](https://render.com/docs)

---

¡Éxito con tu deployment! 🚀🌾
