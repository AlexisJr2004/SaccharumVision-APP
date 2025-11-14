// app/terms.tsx - Modern Terms & Conditions Screen
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

export default function TermsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative Elements */}
      <View style={[styles.decorativeBlur, styles.decorativeTop]} />
      <View style={[styles.decorativeBlur, styles.decorativeBottom]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.backButton, { backgroundColor: colors.card }]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Términos y Condiciones
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View 
            style={[
              styles.contentCard,
              { 
                backgroundColor: colors.card + 'CC',
                borderColor: colors.border + '99',
                shadowColor: colors.shadowColor,
              }
            ]}
          >
            {/* Fecha */}
            <View style={[styles.dateSection, { borderBottomColor: colors.border }]}>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                Última actualización: Noviembre 2025
              </Text>
            </View>

            {/* Sección 1 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>1</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Aceptación de los Términos
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                Al descargar, instalar o utilizar AgroScan ("la Aplicación"), usted acepta estar sujeto a estos 
                Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, no utilice la Aplicación.
              </Text>
            </View>

            {/* Sección 2 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>2</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Descripción del Servicio
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                AgroScan es una aplicación móvil de detección de enfermedades en hojas de maíz mediante inteligencia 
                artificial. La aplicación utiliza tecnología de aprendizaje automático para analizar imágenes y 
                proporcionar diagnósticos preliminares.
              </Text>
            </View>

            {/* Sección 3 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>3</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Uso de la Aplicación
                </Text>
              </View>
              <View style={styles.subsectionContainer}>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>3.1 Propósito Informativo:</Text> Los diagnósticos proporcionados por AgroScan 
                  son exclusivamente informativos y no deben considerarse como asesoramiento profesional definitivo.
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>3.2 Funcionamiento Offline:</Text> La aplicación funciona completamente offline 
                  una vez instalada. No requiere conexión a internet para realizar análisis.
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>3.3 Precisión:</Text> Si bien el modelo de IA ha sido entrenado con alta 
                  precisión (~98%), los resultados pueden variar según la calidad de la imagen y las condiciones de captura.
                </Text>
              </View>
            </View>

            {/* Sección 4 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>4</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Privacidad y Datos
                </Text>
              </View>
              <View style={styles.subsectionContainer}>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>4.1 Datos Locales:</Text> Todas las imágenes y análisis se almacenan localmente 
                  en su dispositivo. No se envían datos a servidores externos.
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>4.2 Permisos:</Text> La aplicación requiere acceso a la cámara y galería 
                  únicamente para capturar y seleccionar imágenes de análisis.
                </Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>
                  <Text style={[styles.bold, { color: colors.text }]}>4.3 Biometría y PIN:</Text> Los datos de autenticación (PIN, huella dactilar) 
                  se almacenan de forma segura y cifrada en su dispositivo.
                </Text>
              </View>
            </View>

            {/* Sección 5 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>5</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Limitación de Responsabilidad
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                AgroScan y sus desarrolladores no se hacen responsables por:
              </Text>
              <View style={styles.listContainer}>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    Decisiones tomadas basadas en los diagnósticos de la aplicación
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    Pérdidas económicas derivadas del uso de la aplicación
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    Diagnósticos incorrectos o imprecisos
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    Problemas técnicos o mal funcionamiento del dispositivo
                  </Text>
                </View>
              </View>
            </View>

            {/* Sección 6 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>6</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Recomendaciones
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                Se recomienda encarecidamente:
              </Text>
              <View style={styles.listContainer}>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    Consultar con un agrónomo o especialista antes de tomar decisiones importantes
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    Utilizar la aplicación como herramienta complementaria, no sustitutiva
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    Tomar fotos de buena calidad con iluminación adecuada
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={[styles.listText, { color: colors.text }]}>
                    Mantener la aplicación actualizada a la última versión
                  </Text>
                </View>
              </View>
            </View>

            {/* Sección 7 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>7</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Propiedad Intelectual
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                Todo el contenido de la aplicación, incluyendo el modelo de IA, diseño, código y documentación, 
                está protegido por derechos de autor y es propiedad de los desarrolladores de AgroScan.
              </Text>
            </View>

            {/* Sección 8 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>8</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Actualizaciones
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                Nos reservamos el derecho de actualizar estos términos en cualquier momento. Las actualizaciones 
                importantes se notificarán a través de la aplicación.
              </Text>
            </View>

            {/* Sección 9 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>9</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Contacto
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text }]}>
                Para preguntas, sugerencias o reportar problemas, puede contactarnos a través de los canales 
                oficiales de soporte de AgroScan.
              </Text>
            </View>

            {/* Footer Message */}
            <LinearGradient
              colors={['#D1FAE5', '#A7F3D0']}
              style={styles.footer}
            >
              <View style={styles.footerContent}>
                <Ionicons name="checkmark-circle" size={24} color="#059669" style={styles.footerIcon} />
                <Text style={[styles.footerText, { color: colors.text }]}>
                  Al usar AgroScan, usted reconoce haber leído, entendido y aceptado estos términos y condiciones.
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeBlur: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.2,
  },
  decorativeTop: {
    top: 80,
    right: 40,
    width: 128,
    height: 128,
    backgroundColor: '#34D399',
  },
  decorativeBottom: {
    bottom: 160,
    left: 40,
    width: 160,
    height: 160,
    backgroundColor: '#3B82F6',
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  contentCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dateSection: {
    paddingBottom: 16,
    marginBottom: 24,
    borderBottomWidth: 1,
  },
  dateText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  numberBadge: {
    width: 24,
    height: 24,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  subsectionContainer: {
    gap: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
  },
  listContainer: {
    marginLeft: 16,
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
  },
  listBullet: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 3,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    borderRadius: 16,
    padding: 20,
    marginTop: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  footerContent: {
    flexDirection: 'row',
    gap: 12,
  },
  footerIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  footerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
});
