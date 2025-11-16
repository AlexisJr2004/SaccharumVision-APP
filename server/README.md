
# 🌾 SaccharumVision - API Server

API REST para predicción de enfermedades del maíz usando Deep Learning (modelo `.keras` en la nube, sin TTA ni inferencia local).

## 📁 Estructura actual del servidor

```
server/
├── app.py                # Código principal de la API (FastAPI)
├── requirements.txt      # Dependencias Python
├── Dockerfile            # Configuración para Hugging Face Spaces
├── README.md             # Este archivo
├── QUICKSTART.md         # Guía rápida de deployment
├── DEPLOYMENT_GUIDE.md   # Guía completa de deployment
├── UPLOAD_MODEL.md       # Instrucciones para subir el modelo
```

## 🚀 Deploy en Hugging Face Spaces

1. Crea una cuenta en [huggingface.co](https://huggingface.co/)
2. Crea un nuevo Space (SDK: Docker, Hardware: CPU basic o GPU T4 small)
3. Sube los archivos: `app.py`, `requirements.txt`, `Dockerfile`, `model.keras`, `README.md`
4. Espera a que se construya el contenedor (~5-10 min)
5. Tu API estará disponible en:
   ```
   https://your-username-saccharumvision-api.hf.space
   ```

## 🔗 Endpoints disponibles

### GET /health
Verifica el estado del servidor:
```bash
curl https://your-api.hf.space/health
```

### POST /predict
Envía una imagen para predicción:
```bash
curl -X POST https://your-api.hf.space/predict -F "file=@corn_leaf.jpg"
```

## 📱 Integración con la app móvil

En la app móvil, configura la URL de la API:
```typescript
const API_URL = "https://your-username-saccharumvision-api.hf.space";
```

La app solo usa el modelo remoto, no hay inferencia local ni TTA.

## 🔧 Configuración del modelo

En `app.py`, ajusta la función de preprocesamiento según tu modelo:
```python
# Ejemplo para ResNet50:
img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
```
Actualiza las clases en `CLASS_NAMES` si cambian:
```python
CLASS_NAMES = {
  0: "Healthy",
  1: "Mosaic",
  2: "RedRot",
  3: "Rust",
  4: "Yellow"
}
```

##  Troubleshooting

- Verifica que `model.keras` esté en la raíz
- Revisa los logs en Hugging Face si hay errores
- Si las predicciones no son correctas, revisa el preprocesamiento y el orden de las clases

## 📚 Documentación adicional

- **QUICKSTART.md**: Guía rápida para deploy
- **DEPLOYMENT_GUIDE.md**: Guía completa de deployment
- **UPLOAD_MODEL.md**: Cómo subir el modelo

## 📞 Soporte

- [Documentación Hugging Face](https://huggingface.co/docs/hub/spaces)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
