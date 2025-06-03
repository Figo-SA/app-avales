import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import { ThemedSelect } from "@/presentation/theme/components/ThemedSelect";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { AvalTecnico } from "@/types/AvalTypes";
import { avalTecnicoSchema } from "@/validations/avalSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, Platform, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

interface Props {
  datos: AvalTecnico;
  onDatosChange: (datos: AvalTecnico) => void;
}

// Opciones de transporte
const opcionesTransporte = [
  { label: "Avión", value: "avion", icon: "airplane" },
  { label: "Bus", value: "bus", icon: "bus" },
  { label: "Auto/Carro", value: "auto", icon: "car" },
  { label: "Tren", value: "tren", icon: "train" },
];

export default function Paso2DetallesTecnicos({ datos, onDatosChange }: Props) {
  const theme = useTheme();

  const [showDatePicker, setShowDatePicker] = useState<{
    show: boolean;
    field: "fechaSalida" | "fechaRetorno" | null;
  }>({ show: false, field: null });

  const [showTimePicker, setShowTimePicker] = useState<{
    show: boolean;
    field: "horaSalida" | "horaRetorno" | null;
  }>({ show: false, field: null });

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<AvalTecnico>({
    resolver: zodResolver(avalTecnicoSchema),
    defaultValues: datos,
  });

  const actualizarDatos = useCallback(
    (campo: keyof AvalTecnico, valor: any) => {
      const datosActuales = getValues();
      const nuevosDatos = { ...datosActuales, [campo]: valor };
      onDatosChange(nuevosDatos);
    },
    [onDatosChange, getValues]
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES");
  };

  const formatTime = (time: string) => {
    return time || "00:00";
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker({ show: false, field: null });
    }

    if (selectedDate && showDatePicker.field) {
      setValue(showDatePicker.field, selectedDate);
      actualizarDatos(showDatePicker.field, selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker({ show: false, field: null });
    }

    if (selectedTime && showTimePicker.field) {
      const timeString = selectedTime.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setValue(showTimePicker.field, timeString);
      actualizarDatos(showTimePicker.field, timeString);
    }
  };

  const closeDatePicker = () => {
    setShowDatePicker({ show: false, field: null });
  };

  const closeTimePicker = () => {
    setShowTimePicker({ show: false, field: null });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Detalles Técnicos
      </Text>

      <View style={styles.form}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Personal
        </Text>

        <View style={styles.row}>
          <Controller
            control={control}
            name="numeroOficiales"
            render={({ field: { onChange, value } }) => (
              <View style={styles.halfWidth}>
                <ThemedTextInput
                  label="Número de Oficiales"
                  placeholder="0"
                  type="numeric"
                  value={value.toString()}
                  onChangeText={(text) => {
                    const numero = parseInt(text) || 0;
                    onChange(numero);
                    actualizarDatos("numeroOficiales", numero);
                  }}
                  keyboardType="numeric"
                  icon="people-outline"
                  errorMessage={errors.numeroOficiales?.message}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="numeroAtletas"
            render={({ field: { onChange, value } }) => (
              <View style={styles.halfWidth}>
                <ThemedTextInput
                  label="Número de Atletas"
                  placeholder="0"
                  type="numeric"
                  value={value.toString()}
                  onChangeText={(text) => {
                    const numero = parseInt(text) || 0;
                    onChange(numero);
                    actualizarDatos("numeroAtletas", numero);
                  }}
                  keyboardType="numeric"
                  icon="fa:users"
                  errorMessage={errors.numeroAtletas?.message}
                />
              </View>
            )}
          />
        </View>
        {/* Fechas y Horas */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Fechas y Horarios
        </Text>

        <View style={styles.row}>
          <Controller
            control={control}
            name="fechaSalida"
            render={({ field: { value } }) => (
              <View style={styles.halfWidth}>
                <Text variant="labelMedium">Fecha de Salida</Text>
                <Button
                  mode="outlined"
                  icon="calendar"
                  onPress={() =>
                    setShowDatePicker({ show: true, field: "fechaSalida" })
                  }
                  style={styles.dateButton}
                  contentStyle={styles.buttonContent}
                >
                  {formatDate(value)}
                </Button>
                {errors.fechaSalida && (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.fechaSalida.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="horaSalida"
            render={({ field: { value } }) => (
              <View style={styles.halfWidth}>
                <Text variant="labelMedium">Hora de Salida</Text>
                <Button
                  mode="outlined"
                  icon="time-outline"
                  onPress={() =>
                    setShowTimePicker({ show: true, field: "horaSalida" })
                  }
                  style={styles.dateButton}
                  contentStyle={styles.buttonContent}
                >
                  {formatTime(value)}
                </Button>
              </View>
            )}
          />
        </View>

        <View style={styles.row}>
          <Controller
            control={control}
            name="fechaRetorno"
            render={({ field: { value } }) => (
              <View style={styles.halfWidth}>
                <Text variant="labelMedium">Fecha de Retorno</Text>
                <Button
                  mode="outlined"
                  icon="calendar"
                  onPress={() =>
                    setShowDatePicker({ show: true, field: "fechaRetorno" })
                  }
                  style={styles.dateButton}
                  contentStyle={styles.buttonContent}
                >
                  {formatDate(value)}
                </Button>
                {errors.fechaRetorno && (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.fechaRetorno.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="horaRetorno"
            render={({ field: { value } }) => (
              <View style={styles.halfWidth}>
                <Text variant="labelMedium">Hora de Retorno</Text>
                <Button
                  mode="outlined"
                  icon="time-outline"
                  onPress={() =>
                    setShowTimePicker({ show: true, field: "horaRetorno" })
                  }
                  style={styles.dateButton}
                  contentStyle={styles.buttonContent}
                >
                  {formatTime(value)}
                </Button>
              </View>
            )}
          />
        </View>

        {/* Transporte */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Transporte
        </Text>

        <Controller
          control={control}
          name="transporteSalida"
          render={({ field: { onChange, value } }) => (
            <ThemedSelect
              label="Transporte de Salida"
              placeholder="Selecciona el medio de transporte"
              value={value}
              onValueChange={(selectedValue) => {
                onChange(selectedValue);
                actualizarDatos("transporteSalida", selectedValue);
              }}
              options={opcionesTransporte}
              errorMessage={errors.transporteSalida?.message}
              icon="chevron-down"
              selectedIcon="car" // Icono por defecto cuando hay selección
            />
          )}
        />

        <Controller
          control={control}
          name="transporteRetorno"
          render={({ field: { onChange, value } }) => (
            <ThemedSelect
              label="Transporte de Retorno"
              placeholder="Selecciona el medio de transporte"
              value={value}
              onValueChange={(selectedValue) => {
                onChange(selectedValue);
                actualizarDatos("transporteRetorno", selectedValue);
              }}
              options={opcionesTransporte}
              errorMessage={errors.transporteRetorno?.message}
              icon="chevron-down"
              selectedIcon="car" // Icono por defecto cuando hay selección
            />
          )}
        />

        {/* Personal */}
      </View>

      {/* Date Picker Modal para iOS */}
      {Platform.OS === "ios" && showDatePicker.show && showDatePicker.field && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker.show}
          onRequestClose={closeDatePicker}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: theme.colors.outline },
                ]}
              >
                <ThemeButton mode="text" onPress={closeDatePicker}>
                  Cancelar
                </ThemeButton>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.onSurface }}
                >
                  Seleccionar Fecha
                </Text>
                <ThemeButton mode="text" onPress={closeDatePicker}>
                  Listo
                </ThemeButton>
              </View>
              <DateTimePicker
                value={getValues(showDatePicker.field)}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.picker}
                themeVariant={theme.dark ? "dark" : "light"}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Time Picker Modal para iOS */}
      {Platform.OS === "ios" && showTimePicker.show && showTimePicker.field && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showTimePicker.show}
          onRequestClose={closeTimePicker}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: theme.colors.outline },
                ]}
              >
                <ThemeButton mode="text" onPress={closeTimePicker}>
                  Cancelar
                </ThemeButton>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.onSurface }}
                >
                  Seleccionar Hora
                </Text>
                <ThemeButton mode="text" onPress={closeTimePicker}>
                  Listo
                </ThemeButton>
              </View>
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                style={styles.picker}
                themeVariant={theme.dark ? "dark" : "light"}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Date Picker para Android (nativo) */}
      {Platform.OS === "android" &&
        showDatePicker.show &&
        showDatePicker.field && (
          <DateTimePicker
            value={getValues(showDatePicker.field)}
            mode="date"
            display="default"
            onChange={handleDateChange}
            themeVariant={theme.dark ? "dark" : "light"}
          />
        )}

      {/* Time Picker para Android (nativo) */}
      {Platform.OS === "android" &&
        showTimePicker.show &&
        showTimePicker.field && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={handleTimeChange}
            themeVariant={theme.dark ? "dark" : "light"}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 24,
    fontWeight: "bold",
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  dateButton: {
    justifyContent: "flex-start",
    marginTop: 4,
  },
  buttonContent: {
    justifyContent: "flex-start",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  picker: {
    height: 200,
  },
});
