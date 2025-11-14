@echo off
echo ========================================
echo    PUBLICAR ACTUALIZACION OTA
echo ========================================
echo.
set /p mensaje="Describe tus cambios: "
echo.
echo Ejecutando: eas update --branch preview --message "%mensaje%"
echo.
echo Esto tardara 30 segundos...
echo.
eas update --branch preview --message "%mensaje%"
echo.
echo ========================================
echo    LISTO! Ahora en tu celular:
echo    1. Abre AgroScan
echo    2. Ve a Configuracion
echo    3. Buscar Actualizaciones
echo    4. Presiona Actualizar
echo ========================================
pause
