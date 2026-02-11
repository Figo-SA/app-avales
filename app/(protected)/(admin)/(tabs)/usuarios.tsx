import { CrudList } from "@/presentation/admin/components/CrudList";
import { UserCard } from "@/presentation/admin/components/UserCard";
import { useUsers } from "@/presentation/admin/hooks/useUsers";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

export default function UsuariosScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const { query, loadNextPage } = useUsers({ search });

  const users = query.data?.pages.flatMap((page) => page.items) || [];
  const totalUsers = query.data?.pages[0]?.pagination?.total || 0;
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
            <Icon source="ion:people" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text variant="titleLarge" style={styles.headerTitle}>
              Usuarios
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              {totalUsers > 0
                ? `${totalUsers} usuario${totalUsers !== 1 ? "s" : ""} registrado${totalUsers !== 1 ? "s" : ""}`
                : "Gestiona los usuarios del sistema"}
            </Text>
          </View>
        </View>
      </View>

      <CrudList
        data={users}
        keyExtractor={(user) => user.id.toString()}
        renderItem={(user) => (
          <UserCard
            user={user}
            onPress={() =>
              router.push({
                pathname: "/(protected)/(admin)/usuario/[id]",
                params: { id: user.id },
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
        onAdd={() => router.push("/(protected)/(admin)/usuario/create" as any)}
        isLoadingMore={query.isFetchingNextPage}
        searchPlaceholder="Buscar por nombre, email..."
        emptyIcon="ion:people-outline"
        emptyTitle="No hay usuarios"
        emptyDescription="No se encontraron usuarios. Presiona + para agregar uno."
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
