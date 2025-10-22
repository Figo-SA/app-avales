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

  const isInitialLoading = avalesQuery.isLoading && avales.length === 0;

  // Mensajes del EmptyState según el filtro seleccionado
  const getEmptyStateProps = () => {
    switch (selectedStatus) {
      case "sent":
        return {
          icon: "ion:send-outline",
          title: "No hay avales enviados",
          description: "Aún no has enviado ningún aval",
        };
      case "pending":
        return {
          icon: "ion:time-outline",
          title: "No hay avales en revisión",
          description: "No tienes avales pendientes de revisión en este momento",
        };
      case "approved":
        return {
          icon: "ion:checkmark-circle-outline",
          title: "No hay avales aceptados",
          description: "Aún no tienes avales aceptados",
        };
      case "rejected":
        return {
          icon: "ion:close-circle-outline",
          title: "No hay avales rechazados",
          description: "No tienes avales rechazados",
        };
      default:
        return {
          icon: "ion:document-text-outline",
          title: "No hay avales",
          description: "Aún no tienes avales registrados. Crea tu primer aval presionando el botón +",
        };
    }
  };

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
          emptyStateProps={getEmptyStateProps()}
          filterKey={selectedStatus}
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
