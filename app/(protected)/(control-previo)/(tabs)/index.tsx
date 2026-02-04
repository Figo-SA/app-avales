import { ColeccionListSkeleton } from "@/presentation/coleccion/components/ColeccionCardSkeleton";
import { ColeccionList } from "@/presentation/coleccion/components/ColeccionList";
import { useColecciones } from "@/presentation/coleccion/hooks/useColecciones";
import { ChipFilters } from "@/presentation/theme/components/ChipFilters";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function ControlPrevioDashboard() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<"revisar" | "historial">("revisar");

  const { coleccionesQuery, loadNextPage } = useColecciones({
    etapa: activeTab === "revisar" ? "COMPRAS_PUBLICAS" : "CONTROL_PREVIO",
  });

  const colecciones =
    coleccionesQuery.data?.pages.flatMap((page) => page.data ?? []).filter(Boolean) || [];
  const isInitialLoading =
    coleccionesQuery.isLoading && colecciones.length === 0;

  const getEmptyStateProps = () => {
    if (activeTab === "revisar") {
      return {
        icon: "ion:shield-checkmark-outline",
        title: "Todo al día",
        description: "No hay expedientes pendientes de control previo.",
      };
    }
    return {
      icon: "ion:checkmark-done-circle-outline",
      title: "Sin historial",
      description: "Aún no has auditado expedientes.",
    };
  };

  const filterOptions = useMemo(
    () => [
      {
        value: "revisar",
        label: "Pendientes Control",
        color: "#EA580C",
      },
      {
        value: "historial",
        label: "Auditados",
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
          Control Previo
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {activeTab === "revisar" 
            ? "Expedientes aprobados por Compras Públicas para revisión final."
            : "Historial de expedientes auditados."}
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
          routePath="/(protected)/(control-previo)/coleccion"
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
