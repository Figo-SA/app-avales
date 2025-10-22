import { Evento } from "@/core/eventos/interfaces/evento";
import { useMemo, useState } from "react";

export type EventoFilterStatus = "all" | "disponibles" | "solicitados" | "rechazados" | "aceptados";

export const useEventoChipFilters = (eventos: Evento[]) => {
  const [selectedStatus, setSelectedStatus] = useState<EventoFilterStatus>("all");

  const counts = useMemo(() => {
    return {
      all: eventos.length,
      disponibles: eventos.filter((e) => e.estado === "disponible").length,
      solicitados: eventos.filter((e) => e.estado === "solicitado").length,
      rechazados: eventos.filter((e) => e.estado === "rechazado").length,
      aceptados: eventos.filter((e) => e.estado === "aceptado").length,
    };
  }, [eventos]);

  // Filtrar eventos según el estado seleccionado
  const filteredEventos = useMemo(() => {
    if (selectedStatus === "all") {
      return eventos;
    }
    return eventos.filter((evento) => {
      if (selectedStatus === "disponibles") return evento.estado === "disponible";
      if (selectedStatus === "solicitados") return evento.estado === "solicitado";
      if (selectedStatus === "rechazados") return evento.estado === "rechazado";
      if (selectedStatus === "aceptados") return evento.estado === "aceptado";
      return true;
    });
  }, [eventos, selectedStatus]);

  return {
    selectedStatus,
    setSelectedStatus,
    counts,
    filteredEventos,
  };
};
