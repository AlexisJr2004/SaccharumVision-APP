FROM python:3.10-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para TensorFlow y PIL
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY app.py .

# IMPORTANTE: Copia tu modelo .keras aquí
# Asegúrate de subirlo a tu repositorio de Hugging Face Space
COPY model.keras .

# Exponer puerto 7860 (estándar de Hugging Face Spaces)
EXPOSE 7860

# Variable de entorno para TensorFlow
ENV TF_CPP_MIN_LOG_LEVEL=2

# Comando para ejecutar la aplicación
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
