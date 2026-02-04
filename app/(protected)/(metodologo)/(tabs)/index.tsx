import { ColeccionEstado } from "@/core/avales/actions/colecciones-actions";
import { ColeccionListSkeleton } from "@/presentation/coleccion/components/ColeccionCardSkeleton";
import { ColeccionList } from "@/presentation/coleccion/components/ColeccionList";
import { useColecciones } from "@/presentation/coleccion/hooks/useColecciones";
import { ChipFilterOption, ChipFilters } from "@/presentation/theme/components/ChipFilters";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type FilterStatus = "SOLICITADO" | "ACEPTADO" | "RECHAZADO";

export default function MetodologoDashboard() {
  const theme = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("SOLICITADO");

  const { coleccionesQuery, counts, loadNextPage } = useColecciones({
    estado: selectedStatus as ColeccionEstado,
    etapa: "SOLICITUD",
  });

  const colecciones =
    coleccionesQuery.data?.pages.flatMap((page) => page.data ?? []).filter(Boolean) || [];
  const isInitialLoading =
    coleccionesQuery.isLoading && colecciones.length === 0;

  const getEmptyStateProps = () => {
    switch (selectedStatus) {
      case "SOLICITADO":
        return {
          icon: "ion:time-outline",
          title: "No hay solicitudes pendientes",
          description: "Las solicitudes de aval pendientes de revisión aparecerán aquí.",
        };
      case "RECHAZADO":
        return {
          icon: "ion:close-circle-outline",
          title: "No hay solicitudes rechazadas",
          description: "Las solicitudes rechazadas aparecerán aquí.",
        };
      case "ACEPTADO":
        return {
          icon: "ion:checkmark-circle-outline",
          title: "No hay solicitudes aprobadas",
          description: "Las solicitudes aprobadas aparecerán aquí.",
        };
    }
  };

  const filterOptions: ChipFilterOption<FilterStatus>[] = useMemo(
    () => [
      {
        value: "SOLICITADO",
        label: "Pendientes",
        count: counts?.solicitado || 0,
        color: "#EA580C",
      },
      {
        value: "ACEPTADO",
        label: "Aprobadas",
        count: counts?.aceptado || 0,
        color: "#059669",
      },
      {
        value: "RECHAZADO",
        label: "Rechazadas",
        count: counts?.rechazado || 0,
        color: "#DC2626",
      },
    ],
    [counts]
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text
          variant="titleLarge"
          style={{ fontWeight: "700", color: theme.colors.onSurface }}
        >
          Solicitudes de Aval
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Revisa y gestiona las solicitudes de aval técnico.
        </Text>
      </View>

      <ChipFilters
        options={filterOptions}
        selectedValue={selectedStatus}
        onValueChange={(status) => setSelectedStatus(status as FilterStatus)}
      />

      {isInitialLoading ? (
        <ColeccionListSkeleton count={5} />
      ) : (
        <ColeccionList
          colecciones={colecciones}
          emptyStateProps={getEmptyStateProps()}
          filterKey={selectedStatus}
          routePath="/(protected)/(metodologo)/coleccion"
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
