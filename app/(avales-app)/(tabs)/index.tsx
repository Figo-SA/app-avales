import { AvalFilters } from "@/presentation/aval/components/AvalFilters";
import { AvalList } from "@/presentation/aval/components/AvalList";
import { useAvalFilters } from "@/presentation/aval/hooks/useAvalFilters";
import { useAvales } from "@/presentation/aval/hooks/useAvales";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export default function AvalesTab() {
  const { avalesQuery, loadNextPage } = useAvales();
  const theme = useTheme();

  const avales = avalesQuery.data?.pages.flat() || [];
  const { selectedStatus, setSelectedStatus, counts, filteredAvales } =
    useAvalFilters(avales);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AvalFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        counts={counts}
      />

      <AvalList
        avales={filteredAvales}
        onEndReached={() => {
          if (selectedStatus === "all") {
            loadNextPage();
          }
        }}
      />
    </View>
  );
}
