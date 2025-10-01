import { EventoFilters } from "@/core/eventos/interfaces/evento";
import { ThemedSelect } from "@/presentation/theme/components/ThemedSelect";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "react-native-paper";

interface EventoFiltersProps {
  filters: EventoFilters;
  onFiltersChange: (filters: EventoFilters) => void;
}

export const EventoFiltersComponent: React.FC<EventoFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const tipoEventoOptions = [
    { label: "Todos", value: "" },
    { label: "Campeonato", value: "CAMPEONATO" },
    { label: "Torneo", value: "TORNEO" },
    { label: "Copa", value: "COPA" },
    { label: "Liga", value: "LIGA" },
    { label: "Contratación", value: "CONTRATACION" },
  ];

  const deporteOptions = [
    { label: "Todos", value: "" },
    { label: "Multi Deportivos", value: "MULTI DEPORTIVOS" },
    { label: "Fútbol", value: "FUTBOL" },
    { label: "Atletismo", value: "ATLETISMO" },
    { label: "Natación", value: "NATACION" },
    { label: "Básquet", value: "BASQUET" },
  ];

  const provinciaOptions = [
    { label: "Todas", value: "" },
    { label: "Loja", value: "LOJA" },
    { label: "Pichincha", value: "PICHINCHA" },
    { label: "Guayas", value: "GUAYAS" },
    { label: "Azuay", value: "AZUAY" },
    { label: "Manabí", value: "MANABI" },
  ];

  const alcanceOptions = [
    { label: "Todos", value: "" },
    { label: "Nacional", value: "NACIONAL" },
    { label: "Internacional", value: "INTERNACIONAL" },
    { label: "Regional", value: "REGIONAL" },
    { label: "Provincial", value: "PROVINCIAL" },
  ];

  const updateFilter = (key: keyof EventoFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value.length > 0
  );

  return (
    <ThemedView className="bg-white border-b border-gray-200 p-4">
      <View className="flex-row justify-between items-center mb-3">
        <ThemedText className="text-lg font-semibold">Filtros</ThemedText>
        {hasActiveFilters && (
          <Button mode="outlined" onPress={clearAllFilters} compact>
            Limpiar
          </Button>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-3">
          <View className="min-w-[150px]">
            <ThemedText className="text-sm font-medium mb-2">
              Tipo de Evento
            </ThemedText>
            <ThemedSelect
              label="Tipo de Evento"
              options={tipoEventoOptions}
              value={filters.tipoEvento || ""}
              onValueChange={(value) => updateFilter("tipoEvento", value)}
              placeholder="Seleccionar"
            />
          </View>

          <View className="min-w-[150px]">
            <ThemedText className="text-sm font-medium mb-2">
              Deporte
            </ThemedText>
            <ThemedSelect
              label="Deporte"
              options={deporteOptions}
              value={filters.deporte || ""}
              onValueChange={(value) => updateFilter("deporte", value)}
              placeholder="Seleccionar"
            />
          </View>

          <View className="min-w-[150px]">
            <ThemedText className="text-sm font-medium mb-2">
              Provincia
            </ThemedText>
            <ThemedSelect
              label="Provincia"
              options={provinciaOptions}
              value={filters.provincia || ""}
              onValueChange={(value) => updateFilter("provincia", value)}
              placeholder="Seleccionar"
            />
          </View>

          <View className="min-w-[150px]">
            <ThemedText className="text-sm font-medium mb-2">
              Alcance
            </ThemedText>
            <ThemedSelect
              label="Alcance"
              options={alcanceOptions}
              value={filters.alcance || ""}
              onValueChange={(value) => updateFilter("alcance", value)}
              placeholder="Seleccionar"
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};
