import { EventoListSkeleton } from "@/presentation/event/components/EventoCardSkeleton";
import { EventoList } from "@/presentation/event/components/EventoList";
import { EventoSearchBar } from "@/presentation/event/components/EventoSearchBar";
import { useEventos } from "@/presentation/event/hooks/useEventos";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

export default function EventTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();

  // Forzamos el estado a "disponibles" para la pestaña Explorar
  const { eventosQuery, loadNextPage } = useEventos({
    estado: "disponibles",
    search: searchQuery,
  });

  const eventos = eventosQuery.data?.pages.flatMap((page) => page.items) || [];
  const totalEventos = eventosQuery.data?.pages[0]?.pagination?.total || 0;
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

  const styles = createStyles(theme);

  return (
    <ThemedView style={styles.container}>
      {/* Header mejorado */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Icon source="ion:compass" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text variant="titleLarge" style={styles.headerTitle}>
              Explorar Eventos
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              {totalEventos > 0
                ? `${totalEventos} evento${totalEventos !== 1 ? "s" : ""} disponible${totalEventos !== 1 ? "s" : ""}`
                : "Encuentra tu próximo evento"}
            </Text>
          </View>
        </View>
      </View>

      {/* Buscador */}
      <EventoSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar por nombre, disciplina..."
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

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    headerIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: theme.colors.primaryContainer,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTextContainer: {
      flex: 1,
    },
    headerTitle: {
      fontWeight: "800",
      color: theme.colors.onSurface,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },
  });
