import { AvalFilters } from "@/presentation/aval/components/AvalFilters";
import { AvalList } from "@/presentation/aval/components/AvalList";
import { useAvalFilters } from "@/presentation/aval/hooks/useAvalFilters";
import { useAvales } from "@/presentation/aval/hooks/useAvales";
import { ThemedView } from "@/presentation/theme/components/ThemedView";

export default function AvalesTab() {
  const { avalesQuery, loadNextPage } = useAvales();

  const avales = avalesQuery.data?.pages.flat() || [];
  const { selectedStatus, setSelectedStatus, counts, filteredAvales } =
    useAvalFilters(avales);

  return (
    <ThemedView style={{ flex: 1 }}>
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
    </ThemedView>
  );
}
