import { Aval } from "@/core/avales/interfaces/aval";
import { useMemo, useState } from "react";

export const useAvalFilters = (avales: Aval[]) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const counts = useMemo(() => {
    return {
      all: avales.length,
      sent: avales.filter((a) => a.status === "sent").length,
      pending: avales.filter((a) => a.status === "pending").length,
      approved: avales.filter((a) => a.status === "approved").length,
      rejected: avales.filter((a) => a.status === "rejected").length,
    };
  }, [avales]);

  // Filtrar avales según el estado seleccionado
  const filteredAvales = useMemo(() => {
    if (selectedStatus === "all") {
      return avales;
    }
    return avales.filter((aval) => aval.status === selectedStatus);
  }, [avales, selectedStatus]);

  return {
    selectedStatus,
    setSelectedStatus,
    counts,
    filteredAvales,
  };
};
