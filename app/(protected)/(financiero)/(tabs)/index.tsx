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
      estado: "APROBADO_SECRETARIA",
    },
    descripcion: "Participación en campeonato nacional categoría juvenil",
    avalTecnico: {
      atletas: 12,
      entrenadores: 3,
    },
    presupuestoAprobado: 14500,
    datosFinancieros: {
      beneficiario: "Federación Deportiva",
      ruc: "1791234567001",
      banco: "Banco Pichincha",
      tipoCuenta: "Corriente",
      numeroCuenta: "2100012345",
    },
    etapaActual: "FINANCIERO",
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
      estado: "APROBADO_SECRETARIA",
    },
    descripcion: "Competencia internacional de natación",
    avalTecnico: {
      atletas: 8,
      entrenadores: 2,
    },
    presupuestoAprobado: 24000,
    datosFinancieros: {
      beneficiario: "Federación Deportiva",
      ruc: "1791234567001",
      banco: "Banco del Pacífico",
      tipoCuenta: "Ahorros",
      numeroCuenta: "7654321000",
    },
    etapaActual: "FINANCIERO",
  },
];

type SolicitudFinanciero = (typeof MOCK_SOLICITUDES)[0];

export default function FinancieroDashboard() {
  const theme = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [data] = useState(MOCK_SOLICITUDES);

  const handleRefresh = () => {
    setRefreshing(true);
    // TODO: Implement actual refresh when API is ready
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePressItem = (item: SolicitudFinanciero) => {
    router.push({
      pathname: "/(protected)/(financiero)/coleccion",
      params: { data: JSON.stringify(item) },
    });
  };

  // Calculate total pending
  const totalPendiente = data.reduce((sum, item) => sum + item.presupuestoAprobado, 0);

  const renderItem = ({ item }: { item: SolicitudFinanciero }) => (
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
              icon="ion:wallet-outline"
              style={{
                backgroundColor: theme.colors.primaryContainer,
              }}
              textStyle={{
                color: theme.colors.onPrimaryContainer,
                fontSize: 12,
              }}
            >
              Por Pagar
            </Chip>
          </View>

          <Text
            variant="bodyMedium"
            numberOfLines={2}
            style={{ marginBottom: 12, color: theme.colors.onSurface }}
          >
            {item.descripcion}
          </Text>

          {/* Financial summary */}
          <Surface
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: theme.colors.primaryContainer,
              marginBottom: 12,
            }}
            elevation={0}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                  Monto Aprobado
                </Text>
                <Text
                  variant="titleLarge"
                  style={{ fontWeight: "bold", color: theme.colors.primary }}
                >
                  ${item.presupuestoAprobado.toLocaleString()}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                  {item.datosFinancieros.banco}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                  {item.datosFinancieros.tipoCuenta}
                </Text>
              </View>
            </View>
          </Surface>

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
                source="ion:people-outline"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {item.avalTecnico.atletas + item.avalTecnico.entrenadores} part.
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
          Aprobación Financiera
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Solicitudes pendientes de pago
        </Text>
      </View>

      {/* Total Summary */}
      <Surface
        style={{
          marginHorizontal: 16,
          marginBottom: 16,
          padding: 16,
          borderRadius: 12,
          backgroundColor: theme.colors.primary,
        }}
        elevation={2}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onPrimary, opacity: 0.8 }}>
              Total Pendiente de Pago
            </Text>
            <Text variant="headlineMedium" style={{ fontWeight: "bold", color: theme.colors.onPrimary }}>
              ${totalPendiente.toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Icon source="ion:cash-outline" size={28} color={theme.colors.onPrimary} />
          </View>
        </View>
        <Text variant="bodySmall" style={{ color: theme.colors.onPrimary, opacity: 0.7, marginTop: 8 }}>
          {data.length} solicitudes pendientes
        </Text>
      </Surface>

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
              source="ion:wallet-outline"
              size={48}
              color={theme.colors.outline}
            />
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.outline, marginTop: 16 }}
            >
              No hay pagos pendientes
            </Text>
          </View>
        }
      />
    </ThemedView>
  );
}
