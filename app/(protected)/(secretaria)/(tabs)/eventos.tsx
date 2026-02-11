import { CrudList } from "@/presentation/admin/components/CrudList";
import { AdminEventoCard } from "@/presentation/admin/components/AdminEventoCard";
import { useAdminEventos } from "@/presentation/admin/hooks/useAdminEventos";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

export default function SecretariaEventosScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const { query, loadNextPage } = useAdminEventos({ search });

  const eventos = query.data?.pages.flatMap((page) => page.items) || [];
  const totalEventos = query.data?.pages[0]?.pagination?.total || 0;
  const styles = createStyles(theme);

  if (query.isLoading && !query.data) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Icon source="ion:calendar" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text variant="titleLarge" style={styles.headerTitle}>
              Eventos
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              {totalEventos > 0
                ? `${totalEventos} evento${totalEventos !== 1 ? "s" : ""} registrado${totalEventos !== 1 ? "s" : ""}`
                : "Gestiona los eventos deportivos"}
            </Text>
          </View>
        </View>
      </View>

      <CrudList
        data={eventos}
        keyExtractor={(evento) => evento.id.toString()}
        renderItem={(evento) => (
          <AdminEventoCard
            evento={evento}
            onPress={() =>
              router.push({
                pathname: "/(protected)/(secretaria)/evento/[id]",
                params: { id: evento.id },
              } as any)
            }
          />
        )}
        search={search}
        onSearchChange={setSearch}
        onEndReached={() => {
          if (query.hasNextPage) loadNextPage();
        }}
        onRefresh={async () => {
          await query.refetch();
        }}
        onAdd={() =>
          router.push("/(protected)/(secretaria)/evento/create" as any)
        }
        isLoadingMore={query.isFetchingNextPage}
        searchPlaceholder="Buscar por nombre, disciplina..."
        emptyIcon="ion:calendar-outline"
        emptyTitle="No hay eventos"
        emptyDescription="No se encontraron eventos. Presiona + para agregar uno."
      />
    </ThemedView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
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
