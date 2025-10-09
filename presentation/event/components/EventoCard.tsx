import { Evento } from "@/core/eventos/interfaces/evento";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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
          <View style={styles.mainInfo}>
            <ThemedText style={styles.sportText}>{evento.deporte}</ThemedText>
            <ThemedText style={styles.dividerText}>•</ThemedText>
            <ThemedText style={styles.locationText}>
              {evento.provincia}
            </ThemedText>
            <ThemedText style={styles.dividerText}>•</ThemedText>
            <ThemedText style={styles.alcanceText}>{evento.alcance}</ThemedText>
          </View>

          <ThemedText style={styles.dateText}>
            {formatDate(evento.fechaInicio)} - {formatDate(evento.fechaFin)}
          </ThemedText>

          <View style={styles.separator} />

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon
                source="ion:people-outline"
                size={16}
                color={theme.colors.primary}
              />
              <ThemedText style={styles.statText}>{totalAtletas}</ThemedText>
              <ThemedText style={styles.statLabel}>atletas</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon
                source="fa:user-tie"
                size={14}
                color={theme.colors.primary}
              />
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
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
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
      gap: 10,
    },
    mainInfo: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
    },
    sportText: {
      fontSize: 14,
      color: theme.colors.onSurface,
      fontWeight: "600",
    },
    dividerText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      marginHorizontal: 6,
    },
    locationText: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
      fontWeight: "500",
    },
    alcanceText: {
      fontSize: 12,
      color: theme.colors.secondary,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    dateText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      fontWeight: "500",
      fontStyle: "italic",
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
