import { EventoFilters } from "@/core/eventos/interfaces/evento";
import { useState } from "react";

export const useEventoFilters = (initialFilters?: EventoFilters) => {
  const [filters, setFilters] = useState<EventoFilters>(initialFilters || {});

  const updateFilter = (
    key: keyof EventoFilters,
    value: string | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some((value) => value && value.length > 0);
  };

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
};
