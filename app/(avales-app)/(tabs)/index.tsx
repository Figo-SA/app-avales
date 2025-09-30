import { AvalCard } from "@/presentation/aval/components/AvalCard";
import { useAvales } from "@/presentation/aval/hooks/useAvales";
import React from "react";
import { FlatList, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function AvalesTab() {
  const { avalesQuery, loadNextPage } = useAvales();
  const theme = useTheme();

  const avales = avalesQuery.data?.pages.flat() || [];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={avales}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AvalCard aval={item} />}
        onEndReached={() => loadNextPage()}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
