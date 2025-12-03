import { getEventoById } from "@/core/eventos/actions/eventos-actions";
import { Evento } from "@/core/eventos/interfaces/evento";
import { formatDateLong } from "@/helpers/date.helper";
import { EmptyState } from "@/presentation/theme/components/EmptyState";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Chip, Icon, IconButton, Surface, Text, useTheme } from "react-native-paper";

/**
 * Pantalla de resumen de solicitud de evento
 * Se muestra cuando el evento está en estado "solicitado" o "aceptado"
 */
export default function EventoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const styles = createStyles(theme);

  const {
    data: evento,
    isLoading,
    error,
  } = useQuery<Evento, Error>({
    queryKey: ["evento", id],
    queryFn: async () => {
      const result = await getEventoById(Number(id));
      if (!result) throw new Error("Evento no encontrado");
      return result;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerBackTitle: "Eventos",
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText style={styles.loadingText}>
            Cargando información del evento...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error || !evento) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Error",
            headerBackTitle: "Eventos",
          }}
        />
        <EmptyState
          icon="ion:alert-circle-outline"
          title="Error al cargar el evento"
          description="No se pudo cargar la información del evento. Por favor, intenta nuevamente."
        />
      </ThemedView>
    );
  }

  const estadoEvento = evento.estado?.toLowerCase() || "disponible";

 
  const getEstadoConfig = () => {
    const isDark = theme.dark;
    
    switch (estadoEvento) {
      case "solicitado":
        return {
          label: "En Revisión",
          color: isDark ? "#FDBA74" : "#EA580C", // Orange 300 : Orange 600
          bgColor: isDark ? "#431407" : "#FFF7ED", // Orange 950 : Orange 50
          borderColor: isDark ? "#9A3412" : "#FED7AA", // Orange 800 : Orange 200
          icon: "ion:time",
          description: "Tu solicitud está siendo revisada por el administrador",
        };
      case "aceptado":
        return {
          label: "Aceptado",
          color: isDark ? "#6EE7B7" : "#059669", // Emerald 300 : Emerald 600
          bgColor: isDark ? "#064E3B" : "#ECFDF5", // Emerald 950 : Emerald 50
          borderColor: isDark ? "#065F46" : "#A7F3D0", // Emerald 800 : Emerald 200
          icon: "ion:checkmark-done",
          description: "¡Felicidades! Tu solicitud ha sido aceptada",
        };
      case "rechazado":
        return {
          label: "Rechazado",
          color: isDark ? "#94A3B8" : "#475569", // Slate 400 : Slate 600
          bgColor: isDark ? "#0F172A" : "#F1F5F9", // Slate 900 : Slate 100
          borderColor: isDark ? "#334155" : "#CBD5E1", // Slate 700 : Slate 300
          icon: "ion:close-circle",
          description: "Tu solicitud fue rechazada",
        };
      default:
        return {
          label: "Disponible",
          color: isDark ? "#93C5FD" : "#2563EB", // Blue 300 : Blue 600
          bgColor: isDark ? "#172554" : "#EFF6FF", // Blue 950 : Blue 50
          borderColor: isDark ? "#1E3A8A" : "#BFDBFE", // Blue 900 : Blue 200
          icon: "ion:information-circle",
          description: "Evento disponible para solicitar",
        };
    }
  };

  const estadoConfig = getEstadoConfig();

  const handleNavigateToParticipants = () => {
    Haptics.selectionAsync();
    router.push(`/(entrenador)/participants?eventoId=${evento.id}`);
  };

  // Mock documents
  const documents = [
    { id: 1, name: "Reglamento del Evento.pdf", size: "2.4 MB", type: "pdf" },
    { id: 2, name: "Guía de Participación.pdf", size: "1.1 MB", type: "pdf" },
    { id: 3, name: "Formulario de Inscripción.docx", size: "850 KB", type: "doc" },
  ];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Detalle del Evento",
          headerBackTitle: "Eventos",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.onPrimary,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner de Estado */}
        <Surface
          style={[
            styles.estadoBanner,
            { 
              backgroundColor: estadoConfig.bgColor,
              borderColor: estadoConfig.borderColor,
            },
          ]}
          elevation={0}
        >
          <View style={[styles.estadoIconContainer, { backgroundColor: theme.colors.surface }]}>
            <Icon
              source={estadoConfig.icon}
              size={28}
              color={estadoConfig.color}
            />
          </View>
          <View style={styles.estadoContent}>
            <Text variant="titleMedium" style={[styles.estadoTitle, { color: theme.colors.onSurface }]}>
              {estadoConfig.label}
            </Text>
            <Text variant="bodySmall" style={[styles.estadoDescription, { color: theme.colors.onSurfaceVariant }]}>
              {estadoConfig.description}
            </Text>
          </View>
        </Surface>

        {/* Card Principal del Evento */}
        <Card style={styles.card} mode="elevated" elevation={1}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text variant="headlineSmall" style={styles.eventTitle}>
                  {evento.nombre}
                </Text>
                <Chip
                  icon="ion:calendar"
                  style={[
                    styles.tipoChip,
                    { backgroundColor: theme.colors.secondaryContainer },
                  ]}
                  textStyle={{ color: theme.colors.onSecondaryContainer, fontSize: 12 }}
                  compact
                >
                  {evento.tipoEvento}
                </Chip>
              </View>
            </View>

            <Text variant="bodyMedium" style={styles.eventCode}>
              Código: <Text style={{ fontWeight: 'bold' }}>{evento.codigo}</Text>
            </Text>
          </Card.Content>
        </Card>

        {/* Información del Evento */}
        <Card style={styles.card} mode="elevated" elevation={1}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon source="ion:information-circle-outline" size={24} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Información General
              </Text>
            </View>

            <View style={styles.infoGrid}>
              <InfoRow
                icon="ion:calendar"
                label="Fecha Inicio"
                value={formatDateLong(evento.fechaInicio)}
                theme={theme}
              />
              <InfoRow
                icon="ion:calendar-outline"
                label="Fecha Fin"
                value={formatDateLong(evento.fechaFin)}
                theme={theme}
              />
              <InfoRow
                icon="ion:location"
                label="Ubicación"
                value={`${evento.lugar}, ${evento.ciudad}`}
                theme={theme}
              />
              <InfoRow
                icon="ion:map"
                label="Provincia"
                value={evento.provincia}
                theme={theme}
              />
              <InfoRow
                icon="ion:basketball"
                label="Deporte"
                value={evento.disciplina.nombre}
                theme={theme}
              />
              <InfoRow
                icon="ion:trophy"
                label="Categoría"
                value={evento.categoria.nombre}
                theme={theme}
              />
              <InfoRow
                icon="ion:globe"
                label="Alcance"
                value={evento.alcance}
                theme={theme}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Documentos */}
        <Card style={styles.card} mode="elevated" elevation={1}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon source="ion:document-text-outline" size={24} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Documentos ({documents.length})
              </Text>
            </View>

            <View style={styles.documentsList}>
              {documents.map((doc) => (
                <TouchableOpacity 
                  key={doc.id} 
                  style={styles.documentItem}
                  onPress={() => Haptics.selectionAsync()}
                >
                  <View style={[styles.docIcon, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Icon 
                      source={doc.type === 'pdf' ? 'file-pdf-box' : 'file-document'} 
                      size={24} 
                      color={doc.type === 'pdf' ? '#F44336' : '#2196F3'} 
                    />
                  </View>
                  <View style={styles.docContent}>
                    <Text variant="bodyMedium" style={styles.docName} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.docSize}>
                      {doc.size}
                    </Text>
                  </View>
                  <IconButton 
                    icon="download-outline" 
                    size={20} 
                    iconColor={theme.colors.primary}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Participantes Requeridos (Rediseñado) */}
        <Card style={styles.card} mode="elevated" elevation={1}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon source="ion:people-outline" size={24} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Participantes Requeridos
              </Text>
            </View>

            <View style={styles.participantsContainer}>
              <ParticipantGroup 
                title="Entrenadores"
                icon="ion:school"
                men={evento.numEntrenadoresHombres}
                women={evento.numEntrenadoresMujeres}
                color={theme.colors.primary}
                theme={theme}
              />
              
              <View style={styles.participantDivider} />

              <ParticipantGroup 
                title="Atletas"
                icon="ion:fitness"
                men={evento.numAtletasHombres}
                women={evento.numAtletasMujeres}
                color={theme.colors.tertiary}
                theme={theme}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Mensaje según estado */}
        {estadoEvento === "solicitado" && (
          <Surface style={[styles.infoBanner, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
            <Icon
              source="ion:information-circle"
              size={24}
              color={theme.colors.primary}
            />
            <Text variant="bodyMedium" style={[styles.infoBannerText, { color: theme.colors.onPrimaryContainer }]}>
              Tu solicitud está siendo revisada. Te notificaremos cuando sea
              aprobada o si se requieren cambios.
            </Text>
          </Surface>
        )}

        {/* Espacio al final */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ThemedView>
  );
}

/**
 * Componente para mostrar una fila de información
 */
const InfoRow = ({
  icon,
  label,
  value,
  theme,
}: {
  icon: string;
  label: string;
  value: string;
  theme: any;
}) => (
  <View style={infoRowStyles(theme).container}>
    <View style={infoRowStyles(theme).iconContainer}>
      <Icon source={icon} size={16} color={theme.colors.primary} />
    </View>
    <View style={infoRowStyles(theme).textContainer}>
      <Text variant="labelSmall" style={infoRowStyles(theme).label}>
        {label}
      </Text>
      <Text variant="bodyMedium" style={infoRowStyles(theme).value}>
        {value}
      </Text>
    </View>
  </View>
);

const infoRowStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surfaceVariant,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
    },
    textContainer: {
      flex: 1,
      gap: 2,
    },
    label: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    value: {
      color: theme.colors.onSurface,
      fontWeight: "600",
    },
  });

/**
 * Componente para grupo de participantes
 */
const ParticipantGroup = ({
  title,
  icon,
  men,
  women,
  color,
  theme,
}: {
  title: string;
  icon: string;
  men: number;
  women: number;
  color: string;
  theme: any;
}) => (
  <View style={participantGroupStyles(theme).container}>
    <View style={participantGroupStyles(theme).header}>
      <View style={[participantGroupStyles(theme).iconBox, { backgroundColor: color + '15' }]}>
        <Icon source={icon} size={22} color={color} />
      </View>
      <Text variant="titleMedium" style={participantGroupStyles(theme).title}>{title}</Text>
    </View>
    
    <View style={participantGroupStyles(theme).countsContainer}>
      <View style={participantGroupStyles(theme).countBadge}>
        <Icon source="ion:man" size={16} color={theme.colors.onSurfaceVariant} />
        <Text variant="labelLarge" style={participantGroupStyles(theme).countText}>{men}</Text>
        <Text variant="labelSmall" style={participantGroupStyles(theme).countLabel}>Hombres</Text>
      </View>
      
      <View style={[participantGroupStyles(theme).dividerVertical, { backgroundColor: theme.colors.outlineVariant }]} />
      
      <View style={participantGroupStyles(theme).countBadge}>
        <Icon source="ion:woman" size={16} color={theme.colors.onSurfaceVariant} />
        <Text variant="labelLarge" style={participantGroupStyles(theme).countText}>{women}</Text>
        <Text variant="labelSmall" style={participantGroupStyles(theme).countLabel}>Mujeres</Text>
      </View>
    </View>
  </View>
);

const participantGroupStyles = (theme: any) => StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  countsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    padding: 4,
  },
  countBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  countText: {
    fontWeight: '700',
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  countLabel: {
    color: theme.colors.onSurfaceVariant,
  },
  dividerVertical: {
    width: 1,
    marginVertical: 6,
  }
});

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
    },
    loadingText: {
      color: theme.colors.onSurfaceVariant,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
      gap: 16,
    },
    estadoBanner: {
      flexDirection: "row",
      padding: 16,
      borderRadius: 20,
      gap: 16,
      alignItems: 'center',
      borderWidth: 1,
    },
    estadoIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    estadoContent: {
      flex: 1,
      gap: 2,
    },
    estadoTitle: {
      fontWeight: "700",
    },
    estadoDescription: {
      lineHeight: 16,
    },
    card: {
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    cardHeader: {
      marginBottom: 8,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
    },
    eventTitle: {
      flex: 1,
      color: theme.colors.onSurface,
      fontWeight: "700",
      lineHeight: 28,
    },
    tipoChip: {
      height: 28,
    },
    eventCode: {
      color: theme.colors.onSurfaceVariant,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surfaceVariant,
    },
    sectionTitle: {
      color: theme.colors.onSurface,
      fontWeight: "700",
    },
    infoGrid: {
      gap: 0,
    },
    participantsContainer: {
      gap: 16,
    },
    participantDivider: {
      height: 1,
      backgroundColor: theme.colors.outlineVariant,
      opacity: 0.5,
    },
    infoBanner: {
      flexDirection: "row",
      padding: 16,
      borderRadius: 16,
      gap: 12,
      alignItems: "flex-start",
    },
    infoBannerText: {
      flex: 1,
      lineHeight: 20,
    },
    bottomSpacer: {
      height: 40,
    },
    documentsList: {
      gap: 12,
    },
    documentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceVariant,
      gap: 12,
    },
    docIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    docContent: {
      flex: 1,
    },
    docName: {
      color: theme.colors.onSurface,
      fontWeight: '600',
    },
    docSize: {
      color: theme.colors.onSurfaceVariant,
    },
  });
