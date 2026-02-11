import type { Deportista } from "@/core/deportistas/interfaces/deportista";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";

interface DeportistaCardProps {
  deportista: Deportista;
  onPress: () => void;
}

export const DeportistaCard = ({ deportista, onPress }: DeportistaCardProps) => {
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
          {/* Header con nombre */}
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.afiliacionBadge,
                {
                  backgroundColor: deportista.afiliacion
                    ? "#E8F5E915"
                    : "#FBE9E715",
                },
              ]}
            >
              <Icon
                source={
                  deportista.afiliacion
                    ? "ion:checkmark-circle"
                    : "ion:close-circle"
                }
                size={12}
                color={deportista.afiliacion ? "#2E7D32" : "#C62828"}
              />
              <Text
                style={[
                  styles.afiliacionText,
                  { color: deportista.afiliacion ? "#2E7D32" : "#C62828" },
                ]}
              >
                {deportista.afiliacion ? "Afiliado" : "No afiliado"}
              </Text>
            </View>
            <Text
              style={[styles.cedulaText, { color: theme.colors.onSurfaceVariant }]}
            >
              {deportista.cedula}
            </Text>
          </View>

          {/* Nombre */}
          <Text
            variant="titleMedium"
            style={[styles.name, { color: theme.colors.onSurface }]}
            numberOfLines={1}
          >
            {deportista.nombres} {deportista.apellidos}
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
                source="ion:male-female-outline"
                size={14}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {deportista.genero}
              </Text>
            </View>
            {deportista.categoria && (
              <View
                style={[
                  styles.infoChip,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <Icon
                  source="ion:ribbon-outline"
                  size={14}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.infoText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {deportista.categoria.nombre}
                </Text>
              </View>
            )}
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
                {deportista.disciplina?.nombre || "—"}
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
  afiliacionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  afiliacionText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cedulaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  name: {
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
});
