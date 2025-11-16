// contexts/ThemeContext.tsx - Context para tema oscuro/claro
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    border: string;
    card: string;
    success: string;
    warning: string;
    error: string;
    accent: string;
    highlight: string;
    buttonBackground: string;
    buttonText: string;
    iconColor: string;
    shadowColor: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Cargar tema en background sin bloquear
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error cargando tema:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('app_theme', newTheme);
    } catch (error) {
      console.error('Error guardando tema:', error);
    }
  };

  const colors = theme === 'light' 
    ? {
        // Modo Claro - Colores mejorados
        background: '#F8F9FA',
        surface: '#FFFFFF',
        text: '#1a1a1a',
        textSecondary: '#666',
        primary: '#2E7D32',
        border: '#e0e0e0',
        card: '#FFFFFF',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        accent: '#81C784',
        highlight: '#E8F5E9',
        buttonBackground: '#2E7D32',
        buttonText: '#FFFFFF',
        iconColor: '#2E7D32',
        shadowColor: '#000000',
      }
    : {
        // Modo Oscuro - Diseño elegante y moderno
        background: '#0D1117', // Negro suave GitHub
        surface: '#161B22',     // Gris oscuro principal
        text: '#F0F6FC',        // Blanco suave
        textSecondary: '#7D8590', // Gris medio
        primary: '#58A6FF',     // Azul GitHub
        border: '#30363D',      // Borde sutil
        card: '#21262D',        // Tarjetas destacadas
        success: '#3FB950',     // Verde éxito
        warning: '#D29922',     // Amarillo advertencia  
        error: '#F85149',       // Rojo error
        accent: '#A5A5F6',      // Púrpura acento
        highlight: '#1C2128',   // Resaltado sutil
        buttonBackground: '#238636', // Verde botón
        buttonText: '#F0F6FC',  // Texto botón blanco
        iconColor: '#58A6FF',   // Azul iconos
        shadowColor: '#010409', // Sombra profunda
      };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};
