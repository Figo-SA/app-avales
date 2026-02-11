import type { Evento } from "@/core/eventos/interfaces/evento";
import { formatDateShort } from "@/helpers/date.helper";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";

interface AdminEventoCardProps {
  evento: Evento;
  onPress: () => void;
}

export const AdminEventoCard = ({ evento, onPress }: AdminEventoCardProps) => {
  const theme = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        mode="elevated"
      >
        <Card.Content style={styles.cardContent}>
          {/* Header con código y tipo */}
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.codeBadge,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Text
                style={[styles.codeText, { color: theme.colors.primary }]}
              >
                {evento.codigo}
              </Text>
            </View>
            <Text
              style={[styles.tipoText, { color: theme.colors.onSurfaceVariant }]}
            >
              {evento.tipoEvento}
            </Text>
          </View>

          {/* Título */}
          <Text
            variant="titleMedium"
            style={[styles.title, { color: theme.colors.onSurface }]}
            numberOfLines={2}
          >
            {evento.nombre}
          </Text>

          {/* Ubicación */}
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
            numberOfLines={1}
          >
            {evento.lugar}, {evento.ciudad}
          </Text>

          {/* Info chips */}
          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoChip,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <Icon
                source="ion:calendar-outline"
                size={14}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {formatDateShort(evento.fechaInicio)}
              </Text>
            </View>
            <View
              style={[
                styles.infoChip,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <Icon
                source="ion:people-outline"
                size={14}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {(evento.numAtletasHombres || 0) +
                  (evento.numAtletasMujeres || 0)}{" "}
                atletas
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View
            style={[
              styles.footer,
              { borderTopColor: theme.colors.surfaceVariant },
            ]}
          >
            <View style={styles.footerItem}>
              <Icon
                source="ion:trophy-outline"
                size={14}
                color={theme.colors.outline}
              />
              <Text
                style={[styles.footerText, { color: theme.colors.outline }]}
              >
                {evento.disciplina?.nombre || "—"}
              </Text>
            </View>
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.colors.outlineVariant },
              ]}
            />
            <View style={styles.footerItem}>
              <Icon
                source="ion:globe-outline"
                size={14}
                color={theme.colors.outline}
              />
              <Text
                style={[styles.footerText, { color: theme.colors.outline }]}
              >
                {evento.alcance}
              </Text>
            </View>
            <View style={{ flex: 1 }} />
            <Icon
              source="ion:chevron-forward"
              size={20}
              color={theme.colors.outline}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    marginBottom: 12,
  },
  cardContent: {
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  codeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  tipoText: {
    fontSize: 12,
    fontWeight: "500",
  },
  title: {
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 11,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 6,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 11,
  },
  divider: {
    width: 1,
    height: 12,
    marginHorizontal: 4,
  },
});
