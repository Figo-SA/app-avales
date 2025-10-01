import { Aval } from "@/core/avales/interfaces/aval";

import { FlatList } from "react-native";
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
  return (
    <FlatList
      data={avales}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AvalCard aval={item} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};
