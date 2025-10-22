import { EventoListSkeleton } from "@/presentation/event/components/EventoCardSkeleton";
import { EventoChipFilters } from "@/presentation/event/components/EventoChipFilters";
import { EventoList } from "@/presentation/event/components/EventoList";
import { useEventoChipFilters } from "@/presentation/event/hooks/useEventoChipFilters";
import { useEventos } from "@/presentation/event/hooks/useEventos";
import { ThemedView } from "@/presentation/theme/components/ThemedView";

export default function EventTab() {
  const { eventosQuery, loadNextPage } = useEventos();

  const eventos = eventosQuery.data?.pages.flat() || [];
  const { selectedStatus, setSelectedStatus, counts, filteredEventos } =
    useEventoChipFilters(eventos);

  const isInitialLoading = eventosQuery.isLoading && eventos.length === 0;

  // Mensajes del EmptyState según el filtro seleccionado
  const getEmptyStateProps = () => {
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
          description: "No tienes eventos rechazados. Puedes revisar el motivo y volver a solicitar.",
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
      <EventoChipFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        counts={counts}
      />

      {isInitialLoading ? (
        <EventoListSkeleton count={5} />
      ) : (
        <EventoList
          eventos={filteredEventos}
          emptyStateProps={getEmptyStateProps()}
          filterKey={selectedStatus}
          onEndReached={() => {
            if (selectedStatus === "all") {
              loadNextPage();
            }
          }}
        />
      )}
    </ThemedView>
  );
}
