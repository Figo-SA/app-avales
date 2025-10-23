import { Evento } from "@/core/eventos/interfaces/evento";
import { formatDateShort } from "@/helpers/date.helper";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";

export const EventoCard = ({
  evento,
  onPress,
}: {
  evento: Evento;
  onPress?: () => void;
}) => {
  const theme = useTheme();

  const handlePress = () => {
    if (onPress) onPress();
  };

  const totalAtletas = evento.numAtletasHombres + evento.numAtletasMujeres;
  const totalEntrenadores =
    evento.numEntrenadoresHombres + evento.numEntrenadoresMujeres;

  // El estado por defecto es "disponible" si no viene del backend
  const estadoEvento = evento.estado || "disponible";

  // Configuración de badge según estado
  const getEstadoConfig = () => {
    switch (estadoEvento) {
      case "disponible":
        return {
          label: "Disponible",
          color: "#4CAF50",
          bgColor: "#4CAF5015",
          icon: "ion:checkmark-circle",
        };
      case "solicitado":
        return {
          label: "En Revisión",
          color: "#FF9800",
          bgColor: "#FF980015",
          icon: "ion:time",
        };
      case "rechazado":
        return {
          label: "Rechazado",
          color: "#F44336",
          bgColor: "#F4433615",
          icon: "ion:close-circle",
        };
      case "aceptado":
        return {
          label: "Aceptado",
          color: "#2196F3",
          bgColor: "#2196F315",
          icon: "ion:checkmark-done",
        };
      default:
        return {
          label: "Disponible",
          color: "#4CAF50",
          bgColor: "#4CAF5015",
          icon: "ion:checkmark-circle",
        };
    }
  };

  const estadoConfig = getEstadoConfig();
  const styles = createStyles(theme);

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      <ThemedView style={styles.card}>
        {/* Barra lateral de color (Estado) */}
        <View
          style={[styles.statusBar, { backgroundColor: estadoConfig.color }]}
        />

        <View style={styles.cardContent}>
          {/* Header con tipo de evento */}
          <View style={styles.header}>
            <View style={styles.tipoTag}>
              <ThemedText style={styles.tipoText}>
                {evento.tipoEvento}
              </ThemedText>
            </View>
            <View style={styles.statusBadge}>
              <Icon
                source={estadoConfig.icon}
                size={20}
                color={estadoConfig.color}
              />
            </View>
          </View>

          {/* Título del evento */}
          <ThemedText style={styles.title} numberOfLines={2}>
            {evento.nombre}
          </ThemedText>

          {/* Info principal en grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Icon
                source="ion:basketball"
                size={16}
                color={theme.colors.primary}
              />
              <ThemedText style={styles.infoText} numberOfLines={1}>
                {evento.disciplina.nombre}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Icon
                source="ion:location"
                size={16}
                color={theme.colors.primary}
              />
              <ThemedText style={styles.infoText} numberOfLines={1}>
                {evento.provincia}
              </ThemedText>
            </View>
          </View>

          {/* Fechas */}
          <View style={styles.dateContainer}>
            <Icon
              source="ion:calendar-outline"
              size={14}
              color={theme.colors.onSurfaceVariant}
            />
            <ThemedText style={styles.dateText}>
              {formatDateShort(evento.fechaInicio)} - {formatDateShort(evento.fechaFin)}
            </ThemedText>
          </View>

          {/* Footer con stats */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <View style={styles.miniStat}>
                <Icon
                  source="ion:people"
                  size={14}
                  color={theme.colors.secondary}
                />
                <ThemedText style={styles.miniStatText}>
                  {totalAtletas}
                </ThemedText>
              </View>
              <View style={styles.miniStat}>
                <Icon
                  source="ion:person"
                  size={14}
                  color={theme.colors.secondary}
                />
                <ThemedText style={styles.miniStatText}>
                  {totalEntrenadores}
                </ThemedText>
              </View>
            </View>
            <View style={styles.alcanceBadge}>
              <ThemedText style={styles.alcanceText}>
                {evento.alcance}
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>
    </Pressable>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    pressable: {
      marginBottom: 14,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      overflow: "hidden",
      flexDirection: "row",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    statusBar: {
      width: 5,
    },
    cardContent: {
      flex: 1,
      padding: 16,
      gap: 12,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tipoTag: {
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
    },
    tipoText: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    statusBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 17,
      fontWeight: "800",
      color: theme.colors.onSurface,
      lineHeight: 24,
      letterSpacing: -0.3,
    },
    infoGrid: {
      gap: 8,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    infoText: {
      fontSize: 13,
      color: theme.colors.onSurface,
      fontWeight: "600",
      flex: 1,
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingTop: 4,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outlineVariant,
    },
    dateText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      fontWeight: "500",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    footerLeft: {
      flexDirection: "row",
      gap: 16,
    },
    miniStat: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    miniStatText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.onSurface,
    },
    alcanceBadge: {
      backgroundColor: theme.colors.secondaryContainer,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    alcanceText: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.colors.secondary,
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
  });
