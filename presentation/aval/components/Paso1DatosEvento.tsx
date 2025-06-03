import { ThemedSelect } from "@/presentation/theme/components/ThemedSelect";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ColeccionAval } from "@/types/AvalTypes";
import { coleccionAvalSchema } from "@/validations/avalSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

interface Props {
  datos: ColeccionAval;
  onDatosChange: (datos: ColeccionAval) => void;
}

const disciplinas = [
  { label: "Fútbol", value: "futbol", icon: "football-outline" },
  { label: "Natación", value: "natacion", icon: "fa:swimmer" },
  { label: "Atletismo", value: "atletismo", icon: "walk-outline" },
  { label: "Baloncesto", value: "baloncesto", icon: "basketball-outline" },
  { label: "Voleibol", value: "voleibol", icon: "fa:volleyball-ball" },
];

const categorias = [
  { label: "Infantil", value: "infantil", icon: "fa:baby" },
  { label: "Juvenil", value: "juvenil", icon: "fa:child" },
  { label: "Senior", value: "senior", icon: "fa:user-tie" },
];

const generos = [
  { label: "Masculino", value: "masculino", icon: "male-outline" },
  { label: "Femenino", value: "femenino", icon: "female-outline" },
  { label: "Mixto", value: "mixto", icon: "male-female-outline" },
];

export default function Paso1DatosEvento({ datos, onDatosChange }: Props) {
  const {
    control,
    formState: { errors },
    getValues,
  } = useForm<ColeccionAval>({
    resolver: zodResolver(coleccionAvalSchema),
    defaultValues: datos,
  });

  const actualizarDatos = useCallback(
    (campo: keyof ColeccionAval, valor: string) => {
      const datosActuales = getValues();
      const nuevosDatos = { ...datosActuales, [campo]: valor };
      onDatosChange(nuevosDatos);
    },
    [onDatosChange, getValues]
  );

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Datos del Evento
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="nombreEvento"
            render={({ field: { onChange, value } }) => (
              <ThemedTextInput
                label="Nombre del Evento"
                placeholder="Nombre oficial del evento"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  actualizarDatos("nombreEvento", text);
                }}
                icon="create-outline"
                errorMessage={errors.nombreEvento?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="descripcion"
            render={({ field: { onChange, value } }) => (
              <ThemedTextInput
                label="Descripción del Evento"
                placeholder="Describe brevemente el evento deportivo"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  actualizarDatos("descripcion", text);
                }}
                errorMessage={errors.descripcion?.message}
                icon="information-circle-outline"
                multiline
                numberOfLines={2}
              />
            )}
          />

          <Controller
            control={control}
            name="lugar"
            render={({ field: { onChange, value } }) => (
              <ThemedTextInput
                label="Lugar del Evento"
                placeholder="Ciudad, estadio, coliseo, etc."
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  actualizarDatos("lugar", text);
                }}
                icon="location-outline"
                errorMessage={errors.lugar?.message}
                numberOfLines={2}
              />
            )}
          />

          <View style={styles.row}>
            <Controller
              control={control}
              name="disciplina"
              render={({ field: { onChange, value } }) => (
                <View style={styles.halfWidth}>
                  <ThemedSelect
                    label="Disciplina"
                    placeholder="Seleccionar disciplina"
                    value={value}
                    onValueChange={(selectedValue) => {
                      onChange(selectedValue);
                      actualizarDatos("disciplina", selectedValue);
                    }}
                    options={disciplinas}
                    errorMessage={errors.disciplina?.message}
                    icon="chevron-down"
                    selectedIcon="sports" // Icono por defecto cuando hay selección
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="categoria"
              render={({ field: { onChange, value } }) => (
                <View style={styles.halfWidth}>
                  <ThemedSelect
                    label="Categoría"
                    placeholder="Seleccionar categoría"
                    value={value}
                    onValueChange={(selectedValue) => {
                      onChange(selectedValue);
                      actualizarDatos("categoria", selectedValue);
                    }}
                    options={categorias}
                    errorMessage={errors.categoria?.message}
                    icon="chevron-down"
                    selectedIcon="trophy" // Icono por defecto cuando hay selección
                  />
                </View>
              )}
            />
          </View>

          <Controller
            control={control}
            name="genero"
            render={({ field: { onChange, value } }) => (
              <ThemedSelect
                label="Género"
                placeholder="Selecciona un género"
                value={value}
                onValueChange={(selectedValue) => {
                  onChange(selectedValue);
                  actualizarDatos("genero", selectedValue);
                }}
                options={generos}
                errorMessage={errors.genero?.message}
                icon="chevron-down"
                selectedIcon="account" // Icono por defecto cuando hay selección
              />
            )}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
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
});
