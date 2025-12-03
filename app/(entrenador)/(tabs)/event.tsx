import { EventoListSkeleton } from "@/presentation/event/components/EventoCardSkeleton";
import { EventoList } from "@/presentation/event/components/EventoList";
import { EventoSearchBar } from "@/presentation/event/components/EventoSearchBar";
import { useEventos } from "@/presentation/event/hooks/useEventos";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useState } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function EventTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();

  // Forzamos el estado a "disponibles" para la pestaña Explorar
  const { eventosQuery, loadNextPage } = useEventos({
    estado: "disponibles",
    search: searchQuery,
  });

  const eventos = eventosQuery.data?.pages.flatMap((page) => page.items) || [];
  const isInitialLoading = eventosQuery.isLoading && eventos.length === 0;

  const getEmptyStateProps = () => {
    if (searchQuery.trim() !== "") {
      return {
        icon: "ion:search-outline",
        title: "No se encontraron resultados",
        description: `No hay eventos disponibles que coincidan con "${searchQuery}"`,
      };
    }

    return {
      icon: "ion:compass-outline",
      title: "No hay eventos disponibles",
      description: "No encontramos eventos nuevos para explorar en este momento. Intenta más tarde.",
    };
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text variant="titleMedium" style={{ fontWeight: "700", color: theme.colors.onSurface }}>
          Encuentra tu próximo evento
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Explora los eventos disponibles y solicita tu aval.
        </Text>
      </View>

      {/* Buscador */}
      <EventoSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar eventos..."
      />

      {isInitialLoading ? (
        <EventoListSkeleton count={5} />
      ) : (
        <EventoList
          eventos={eventos}
          emptyStateProps={getEmptyStateProps()}
          filterKey={`disponibles-${searchQuery}`}
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
