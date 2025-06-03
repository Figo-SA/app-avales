import { DeportistaAval } from "@/types/AvalTypes";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Button,
  Card,
  IconButton,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";

interface Props {
  deportistas: DeportistaAval[];
  numeroAtletasRequerido: number;
  onDeportistasChange: (deportistas: DeportistaAval[]) => void;
}

// Datos de ejemplo con más información
const deportistasDisponibles: Omit<DeportistaAval, "selected" | "rol">[] = [
  { deportistaId: "1", nombre: "Pedro Sánchez", cedula: "1234567890" },
  { deportistaId: "2", nombre: "María García", cedula: "0987654321" },
  { deportistaId: "3", nombre: "Juan Pérez", cedula: "1122334455" },
  { deportistaId: "4", nombre: "Ana López", cedula: "5566778899" },
  { deportistaId: "5", nombre: "Carlos Ruiz", cedula: "9988776655" },
  { deportistaId: "6", nombre: "Sofía Martín", cedula: "4433221100" },
  { deportistaId: "7", nombre: "Diego Torres", cedula: "1111222233" },
  { deportistaId: "8", nombre: "Laura Vega", cedula: "2222333344" },
  { deportistaId: "9", nombre: "Roberto Silva", cedula: "3333444455" },
  { deportistaId: "10", nombre: "Carmen Díaz", cedula: "4444555566" },
];

export default function Paso3Deportistas({
  deportistas,
  numeroAtletasRequerido,
  onDeportistasChange,
}: Props) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [deportistasFiltrados, setDeportistasFiltrados] = useState(
    deportistasDisponibles
  );
  const [mostrarSoloSeleccionados, setMostrarSoloSeleccionados] =
    useState(false);

  useEffect(() => {
    const filtered = deportistasDisponibles.filter(
      (deportista) =>
        deportista.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deportista.cedula.includes(searchQuery)
    );
    setDeportistasFiltrados(filtered);
  }, [searchQuery]);

  const toggleDeportista = (deportistaId: string) => {
    const deportista = deportistasDisponibles.find(
      (d) => d.deportistaId === deportistaId
    );
    if (!deportista) return;

    const deportistaExistente = deportistas.find(
      (d) => d.deportistaId === deportistaId
    );

    if (deportistaExistente) {
      // Remover deportista
      const nuevosDeportistas = deportistas.filter(
        (d) => d.deportistaId !== deportistaId
      );
      onDeportistasChange(nuevosDeportistas);
    } else {
      // Agregar deportista (sin rol, solo como deportista)
      const nuevoDeportista: DeportistaAval = {
        ...deportista,
        rol: "deportista", // Valor simple y fijo
        selected: true,
      };

      const nuevosDeportistas = [...deportistas, nuevoDeportista];
      onDeportistasChange(nuevosDeportistas);
    }
  };

  const removerDeportista = (deportistaId: string, event: any) => {
    // Prevenir que el evento se propague al TouchableOpacity padre
    event?.stopPropagation();

    const nuevosDeportistas = deportistas.filter(
      (d) => d.deportistaId !== deportistaId
    );
    onDeportistasChange(nuevosDeportistas);
  };

  const seleccionarTodos = () => {
    const todosSeleccionados = deportistasFiltrados.map((deportista) => ({
      ...deportista,
      rol: "deportista", // Valor simple y fijo
      selected: true,
    }));
    onDeportistasChange(todosSeleccionados);
  };

  const limpiarSeleccion = () => {
    onDeportistasChange([]);
  };

  const isDeportistaSeleccionado = (deportistaId: string) => {
    return deportistas.some((d) => d.deportistaId === deportistaId);
  };

  const deportistasExcedentes = Math.max(
    0,
    deportistas.length - numeroAtletasRequerido
  );

  const deportistasParaMostrar = mostrarSoloSeleccionados
    ? deportistasDisponibles.filter((d) =>
        isDeportistaSeleccionado(d.deportistaId)
      )
    : deportistasFiltrados;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={styles.title}>
        Selección de Deportistas
      </Text>

      {/* Indicador de progreso simple */}
      {deportistas.length > 0 && (
        <Card
          style={[
            styles.progressCard,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Card.Content>
            <View style={styles.progressInfo}>
              <Text variant="titleMedium" style={styles.progressText}>
                {deportistas.length} deportistas seleccionados
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Mínimo recomendado: {numeroAtletasRequerido}
                {deportistasExcedentes > 0 &&
                  ` (+${deportistasExcedentes} adicionales)`}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Controles de búsqueda y filtros */}
      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Buscar por nombre o cédula"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          icon="search"
        />

        <View style={styles.filterButtons}>
          <Button
            mode={mostrarSoloSeleccionados ? "contained" : "outlined"}
            onPress={() =>
              setMostrarSoloSeleccionados(!mostrarSoloSeleccionados)
            }
            icon={mostrarSoloSeleccionados ? "eye" : "filter"}
            compact
            style={styles.filterButton}
          >
            {mostrarSoloSeleccionados ? "Todos" : "Filtrar"}
          </Button>

          {!mostrarSoloSeleccionados && deportistasFiltrados.length > 0 && (
            <Button
              mode="outlined"
              onPress={seleccionarTodos}
              icon="fa:globe"
              compact
              style={styles.filterButton}
            >
              Todo
            </Button>
          )}

          {deportistas.length > 0 && (
            <Button
              mode="outlined"
              onPress={limpiarSeleccion}
              icon="close"
              compact
              style={styles.filterButton}
              textColor={theme.colors.error}
            >
              Limpiar
            </Button>
          )}
        </View>
      </View>

      {/* Lista de deportistas disponibles */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {mostrarSoloSeleccionados
          ? `Deportistas Seleccionados (${deportistasParaMostrar.length})`
          : `Deportistas Disponibles (${deportistasParaMostrar.length})`}
      </Text>

      {deportistasParaMostrar.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <IconButton
              icon={mostrarSoloSeleccionados ? "account-off" : "magnify"}
              size={48}
              iconColor={theme.colors.outline}
            />
            <Text variant="bodyLarge" style={styles.emptyText}>
              {mostrarSoloSeleccionados
                ? "No hay deportistas seleccionados"
                : "No se encontraron deportistas"}
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtext}>
              {mostrarSoloSeleccionados
                ? "Cambia a 'Ver todos' para seleccionar deportistas"
                : "Intenta con otro término de búsqueda"}
            </Text>
          </Card.Content>
        </Card>
      ) : (
        deportistasParaMostrar.map((deportista) => {
          const isSelected = isDeportistaSeleccionado(deportista.deportistaId);

          return (
            <TouchableOpacity
              key={deportista.deportistaId}
              onPress={() => toggleDeportista(deportista.deportistaId)}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.deportistaCard,
                  isSelected && {
                    backgroundColor: theme.colors.primaryContainer,
                    borderColor: theme.colors.primary,
                    borderWidth: 2,
                  },
                ]}
              >
                <Card.Content>
                  <View style={styles.deportistaHeader}>
                    <View style={styles.deportistaInfo}>
                      <View style={styles.deportistaTexto}>
                        <View style={styles.nombreContainer}>
                          <Text
                            variant="bodyLarge"
                            style={[
                              styles.deportistaNombre,
                              isSelected && {
                                color: theme.colors.onPrimaryContainer,
                              },
                            ]}
                          >
                            {deportista.nombre}
                          </Text>
                        </View>
                        <Text
                          variant="bodySmall"
                          style={{
                            color: isSelected
                              ? theme.colors.onPrimaryContainer
                              : theme.colors.onSurfaceVariant,
                          }}
                        >
                          Cédula: {deportista.cedula}
                        </Text>
                      </View>
                    </View>

                    {isSelected && (
                      <TouchableOpacity
                        onPress={(event) =>
                          removerDeportista(deportista.deportistaId, event)
                        }
                        style={styles.removeButtonTouchable}
                      >
                        <IconButton
                          icon="close-circle"
                          size={24}
                          iconColor={theme.colors.error}
                          style={styles.removeButton}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          );
        })
      )}

      {/* Resumen final simplificado */}
      {deportistas.length > 0 && (
        <Card
          style={[
            styles.summaryCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Card.Content>
            <Text variant="titleMedium" style={styles.summaryTitle}>
              Resumen de Selección
            </Text>
            <View style={styles.summaryContent}>
              <Text variant="bodyMedium">
                • Total seleccionados: {deportistas.length} deportistas
              </Text>
              <Text variant="bodyMedium">
                • Mínimo recomendado: {numeroAtletasRequerido}
              </Text>
              {deportistasExcedentes > 0 && (
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.primary }}
                >
                  • Deportistas adicionales: {deportistasExcedentes}
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Espaciado final */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  nombreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  progressCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  progressInfo: {
    alignItems: "center",
    gap: 4,
  },
  progressText: {
    fontWeight: "600",
  },
  checkIcon: {
    margin: 0,
    padding: 0,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchbar: {
    marginBottom: 12,
    elevation: 2,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  filterButton: {
    flex: 1,
    minWidth: 100,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  emptyCard: {
    marginBottom: 16,
    elevation: 1,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    textAlign: "center",
    fontWeight: "500",
  },
  emptySubtext: {
    textAlign: "center",
    opacity: 0.7,
  },
  deportistaCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  deportistaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deportistaInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deportistaTexto: {
    flex: 1,
  },
  deportistaNombre: {
    fontWeight: "600",
    flex: 1,
  },
  removeButton: {
    margin: 0,
  },
  removeButtonTouchable: {
    padding: 4,
  },
  summaryCard: {
    marginTop: 16,
    marginBottom: 32,
    elevation: 2,
    borderRadius: 12,
  },
  summaryTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  summaryContent: {
    gap: 4,
  },
  bottomSpacing: {
    height: 32,
  },
});
