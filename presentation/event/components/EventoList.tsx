import { Evento } from "@/core/eventos/interfaces/evento";
import { EmptyState } from "@/presentation/theme/components/EmptyState";
import BottomSheet from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { EventoCard } from "./EventoCard";
import { EventoRechazoBottomSheet } from "./EventoRechazoBottomSheet";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [eventoRechazado, setEventoRechazado] = useState<Evento | null>(null);
  const rechazoSheetRef = useRef<BottomSheet>(null);
  const queryClient = useQueryClient();
  const theme = useTheme();

  const handleEventoPress = (evento: Evento) => {
    const estadoEvento = evento.estado?.toLowerCase() || "disponible";

    // Rechazado: Mostrar bottom sheet con motivo
    if (estadoEvento === "rechazado") {
      setEventoRechazado(evento);
      rechazoSheetRef.current?.expand();
      return;
    }

    // Solicitado: Navegar a pantalla de resumen
    if (estadoEvento === "solicitado") {
      router.push(`/(entrenador)/evento/${evento.id}`);
      return;
    }

    // Disponible: Navegar a solicitud
    if (estadoEvento === "disponible") {
      router.push(`/(entrenador)/solicitud/${evento.id}`);
      return;
    }

    // Aceptado: Navegar a resumen también
    if (estadoEvento === "aceptado") {
      router.push(`/(entrenador)/evento/${evento.id}`);
      return;
    }
  };

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
          <EventoCard evento={item} onPress={() => handleEventoPress(item)} />
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

      <EventoRechazoBottomSheet
        ref={rechazoSheetRef}
        evento={eventoRechazado}
      />
    </>
  );
};
