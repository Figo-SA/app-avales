import { ColeccionListSkeleton } from "@/presentation/coleccion/components/ColeccionCardSkeleton";
import { ColeccionList } from "@/presentation/coleccion/components/ColeccionList";
import { useColecciones } from "@/presentation/coleccion/hooks/useColecciones";
import { ChipFilters } from "@/presentation/theme/components/ChipFilters";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function SecretariaDashboard() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<"despacho" | "historial">("despacho");

  const { coleccionesQuery, loadNextPage } = useColecciones({
    etapa: activeTab === "despacho" ? "CONTROL_PREVIO" : "SECRETARIA",
  });

  const colecciones =
    coleccionesQuery.data?.pages.flatMap((page) => page.data ?? []).filter(Boolean) || [];
  const isInitialLoading =
    coleccionesQuery.isLoading && colecciones.length === 0;

  const getEmptyStateProps = () => {
    if (activeTab === "despacho") {
      return {
        icon: "ion:file-tray-full-outline",
        title: "Bandeja vacía",
        description: "No hay trámites pendientes de despacho.",
      };
    }
    return {
      icon: "ion:archive-outline",
      title: "Sin historial",
      description: "No se han procesado resoluciones aún.",
    };
  };

  const filterOptions = useMemo(
    () => [
      {
        value: "despacho",
        label: "Pendientes Despacho",
        color: "#EA580C",
      },
      {
        value: "historial",
        label: "Procesados",
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
          Gestión Secretaría
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {activeTab === "despacho" 
            ? "Trámites validados por Control Previo pendientes de resolución."
            : "Historial de trámites despachados a Financiero."}
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
          routePath="/(protected)/(secretaria)/coleccion"
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
