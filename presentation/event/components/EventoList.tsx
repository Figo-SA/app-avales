import { Evento } from "@/core/eventos/interfaces/evento";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import BottomSheet from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { EventoCard } from "./EventoCard";
import { EventoDetail } from "./EventoDetail";
interface EventoListProps {
  eventos: Evento[];
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  onRefresh?: () => Promise<void>;
}

export const EventoList = ({
  eventos,
  onEndReached,
  onEndReachedThreshold = 0.5,
}: EventoListProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(
    null
  );
  const openBottomSheet = useCallback((evento: Evento) => {
    setEventoSeleccionado(evento);
    bottomSheetRef.current?.expand();
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onPullToRefresh = async () => {
    setIsRefreshing(true);

    await new Promise((resolve) => setTimeout(resolve, 200));

    await queryClient.invalidateQueries({
      queryKey: ["eventos", "infinite"],
    });

    setIsRefreshing(false);
  };

  const renderEmptyComponent = () => (
    <ThemedView className="flex-1 justify-center items-center p-8">
      <ThemedText className="text-gray-500 text-center text-lg">
        No se encontraron eventos
      </ThemedText>
      <ThemedText className="text-gray-400 text-center mt-2">
        Prueba ajustando los filtros de búsqueda
      </ThemedText>
    </ThemedView>
  );

  return (
    <>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.codigoItem.toString()}
        renderItem={({ item }) => (
          <EventoCard evento={item} onPress={() => openBottomSheet(item)} />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onPullToRefresh}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
      />

      <EventoDetail
        ref={bottomSheetRef}
        evento={eventoSeleccionado}
        onDocumentUploaded={(file) => {
          console.log("Documento subido:", file.name);
          // Aquí puedes agregar la lógica para enviar el archivo al servidor
        }}
      />
    </>
  );
};
