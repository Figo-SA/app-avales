import { EventoListSkeleton } from "@/presentation/event/components/EventoCardSkeleton";
import { EventoList } from "@/presentation/event/components/EventoList";
import { useEventos } from "@/presentation/event/hooks/useEventos";
import { ThemedView } from "@/presentation/theme/components/ThemedView";

export default function EventTab() {
  const { eventosQuery, loadNextPage } = useEventos();
  const eventos = eventosQuery.data?.pages.flat() || [];

  const isInitialLoading = eventosQuery.isLoading && eventos.length === 0;

  return (
    <ThemedView style={{ flex: 1 }}>
      {isInitialLoading ? (
        <EventoListSkeleton count={5} />
      ) : (
        <EventoList eventos={eventos} onEndReached={() => loadNextPage()} />
      )}
    </ThemedView>
  );
}
