import { ColeccionAval } from "@/core/avales/interfaces/coleccion";
import { EmptyState } from "@/presentation/theme/components/EmptyState";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { ColeccionCard } from "./ColeccionCard";

interface ColeccionListProps {
  colecciones: ColeccionAval[];
  emptyStateProps?: {
    icon: string;
    title: string;
    description: string;
  };
  filterKey?: string;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  isLoadingMore?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  routePath?: string;
}

export const ColeccionList = ({
  colecciones,
  emptyStateProps = {
    icon: "ion:document-text-outline",
    title: "Sin solicitudes",
    description: "No hay solicitudes de aval en este momento.",
  },
  filterKey,
  onEndReached,
  onEndReachedThreshold = 0.5,
  isLoadingMore = false,
  onRefresh,
  isRefreshing = false,
  routePath,
}: ColeccionListProps) => {
  const theme = useTheme();
  const [isRefreshingInternal, setIsRefreshingInternal] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setIsRefreshingInternal(true);
      await onRefresh();
      setIsRefreshingInternal(false);
    }
  }, [onRefresh]);

  const renderItem = useCallback(
    ({ item }: { item: ColeccionAval }) => {
      if (!item) return null;
      return <ColeccionCard item={item} routePath={routePath} />;
    },
    [routePath]
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [isLoadingMore, theme.colors.primary]);

  const renderEmpty = useCallback(
    () => (
      <EmptyState
        icon={emptyStateProps.icon}
        title={emptyStateProps.title}
        description={emptyStateProps.description}
      />
    ),
    [emptyStateProps]
  );

  const keyExtractor = useCallback(
    (item: ColeccionAval, index: number) => `${filterKey}-${item?.id ?? index}`,
    [filterKey]
  );

  return (
    <FlatList
      data={colecciones}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing || isRefreshingInternal}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
