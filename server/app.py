"""
API FastAPI para predicción de enfermedades del maíz
Despliega en Hugging Face Spaces gratuitamente
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SaccharumVision API",
    description="API de predicción de enfermedades del maíz",
    version="1.0.0"
)

# Habilitar CORS para permitir requests desde la app móvil
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variables globales
model = None
classes = None
IMG_SIZE = 224

# Mapeo de clases - ResNet50 Model
# Orden: ["Healthy", "Mosaic", "RedRot", "Rust", "Yellow"]
CLASS_NAMES = {
    0: "Healthy",
    1: "Mosaic",
    2: "RedRot",
    3: "Rust",
    4: "Yellow"
}

def load_model():
    """Carga el modelo .keras"""
    global model, classes
    try:
        # Carga tu modelo .keras aquí
        # Asegúrate de subir el archivo a Hugging Face Spaces
        model = tf.keras.models.load_model("model.keras")
        classes = CLASS_NAMES
        logger.info("✅ Modelo cargado exitosamente")
        logger.info(f"Input shape: {model.input_shape}")
        logger.info(f"Output shape: {model.output_shape}")
        return True
    except Exception as e:
        logger.error(f"❌ Error cargando modelo: {e}")
        return False

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Preprocesa la imagen para ResNet50
    CRÍTICO: Usa la normalización correcta de ImageNet para ResNet50
    """
    try:
        # Cargar imagen
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convertir a RGB si es necesario
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        logger.info(f"📸 Imagen original: {image.size} modo: {image.mode}")
        
        # Redimensionar a 224x224
        image = image.resize((IMG_SIZE, IMG_SIZE), Image.Resampling.LANCZOS)
        
        # Convertir a array numpy
        img_array = np.array(image, dtype=np.float32)
        
        # CRÍTICO: Usar preprocesamiento de ResNet50 de Keras
        # Esto aplica la normalización correcta de ImageNet:
        # 1. Convierte RGB a BGR
        # 2. Resta la media de ImageNet de cada canal
        img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
        
        # Añadir dimensión de batch
        img_array = np.expand_dims(img_array, axis=0)
        
        logger.info(f"🔄 Imagen procesada: shape={img_array.shape}, dtype={img_array.dtype}")
        logger.info(f"📊 Rango de valores: [{img_array.min():.2f}, {img_array.max():.2f}]")
        
        return img_array
    except Exception as e:
        logger.error(f"❌ Error en preprocesamiento: {e}")
        raise

@app.on_event("startup")
async def startup_event():
    """Carga el modelo al iniciar"""
    logger.info("🚀 Iniciando servidor...")
    success = load_model()
    if not success:
        logger.warning("⚠️ Modelo no cargado, servidor iniciará en modo simulado")

@app.get("/")
async def root():
    """Endpoint de prueba"""
    return {
        "status": "online",
        "message": "SaccharumVision API",
        "model_loaded": model is not None,
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "classes": list(classes.values()) if classes else []
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...), use_tta: bool = False):
    """
    Endpoint principal de predicción
    
    Args:
        file: Imagen en formato JPG, PNG, etc.
        use_tta: Si True, aplica Test Time Augmentation para mayor precisión
    
    Returns:
        JSON con predicciones y confianzas
    """
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Modelo no disponible"
        )
    
    try:
        # Leer imagen
        image_bytes = await file.read()
        logger.info(f"📸 Imagen recibida: {file.filename}, {len(image_bytes)} bytes")
        logger.info(f"🔧 TTA: {'Activado ⚡' if use_tta else 'Desactivado'}")
        
        # Preprocesar
        processed_image = preprocess_image(image_bytes)
        logger.info(f"🔄 Imagen procesada: shape {processed_image.shape}")
        
        if use_tta:
            # Test Time Augmentation: predecir con versiones aumentadas
            logger.info("⚡ Aplicando TTA...")
            augmented_predictions = []
            
            # Predicción original
            pred_original = model.predict(processed_image, verbose=0)[0]
            augmented_predictions.append(pred_original)
            
            # Flip horizontal
            img_flipped = np.flip(processed_image, axis=2)
            pred_flipped = model.predict(img_flipped, verbose=0)[0]
            augmented_predictions.append(pred_flipped)
            
            # Pequeña rotación (+5 grados)
            image_pil = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            img_rotated = image_pil.rotate(5)
            img_rotated_bytes = io.BytesIO()
            img_rotated.save(img_rotated_bytes, format='JPEG')
            processed_rotated = preprocess_image(img_rotated_bytes.getvalue())
            pred_rotated = model.predict(processed_rotated, verbose=0)[0]
            augmented_predictions.append(pred_rotated)
            
            # Pequeña rotación (-5 grados)
            img_rotated2 = image_pil.rotate(-5)
            img_rotated2_bytes = io.BytesIO()
            img_rotated2.save(img_rotated2_bytes, format='JPEG')
            processed_rotated2 = preprocess_image(img_rotated2_bytes.getvalue())
            pred_rotated2 = model.predict(processed_rotated2, verbose=0)[0]
            augmented_predictions.append(pred_rotated2)
            
            # Promediar todas las predicciones
            predictions = np.mean(augmented_predictions, axis=0)
            logger.info(f"⚡ TTA completado: {len(augmented_predictions)} augmentaciones")
        else:
            # Predicción normal sin TTA
            predictions = model.predict(processed_image, verbose=0)
            predictions = predictions[0]  # Remover batch dimension
        
        logger.info(f"📊 Predicciones raw: {predictions}")
        
        # Crear respuesta
        results = []
        for class_idx, confidence in enumerate(predictions):
            results.append({
                "className": classes[class_idx],
                "classIndex": int(class_idx),
                "confidence": float(confidence)
            })
        
        # Ordenar por confianza
        results.sort(key=lambda x: x["confidence"], reverse=True)
        
        logger.info(f"✅ Top prediction: {results[0]['className']} ({results[0]['confidence']:.2%})")
        top3_str = ", ".join([f"{r['className']}: {r['confidence']:.2%}" for r in results[:3]])
        logger.info(f"📋 Top 3: {top3_str}")
        
        return {
            "success": True,
            "predictions": results,
            "topPrediction": results[0],
            "usedTTA": use_tta,
            "modelInfo": {
                "version": "1.0.0",
                "inputSize": IMG_SIZE
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Error en predicción: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error procesando imagen: {str(e)}"
        )

@app.post("/predict-batch")
async def predict_batch(files: list[UploadFile] = File(...)):
    """
    Predicción por lotes (múltiples imágenes)
    Útil para Test Time Augmentation (TTA)
    """
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Modelo no disponible"
        )
    
    try:
        all_predictions = []
        
        for file in files:
            image_bytes = await file.read()
            processed_image = preprocess_image(image_bytes)
            predictions = model.predict(processed_image, verbose=0)[0]
            all_predictions.append(predictions)
        
        # Promediar predicciones (TTA)
        avg_predictions = np.mean(all_predictions, axis=0)
        
        # Crear respuesta
        results = []
        for class_idx, confidence in enumerate(avg_predictions):
            results.append({
                "className": classes[class_idx],
                "classIndex": int(class_idx),
                "confidence": float(confidence)
            })
        
        results.sort(key=lambda x: x["confidence"], reverse=True)
        
        return {
            "success": True,
            "predictions": results,
            "topPrediction": results[0],
            "numImages": len(files),
            "usedTTA": True
        }
        
    except Exception as e:
        logger.error(f"❌ Error en batch prediction: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error procesando imágenes: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)  # Puerto 7860 es estándar en HF Spaces
