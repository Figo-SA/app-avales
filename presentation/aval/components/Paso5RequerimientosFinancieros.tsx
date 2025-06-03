import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { AvalRequerimiento } from "@/types/AvalTypes";
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
  requerimientos: AvalRequerimiento[];
  onRequerimientosChange: (requerimientos: AvalRequerimiento[]) => void;
}

// Rubros predefinidos comunes
const rubrosComunes = [
  { label: "Hospedaje", value: "Hospedaje", icon: "fa:bed" },
  { label: "Alimentación", value: "Alimentación", icon: "fa:utensils" },
  { label: "Transporte", value: "Transporte", icon: "fa:bus" },
  { label: "Premiación", value: "Premiación", icon: "fa:trophy" },
  { label: "Equipamiento", value: "Equipamiento", icon: "fa:futbol" },
  { label: "Uniformes", value: "Uniformes", icon: "fa:tshirt" },
  { label: "Médico", value: "Médico", icon: "fa:briefcase-medical" },
  { label: "Arbitraje", value: "Arbitraje", icon: "fa:user-check" }, // alternativa a "whistle"
];

export default function Paso5RequerimientosFinancieros({
  requerimientos,
  onRequerimientosChange,
}: Props) {
  const theme = useTheme();
  const [nuevoRequerimiento, setNuevoRequerimiento] =
    useState<AvalRequerimiento>({
      rubro: "",
      cantidadDias: 0,
      valorUnitario: 0,
    });

  const [rubroSeleccionado, setRubroSeleccionado] = useState("");

  const agregarRequerimiento = () => {
    if (!nuevoRequerimiento.rubro.trim()) {
      Alert.alert("Error", "Selecciona o escribe un rubro");
      return;
    }

    if (nuevoRequerimiento.cantidadDias <= 0) {
      Alert.alert("Error", "La cantidad de días debe ser mayor a 0");
      return;
    }

    if (nuevoRequerimiento.valorUnitario <= 0) {
      Alert.alert("Error", "El valor unitario debe ser mayor a 0");
      return;
    }

    onRequerimientosChange([...requerimientos, { ...nuevoRequerimiento }]);
    setNuevoRequerimiento({
      rubro: "",
      cantidadDias: 0,
      valorUnitario: 0,
    });
    setRubroSeleccionado("");
  };
  const obtenerIconoPorRubro = (rubro: string) => {
    const rubroData = rubrosComunes.find((r) => r.value === rubro);
    return rubroData ? rubroData.icon : "tag"; // "tag" como icono por defecto
  };

  const eliminarRequerimiento = (index: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este requerimiento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const nuevosRequerimientos = requerimientos.filter(
              (_, i) => i !== index
            );
            onRequerimientosChange(nuevosRequerimientos);
          },
        },
      ]
    );
  };

  const seleccionarRubroComun = (rubro: string) => {
    setNuevoRequerimiento((prev) => ({ ...prev, rubro }));
    setRubroSeleccionado(rubro);
  };

  const calcularTotal = (requerimiento: AvalRequerimiento) => {
    return requerimiento.cantidadDias * requerimiento.valorUnitario;
  };

  const calcularTotalGeneral = () => {
    return requerimientos.reduce(
      (total, req) => total + req.cantidadDias * req.valorUnitario,
      0
    );
  };
  const obtenerIconoRubro = () => {
    const rubroData = rubrosComunes.find((r) => r.value === rubroSeleccionado);
    return rubroData ? rubroData.icon : "settings-outline"; // "tag" como icono por defecto
  };

  // Función para obtener el label dinámico
  const obtenerLabelRubro = () => {
    const rubroData = rubrosComunes.find((r) => r.value === rubroSeleccionado);
    if (rubroData) {
      return `Rubro seleccionado: ${rubroData.label}`;
    }
    return "O escribe un rubro personalizado";
  };

  // Función para obtener el placeholder dinámico
  const obtenerPlaceholderRubro = () => {
    const rubroData = rubrosComunes.find((r) => r.value === rubroSeleccionado);
    if (rubroData) {
      return `${rubroData.label} - puedes editarlo`;
    }
    return "Ej: Seguridad, Sonido, etc.";
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const cancelarFormulario = () => {
    setNuevoRequerimiento({
      rubro: "",
      cantidadDias: 0,
      valorUnitario: 0,
    });
    setRubroSeleccionado("");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={styles.title}>
        Requerimientos Financieros
      </Text>

      {/* Resumen financiero */}
      <Card
        style={[
          styles.summaryCard,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Card.Content>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text
                variant="titleLarge"
                style={[styles.summaryNumber, { color: theme.colors.primary }]}
              >
                {requerimientos.length}
              </Text>
              <Text variant="bodySmall">Rubros</Text>
            </View>
            <Divider style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text
                variant="titleLarge"
                style={[
                  styles.summaryNumber,
                  { color: theme.colors.secondary },
                ]}
              >
                {formatearMoneda(calcularTotalGeneral())}
              </Text>
              <Text variant="bodySmall">Total Estimado</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Información contextual */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.infoHeader}>
            <IconButton
              icon="information"
              size={24}
              iconColor={theme.colors.primary}
            />
            <Text variant="bodyMedium" style={styles.infoText}>
              Define los gastos necesarios para tu evento. Selecciona rubros
              predefinidos o crea personalizados.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Formulario siempre visible */}
      <Card style={[styles.formCard, { borderColor: theme.colors.primary }]}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.formTitle}>
            Agregar Requerimiento Financiero
          </Text>

          {/* Rubros predefinidos con iconos */}
          <Text variant="bodyMedium" style={styles.sectionSubtitle}>
            Selecciona un rubro común:
          </Text>

          <View style={styles.rubrosContainer}>
            {rubrosComunes.map((rubro, index) => (
              <Chip
                key={index}
                icon={rubro.icon} // Usando el icono del array
                mode={rubroSeleccionado === rubro.value ? "flat" : "outlined"}
                selected={rubroSeleccionado === rubro.value}
                onPress={() => seleccionarRubroComun(rubro.value)}
                style={[
                  styles.rubroChip,
                  rubroSeleccionado === rubro.value && {
                    backgroundColor: theme.colors.primaryContainer,
                  },
                ]}
              >
                {rubro.label}
              </Chip>
            ))}
          </View>

          {/* Campo rubro personalizado */}
          <ThemedTextInput
            label={obtenerLabelRubro()}
            placeholder={obtenerPlaceholderRubro()}
            value={nuevoRequerimiento.rubro}
            onChangeText={(text) => {
              setNuevoRequerimiento((prev) => ({ ...prev, rubro: text }));
              setRubroSeleccionado(""); // Limpiar selección de chips
            }}
            icon={obtenerIconoRubro()}
            style={[
              styles.rubroInput,
              rubroSeleccionado && {
                backgroundColor: theme.colors.primaryContainer + "20",
              },
            ]}
          />

          {/* Campos numéricos */}
          <View style={styles.row}>
            <ThemedTextInput
              label="Días"
              placeholder="1"
              value={
                nuevoRequerimiento.cantidadDias > 0
                  ? nuevoRequerimiento.cantidadDias.toString()
                  : ""
              }
              onChangeText={(text) =>
                setNuevoRequerimiento((prev) => ({
                  ...prev,
                  cantidadDias: parseInt(text) || 0,
                }))
              }
              type="numeric"
              style={styles.halfInput}
              icon="calendar"
            />

            <ThemedTextInput
              label="Valor por día"
              placeholder="50000"
              value={
                nuevoRequerimiento.valorUnitario > 0
                  ? nuevoRequerimiento.valorUnitario.toString()
                  : ""
              }
              onChangeText={(text) =>
                setNuevoRequerimiento((prev) => ({
                  ...prev,
                  valorUnitario: parseFloat(text) || 0,
                }))
              }
              type="numeric"
              style={styles.halfInput}
              icon="fa:coins"
            />
          </View>

          {/* Preview del total */}
          {nuevoRequerimiento.cantidadDias > 0 &&
            nuevoRequerimiento.valorUnitario > 0 && (
              <Card
                style={[
                  styles.previewCard,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Card.Content style={styles.previewContent}>
                  <Text variant="bodyMedium">Total estimado:</Text>
                  <Text
                    variant="titleLarge"
                    style={[
                      styles.previewTotal,
                      { color: theme.colors.onPrimaryContainer },
                    ]}
                  >
                    {formatearMoneda(
                      nuevoRequerimiento.cantidadDias *
                        nuevoRequerimiento.valorUnitario
                    )}
                  </Text>
                </Card.Content>
              </Card>
            )}

          {/* Botones de acción */}
          <View style={styles.formButtons}>
            <ThemeButton
              mode="outlined"
              onPress={cancelarFormulario}
              style={styles.cancelButton}
              icon="refresh"
            >
              Limpiar
            </ThemeButton>
            <ThemeButton
              mode="contained"
              onPress={agregarRequerimiento}
              style={styles.addButton}
              icon="fa:plus"
              disabled={
                !nuevoRequerimiento.rubro.trim() ||
                nuevoRequerimiento.cantidadDias <= 0 ||
                nuevoRequerimiento.valorUnitario <= 0
              }
            >
              Agregar
            </ThemeButton>
          </View>
        </Card.Content>
      </Card>

      {/* Lista de requerimientos */}
      {requerimientos.length > 0 && (
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            📊 Requerimientos Agregados ({requerimientos.length})
          </Text>

          {requerimientos.map((requerimiento, index) => (
            <Card key={index} style={styles.requerimientoCard}>
              <Card.Content>
                <View style={styles.requerimientoHeader}>
                  <Chip
                    icon={obtenerIconoPorRubro(requerimiento.rubro)} // Icono dinámico según el rubro
                    style={[
                      styles.itemChip,
                      { backgroundColor: theme.colors.background },
                    ]}
                  >
                    {requerimiento.rubro}
                  </Chip>
                  <View style={styles.requerimientoActions}>
                    <Text variant="titleMedium" style={styles.subtotal}>
                      {formatearMoneda(calcularTotal(requerimiento))}
                    </Text>
                    <TouchableOpacity
                      onPress={() => eliminarRequerimiento(index)}
                      style={styles.deleteButton}
                    >
                      <IconButton
                        icon="trash"
                        size={20}
                        iconColor={theme.colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.requerimientoDetails}>
                  <Text variant="bodyMedium" style={styles.detailText}>
                    {requerimiento.cantidadDias} días ×{" "}
                    {formatearMoneda(requerimiento.valorUnitario)} c/día
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}

      {/* Estado inicial sin requerimientos */}
      {requerimientos.length === 0 && (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <IconButton
              icon="fa:coins"
              size={48}
              iconColor={theme.colors.outline}
            />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              Comienza agregando tu primer requerimiento
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Usa el formulario de arriba para definir los gastos de tu evento
            </Text>
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
  title: {
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryNumber: {
    fontWeight: "bold",
    fontSize: 24,
  },
  summaryDivider: {
    height: 40,
    width: 1,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 1,
    borderRadius: 12,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    flex: 1,
    lineHeight: 20,
  },
  addCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "transparent",
  },
  addContent: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  formCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    borderWidth: 2,
  },
  formTitle: {
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionSubtitle: {
    marginBottom: 12,
    opacity: 0.8,
  },
  rubrosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  rubroChip: {
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
  },
  fullInput: {
    marginBottom: 12,
  },
  previewCard: {
    marginBottom: 16,
    elevation: 1,
    borderRadius: 8,
  },
  previewContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewTotal: {
    fontWeight: "bold",
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  requerimientoCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  requerimientoHeader: {
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
  subtotalCard: {
    marginTop: 12,
    elevation: 1,
    borderRadius: 8,
  },
  subtotalContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtotal: {
    fontWeight: "bold",
  },
  totalCard: {
    marginTop: 16,
    elevation: 4,
    borderRadius: 16,
  },
  totalContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  totalText: {
    flex: 1,
  },
  totalGeneral: {
    fontWeight: "bold",
    fontSize: 28,
  },
  emptyCard: {
    marginTop: 32,
    elevation: 1,
    borderRadius: 12,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyTitle: {
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 32,
  },

  requerimientoActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requerimientoDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  detailText: {
    opacity: 0.7,
    fontStyle: "italic",
  },
  rubroInput: {
    marginBottom: 12,
  },
  rubroSelectedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  clearSelectionButton: {
    marginLeft: 8,
  },
});
