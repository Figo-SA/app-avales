import { ChipFilters, ChipFilterOption } from "@/presentation/theme/components/ChipFilters";
import { EventoFilterStatus } from "@/presentation/event/hooks/useEventoChipFilters";
import { useMemo } from "react";

interface EventoChipFiltersProps {
  selectedStatus: EventoFilterStatus;
  onStatusChange: (status: EventoFilterStatus) => void;
  counts: {
    all: number;
    disponibles: number;
    solicitados: number;
  };
}

export const EventoChipFilters = ({
  selectedStatus,
  onStatusChange,
  counts,
}: EventoChipFiltersProps) => {
  const options: ChipFilterOption<EventoFilterStatus>[] = useMemo(
    () => [
      { value: "all", label: "Todos", count: counts.all },
      { value: "disponibles", label: "Disponibles", count: counts.disponibles, color: "#4CAF50" },
      { value: "solicitados", label: "Solicitados", count: counts.solicitados, color: "#FF9800" },
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
