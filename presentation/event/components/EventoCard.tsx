import { getEstadoBadge } from "@/core/constants/avales.constants";
import { Evento } from "@/core/eventos/interfaces/evento";
import { formatDateShort } from "@/helpers/date.helper";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";
import { EventoStepper } from "./EventoStepper";

export const EventoCard = ({
  evento,
  onPress,
  actionLabel,
  onActionPress,
}: {
  evento: Evento;
  onPress?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
}) => {
  const theme = useTheme();

  const handlePress = () => {
    if (onPress) onPress();
  };

  const estadoEvento = (evento.estado?.toUpperCase() || "DISPONIBLE") as
    | "DISPONIBLE"
    | "SOLICITADO"
    | "RECHAZADO"
    | "ACEPTADO";

  const badgeInfo = getEstadoBadge(estadoEvento, evento.etapa, theme.dark);
  const estadoConfig = {
    label: badgeInfo.label,
    color: badgeInfo.color,
    bgColor: `${badgeInfo.color}15`,
    icon: badgeInfo.icon,
  };
  const styles = createStyles(theme, estadoConfig);

  const hasActions = !!actionLabel && !!onActionPress;

  return (
    <View style={styles.pressable}>
      <View style={styles.card}>
        <Pressable onPress={handlePress}>
          {/* Header con estado y tipo */}
          <View style={styles.header}>
            <View style={styles.estadoBadge}>
              <Icon source={estadoConfig.icon} size={14} color={estadoConfig.color} />
              <ThemedText style={styles.estadoText}>{estadoConfig.label}</ThemedText>
            </View>
            <View style={styles.tipoTag}>
              <ThemedText style={styles.tipoText}>{evento.tipoEvento}</ThemedText>
            </View>
          </View>

          {/* Título del evento */}
          <ThemedText style={styles.title} numberOfLines={2}>
            {evento.nombre}
          </ThemedText>

          {/* Info grid */}
          <View style={styles.infoGrid}>
            {/* Disciplina */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Icon source="ion:trophy-outline" size={16} color={theme.colors.primary} />
              </View>
              <ThemedText style={styles.infoText} numberOfLines={1}>
                {evento.disciplina.nombre}
              </ThemedText>
            </View>

            {/* Ubicación */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Icon source="ion:location-outline" size={16} color={theme.colors.primary} />
              </View>
              <ThemedText style={styles.infoText} numberOfLines={1}>
                {evento.ciudad}, {evento.provincia}
              </ThemedText>
            </View>
          </View>

          {/* Fechas */}
          <View style={styles.dateContainer}>
            <Icon source="ion:calendar-outline" size={14} color={theme.colors.onSurfaceVariant} />
            <ThemedText style={styles.dateText}>
              {formatDateShort(evento.fechaInicio)} - {formatDateShort(evento.fechaFin)}
            </ThemedText>
            <View style={styles.alcanceTag}>
              <ThemedText style={styles.alcanceText}>{evento.alcance}</ThemedText>
            </View>
          </View>

          {/* Stepper de progreso - Solo si ya hay proceso iniciado */}
          {estadoEvento !== "DISPONIBLE" && <EventoStepper estado={estadoEvento} etapa={evento.etapa} />}
        </Pressable>

        {/* Action buttons */}
        {hasActions ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handlePress}
              style={[styles.actionBtn, { backgroundColor: theme.colors.surfaceVariant }]}
            >
              <Icon source="ion:eye-outline" size={16} color={theme.colors.onSurfaceVariant} />
              <ThemedText style={[styles.actionBtnText, { color: theme.colors.onSurfaceVariant }]}>
                Ver detalle
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={onActionPress}
              style={[styles.actionBtn, { backgroundColor: theme.colors.primaryContainer }]}
            >
              <Icon source="ion:create-outline" size={16} color={theme.colors.primary} />
              <ThemedText style={[styles.actionBtnText, { color: theme.colors.primary }]}>
                {actionLabel}
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : !hasActions && estadoEvento === "DISPONIBLE" ? (
          <Pressable onPress={handlePress}>
            <View style={styles.ctaContainer}>
              <ThemedText style={styles.ctaText}>Solicitar aval</ThemedText>
              <Icon source="ion:chevron-forward" size={16} color={theme.colors.primary} />
            </View>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const createStyles = (theme: any, estadoConfig: any) =>
  StyleSheet.create({
    pressable: {
      marginBottom: 12,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    estadoBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: estadoConfig.bgColor,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
    },
    estadoText: {
      fontSize: 11,
      fontWeight: "700",
      color: estadoConfig.color,
    },
    tipoTag: {
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    tipoText: {
      fontSize: 10,
      fontWeight: "600",
      color: theme.colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.colors.onSurface,
      lineHeight: 22,
      letterSpacing: -0.3,
    },
    infoGrid: {
      gap: 8,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    infoIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.colors.primaryContainer,
      justifyContent: "center",
      alignItems: "center",
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      color: theme.colors.onSurface,
      fontWeight: "500",
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outlineVariant,
    },
    dateText: {
      flex: 1,
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      fontWeight: "500",
    },
    alcanceTag: {
      backgroundColor: theme.colors.secondaryContainer,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
    },
    alcanceText: {
      fontSize: 9,
      fontWeight: "700",
      color: theme.colors.onSecondaryContainer,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    ctaContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 4,
      paddingTop: 4,
    },
    ctaText: {
      fontSize: 13,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    actionsRow: {
      flexDirection: "row",
      gap: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outlineVariant,
    },
    actionBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 10,
      borderRadius: 10,
    },
    actionBtnText: {
      fontSize: 13,
      fontWeight: "600",
    },
  });
