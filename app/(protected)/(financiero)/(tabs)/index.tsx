import { ColeccionListSkeleton } from "@/presentation/coleccion/components/ColeccionCardSkeleton";
import { ColeccionList } from "@/presentation/coleccion/components/ColeccionList";
import { useColecciones } from "@/presentation/coleccion/hooks/useColecciones";
import { ChipFilters } from "@/presentation/theme/components/ChipFilters";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Icon, Surface, Text, useTheme } from "react-native-paper";

export default function FinancieroDashboard() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<"pendientes" | "historial">("pendientes");

  const { coleccionesQuery, loadNextPage } = useColecciones({
    etapa: activeTab === "pendientes" ? "SECRETARIA" : "FINANCIERO",
  });

  const colecciones =
    coleccionesQuery.data?.pages.flatMap((page) => page.data ?? []).filter(Boolean) || [];
  const isInitialLoading =
    coleccionesQuery.isLoading && colecciones.length === 0;

  // Calculate total pending budget for the current view
  const totalPendiente = useMemo(() => {
    return colecciones.reduce((sum, item) => {
      // Logic to calculate estimated budget from Requerimientos if not available directly
      const presupuesto = item.avalTecnico?.requerimientos?.reduce(
        (acc: number, req: any) => acc + (Number(req.cantidadDias) * Number(req.valorUnitario)),
        0
      ) || 0;
      return sum + presupuesto;
    }, 0);
  }, [colecciones]);

  const getEmptyStateProps = () => {
    if (activeTab === "pendientes") {
      return {
        icon: "ion:wallet-outline",
        title: "Al día con los pagos",
        description: "No hay órdenes de pago pendientes.",
      };
    }
    return {
      icon: "ion:receipt-outline",
      title: "Sin historial",
      description: "No se han realizado pagos aún.",
    };
  };

  const filterOptions = useMemo(
    () => [
      {
        value: "pendientes",
        label: "Órdenes de Pago",
        color: "#EA580C",
      },
      {
        value: "historial",
        label: "Historial Pagos",
        color: "#059669",
      },
    ],
    []
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text
          variant="titleLarge"
          style={{ fontWeight: "700", color: theme.colors.onSurface }}
        >
          Gestión Financiera
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {activeTab === "pendientes" 
            ? "Órdenes de pago validadas listas para desembolso."
            : "Historial de pagos ejecutados."}
        </Text>
      </View>

      {/* Summary Card - Only visible in "Pendientes" */}
      {activeTab === "pendientes" && (
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
                Total Pendiente
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
            {colecciones.length} solicitudes por pagar
          </Text>
        </Surface>
      )}

      <ChipFilters
        options={filterOptions}
        selectedValue={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
      />

      {isInitialLoading ? (
        <ColeccionListSkeleton count={5} />
      ) : (
        <ColeccionList
          colecciones={colecciones}
          emptyStateProps={getEmptyStateProps()}
          filterKey={activeTab}
          routePath="/(protected)/(financiero)/coleccion"
          onEndReached={() => {
            if (
              coleccionesQuery.hasNextPage &&
              !coleccionesQuery.isFetchingNextPage
            ) {
              loadNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          isLoadingMore={coleccionesQuery.isFetchingNextPage}
          onRefresh={() => coleccionesQuery.refetch()}
          isRefreshing={coleccionesQuery.isRefetching}
        />
      )}
    </ThemedView>
  );
}
