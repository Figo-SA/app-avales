import { EventoListSkeleton } from "@/presentation/event/components/EventoCardSkeleton";
import { EventoChipFilters } from "@/presentation/event/components/EventoChipFilters";
import { EventoList } from "@/presentation/event/components/EventoList";
import { useEventos } from "@/presentation/event/hooks/useEventos";
import { ChipFilterOption } from "@/presentation/theme/components/ChipFilters";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type SolicitudStatus = "solicitados" | "rechazados" | "aceptados" | "borrador";

export default function MisSolicitudesTab() {
  const [selectedStatus, setSelectedStatus] = useState<SolicitudStatus>("solicitados");
  const theme = useTheme();

  const { eventosQuery, loadNextPage, counts } = useEventos({
    estado: selectedStatus,
  });

  const eventos = eventosQuery.data?.pages.flatMap((page) => page.items) || [];
  const isInitialLoading = eventosQuery.isLoading && eventos.length === 0;

  const getEmptyStateProps = () => {
    switch (selectedStatus) {
      case "solicitados":
        return {
          icon: "ion:time-outline",
          title: "No tienes solicitudes en revisión",
          description: "Tus solicitudes pendientes de aprobación aparecerán aquí.",
        };
      case "rechazados":
        return {
          icon: "ion:close-circle-outline",
          title: "No tienes solicitudes rechazadas",
          description: "Aquí verás las solicitudes que requieran correcciones.",
        };
      case "aceptados":
        return {
          icon: "ion:checkmark-circle-outline",
          title: "No tienes avales aceptados",
          description: "Cuando tus solicitudes sean aprobadas, tus avales aparecerán aquí.",
        };
      case "borrador":
        return {
          icon: "ion:document-text-outline",
          title: "No tienes borradores",
          description: "Aquí aparecerán las solicitudes que has iniciado pero no completado.",
        };
    }
  };

  const filterOptions: ChipFilterOption<SolicitudStatus>[] = useMemo(
    () => [
      { 
        value: "borrador", 
        label: "Borradores", 
        count: (counts as any)?.borradores || 0, 
        color: "#6B7280" 
      },
      { 
        value: "rechazados", 
        label: "Rechazados", 
        count: counts?.rechazados || 0, 
        color: "#DC2626" 
      },
      { 
        value: "solicitados", 
        label: "En Revisión", 
        count: counts?.solicitados || 0, 
        color: "#EA580C" 
      },
      { 
        value: "aceptados", 
        label: "Aceptados", 
        count: counts?.aceptados || 0, 
        color: "#059669" 
      },
    ],
    [counts]
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text variant="titleMedium" style={{ fontWeight: "700", color: theme.colors.onSurface }}>
          Gestiona tus trámites
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Revisa el estado de tus solicitudes y descarga tus avales.
        </Text>
      </View>

      <EventoChipFilters
        selectedStatus={selectedStatus as any}
        onStatusChange={(status) => setSelectedStatus(status as SolicitudStatus)}
        counts={counts as any}
        // Override options to only show what we want
        overrideOptions={filterOptions as any}
      />

      {isInitialLoading ? (
        <EventoListSkeleton count={5} />
      ) : (
        <EventoList
          eventos={eventos}
          emptyStateProps={getEmptyStateProps()}
          filterKey={selectedStatus}
          onEndReached={() => {
            if (eventosQuery.hasNextPage && !eventosQuery.isFetchingNextPage) {
              loadNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          isLoadingMore={eventosQuery.isFetchingNextPage}
        />
      )}
    </ThemedView>
  );
}
