@echo off
echo ========================================
echo   AgroScan - Iniciando Expo
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Verificando dependencias...
if not exist "node_modules\" (
    echo Instalando dependencias...
    call npm install
)

echo.
echo [2/2] Iniciando Expo...
echo.
echo Opciones:
echo - Presiona 'a' para Android
echo - Presiona 'i' para iOS  
echo - Escanea el QR con Expo Go
echo.

call npx expo start

pause
