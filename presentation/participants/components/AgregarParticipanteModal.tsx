import { searchParticipantes } from "@/core/participants/actions/participants-actions";
import {
  Participante,
  SexoParticipante,
  TipoParticipante,
} from "@/core/participants/interfaces/participante";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import {
  Divider,
  Icon,
  IconButton,
  Modal,
  Portal,
  Searchbar,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

interface AgregarParticipanteModalProps {
  visible: boolean;
  onDismiss: () => void;
  tipo: TipoParticipante;
  sexo: SexoParticipante;
  cantidadRequerida: number;
  cantidadActual: number;
  participantesYaAgregados: Participante[];
  onAgregar: (participantes: Participante[]) => void;
}

export const AgregarParticipanteModal: React.FC<
  AgregarParticipanteModalProps
> = ({
  visible,
  onDismiss,
  tipo,
  sexo,
  cantidadRequerida,
  cantidadActual,
  participantesYaAgregados,
  onAgregar,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParticipantes, setSelectedParticipantes] = useState<
    Participante[]
  >([]);
  const [participantesFiltrados, setParticipantesFiltrados] = useState<
    Participante[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const cantidadFaltante = cantidadRequerida - cantidadActual;
  const puedeSeleccionarMas = selectedParticipantes.length < cantidadFaltante;

  // IDs de participantes ya agregados para filtrarlos
  const idsYaAgregados = participantesYaAgregados.map((p) => p.id);

  useEffect(() => {
    if (visible) {
      buscarParticipantes();
      setSelectedParticipantes([]);
    }
  }, [visible, searchQuery, tipo, sexo]);

  const buscarParticipantes = async () => {
    setIsLoading(true);
    try {
      const resultados = await searchParticipantes(tipo, sexo, searchQuery);
      
      // Eliminar duplicados que puedan venir del backend
      const uniqueResultados = resultados.filter((participante, index, self) =>
        index === self.findIndex((p) => p.id === participante.id)
      );

      // Filtrar los que ya están agregados
      const resultadosFiltrados = uniqueResultados.filter(
        (p) => !idsYaAgregados.includes(p.id)
      );
      
      setParticipantesFiltrados(resultadosFiltrados);
    } catch (error) {
      console.error("Error al buscar participantes:", error);
      setParticipantesFiltrados([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSeleccion = (participante: Participante) => {
    const yaSeleccionado = selectedParticipantes.find(
      (p) => p.id === participante.id
    );

    if (yaSeleccionado) {
      // Deseleccionar
      setSelectedParticipantes(
        selectedParticipantes.filter((p) => p.id !== participante.id)
      );
    } else if (puedeSeleccionarMas) {
      // Seleccionar si hay espacio
      setSelectedParticipantes([...selectedParticipantes, participante]);
    }
  };

  const isSeleccionado = (id: string) =>
    selectedParticipantes.some((p) => p.id === id);

  const handleAgregar = () => {
    if (selectedParticipantes.length > 0) {
      onAgregar(selectedParticipantes);
      setSelectedParticipantes([]);
      setSearchQuery("");
      onDismiss();
    }
  };

  const getTituloModal = () => {
    const tipoTexto = tipo === "atleta" ? "Atleta" : "Entrenador";
    const sexoTexto = sexo === "masculino" ? "Hombre" : "Mujer";
    return `Agregar ${tipoTexto} ${sexoTexto}`;
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Surface style={styles.modalContent} elevation={5}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Icon
                source={tipo === "atleta" ? "ion:person" : "fa:user-tie"}
                size={24}
                color={theme.colors.primary}
              />
              <Text variant="titleLarge" style={styles.title}>
                {getTituloModal()}
              </Text>
            </View>
            <IconButton icon="close" size={24} onPress={onDismiss} />
          </View>

          <Divider />

          {/* Contador de seleccionados */}
          <Surface style={styles.contadorContainer} elevation={0}>
            <Icon
              source="ion:checkmark-circle"
              size={20}
              color={theme.colors.primary}
            />
            <Text variant="bodyMedium" style={styles.contadorText}>
              {selectedParticipantes.length} / {cantidadFaltante} seleccionados
            </Text>
          </Surface>

          <Divider />

          {/* Searchbar */}
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Buscar por nombre o cédula..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
              elevation={0}
              icon={() => (
                <Icon
                  source="ion:search"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
              )}
              clearIcon={() =>
                searchQuery ? (
                  <Icon
                    source="ion:close"
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                  />
                ) : null
              }
            />
          </View>

          {/* Lista de resultados */}
          <View style={styles.listContainer}>
            {isLoading ? (
              <View style={styles.emptyContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text variant="bodyMedium" style={styles.emptyText}>
                  Buscando participantes...
                </Text>
              </View>
            ) : participantesFiltrados.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon
                  source="ion:search-outline"
                  size={48}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text variant="bodyLarge" style={styles.emptyText}>
                  {searchQuery
                    ? "No se encontraron resultados"
                    : "Busca un participante por nombre o cédula"}
                </Text>
              </View>
            ) : (
              <FlatList
                data={participantesFiltrados}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Surface
                    style={[
                      styles.participanteItem,
                      isSeleccionado(item.id) && styles.participanteItemSelected,
                    ]}
                    elevation={isSeleccionado(item.id) ? 2 : 0}
                  >
                    <View style={styles.participanteContent}>
                      <View style={styles.participanteInfo}>
                        <View style={styles.participanteHeader}>
                          <Text
                            variant="bodyLarge"
                            style={styles.participanteNombre}
                          >
                            {item.nombres} {item.apellidos}
                          </Text>
                        </View>
                        <Text
                          variant="bodySmall"
                          style={styles.participanteCedula}
                        >
                          CI: {item.cedula}
                        </Text>
                      </View>
                      <ThemeButton
                        mode={isSeleccionado(item.id) ? "contained" : "outlined"}
                        compact
                        disabled={!isSeleccionado(item.id) && !puedeSeleccionarMas}
                        onPress={() => toggleSeleccion(item)}
                      >
                        {isSeleccionado(item.id)
                          ? "Seleccionado"
                          : "Seleccionar"}
                      </ThemeButton>
                    </View>
                  </Surface>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}
          </View>

          {/* Footer con botones */}
          <Divider />
          <View style={styles.footer}>
            <ThemeButton
              mode="outlined"
              onPress={onDismiss}
              style={styles.button}
            >
              Cancelar
            </ThemeButton>
            <ThemeButton
              mode="contained"
              onPress={handleAgregar}
              disabled={selectedParticipantes.length === 0}
              style={styles.button}
            >
              {`Agregar (${selectedParticipantes.length})`}
            </ThemeButton>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    modalContainer: {
      padding: 20,
      justifyContent: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    title: {
      fontWeight: "700",
      color: theme.colors.onSurface,
    },
    contadorContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.colors.primaryContainer,
    },
    contadorText: {
      fontWeight: "600",
      color: theme.colors.onPrimaryContainer,
    },
    searchContainer: {
      padding: 16,
      paddingBottom: 8,
    },
    searchbar: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
    },
    listContainer: {
      height: 350,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
      gap: 16,
    },
    emptyText: {
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
    },
    participanteItem: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: 16,
      borderRadius: 12,
    },
    participanteItemSelected: {
      backgroundColor: theme.colors.primaryContainer,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    participanteContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      gap: 12,
    },
    participanteInfo: {
      flex: 1,
      gap: 4,
    },
    participanteHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
    },
    participanteNombre: {
      fontWeight: "600",
      color: theme.colors.onSurface,
    },
    participanteCedula: {
      color: theme.colors.onSurfaceVariant,
    },
    separator: {
      height: 8,
    },
    footer: {
      flexDirection: "row",
      gap: 12,
      padding: 16,
    },
    button: {
      flex: 1,
    },
  });
