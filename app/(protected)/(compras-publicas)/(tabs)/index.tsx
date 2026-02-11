import { ColeccionListSkeleton } from "@/presentation/coleccion/components/ColeccionCardSkeleton";
import { ColeccionList } from "@/presentation/coleccion/components/ColeccionList";
import { useColecciones } from "@/presentation/coleccion/hooks/useColecciones";
import { ChipFilters } from "@/presentation/theme/components/ChipFilters";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function ComprasPublicasDashboard() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<"validar" | "historial">("validar");

  const { coleccionesQuery, loadNextPage } = useColecciones({
    etapa: activeTab === "validar" ? "PDA" : "COMPRAS_PUBLICAS",
    estado: activeTab === "validar" ? "SOLICITADO" : undefined,
  });

  const colecciones =
    coleccionesQuery.data?.pages.flatMap((page) => page.data ?? []).filter(Boolean) || [];
  const isInitialLoading =
    coleccionesQuery.isLoading && colecciones.length === 0;

  const getEmptyStateProps = () => {
    if (activeTab === "validar") {
      return {
        icon: "ion:briefcase-outline",
        title: "Todo al día",
        description: "No hay procesos pendientes de validación de contratación.",
      };
    }
    return {
      icon: "ion:checkmark-done-circle-outline",
      title: "Sin historial",
      description: "Aún no has validado procesos de contratación.",
    };
  };

  const filterOptions = useMemo(
    () => [
      {
        value: "validar",
        label: "Pendientes Compras",
        color: "#EA580C",
      },
      {
        value: "historial",
        label: "Procesos Validados",
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
          Gestión Compras Públicas
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {activeTab === "validar" 
            ? "Procesos por validar contratación."
            : "Historial de procesos validados."}
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
          routePath="/(protected)/(compras-publicas)/coleccion"
          isPending={activeTab === "validar"}
          actionLabel="Validar Compras"
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
