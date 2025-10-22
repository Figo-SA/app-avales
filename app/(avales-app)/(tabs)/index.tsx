import { AvalFilters } from "@/presentation/aval/components/AvalFilters";
import { AvalList } from "@/presentation/aval/components/AvalList";
import { AvalListSkeleton } from "@/presentation/aval/components/AvalCardSkeleton";
import { useAvalFilters } from "@/presentation/aval/hooks/useAvalFilters";
import { useAvales } from "@/presentation/aval/hooks/useAvales";
import { ThemedView } from "@/presentation/theme/components/ThemedView";

export default function AvalesTab() {
  const { avalesQuery, loadNextPage } = useAvales();

  const avales = avalesQuery.data?.pages.flat() || [];
  const { selectedStatus, setSelectedStatus, counts, filteredAvales } =
    useAvalFilters(avales);

  // Mostrar skeleton durante la carga inicial
  const isInitialLoading = avalesQuery.isLoading && avales.length === 0;

  return (
    <ThemedView style={{ flex: 1 }}>
      <AvalFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        counts={counts}
      />

      {isInitialLoading ? (
        <AvalListSkeleton count={5} />
      ) : (
        <AvalList
          avales={filteredAvales}
          onEndReached={() => {
            if (selectedStatus === "all") {
              loadNextPage();
            }
          }}
        />
      )}
    </ThemedView>
  );
}
