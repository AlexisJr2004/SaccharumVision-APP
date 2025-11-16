# 🌽 SaccharumVision - Detección de Enfermedades en Maíz

App móvil para detectar enfermedades en hojas de maíz usando IA (modelo remoto en la nube).

## 🚀 Instalación rápida

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU-USUARIO/SaccharumVision-APP.git
   cd SaccharumVision-APP/mobile
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia en modo desarrollo:
   ```bash
   npm start
   ```
   Escanea el QR con Expo Go en tu teléfono.

## 📦 Build y actualización

- Compila APK: `eas build --platform android --profile preview`
- Publica actualización OTA: `eas update --branch preview --message "Descripción"`

## 📁 Estructura principal

```
mobile/
├── app/            # Pantallas y navegación
├── components/     # Componentes reutilizables
├── services/       # Lógica de negocio y API
├── assets/         # Imágenes y clases
├── scripts/        # Scripts de utilidad
├── app.json        # Configuración Expo
├── package.json    # Dependencias
└── tsconfig.json   # TypeScript
```

## � Predicción con modelo remoto

La app envía la imagen al servidor Hugging Face Spaces vía API REST:
```typescript
const API_URL = "https://your-username-saccharumvision-api.hf.space";
```
No se usa modelo local ni TFLite.

## ✨ Funcionalidades

- 📸 Captura y análisis de imágenes
- 🔒 Autenticación biométrica
- 📊 Historial de análisis
- 🔔 Notificaciones
- 🎨 Tema claro/oscuro

## 🐛 Problemas comunes

- Si `npm install` falla: `npm cache clean --force && npm install`
- Si Expo no inicia: `npx expo start --clear`

## 📄 Licencia y soporte

Proyecto privado. Para soporte, contacta al equipo de desarrollo.

---
**Desarrollado con ❤️ para mejorar la agricultura**
