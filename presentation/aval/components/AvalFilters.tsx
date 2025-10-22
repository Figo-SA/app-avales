import { ChipFilters, ChipFilterOption } from "@/presentation/theme/components/ChipFilters";
import { useMemo } from "react";

interface AvalFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  counts: {
    all: number;
    sent: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const AvalFilters = ({
  selectedStatus,
  onStatusChange,
  counts,
}: AvalFiltersProps) => {
  const options: ChipFilterOption<string>[] = useMemo(
    () => [
      { value: "all", label: "Todos", count: counts.all },
      { value: "sent", label: "Enviados", count: counts.sent },
      { value: "pending", label: "En revisión", count: counts.pending, color: "#FF9800" },
      { value: "approved", label: "Aceptados", count: counts.approved, color: "#4CAF50" },
      { value: "rejected", label: "Rechazados", count: counts.rejected, color: "#F44336" },
    ],
    [counts]
  );

  return (
    <ChipFilters
      options={options}
      selectedValue={selectedStatus}
      onValueChange={onStatusChange}
    />
  );
};
