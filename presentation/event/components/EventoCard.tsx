import { Evento } from "@/core/eventos/interfaces/evento";
import { formatDateShort } from "@/helpers/date.helper";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";
import { EventoStepper } from "./EventoStepper";

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

  // Normalizar estado del backend (MAYÚSCULAS) a minúsculas
  const estadoEvento = (evento.estado?.toLowerCase() || "disponible") as 
    | "disponible"
    | "solicitado"
    | "rechazado"
    | "aceptado";

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
                size={16}
                color={estadoConfig.color}
              />
            </View>
          </View>

          {/* Título del evento */}
          <ThemedText style={styles.title} numberOfLines={2}>
            {evento.nombre}
          </ThemedText>

          {/* Disciplina */}
          <View style={styles.disciplinaContainer}>
            <Icon
              source="ion:basketball"
              size={14}
              color={theme.colors.primary}
            />
            <ThemedText style={styles.disciplinaText} numberOfLines={1}>
              {evento.disciplina.nombre}
            </ThemedText>
          </View>

          {/* Fechas */}
          <View style={styles.dateContainer}>
            <Icon
              source="ion:calendar-outline"
              size={12}
              color={theme.colors.onSurfaceVariant}
            />
            <ThemedText style={styles.dateText}>
              {formatDateShort(evento.fechaInicio)} -{" "}
              {formatDateShort(evento.fechaFin)}
            </ThemedText>
          </View>

          {/* Stepper de progreso - Solo si ya hay proceso iniciado */}
          {estadoEvento !== "disponible" && (
            <EventoStepper estado={estadoEvento} />
          )}

          {/* CTA para eventos disponibles */}
          {estadoEvento === "disponible" && (
            <View style={styles.ctaContainer}>
              <ThemedText style={styles.ctaText}>
                📤 Toca para solicitar este evento
              </ThemedText>
            </View>
          )}
        </View>
      </ThemedView>
    </Pressable>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    pressable: {
      marginBottom: 10,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      overflow: "hidden",
      flexDirection: "row",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    statusBar: {
      width: 5,
    },
    cardContent: {
      flex: 1,
      padding: 12,
      gap: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tipoTag: {
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 12,
    },
    tipoText: {
      fontSize: 10,
      fontWeight: "700",
      color: theme.colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
    statusBadge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.onSurface,
      lineHeight: 20,
      letterSpacing: -0.2,
    },
    disciplinaContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    disciplinaText: {
      fontSize: 12,
      color: theme.colors.onSurface,
      fontWeight: "600",
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingTop: 6,
      paddingBottom: 2,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outlineVariant,
    },
    dateText: {
      fontSize: 11,
      color: theme.colors.onSurfaceVariant,
      fontWeight: "500",
    },
    ctaContainer: {
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: "center",
    },
    ctaText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: "600",
      textAlign: "center",
    },
  });
