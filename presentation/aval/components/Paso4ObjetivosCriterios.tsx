import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { AvalCriterio, AvalObjetivo } from "@/types/AvalTypes";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Card,
  Chip,
  Divider,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";

interface Props {
  objetivos: AvalObjetivo[];
  criterios: AvalCriterio[];
  onObjetivosChange: (objetivos: AvalObjetivo[]) => void;
  onCriteriosChange: (criterios: AvalCriterio[]) => void;
}

export default function Paso4ObjetivosCriterios({
  objetivos,
  criterios,
  onObjetivosChange,
  onCriteriosChange,
}: Props) {
  const theme = useTheme();
  const [nuevoObjetivo, setNuevoObjetivo] = useState("");
  const [nuevoCriterio, setNuevoCriterio] = useState("");
  const [mostrandoFormulario, setMostrandoFormulario] = useState<
    "objetivos" | "criterios" | null
  >(null);

  const agregarObjetivo = () => {
    if (!nuevoObjetivo.trim()) {
      Alert.alert("Error", "El objetivo no puede estar vacío");
      return;
    }

    const objetivo: AvalObjetivo = {
      descripcion: nuevoObjetivo.trim(),
    };

    onObjetivosChange([...objetivos, objetivo]);
    setNuevoObjetivo("");
    setMostrandoFormulario(null);
  };

  const eliminarObjetivo = (index: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este objetivo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const nuevosObjetivos = objetivos.filter((_, i) => i !== index);
            onObjetivosChange(nuevosObjetivos);
          },
        },
      ]
    );
  };

  const actualizarObjetivo = (index: number, descripcion: string) => {
    const nuevosObjetivos = objetivos.map((objetivo, i) =>
      i === index ? { ...objetivo, descripcion } : objetivo
    );
    onObjetivosChange(nuevosObjetivos);
  };

  const agregarCriterio = () => {
    if (!nuevoCriterio.trim()) {
      Alert.alert("Error", "El criterio no puede estar vacío");
      return;
    }

    const criterio: AvalCriterio = {
      descripcion: nuevoCriterio.trim(),
    };

    onCriteriosChange([...criterios, criterio]);
    setNuevoCriterio("");
    setMostrandoFormulario(null);
  };

  const eliminarCriterio = (index: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este criterio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const nuevosCriterios = criterios.filter((_, i) => i !== index);
            onCriteriosChange(nuevosCriterios);
          },
        },
      ]
    );
  };

  const actualizarCriterio = (index: number, descripcion: string) => {
    const nuevosCriterios = criterios.map((criterio, i) =>
      i === index ? { ...criterio, descripcion } : criterio
    );
    onCriteriosChange(nuevosCriterios);
  };

  const cancelarFormulario = () => {
    setMostrandoFormulario(null);
    setNuevoObjetivo("");
    setNuevoCriterio("");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={styles.title}>
        Objetivos y Criterios
      </Text>

      {/* Resumen rápido */}
      <Card
        style={[
          styles.summaryCard,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Card.Content>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text variant="titleLarge" style={styles.summaryNumber}>
                {objetivos.length}
              </Text>
              <Text variant="bodySmall">Objetivos</Text>
            </View>
            <Divider style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text variant="titleLarge" style={styles.summaryNumber}>
                {criterios.length}
              </Text>
              <Text variant="bodySmall">Criterios</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Sección Objetivos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderText}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              🎯 Objetivos del Evento
            </Text>
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              Define qué quieres lograr con este evento
            </Text>
          </View>
          <IconButton
            icon="fa:plus"
            size={32}
            iconColor={theme.colors.primary}
            onPress={() => setMostrandoFormulario("objetivos")}
          />
        </View>

        {/* Formulario agregar objetivo */}
        {mostrandoFormulario === "objetivos" && (
          <Card style={styles.addCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.addCardTitle}>
                Nuevo Objetivo
              </Text>
              <ThemedTextInput
                label="Descripción del objetivo"
                placeholder="Ej: Mejorar la técnica de los atletas en competencia"
                value={nuevoObjetivo}
                onChangeText={setNuevoObjetivo}
                multiline
                numberOfLines={3}
                icon="information-circle-outline"
              />
              <View style={styles.addCardButtons}>
                <ThemeButton
                  mode="outlined"
                  onPress={cancelarFormulario}
                  style={styles.cancelButton}
                >
                  Cancelar
                </ThemeButton>
                <ThemeButton
                  mode="contained"
                  onPress={agregarObjetivo}
                  style={styles.addButtonCard}
                  icon="fa:plus"
                >
                  Agregar
                </ThemeButton>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Lista de objetivos */}
        {objetivos.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <IconButton
                icon="alert-circle-outline"
                size={48}
                iconColor={theme.colors.outline}
              />
              <Text variant="bodyLarge" style={styles.emptyText}>
                No hay objetivos definidos
              </Text>
              <Text variant="bodySmall" style={styles.emptySubtext}>
                Agrega al menos un objetivo para tu evento
              </Text>
            </Card.Content>
          </Card>
        ) : (
          objetivos.map((objetivo, index) => (
            <Card key={index} style={styles.itemCard}>
              <Card.Content>
                <View style={styles.itemHeader}>
                  <Chip
                    icon="medal-outline"
                    style={[
                      styles.itemChip,
                      { backgroundColor: theme.colors.background },
                    ]}
                  >
                    Objetivo {index + 1}
                  </Chip>
                  <TouchableOpacity
                    onPress={() => eliminarObjetivo(index)}
                    style={styles.deleteButton}
                  >
                    <IconButton
                      icon="trash"
                      size={20}
                      iconColor={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>
                <ThemedTextInput
                  label="Descripción"
                  value={objetivo.descripcion}
                  onChangeText={(text) => actualizarObjetivo(index, text)}
                  multiline
                  numberOfLines={3}
                  style={styles.itemInput}
                />
              </Card.Content>
            </Card>
          ))
        )}
      </View>

      {/* Sección Criterios */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderText}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              📊 Criterios de Evaluación
            </Text>
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              Define cómo vas a medir el éxito del evento
            </Text>
          </View>
          <IconButton
            icon="fa:plus"
            size={32}
            iconColor={theme.colors.primary}
            onPress={() => setMostrandoFormulario("criterios")}
          />
        </View>

        {/* Formulario agregar criterio */}
        {mostrandoFormulario === "criterios" && (
          <Card style={styles.addCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.addCardTitle}>
                Nuevo Criterio
              </Text>
              <ThemedTextInput
                label="Descripción del criterio"
                placeholder="Ej: Participación de al menos 80% de los atletas inscritos"
                value={nuevoCriterio}
                onChangeText={setNuevoCriterio}
                multiline
                numberOfLines={3}
                icon="information-circle-outline"
              />
              <View style={styles.addCardButtons}>
                <ThemeButton
                  mode="outlined"
                  onPress={cancelarFormulario}
                  style={styles.cancelButton}
                >
                  Cancelar
                </ThemeButton>
                <ThemeButton
                  mode="contained"
                  onPress={agregarCriterio}
                  style={styles.addButtonCard}
                  icon="fa:plus"
                >
                  Agregar
                </ThemeButton>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Lista de criterios */}
        {criterios.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <IconButton
                icon="alert-circle-outline"
                size={48}
                iconColor={theme.colors.outline}
              />
              <Text variant="bodyLarge" style={styles.emptyText}>
                No hay criterios definidos
              </Text>
              <Text variant="bodySmall" style={styles.emptySubtext}>
                Agrega criterios para evaluar tu evento
              </Text>
            </Card.Content>
          </Card>
        ) : (
          criterios.map((criterio, index) => (
            <Card key={index} style={styles.itemCard}>
              <Card.Content>
                <View style={styles.itemHeader}>
                  <Chip
                    icon="bulb-outline"
                    style={[
                      styles.itemChip,
                      { backgroundColor: theme.colors.background },
                    ]}
                  >
                    Criterio {index + 1}
                  </Chip>
                  <TouchableOpacity
                    onPress={() => eliminarCriterio(index)}
                    style={styles.deleteButton}
                  >
                    <IconButton
                      icon="trash"
                      size={20}
                      iconColor={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>
                <ThemedTextInput
                  label="Descripción"
                  value={criterio.descripcion}
                  onChangeText={(text) => actualizarCriterio(index, text)}
                  multiline
                  numberOfLines={3}
                  style={styles.itemInput}
                />
              </Card.Content>
            </Card>
          ))
        )}
      </View>

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
  title: {
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  summaryCard: {
    marginBottom: 24,
    elevation: 3,
    borderRadius: 16,
  },
  summaryRow: {
    flexDirection: "row",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryNumber: {
    fontWeight: "bold",
    fontSize: 28,
  },
  summaryDivider: {
    height: 40,
    width: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sectionHeaderText: {
    flex: 1,
    marginRight: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionDescription: {
    opacity: 0.7,
    fontStyle: "italic",
  },
  addCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    borderStyle: "dashed",
  },
  addCardTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  addCardButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
  },
  addButtonCard: {
    flex: 1,
  },
  emptyCard: {
    elevation: 1,
    borderRadius: 12,
    opacity: 0.8,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontWeight: "500",
    textAlign: "center",
  },
  emptySubtext: {
    textAlign: "center",
    opacity: 0.7,
  },
  itemCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemChip: {
    alignSelf: "flex-start",
  },
  deleteButton: {
    margin: -8,
  },
  itemInput: {
    marginTop: 4,
  },
  bottomSpacing: {
    height: 32,
  },
});
