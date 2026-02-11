import type { Deportista } from "@/core/deportistas/interfaces/deportista";
import { DateTimeInput } from "@/presentation/solicitud/components/DateTimeInput";
import { ThemedSelect } from "@/presentation/theme/components/ThemedSelect";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { deportistaSchema } from "@/validations/deportista-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Switch, Text, useTheme } from "react-native-paper";
import { useCategorias, useDisciplinas } from "../hooks/useCatalog";

const GENERO_OPTIONS = [
  { label: "Masculino", value: "Masculino" },
  { label: "Femenino", value: "Femenino" },
];

interface DeportistaFormProps {
  mode: "create" | "edit";
  initialData?: Deportista;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const DeportistaForm = ({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}: DeportistaFormProps) => {
  const theme = useTheme();
  const { data: categorias } = useCategorias();
  const { data: disciplinas } = useDisciplinas();

  const categoriasOptions = (categorias || []).map((c) => ({
    label: c.nombre,
    value: String(c.id),
  }));

  const disciplinasOptions = (disciplinas || []).map((d) => ({
    label: d.nombre,
    value: String(d.id),
  }));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(deportistaSchema),
    defaultValues: {
      nombres: initialData?.nombres || "",
      apellidos: initialData?.apellidos || "",
      cedula: initialData?.cedula || "",
      genero: initialData?.genero || "",
      fechaNacimiento: initialData?.fechaNacimiento
        ? new Date(initialData.fechaNacimiento)
        : (undefined as unknown as Date),
      categoriaId: initialData?.categoriaId || 0,
      disciplinaId: initialData?.disciplinaId || 0,
      afiliacion: initialData?.afiliacion ?? false,
    },
  });

  const onFormSubmit = (data: any) => {
    const submitData = {
      ...data,
      fechaNacimiento: data.fechaNacimiento.toISOString().split("T")[0],
    };
    onSubmit(submitData);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
      >
        Datos Personales
      </Text>

      <Controller
        control={control}
        name="nombres"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="Nombres"
            icon="ion:person-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.nombres?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="apellidos"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="Apellidos"
            icon="ion:person-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.apellidos?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="cedula"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="Cédula"
            icon="ion:card-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.cedula?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="genero"
        render={({ field: { onChange, value } }) => (
          <ThemedSelect
            label="Género"
            placeholder="Seleccionar género"
            value={value}
            onValueChange={onChange}
            options={GENERO_OPTIONS}
            errorMessage={errors.genero?.message as string}
          />
        )}
      />

      <DateTimeInput
        control={control}
        name="fechaNacimiento"
        label="Fecha de Nacimiento"
        mode="date"
        error={errors.fechaNacimiento?.message as string}
        maximumDate={new Date()}
      />

      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
      >
        Deportivo
      </Text>

      <Controller
        control={control}
        name="disciplinaId"
        render={({ field: { onChange, value } }) => (
          <ThemedSelect
            label="Disciplina"
            placeholder="Seleccionar disciplina"
            value={value ? String(value) : ""}
            onValueChange={(v) => onChange(Number(v))}
            options={disciplinasOptions}
            errorMessage={errors.disciplinaId?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="categoriaId"
        render={({ field: { onChange, value } }) => (
          <ThemedSelect
            label="Categoría"
            placeholder="Seleccionar categoría"
            value={value ? String(value) : ""}
            onValueChange={(v) => onChange(Number(v))}
            options={categoriasOptions}
            errorMessage={errors.categoriaId?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="afiliacion"
        render={({ field: { onChange, value } }) => (
          <View style={styles.switchRow}>
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.onSurface, flex: 1 }}
            >
              Afiliado
            </Text>
            <Switch value={value} onValueChange={onChange} />
          </View>
        )}
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onFormSubmit)}
        disabled={isLoading}
        style={styles.submitButton}
        contentStyle={styles.submitContent}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : mode === "create" ? (
          "Crear Deportista"
        ) : (
          "Guardar Cambios"
        )}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 12,
  },
  submitContent: {
    height: 50,
  },
});
