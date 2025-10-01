import { Evento } from "@/core/eventos/interfaces/evento";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const EventoCard = ({ evento }: { evento: Evento }) => {
  const theme = useTheme();

  const handlePress = () => {
    // Navegar a detalle del evento - por ahora solo log
    console.log("Ver detalle del evento:", evento.codigoItem);
  };

  const totalAtletas =
    evento.numeroAtletasHombres + evento.numeroAtletasMujeres;
  const totalEntrenadores =
    evento.numeroEntrenadoresHombres + evento.numeroEntrenadoresMujeres;

  const styles = createStyles(theme);

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      <ThemedView style={styles.card}>
        <View style={styles.header}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {evento.evento}
          </ThemedText>
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>
              {evento.tipoEvento}
            </ThemedText>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <View style={styles.sportContainer}>
              <ThemedText style={styles.sportText}>{evento.deporte}</ThemedText>
            </View>
            <View style={styles.locationContainer}>
              <ThemedText style={styles.locationText}>
                📍 {evento.provincia}
              </ThemedText>
            </View>
          </View>

          <View style={styles.dateContainer}>
            <ThemedText style={styles.dateLabel}>📅</ThemedText>
            <ThemedText style={styles.dateText}>
              {formatDate(evento.fechaInicio)} - {formatDate(evento.fechaFin)}
            </ThemedText>
          </View>

          <View style={styles.separator} />

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statIcon}>👥</ThemedText>
              <ThemedText style={styles.statText}>{totalAtletas}</ThemedText>
              <ThemedText style={styles.statLabel}>atletas</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statIcon}>🏃‍♂️</ThemedText>
              <ThemedText style={styles.statText}>
                {totalEntrenadores}
              </ThemedText>
              <ThemedText style={styles.statLabel}>entrenadores</ThemedText>
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
      marginBottom: 12,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 0.5,
      borderColor: theme.colors.outline,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.onSurface,
      flex: 1,
      marginRight: 12,
      lineHeight: 22,
    },
    badge: {
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: "600",
      color: theme.colors.onPrimaryContainer,
      textTransform: "uppercase",
    },
    content: {
      gap: 8,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sportContainer: {
      flex: 1,
    },
    sportText: {
      fontSize: 14,
      color: theme.colors.onSurface,
      fontWeight: "600",
    },
    locationContainer: {
      alignItems: "flex-end",
    },
    locationText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      fontWeight: "500",
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    dateLabel: {
      fontSize: 12,
    },
    dateText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      fontWeight: "500",
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.outline,
      opacity: 0.3,
      marginVertical: 4,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    statItem: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    statDivider: {
      width: 1,
      height: 20,
      backgroundColor: theme.colors.outline,
      opacity: 0.3,
    },
    statIcon: {
      fontSize: 14,
    },
    statText: {
      fontSize: 14,
      color: theme.colors.onSurface,
      fontWeight: "700",
    },
    statLabel: {
      fontSize: 11,
      color: theme.colors.onSurfaceVariant,
      fontWeight: "500",
    },
  });
