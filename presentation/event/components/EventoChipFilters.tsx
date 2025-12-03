import { EventoFilterStatus } from "@/presentation/event/hooks/useEventoChipFilters";
import { ChipFilterOption, ChipFilters } from "@/presentation/theme/components/ChipFilters";
import { useMemo } from "react";

interface EventoChipFiltersProps {
  selectedStatus: EventoFilterStatus;
  onStatusChange: (status: EventoFilterStatus) => void;
  counts: {
    all: number;
    disponibles: number;
    solicitados: number;
    rechazados: number;
    aceptados: number;
  };
  overrideOptions?: ChipFilterOption<any>[];
}

export const EventoChipFilters = ({
  selectedStatus,
  onStatusChange,
  counts,
  overrideOptions,
}: EventoChipFiltersProps) => {
  const defaultOptions: ChipFilterOption<EventoFilterStatus>[] = useMemo(
    () => [
      { value: "all", label: "Todos", count: counts?.all || 0 },
      { value: "disponibles", label: "Disponibles", count: counts?.disponibles || 0, color: "#4CAF50" },
      { value: "solicitados", label: "Solicitados", count: counts?.solicitados || 0, color: "#FF9800" },
      { value: "rechazados", label: "Rechazados", count: counts?.rechazados || 0, color: "#F44336" },
      { value: "aceptados", label: "Aceptados", count: counts?.aceptados || 0, color: "#2196F3" },
    ],
    [counts]
  );

  return (
    <ChipFilters
      options={overrideOptions || defaultOptions}
      selectedValue={selectedStatus}
      onValueChange={onStatusChange}
    />
  );
};
