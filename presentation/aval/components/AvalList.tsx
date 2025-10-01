import { Aval } from "@/core/avales/interfaces/aval";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { AvalCard } from "./AvalCard";

interface AvalListProps {
  avales: Aval[];
  onEndReached: () => void;
  onEndReachedThreshold?: number;
}

export const AvalList = ({
  avales,
  onEndReached,
  onEndReachedThreshold = 0.5,
}: AvalListProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onPullToRefresh = async () => {
    setIsRefreshing(true);

    await new Promise((resolve) => setTimeout(resolve, 200));

    await queryClient.invalidateQueries({
      queryKey: ["avales", "infinite"],
    });

    setIsRefreshing(false);
  };

  return (
    <FlatList
      data={avales}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AvalCard aval={item} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onPullToRefresh} />
      }
    />
  );
};
