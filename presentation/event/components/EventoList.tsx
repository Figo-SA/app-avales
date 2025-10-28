import { Evento } from "@/core/eventos/interfaces/evento";
import { EmptyState } from "@/presentation/theme/components/EmptyState";
import BottomSheet from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";
import { useTheme } from "react-native-paper";
import { EventoCard } from "./EventoCard";
import { EventoDetail } from "./EventoDetail";

interface EventoListProps {
  eventos: Evento[];
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  onRefresh?: () => Promise<void>;
  emptyStateProps?: {
    icon?: string;
    title: string;
    description?: string;
  };
  filterKey?: string;
  isLoadingMore?: boolean;
}

export const EventoList = ({
  eventos,
  onEndReached,
  onEndReachedThreshold = 0.5,
  emptyStateProps,
  filterKey = "default",
  isLoadingMore = false,
}: EventoListProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(
    null
  );
  const openBottomSheet = useCallback((evento: Evento) => {
    setEventoSeleccionado(evento);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const theme = useTheme();

  const onPullToRefresh = async () => {
    setIsRefreshing(true);

    await new Promise((resolve) => setTimeout(resolve, 200));

    await queryClient.invalidateQueries({
      queryKey: ["eventos", "infinite"],
    });

    setIsRefreshing(false);
  };

  const renderEmptyComponent = () => (
    <EmptyState
      icon={emptyStateProps?.icon || "ion:calendar-outline"}
      title={emptyStateProps?.title || "No hay eventos"}
      description={
        emptyStateProps?.description ||
        "No se encontraron eventos disponibles en este momento"
      }
    />
  );

  return (
    <>
      <FlatList
        key={filterKey} // Fuerza reset del FlatList cuando cambia el filtro
        data={eventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventoCard evento={item} onPress={() => openBottomSheet(item)} />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          eventos.length === 0
            ? { flex: 1, justifyContent: "center" }
            : { padding: 16, paddingBottom: 100 }
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onPullToRefresh}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : null
        }
      />

      <EventoDetail
        ref={bottomSheetRef}
        evento={eventoSeleccionado}
      />
    </>
  );
};
