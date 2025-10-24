import { Evento } from "@/core/eventos/interfaces/evento";
import { useMemo, useState } from "react";

export type EventoFilterStatus = "all" | "disponibles" | "solicitados" | "rechazados" | "aceptados";

export const useEventoChipFilters = (eventos: Evento[]) => {
  const [selectedStatus, setSelectedStatus] = useState<EventoFilterStatus>("all");

  const counts = useMemo(() => {
    return {
      all: eventos.length,
      disponibles: eventos.filter((e) => (e.estado || "disponible") === "disponible").length,
      solicitados: eventos.filter((e) => (e.estado || "disponible") === "solicitado").length,
      rechazados: eventos.filter((e) => (e.estado || "disponible") === "rechazado").length,
      aceptados: eventos.filter((e) => (e.estado || "disponible") === "aceptado").length,
    };
  }, [eventos]);

  // Filtrar eventos según el estado seleccionado
  const filteredEventos = useMemo(() => {
    if (selectedStatus === "all") {
      return eventos;
    }
    return eventos.filter((evento) => {
      const estado = evento.estado || "disponible";
      if (selectedStatus === "disponibles") return estado === "disponible";
      if (selectedStatus === "solicitados") return estado === "solicitado";
      if (selectedStatus === "rechazados") return estado === "rechazado";
      if (selectedStatus === "aceptados") return estado === "aceptado";
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
