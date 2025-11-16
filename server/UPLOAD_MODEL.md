# 📤 Guía: Subir tu Modelo ResNet50 a Hugging Face

## 📂 Tu Modelo

**Ubicación**: `c:\Users\duran\OneDrive\Escritorio\SaccharumVision_app\models\ResNet50\ResNet50_latest.keras`

**Clases**: Healthy, Mosaic, RedRot, Rust, Yellow

---

## 🚀 OPCIÓN 1: Subir por Interfaz Web (MÁS FÁCIL) ⭐

### Paso 1: Crear tu Space

1. Ve a https://huggingface.co/
2. Inicia sesión (o crea cuenta gratis)
3. Click en tu perfil → **"Spaces"** → **"Create new Space"**

### Paso 2: Configurar Space

```
Name: saccharumvision-api
License: MIT
SDK: Docker ← IMPORTANTE
Hardware: CPU basic (gratis) o GPU T4 small (gratis)
Visibility: Public (recomendado)
```

Click **"Create Space"**

### Paso 3: Subir Archivos

En tu nuevo Space, verás "Files and versions" → **"Add file"** → **"Upload files"**

**Arrastra estos archivos** (en este orden):

#### A. Archivos del servidor
```
1. server/app.py
2. server/requirements.txt  
3. server/Dockerfile
```

#### B. Tu modelo ⚠️ IMPORTANTE
```
4. models/ResNet50/ResNet50_latest.keras
```

**⚠️ CRÍTICO**: Después de subir, **RENOMBRA** el archivo a:
```
ResNet50_latest.keras → model.keras
```

Así:
- Click en el archivo
- Click en "⋮" (3 puntos)
- "Rename"
- Cambiar a: `model.keras`

### Paso 4: Commit

Click **"Commit changes to main"**

### Paso 5: Esperar Build

- Verás "Building" en la parte superior
- Tarda 5-10 minutos
- Puedes ver progreso en "Logs"

### Paso 6: ¡Listo!

Cuando veas **"Running"**, tu API está lista en:
```
https://TU-USUARIO-saccharumvision-api.hf.space
```

---

## 🔧 OPCIÓN 2: Subir con Git (RECOMENDADO para archivos grandes)

### ¿Por qué Git?
- ✅ Maneja archivos grandes mejor
- ✅ Más confiable para modelos >100MB
- ✅ Control de versiones

### Paso 1: Instalar Git LFS

```powershell
# Si no tienes Git instalado
winget install Git.Git

# Instalar Git LFS (Large File Storage)
# Descarga desde: https://git-lfs.github.com/
# O con Chocolatey:
choco install git-lfs

# Inicializar LFS
git lfs install
```

### Paso 2: Crear Space (igual que Opción 1)

1. Crea tu Space en HuggingFace.co
2. Selecciona Docker SDK
3. Click "Create Space"

### Paso 3: Clonar tu Space

```powershell
# Navegar a una carpeta temporal
cd $env:TEMP

# Clonar (reemplaza TU-USUARIO)
git clone https://huggingface.co/spaces/TU-USUARIO/saccharumvision-api
cd saccharumvision-api
```

### Paso 4: Configurar Git LFS para modelos

```powershell
# Decirle a Git que .keras son archivos grandes
git lfs track "*.keras"
git add .gitattributes
```

### Paso 5: Copiar archivos

```powershell
# Copiar archivos del servidor
copy "C:\Users\duran\OneDrive\Escritorio\SaccharumVision_app\server\app.py" .
copy "C:\Users\duran\OneDrive\Escritorio\SaccharumVision_app\server\requirements.txt" .
copy "C:\Users\duran\OneDrive\Escritorio\SaccharumVision_app\server\Dockerfile" .

# Copiar modelo y RENOMBRAR
copy "C:\Users\duran\OneDrive\Escritorio\SaccharumVision_app\models\ResNet50\ResNet50_latest.keras" model.keras
```

### Paso 6: Commit y Push

```powershell
# Agregar archivos
git add .

# Commit
git commit -m "Initial deployment with ResNet50 model"

# Push (va a tardar por el modelo grande)
git push
```

**⏳ Nota**: El push puede tardar varios minutos dependiendo del tamaño del modelo.

### Paso 7: Verificar en Hugging Face

1. Ve a tu Space en HuggingFace
2. Verás los archivos subidos
3. Build se iniciará automáticamente
4. Espera a que muestre "Running"

---

## 💻 OPCIÓN 3: Hugging Face CLI (AVANZADO)

### Paso 1: Instalar CLI

```powershell
pip install huggingface_hub
```

### Paso 2: Login

```powershell
huggingface-cli login
```

Te pedirá un **token**:
1. Ve a https://huggingface.co/settings/tokens
2. Click "New token"
3. Name: "saccharumvision-deploy"
4. Type: Write
5. Copy el token
6. Pégalo en la terminal

### Paso 3: Crear estructura temporal

```powershell
# Crear carpeta temporal
mkdir $env:TEMP\saccharum-deploy
cd $env:TEMP\saccharum-deploy

# Copiar archivos
copy "C:\Users\duran\OneDrive\Escritorio\SaccharumVision_app\server\*" .
copy "C:\Users\duran\OneDrive\Escritorio\SaccharumVision_app\models\ResNet50\ResNet50_latest.keras" model.keras
```

### Paso 4: Subir con CLI

```powershell
# Crear y subir Space
huggingface-cli upload TU-USUARIO/saccharumvision-api . --repo-type=space
```

---

## ✅ Verificar que Subió Correctamente

### Checklist de Archivos en HF

Tu Space debe tener estos archivos:

```
saccharumvision-api/
├── app.py                 ✅
├── requirements.txt       ✅
├── Dockerfile            ✅
├── model.keras           ✅ (este es tu ResNet50_latest.keras renombrado)
└── README.md             (opcional)
```

### Verificar Tamaño del Modelo

1. En tu Space, click en `model.keras`
2. Verifica que el tamaño sea correcto (debería ser >50MB típicamente)
3. Si es muy pequeño (KB), no subió bien

### Ver Logs de Build

1. En tu Space, click en "Logs" (arriba a la derecha)
2. Busca esta línea:
   ```
   ✅ Modelo cargado exitosamente
   Input shape: (None, 224, 224, 3)
   Output shape: (None, 5)
   ```
3. Si ves esto, ¡el modelo cargó bien! 🎉

---

## 🐛 Troubleshooting

### Problema: "Archivo muy grande"

Si el modelo es >5GB:

**Solución**: Usa Git LFS (Opción 2)

### Problema: "Upload failed"

**Solución 1**: Intenta de nuevo (a veces falla por conexión)

**Solución 2**: Usa Git LFS (Opción 2)

**Solución 3**: 
```powershell
# Comprime el modelo temporalmente
# (NO afecta la precisión)
python -c "
import tensorflow as tf
model = tf.keras.models.load_model('models/ResNet50/ResNet50_latest.keras')
model.save('model_compressed.keras', save_format='keras')
"
```

### Problema: "Model not found" en logs

**Causa**: El archivo no se llama `model.keras`

**Solución**: Renombra el archivo exactamente a `model.keras` (todo minúsculas)

### Problema: "Out of memory" al cargar

**Causa**: Modelo muy grande para CPU basic

**Solución**: Cambia hardware a GPU T4:
1. Space → Settings
2. Hardware → GPU T4 small
3. Save

### Problema: "Shape mismatch"

**Causa**: Clases en app.py no coinciden

**Solución**: Ya está configurado correctamente (5 clases), pero si falla:

```python
# En app.py, verifica línea 31-37
CLASS_NAMES = {
    0: "Healthy",
    1: "Mosaic", 
    2: "RedRot",
    3: "Rust",
    4: "Yellow"
}
```

---

## 📊 Verificar Predicciones

Una vez deployed, prueba con curl:

```powershell
# Health check
curl https://TU-USUARIO-saccharumvision-api.hf.space/health

# Predict con una imagen de prueba
curl -X POST https://TU-USUARIO-saccharumvision-api.hf.space/predict `
  -F "file=@test_corn.jpg"
```

Deberías ver algo como:
```json
{
  "success": true,
  "topPrediction": {
    "className": "Healthy",
    "confidence": 0.89
  }
}
```

---

## 🎯 Recomendación

Para tu caso (modelo ResNet50 de ~100-300MB):

**→ Usa OPCIÓN 2 (Git LFS)** ✅

Es más confiable y maneja bien archivos grandes.

---

## 📞 Próximos Pasos

1. ✅ Sube el modelo con una de las opciones
2. ✅ Espera build (5-10 min)
3. ✅ Verifica logs
4. ✅ Prueba con curl
5. ✅ Configura app móvil (ver `../mobile/CONFIGURATION.md`)

---

¿Necesitas ayuda con algún paso específico? 🚀
