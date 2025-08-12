import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  Card,
  useTheme,
  Chip,
  IconButton,
  FAB,
  Avatar,
  Divider,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { ThemedText } from "@/presentation/theme/components/ThemedText";

// Tipos para los estados de avales
type EstadoAval =
  | "borrador"
  | "pendiente"
  | "aprobado"
  | "rechazado"
  | "revision";

interface AvalItem {
  id: string;
  nombreEvento: string;
  disciplina: string;
  categoria: string;
  fechaCreacion: Date;
  fechaEvento: Date;
  estado: EstadoAval;
  lugar: string;
  numeroAtletas: number;
  observaciones?: string;
}

// Datos de ejemplo (esto vendría de tu API/base de datos)
const avalsMock: AvalItem[] = [
  {
    id: "1",
    nombreEvento: "Campeonato Nacional de Natación",
    disciplina: "natacion",
    categoria: "juvenil",
    fechaCreacion: new Date("2024-01-15"),
    fechaEvento: new Date("2024-03-20"),
    estado: "aprobado",
    lugar: "Complejo Acuático Nacional",
    numeroAtletas: 25,
  },
  {
    id: "2",
    nombreEvento: "Copa Regional de Fútbol",
    disciplina: "futbol",
    categoria: "senior",
    fechaCreacion: new Date("2024-01-20"),
    fechaEvento: new Date("2024-02-28"),
    estado: "pendiente",
    lugar: "Estadio Municipal",
    numeroAtletas: 22,
  },
  {
    id: "3",
    nombreEvento: "Torneo de Atletismo Escolar",
    disciplina: "atletismo",
    categoria: "infantil",
    fechaCreacion: new Date("2024-01-10"),
    fechaEvento: new Date("2024-02-15"),
    estado: "rechazado",
    lugar: "Pista de Atletismo Central",
    numeroAtletas: 30,
    observaciones: "Documentación incompleta. Falta presupuesto detallado.",
  },
  {
    id: "4",
    nombreEvento: "Liga Juvenil de Baloncesto",
    disciplina: "baloncesto",
    categoria: "juvenil",
    fechaCreacion: new Date("2024-01-22"),
    fechaEvento: new Date("2024-04-10"),
    estado: "borrador",
    lugar: "Coliseo Deportivo",
    numeroAtletas: 15,
  },
];
const estadoConfig = {
  borrador: {
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    icon: "fa:file-alt",
    label: "Borrador",
  },
  pendiente: {
    color: "#D97706",
    backgroundColor: "#FEF3C7",
    icon: "fa:clock",
    label: "Pendiente",
  },
  aprobado: {
    color: "#059669",
    backgroundColor: "#D1FAE5",
    icon: "fa:check-circle",
    label: "Aprobado",
  },
  rechazado: {
    color: "#DC2626",
    backgroundColor: "#FEE2E2",
    icon: "fa:times-circle",
    label: "Rechazado",
  },
  revision: {
    color: "#7C3AED",
    backgroundColor: "#EDE9FE",
    icon: "fa:eye",
    label: "En Revisión",
  },
};

const disciplinaIcons = {
  futbol: "football-outline",
  natacion: "fa:swimmer",
  atletismo: "walk-outline",
  baloncesto: "basketball-outline",
  voleibol: "fa:volleyball-ball",
};

export default function PantallaInicio() {
  const theme = useTheme();
  const router = useRouter();
  const [avales, setAvales] = useState<AvalItem[]>(avalsMock);
  const [refreshing, setRefreshing] = useState(false);

  // Estadísticas
  const estadisticas = {
    total: avales.length,
    aprobados: avales.filter((a) => a.estado === "aprobado").length,
    pendientes: avales.filter((a) => a.estado === "pendiente").length,
    rechazados: avales.filter((a) => a.estado === "rechazado").length,
    borradores: avales.filter((a) => a.estado === "borrador").length,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Aquí harías la llamada a tu API para actualizar los datos
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const crearNuevoAval = () => {
    router.push("/(avales-app)/(tabs)/aval");
  };

  const editarAval = (id: string) => {
    // Navegar al formulario de edición con el ID del aval
    router.push(`/(avales-app)/(tabs)/aval?edit=${id}`);
  };

  const verDetalles = (aval: AvalItem) => {
    Alert.alert(
      aval.nombreEvento,
      `Estado: ${estadoConfig[aval.estado].label}\nLugar: ${aval.lugar}\nAtletas: ${aval.numeroAtletas}\n${
        aval.observaciones ? `\nObservaciones: ${aval.observaciones}` : ""
      }`,
    );
  };

  const eliminarAval = (id: string, nombreEvento: string) => {
    Alert.alert(
      "Eliminar Aval",
      `¿Estás seguro de que quieres eliminar "${nombreEvento}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setAvales((prev) => prev.filter((a) => a.id !== id));
          },
        },
      ],
    );
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderEstadisticas = () => (
    <Card style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.statsHeader}>
        <ThemedText type="title" style={{ marginTop: 16 }}>
          Mis Avales
        </ThemedText>
        <Text variant="bodyLarge" style={{ color: "white", opacity: 0.9 }}>
          Resumen de actividades
        </Text>
      </View>

      <View style={styles.statsContent}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text
              variant="headlineMedium"
              style={{ color: theme.colors.primary }}
            >
              {estadisticas.total}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Total
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              variant="headlineMedium"
              style={{ color: estadoConfig.aprobado.color }}
            >
              {estadisticas.aprobados}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Aprobados
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              variant="headlineMedium"
              style={{ color: estadoConfig.pendiente.color }}
            >
              {estadisticas.pendientes}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Pendientes
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              variant="headlineMedium"
              style={{ color: estadoConfig.rechazado.color }}
            >
              {estadisticas.rechazados}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Rechazados
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderAvalCard = (aval: AvalItem) => {
    const config = estadoConfig[aval.estado];
    const disciplinaIcon = disciplinaIcons[aval.disciplina] || "sports";

    return (
      <Card
        key={aval.id}
        style={[styles.avalCard, { backgroundColor: theme.colors.surface }]}
      >
        <TouchableOpacity onPress={() => verDetalles(aval)}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Avatar.Icon
                  size={40}
                  icon={disciplinaIcon}
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                />
                <View style={styles.cardHeaderText}>
                  <Text variant="titleMedium" numberOfLines={1}>
                    {aval.nombreEvento}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {aval.lugar}
                  </Text>
                </View>
              </View>
              <Chip
                icon={config.icon}
                style={{ backgroundColor: config.backgroundColor }}
                textStyle={{ color: config.color, fontWeight: "600" }}
                compact
              >
                {config.label}
              </Chip>
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <View style={styles.cardDetails}>
              <View style={styles.cardDetailItem}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Categoría: {aval.categoria}
                </Text>
              </View>
              <View style={styles.cardDetailItem}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Atletas: {aval.numeroAtletas}
                </Text>
              </View>
              <View style={styles.cardDetailItem}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Evento: {formatearFecha(aval.fechaEvento)}
                </Text>
              </View>
            </View>

            {aval.observaciones && (
              <View style={styles.observaciones}>
                <Text
                  variant="bodySmall"
                  style={{ color: estadoConfig.rechazado.color }}
                >
                  {aval.observaciones}
                </Text>
              </View>
            )}
          </Card.Content>

          <Card.Actions style={styles.cardActions}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}
            >
              Creado: {formatearFecha(aval.fechaCreacion)}
            </Text>
            {(aval.estado === "borrador" || aval.estado === "rechazado") && (
              <IconButton
                icon="pencil"
                iconColor={theme.colors.primary}
                onPress={() => editarAval(aval.id)}
              />
            )}
            {aval.estado === "borrador" && (
              <IconButton
                icon="delete"
                iconColor={theme.colors.error}
                onPress={() => eliminarAval(aval.id, aval.nombreEvento)}
              />
            )}
          </Card.Actions>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderEstadisticas()}

        <View style={styles.avalList}>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            Avales Recientes
          </Text>
          {avales.length > 0 ? (
            avales.map(renderAvalCard)
          ) : (
            <Card
              style={[
                styles.emptyCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content style={styles.emptyContent}>
                <Avatar.Icon
                  size={80}
                  icon="file-document-plus-outline"
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                />
                <Text
                  variant="titleMedium"
                  style={{ marginTop: 16, textAlign: "center" }}
                >
                  No tienes avales aún
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  Crea tu primer aval deportivo para comenzar
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>

      <FAB
        icon="fa:plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={crearNuevoAval}
        label="Nuevo Aval"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  statsCard: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  statsGradient: {
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  statsHeader: {
    alignItems: "center",
  },
  statsContent: {
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  avalList: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  avalCard: {
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardDetailItem: {
    flex: 1,
  },
  observaciones: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 8,
  },
  cardActions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyCard: {
    borderRadius: 12,
    padding: 24,
  },
  emptyContent: {
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});
