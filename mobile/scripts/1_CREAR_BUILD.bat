@echo off
echo ========================================
echo    CREAR BUILD INICIAL (SOLO UNA VEZ)
echo ========================================
echo.
echo Ejecutando: eas build --platform android --profile preview
echo.
echo Esto tardara 15-20 minutos...
echo Al terminar, descarga e instala el APK en tu celular
echo.
pause
eas build --platform android --profile preview
