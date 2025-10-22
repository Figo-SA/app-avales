import { Evento } from "@/core/eventos/interfaces/evento";
import { useMemo, useState } from "react";

export type EventoFilterStatus = "all" | "disponibles" | "solicitados";

export const useEventoChipFilters = (eventos: Evento[]) => {
  const [selectedStatus, setSelectedStatus] = useState<EventoFilterStatus>("all");

  const counts = useMemo(() => {
    return {
      all: eventos.length,
      disponibles: eventos.filter((e) => !e.solicitado).length,
      solicitados: eventos.filter((e) => e.solicitado === true).length,
    };
  }, [eventos]);

  // Filtrar eventos según el estado seleccionado
  const filteredEventos = useMemo(() => {
    if (selectedStatus === "all") {
      return eventos;
    }
    if (selectedStatus === "disponibles") {
      return eventos.filter((evento) => !evento.solicitado);
    }
    if (selectedStatus === "solicitados") {
      return eventos.filter((evento) => evento.solicitado === true);
    }
    return eventos;
  }, [eventos, selectedStatus]);

  return {
    selectedStatus,
    setSelectedStatus,
    counts,
    filteredEventos,
  };
};
