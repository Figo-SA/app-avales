import { EventoList } from "@/presentation/event/components/EventoList";
import { useEventos } from "@/presentation/event/hooks/useEventos";
import { ThemedView } from "@/presentation/theme/components/ThemedView";

export default function EventTab() {
  const { eventosQuery, loadNextPage } = useEventos();
  const eventos = eventosQuery.data?.pages.flat() || [];

  return (
    <ThemedView style={{ flex: 1 }}>
      <EventoList eventos={eventos} onEndReached={() => loadNextPage()} />
    </ThemedView>
  );
}
