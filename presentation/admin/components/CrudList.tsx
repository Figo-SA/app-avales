import { EmptyState } from "@/presentation/theme/components/EmptyState";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { FAB, useTheme } from "react-native-paper";
import { SearchBar } from "./SearchBar";

interface CrudListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactElement;
  keyExtractor: (item: T) => string;
  search: string;
  onSearchChange: (text: string) => void;
  onEndReached?: () => void;
  onRefresh: () => Promise<void>;
  onAdd: () => void;
  isLoadingMore?: boolean;
  searchPlaceholder?: string;
  emptyIcon?: string;
  emptyTitle: string;
  emptyDescription?: string;
}

export function CrudList<T>({
  data,
  renderItem,
  keyExtractor,
  search,
  onSearchChange,
  onEndReached,
  onRefresh,
  onAdd,
  isLoadingMore = false,
  searchPlaceholder,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: CrudListProps<T>) {
  const theme = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={search}
        onChangeText={onSearchChange}
        placeholder={searchPlaceholder}
      />
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderItem(item)}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          data.length === 0 ? styles.emptyContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={emptyIcon || "ion:file-tray-outline"}
            title={emptyTitle}
            description={emptyDescription}
          />
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : null
        }
      />
      <FAB
        icon="ion:add"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#FFFFFF"
        onPress={onAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  loader: {
    padding: 20,
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    borderRadius: 16,
  },
});
