# 🌽 SaccharumVision - Detección de Enfermedades en Maíz

Aplicación móvil para detectar enfermedades en hojas de maíz usando inteligencia artificial con TensorFlow Lite.

## ✨ Características

- 🤖 **IA Integrada** - Modelo ResNet50 cuantizado (24.5 MB)
- 🎯 **5 Enfermedades Detectables** - Healthy, Mosaic, RedRot, Rust, Yellow
- 📸 **Cámara y Galería** - Captura o selecciona imágenes
- 🔒 **Autenticación Biométrica** - Protección con huella/Face ID
- 📊 **Historial de Análisis** - Guarda y revisa predicciones anteriores
- 🔔 **Notificaciones** - Alertas sobre el estado de tus cultivos
- 🎨 **Temas Claro/Oscuro** - Interfaz adaptable
- 🌐 **Sin conexión** - Funciona offline con modelo local

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** (incluido con Node.js)
- **Expo Go** (para pruebas en desarrollo)
- **Cuenta Expo** (para builds de producción)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/SaccharumVision-APP.git
cd SaccharumVision-APP/mobile
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando descargará e instalará todas las dependencias necesarias listadas en `package.json`:
- **expo** ~54.0.22 - Framework principal
- **react-native** 0.81.5 - Core de la app
- **expo-camera** ~17.0.8 - Acceso a la cámara
- **expo-image-picker** ~17.0.8 - Selector de imágenes
- **@react-native-async-storage/async-storage** - Almacenamiento local
- **expo-local-authentication** - Autenticación biométrica
- Y más... (ver `package.json` completo)

> **Nota**: Si `npm install` falla, intenta:
> ```bash
> npm cache clean --force
> npm install
> ```

### 3. Iniciar en modo desarrollo

Opción 1 - Usando npm:
```bash
npm start
```

Opción 2 - Usando script de Windows:
```bash
cd scripts
start.bat
```

Luego escanea el QR con **Expo Go** en tu teléfono.


## 📦 Compilar APK para Android

### Configuración inicial (solo primera vez)

```bash
# 1. Instalar EAS CLI globalmente
npm install -g eas-cli

# 2. Login a tu cuenta Expo
eas login

# 3. Configurar proyecto (si no está configurado)
eas build:configure
```

### Crear Build de Prueba (APK)

Opción 1 - Comando directo:
```bash
eas build --platform android --profile preview
```

Opción 2 - Script de Windows:
```bash
cd scripts
1_CREAR_BUILD.bat
```

El proceso toma 10-15 minutos. Al finalizar, recibirás un enlace para descargar el APK.

### Publicar Actualización OTA (sin rebuild)

Para actualizaciones menores que no requieren recompilar:

```bash
# Opción 1
eas update --branch preview --message "Descripción del cambio"

# Opción 2 - Script
cd scripts
2_PUBLICAR_UPDATE.bat
```

## 📁 Estructura del Proyecto

```
mobile/
├── app/                          # Pantallas (expo-router)
│   ├── (tabs)/                   # Navegación por tabs
│   │   ├── index.tsx            # 🏠 Inicio/Dashboard
│   │   ├── history.tsx          # 📋 Historial de análisis
│   │   ├── notifications.tsx    # 🔔 Notificaciones
│   │   └── settings.tsx         # ⚙️ Configuración
│   ├── camera.tsx               # 📸 Pantalla de cámara
│   ├── results.tsx              # 📊 Resultados del análisis
│   ├── history-detail.tsx       # 📄 Detalle de historial
│   ├── terms.tsx                # 📜 Términos y condiciones
│   └── _layout.tsx              # Layout principal
├── components/                   # Componentes reutilizables
│   ├── ActionButton.tsx         # Botones de acción
│   ├── CustomAlert.tsx          # Alertas personalizadas
│   ├── DiseaseCard.tsx          # Tarjeta de enfermedad
│   ├── LockScreen.tsx           # Pantalla de bloqueo biométrico
│   └── Themed.tsx               # Componentes con tema
├── services/                     # Servicios y lógica de negocio
│   ├── modelService.ts          # Carga y predicción del modelo TFLite
│   └── i18n.ts                  # Internacionalización
├── contexts/                     # Contextos de React
│   └── ThemeContext.tsx         # Tema claro/oscuro
├── constants/                    # Constantes
│   └── Colors.ts                # Paleta de colores
├── assets/                       # Recursos estáticos
│   ├── models/                  # Modelo de IA
│   │   ├── resnet50_model_quantized.tflite  # Modelo (24.5 MB)
│   │   └── classes_latest.json              # Clases y metadata
│   ├── images/                  # Imágenes de la app
│   └── fonts/                   # Fuentes personalizadas
├── scripts/                      # Scripts de utilidad
│   ├── 1_CREAR_BUILD.bat        # Crear build APK
│   ├── 2_PUBLICAR_UPDATE.bat    # Publicar OTA update
│   └── start.bat                # Iniciar servidor dev
├── app.json                      # Configuración de Expo
├── eas.json                      # Configuración de EAS Build
├── package.json                  # Dependencias del proyecto
└── tsconfig.json                 # Configuración TypeScript
```

## 🎯 Flujo de Uso de la App

1. **🔒 Autenticación** - Desbloquea con huella/Face ID (primera vez)
2. **🏠 Dashboard** - Ve estadísticas y estado general
3. **📸 Capturar** - Toma foto o selecciona de galería
4. **🤖 Análisis** - El modelo TFLite procesa la imagen
5. **📊 Resultados** - Diagnóstico, confianza y recomendaciones
6. **💾 Historial** - Guarda automáticamente para revisión posterior
7. **🔔 Notificaciones** - Recibe alertas sobre tus análisis


## 🔧 Tecnologías Principales

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Expo SDK** | ~54.0 | Framework y herramientas de desarrollo |
| **React Native** | 0.81.5 | Framework móvil multiplataforma |
| **React** | 19.1.0 | Biblioteca UI |
| **Expo Router** | ~6.0 | Navegación basada en archivos |
| **TypeScript** | ~5.9.2 | Tipado estático y mejor DX |
| **TensorFlow Lite** | - | Inferencia de modelos ML offline |
| **AsyncStorage** | ^2.2.0 | Almacenamiento local persistente |
| **Expo Camera** | ~17.0 | Acceso a cámara del dispositivo |
| **Reanimated** | ~4.1.1 | Animaciones nativas de alto rendimiento |

## 📱 Permisos Requeridos

La app solicitará los siguientes permisos:

- 📸 **Cámara** - Para capturar fotos de hojas de maíz
- 🖼️ **Galería/Almacenamiento** - Para seleccionar fotos existentes
- 🔒 **Biometría** - Para autenticación con huella/Face ID
- 📂 **Sistema de archivos** - Para guardar y compartir resultados

## 🐛 Solución de Problemas

### Error: "Cannot find module" o dependencias faltantes

```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Error de caché de Expo

```bash
npx expo start --clear
```

### Build de EAS falla

1. Verifica que `.easignore` esté presente
2. Asegúrate que `node_modules/` esté en `.gitignore`
3. Revisa que `eas.json` tenga los profiles correctos:
   ```json
   {
     "build": {
       "preview": {
         "android": {
           "buildType": "apk"
         }
       }
     }
   }
   ```

### La app no inicia en Expo Go

- Asegúrate de estar en la misma red WiFi
- Verifica que el firewall no bloquee el puerto 8081
- Intenta con `npm start -- --tunnel`

### Modelo TFLite no carga

- Verifica que los archivos existan en `assets/models/`:
  - `resnet50_model_quantized.tflite` (24.5 MB)
  - `classes_latest.json`
- Confirma que `app.json` tenga configurado `assetBundlePatterns`

## 📝 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| **Desarrollo** | `npm start` | Inicia servidor de desarrollo |
| **Android** | `npm run android` | Ejecuta en emulador Android |
| **iOS** | `npm run ios` | Ejecuta en simulador iOS (solo Mac) |
| **Web** | `npm run web` | Ejecuta versión web |
| **Lint** | `npm run lint` | Verifica código con ESLint |

## 🔐 Variables de Entorno

Si necesitas configurar variables de entorno, crea un archivo `.env` en la raíz:

```env
# No necesario por ahora - todo funciona offline
# API_URL=https://tu-api.com
```

## 🚀 Roadmap

- [ ] Integrar react-native-fast-tflite para predicciones reales
- [ ] Añadir más enfermedades al modelo
- [ ] Implementar sincronización con backend (opcional)
- [ ] Versión iOS
- [ ] Modo experto con métricas avanzadas

## 👨‍💻 Desarrollo

### Agregar una nueva pantalla

1. Crea archivo en `app/` o `app/(tabs)/`
2. Expo Router lo detectará automáticamente
3. Usa `router.push('/nombre-pantalla')` para navegar

### Modificar el modelo TFLite

1. Coloca nuevo modelo en `assets/models/`
2. Actualiza `classes_latest.json` con las nuevas clases
3. Modifica `services/modelService.ts` si cambió la arquitectura

## 📄 Licencia

Este proyecto es privado y está protegido por derechos de autor.

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Crea un fork del repositorio
2. Crea una rama con tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📞 Soporte

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para mejorar la agricultura**

Para más información sobre Expo: https://docs.expo.dev/
