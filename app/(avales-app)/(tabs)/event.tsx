import { EventoListSkeleton } from "@/presentation/event/components/EventoCardSkeleton";
import { EventoChipFilters } from "@/presentation/event/components/EventoChipFilters";
import { EventoList } from "@/presentation/event/components/EventoList";
import { EventoSearchBar } from "@/presentation/event/components/EventoSearchBar";
import { useEventoChipFilters } from "@/presentation/event/hooks/useEventoChipFilters";
import { useEventos } from "@/presentation/event/hooks/useEventos";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useState } from "react";

export default function EventTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const { selectedStatus, setSelectedStatus, estadoFilter } =
    useEventoChipFilters();

  const { eventosQuery, loadNextPage, counts } = useEventos({
    estado: estadoFilter,
    search: searchQuery,
  });

  const eventos = eventosQuery.data?.pages.flatMap((page) => page.items) || [];

  const isInitialLoading = eventosQuery.isLoading && eventos.length === 0;

  const getEmptyStateProps = () => {
    if (searchQuery.trim() !== "") {
      return {
        icon: "ion:search-outline",
        title: "No se encontraron resultados",
        description: `No hay eventos que coincidan con "${searchQuery}"`,
      };
    }

    switch (selectedStatus) {
      case "disponibles":
        return {
          icon: "ion:calendar-clear-outline",
          title: "No hay eventos disponibles",
          description: "Actualmente no hay eventos disponibles para solicitar",
        };
      case "solicitados":
        return {
          icon: "ion:time-outline",
          title: "No hay eventos solicitados",
          description:
            "Aún no has solicitado ningún evento. Busca eventos disponibles y solicita uno.",
        };
      case "rechazados":
        return {
          icon: "ion:close-circle-outline",
          title: "No hay eventos rechazados",
          description:
            "No tienes eventos rechazados. Puedes revisar el motivo y volver a solicitar.",
        };
      case "aceptados":
        return {
          icon: "ion:checkmark-circle-outline",
          title: "No hay eventos aceptados",
          description: "Aún no tienes eventos aceptados",
        };
      default:
        return {
          icon: "ion:calendar-outline",
          title: "No hay eventos",
          description: "No se encontraron eventos disponibles en este momento",
        };
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Buscador */}
      <EventoSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar eventos por nombre, código, lugar..."
      />

      {/* Filtros por estado */}
      <EventoChipFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        counts={{
          all:
            (counts?.disponibles || 0) +
            (counts?.solicitados || 0) +
            (counts?.rechazados || 0) +
            (counts?.aceptados || 0),
          disponibles: counts?.disponibles || 0,
          solicitados: counts?.solicitados || 0,
          rechazados: counts?.rechazados || 0,
          aceptados: counts?.aceptados || 0,
        }}
      />

      {isInitialLoading ? (
        <EventoListSkeleton count={5} />
      ) : (
        <EventoList
          eventos={eventos}
          emptyStateProps={getEmptyStateProps()}
          filterKey={`${selectedStatus}-${searchQuery}`}
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
