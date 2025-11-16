# 🚀 INICIO RÁPIDO - SaccharumVision API

## ⚡ 3 Pasos para Deployar

### 1️⃣ Crear Space en Hugging Face (5 min)
```
1. Ve a https://huggingface.co/ → Sign up (gratis)
2. Perfil → Spaces → Create new Space
3. Configuración:
   - Name: saccharumvision-api
   - SDK: Docker
   - Hardware: CPU basic (gratis) o GPU T4 (también gratis!)
```

### 2️⃣ Subir Archivos (3 min)
```
Arrastra estos archivos a tu Space:
✅ server/app.py
✅ server/requirements.txt
✅ server/Dockerfile
✅ TU_MODELO.keras (el archivo original que predice bien)

Renombra tu modelo a: model.keras
```

### 3️⃣ Configurar App (2 min)
```
Edita: mobile/services/apiService.ts
Línea 19: private API_URL = 'https://TU-USUARIO-saccharumvision-api.hf.space';

Edita: mobile/app/_layout.tsx
Agrega en useEffect:
  modelService.setAPIUrl('https://TU-USUARIO-saccharumvision-api.hf.space');
  modelService.setModelType('remote');
  await modelService.loadModel();
```

## ✅ ¡Listo!

Espera 5-10 min mientras Hugging Face construye el contenedor.

Tu API estará en: `https://TU-USUARIO-saccharumvision-api.hf.space`

## 🧪 Probar

```powershell
# Health check
curl https://TU-USUARIO-saccharumvision-api.hf.space/health

# Ver docs interactivas
# Abre en navegador: https://TU-USUARIO-saccharumvision-api.hf.space/docs
```

## 📚 Documentación Completa

- **DEPLOYMENT_GUIDE.md** - Guía completa paso a paso
- **LOCAL_TESTING.md** - Cómo probar localmente antes de deployar
- **CONFIGURATION.md** - Configuración avanzada de la app

## 💰 Costo

✅ **$0** - 100% Gratuito con Hugging Face Spaces

## 🆘 Ayuda

### Modelo no carga
```
Verifica que el archivo se llama exactamente: model.keras
```

### Predicciones incorrectas
```
Edita server/app.py:
- Ajusta IMG_SIZE (línea 29)
- Ajusta preprocesamiento (línea 70-80)
- Verifica CLASS_NAMES (línea 31-37)
```

### App no conecta
```
Verifica la URL en apiService.ts
Asegúrate de usar https:// (NO http://)
```

## 📞 Más Información

Lee `DEPLOYMENT_GUIDE.md` para todas las opciones y troubleshooting.

---

**Tiempo total: ~10 minutos** ⏱️

¡Éxito! 🚀🌾
