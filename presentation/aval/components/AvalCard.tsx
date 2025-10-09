import { getStatusConfig } from "@/core/avales/helpers/statusHelper";
import { Aval } from "@/core/avales/interfaces/aval";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Card, Chip, Icon, Surface, Text, useTheme } from "react-native-paper";

export const AvalCard = ({ aval }: { aval: Aval }) => {
  const statusConfig = getStatusConfig(aval.status);
  const theme = useTheme();

  const handlePress = () => {
    router.push(`/(avales-app)/aval/${aval.id}`);
  };

  const totalDeportistas = aval.deportistas.length;
  const totalEntrenadores =
    aval.numeroEntrenadoresHombres + aval.numeroEntrenadoresMujeres;

  return (
    <Pressable onPress={handlePress}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          {/* Header con Título y Estado */}
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text
                variant="titleMedium"
                style={[styles.title, { color: theme.colors.onSurface }]}
                numberOfLines={2}
              >
                {aval.evento}
              </Text>
              <View style={styles.infoRow}>
                <Icon
                  source="ion:basketball"
                  size={14}
                  color={theme.colors.primary}
                />
                <Text
                  variant="bodySmall"
                  style={[
                    styles.deporte,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {aval.deporte}
                </Text>
              </View>
            </View>

            <Chip
              icon={statusConfig.icon}
              textStyle={{ fontSize: 11, fontWeight: "600" }}
              style={[
                styles.statusChip,
                {
                  backgroundColor: `${statusConfig.color}15`,
                  borderColor: statusConfig.color,
                },
              ]}
              compact
            >
              {statusConfig.label}
            </Chip>
          </View>

          {/* Información del Evento */}
          <View style={styles.eventInfo}>
            <View style={styles.eventInfoItem}>
              <Icon
                source="ion:calendar"
                size={16}
                color={theme.colors.primary}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant, marginLeft: 6 }}
              >
                {new Date(aval.fechaInicio).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                })}{" "}
                -{" "}
                {new Date(aval.fechaFin).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>

            <View style={styles.eventInfoItem}>
              <Icon
                source="ion:location"
                size={16}
                color={theme.colors.primary}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant, marginLeft: 6 }}
              >
                {aval.provincia}
              </Text>
            </View>
          </View>

          {/* Alcance y Tipo */}
          <View style={styles.tagsContainer}>
            <Surface
              style={[
                styles.tag,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
              elevation={0}
            >
              <Text
                variant="labelSmall"
                style={{
                  color: theme.colors.onPrimaryContainer,
                  fontWeight: "600",
                }}
              >
                {aval.alcance}
              </Text>
            </Surface>
            <Surface
              style={[
                styles.tag,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
              elevation={0}
            >
              <Text
                variant="labelSmall"
                style={{
                  color: theme.colors.onSecondaryContainer,
                  fontWeight: "600",
                }}
              >
                {aval.tipoEvento}
              </Text>
            </Surface>
          </View>

          {/* Estadísticas de Deportistas y Entrenadores */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon
                source="ion:people"
                size={18}
                color={theme.colors.primary}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}
              >
                {totalDeportistas}{" "}
                {totalDeportistas === 1 ? "Deportista" : "Deportistas"}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Icon
                source="ion:school"
                size={18}
                color={theme.colors.secondary}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}
              >
                {totalEntrenadores}{" "}
                {totalEntrenadores === 1 ? "Entrenador" : "Entrenadores"}
              </Text>
            </View>
          </View>

          {/* Footer con Fecha de Solicitud */}
          <View style={styles.footer}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Solicitado el{" "}
              {new Date(aval.fechaSolicitud).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deporte: {
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statusChip: {
    borderWidth: 1,
  },
  eventInfo: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  eventInfoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  approvedBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  rejectedBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
});
