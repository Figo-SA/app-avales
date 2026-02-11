import { Aval } from "@/core/avales/interfaces/aval";
import { useMemo, useState } from "react";

export const useAvalFilters = (avales: Aval[]) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const counts = useMemo(() => {
    return {
      all: avales.length,
      solicitado: avales.filter((a) => a.estado === "SOLICITADO").length,
      borrador: avales.filter((a) => a.estado === "BORRADOR").length,
      aceptado: avales.filter((a) => a.estado === "ACEPTADO").length,
      rechazado: avales.filter((a) => a.estado === "RECHAZADO").length,
    };
  }, [avales]);

  // Filtrar avales según el estado seleccionado
  const filteredAvales = useMemo(() => {
    if (selectedStatus === "all") {
      return avales;
    }
    return avales.filter((aval) => aval.estado === selectedStatus);
  }, [avales, selectedStatus]);

  return {
    selectedStatus,
    setSelectedStatus,
    counts,
    filteredAvales,
  };
};
