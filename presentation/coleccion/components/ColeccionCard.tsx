import { getEstadoBadge } from "@/core/constants/avales.constants";
import { ColeccionAval } from "@/core/avales/interfaces/coleccion";
import { formatDateLong } from "@/helpers/date.helper";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";

interface ColeccionCardProps {
  item: ColeccionAval;
  routePath?: string;
  isPending?: boolean;
  actionLabel?: string;
}

export const ColeccionCard = ({
  item,
  routePath = "/(protected)/(dtm)/coleccion",
  isPending,
  actionLabel,
}: ColeccionCardProps) => {
  const theme = useTheme();
  const router = useRouter();

  const navigate = (mode: "view" | "edit") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: routePath as any,
      params: { data: JSON.stringify(item), mode },
    });
  };

  const estado = getEstadoBadge(item.estado, item.etapaActual || item.etapa, theme.dark);
  const totalParticipantes = item.avalTecnico
    ? item.avalTecnico.atletas + item.avalTecnico.entrenadores
    : 0;

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      mode="elevated"
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigate("view")}
      >
        <Card.Content style={styles.cardContent}>
          {/* Header con estado */}
          <View style={styles.cardHeader}>
            <View style={[styles.estadoBadge, { backgroundColor: estado.bg }]}>
              <Icon source={estado.icon} size={12} color={estado.color} />
              <Text style={[styles.estadoText, { color: estado.color }]}>
                {estado.label}
              </Text>
            </View>
            <Text
              style={[styles.codigo, { color: theme.colors.onSurfaceVariant }]}
            >
              {item.evento.codigo}
            </Text>
          </View>

          {/* Título */}
          <Text
            variant="titleMedium"
            style={[styles.title, { color: theme.colors.onSurface }]}
            numberOfLines={2}
          >
            {item.evento.nombre}
          </Text>

          {/* Ubicación */}
          <Text
            variant="bodySmall"
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={1}
          >
            {item.evento.lugar}, {item.evento.ciudad}
          </Text>

          {/* Info Row */}
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
                style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}
              >
                {formatDateLong(item.evento.fechaInicio).split(",")[0]}
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
                style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}
              >
                {totalParticipantes} participantes
              </Text>
            </View>
          </View>

          {/* Footer con tipo y alcance */}
          <View
            style={[
              styles.metaRow,
              { borderTopColor: theme.colors.surfaceVariant },
            ]}
          >
            <View style={styles.footerItem}>
              <Icon
                source="ion:trophy-outline"
                size={14}
                color={theme.colors.outline}
              />
              <Text style={[styles.footerText, { color: theme.colors.outline }]}>
                {item.evento.tipoEvento}
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
              <Text style={[styles.footerText, { color: theme.colors.outline }]}>
                {item.evento.alcance}
              </Text>
            </View>
          </View>
        </Card.Content>
      </TouchableOpacity>

      {/* Action buttons */}
      <View
        style={[
          styles.actionsRow,
          { borderTopColor: theme.colors.surfaceVariant },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigate("view")}
          style={[
            styles.actionBtn,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Icon source="ion:eye-outline" size={16} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.actionBtnText, { color: theme.colors.onSurfaceVariant }]}>
            Ver detalle
          </Text>
        </TouchableOpacity>

        {isPending && actionLabel && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigate("edit")}
            style={[
              styles.actionBtn,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <Icon source="ion:create-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.actionBtnText, { color: theme.colors.primary }]}>
              {actionLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: "hidden",
  },
  cardContent: {
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  estadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  estadoText: {
    fontSize: 11,
    fontWeight: "600",
  },
  codigo: {
    fontSize: 12,
    fontWeight: "500",
  },
  title: {
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
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
  metaRow: {
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
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
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
