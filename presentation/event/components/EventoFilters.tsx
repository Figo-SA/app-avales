import { EventoFilters } from "@/core/eventos/interfaces/evento";
import { ThemedSelect } from "@/presentation/theme/components/ThemedSelect";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

interface EventoFiltersProps {
  filters: EventoFilters;
  onFiltersChange: (filters: EventoFilters) => void;
}

export const EventoFiltersComponent: React.FC<EventoFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const theme = useTheme();

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
    <ThemedView
      style={[styles.container, { borderBottomColor: theme.colors.outline }]}
    >
      <View style={styles.header}>
        <ThemedText style={styles.title}>Filtros</ThemedText>
        {hasActiveFilters && (
          <Button mode="outlined" onPress={clearAllFilters} compact>
            Limpiar
          </Button>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filtersRow}>
          <View style={styles.filterItem}>
            <ThemedText style={styles.filterLabel}>Tipo de Evento</ThemedText>
            <ThemedSelect
              label="Tipo de Evento"
              options={tipoEventoOptions}
              value={filters.tipoEvento || ""}
              onValueChange={(value) => updateFilter("tipoEvento", value)}
              placeholder="Seleccionar"
            />
          </View>

          <View style={styles.filterItem}>
            <ThemedText style={styles.filterLabel}>Deporte</ThemedText>
            <ThemedSelect
              label="Deporte"
              options={deporteOptions}
              value={filters.deporte || ""}
              onValueChange={(value) => updateFilter("deporte", value)}
              placeholder="Seleccionar"
            />
          </View>

          <View style={styles.filterItem}>
            <ThemedText style={styles.filterLabel}>Provincia</ThemedText>
            <ThemedSelect
              label="Provincia"
              options={provinciaOptions}
              value={filters.provincia || ""}
              onValueChange={(value) => updateFilter("provincia", value)}
              placeholder="Seleccionar"
            />
          </View>

          <View style={styles.filterItem}>
            <ThemedText style={styles.filterLabel}>Alcance</ThemedText>
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  filtersRow: {
    flexDirection: "row",
    gap: 12,
  },
  filterItem: {
    minWidth: 150,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
});
