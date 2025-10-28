import { useState } from "react";

export type EventoFilterStatus = "all" | "disponibles" | "solicitados" | "rechazados" | "aceptados";

// Mapeo de filtro de UI a estado del backend
export const mapFilterToEstado = (filter: EventoFilterStatus): string | undefined => {
  if (filter === "all") return undefined;
  if (filter === "disponibles") return "disponible";
  if (filter === "solicitados") return "solicitado";
  if (filter === "rechazados") return "rechazado";
  if (filter === "aceptados") return "aceptado";
  return undefined;
};

export const useEventoChipFilters = () => {
  const [selectedStatus, setSelectedStatus] = useState<EventoFilterStatus>("all");

  return {
    selectedStatus,
    setSelectedStatus,
    estadoFilter: mapFilterToEstado(selectedStatus),
  };
};
