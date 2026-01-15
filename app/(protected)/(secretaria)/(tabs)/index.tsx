import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import {
  Chip,
  Icon,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

// Mock data - TODO: Replace with API call when backend is ready
const MOCK_SOLICITUDES = [
  {
    id: 1,
    evento: {
      id: 1,
      nombre: "Campeonato Nacional de Atletismo",
      codigo: "ATL-2024-001",
      ciudad: "Quito",
      provincia: "Pichincha",
      fechaInicio: "2024-03-15",
      estado: "APROBADO_CONTROL_PREVIO",
    },
    descripcion: "Participación en campeonato nacional categoría juvenil",
    avalTecnico: {
      atletas: 12,
      entrenadores: 3,
    },
    presupuestoAprobado: 14500,
    etapaActual: "SECRETARIA",
    aprobaciones: {
      dtm: true,
      pda: true,
      controlPrevio: true,
    },
  },
  {
    id: 2,
    evento: {
      id: 2,
      nombre: "Copa Internacional de Natación",
      codigo: "NAT-2024-002",
      ciudad: "Guayaquil",
      provincia: "Guayas",
      fechaInicio: "2024-04-20",
      estado: "APROBADO_CONTROL_PREVIO",
    },
    descripcion: "Competencia internacional de natación",
    avalTecnico: {
      atletas: 8,
      entrenadores: 2,
    },
    presupuestoAprobado: 24000,
    etapaActual: "SECRETARIA",
    aprobaciones: {
      dtm: true,
      pda: true,
      controlPrevio: true,
    },
  },
];

type SolicitudSecretaria = (typeof MOCK_SOLICITUDES)[0];

export default function SecretariaDashboard() {
  const theme = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [data] = useState(MOCK_SOLICITUDES);

  const handleRefresh = () => {
    setRefreshing(true);
    // TODO: Implement actual refresh when API is ready
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePressItem = (item: SolicitudSecretaria) => {
    router.push({
      pathname: "/(protected)/(secretaria)/coleccion",
      params: { data: JSON.stringify(item) },
    });
  };

  const getAprobacionCount = (aprobaciones: SolicitudSecretaria["aprobaciones"]) => {
    return Object.values(aprobaciones).filter(Boolean).length;
  };

  const renderItem = ({ item }: { item: SolicitudSecretaria }) => (
    <Surface
      style={{
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: theme.colors.surface,
        overflow: "hidden",
      }}
      elevation={1}
    >
      <TouchableRipple onPress={() => handlePressItem(item)}>
        <View style={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                {item.evento.nombre}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {item.evento.ciudad}, {item.evento.provincia}
              </Text>
            </View>
            <Chip
              mode="flat"
              style={{
                backgroundColor: theme.colors.primaryContainer,
              }}
              textStyle={{
                color: theme.colors.onPrimaryContainer,
                fontSize: 12,
              }}
            >
              Revisión Final
            </Chip>
          </View>

          <Text
            variant="bodyMedium"
            numberOfLines={2}
            style={{ marginBottom: 12, color: theme.colors.onSurface }}
          >
            {item.descripcion}
          </Text>

          {/* Progress indicators */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Chip
              compact
              icon="ion:checkmark-circle"
              style={{ backgroundColor: theme.colors.primaryContainer }}
              textStyle={{ fontSize: 10, color: theme.colors.onPrimaryContainer }}
            >
              DTM
            </Chip>
            <Chip
              compact
              icon="ion:checkmark-circle"
              style={{ backgroundColor: theme.colors.primaryContainer }}
              textStyle={{ fontSize: 10, color: theme.colors.onPrimaryContainer }}
            >
              PDA
            </Chip>
            <Chip
              compact
              icon="ion:checkmark-circle"
              style={{ backgroundColor: theme.colors.primaryContainer }}
              textStyle={{ fontSize: 10, color: theme.colors.onPrimaryContainer }}
            >
              Control
            </Chip>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon
                source="ion:calendar-outline"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {new Date(item.evento.fechaInicio).toLocaleDateString()}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon
                source="ion:cash-outline"
                size={16}
                color={theme.colors.primary}
              />
              <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: "600" }}>
                ${item.presupuestoAprobado.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>
          Revisión Administrativa
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Aprobación final antes de enviar a Financiero
        </Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={{ padding: 32, alignItems: "center" }}>
            <Icon
              source="ion:briefcase-outline"
              size={48}
              color={theme.colors.outline}
            />
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.outline, marginTop: 16 }}
            >
              No hay solicitudes pendientes
            </Text>
          </View>
        }
      />
    </ThemedView>
  );
}
