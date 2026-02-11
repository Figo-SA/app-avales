import { ColeccionListSkeleton } from "@/presentation/coleccion/components/ColeccionCardSkeleton";
import { ColeccionList } from "@/presentation/coleccion/components/ColeccionList";
import { useColecciones } from "@/presentation/coleccion/hooks/useColecciones";
import { ChipFilters } from "@/presentation/theme/components/ChipFilters";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function PdaDashboard() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<"certificar" | "historial">("certificar");

  const { coleccionesQuery, loadNextPage } = useColecciones({
    etapa: activeTab === "certificar" ? "SOLICITUD" : "PDA",
    estado: activeTab === "certificar" ? "SOLICITADO" : undefined,
  });

  const colecciones =
    coleccionesQuery.data?.pages.flatMap((page) => page.data ?? []).filter(Boolean) || [];
  const isInitialLoading =
    coleccionesQuery.isLoading && colecciones.length === 0;

  const getEmptyStateProps = () => {
    if (activeTab === "certificar") {
      return {
        icon: "ion:wallet-outline",
        title: "Todo al día",
        description: "No hay solicitudes pendientes de certificación presupuestaria.",
      };
    }
    return {
      icon: "ion:checkmark-done-circle-outline",
      title: "Sin historial",
      description: "Aún no has certificado presupuestos.",
    };
  };

  const filterOptions = useMemo(
    () => [
      {
        value: "certificar",
        label: "Por Certificar",
        color: "#EA580C",
      },
      {
        value: "historial",
        label: "Historial Certificados",
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
          Gestión Presupuestaria (PDA)
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {activeTab === "certificar" 
            ? "Solicitudes aprobadas por DTM listas para certificación."
            : "Historial de certificaciones emitidas."}
        </Text>
      </View>

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
          routePath="/(protected)/(pda)/coleccion"
          isPending={activeTab === "certificar"}
          actionLabel="Certificar PDA"
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
