import { CrudList } from "@/presentation/admin/components/CrudList";
import { DeportistaCard } from "@/presentation/admin/components/DeportistaCard";
import { useDeportistas } from "@/presentation/admin/hooks/useDeportistas";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

export default function DeportistasScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const { query, loadNextPage } = useDeportistas({ search });

  const deportistas =
    query.data?.pages.flatMap((page) => page.items) || [];
  const totalDeportistas = query.data?.pages[0]?.pagination?.total || 0;
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
            <Icon source="ion:fitness" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text variant="titleLarge" style={styles.headerTitle}>
              Deportistas
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              {totalDeportistas > 0
                ? `${totalDeportistas} deportista${totalDeportistas !== 1 ? "s" : ""} registrado${totalDeportistas !== 1 ? "s" : ""}`
                : "Gestiona los deportistas"}
            </Text>
          </View>
        </View>
      </View>

      <CrudList
        data={deportistas}
        keyExtractor={(d) => d.id.toString()}
        renderItem={(deportista) => (
          <DeportistaCard
            deportista={deportista}
            onPress={() =>
              router.push({
                pathname: "/(protected)/(admin)/deportista/[id]",
                params: { id: deportista.id },
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
          router.push("/(protected)/(admin)/deportista/create" as any)
        }
        isLoadingMore={query.isFetchingNextPage}
        searchPlaceholder="Buscar por nombre, cédula..."
        emptyIcon="ion:fitness-outline"
        emptyTitle="No hay deportistas"
        emptyDescription="No se encontraron deportistas. Presiona + para agregar uno."
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
