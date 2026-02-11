import type { Evento } from "@/core/eventos/interfaces/evento";
import { DateTimeInput } from "@/presentation/solicitud/components/DateTimeInput";
import { ThemedSelect } from "@/presentation/theme/components/ThemedSelect";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { adminEventoSchema } from "@/validations/evento-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useCategorias, useDisciplinas } from "../hooks/useCatalog";

const GENERO_OPTIONS = [
  { label: "Masculino", value: "Masculino" },
  { label: "Femenino", value: "Femenino" },
  { label: "Mixto", value: "Mixto" },
];

const ALCANCE_OPTIONS = [
  { label: "Local", value: "Local" },
  { label: "Provincial", value: "Provincial" },
  { label: "Nacional", value: "Nacional" },
  { label: "Internacional", value: "Internacional" },
];

const TIPO_EVENTO_OPTIONS = [
  { label: "Competencia", value: "Competencia" },
  { label: "Entrenamiento", value: "Entrenamiento" },
  { label: "Exhibición", value: "Exhibición" },
];

const TIPO_PARTICIPACION_OPTIONS = [
  { label: "Individual", value: "Individual" },
  { label: "Equipo", value: "Equipo" },
  { label: "Mixta", value: "Mixta" },
];

interface EventoFormProps {
  mode: "create" | "edit";
  initialData?: Evento;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const EventoForm = ({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}: EventoFormProps) => {
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
    resolver: zodResolver(adminEventoSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      tipoEvento: initialData?.tipoEvento || "",
      tipoParticipacion: initialData?.tipoParticipacion || "",
      genero: initialData?.genero || "",
      disciplinaId: initialData?.disciplinaId || 0,
      categoriaId: initialData?.categoriaId || 0,
      alcance: initialData?.alcance || "",
      lugar: initialData?.lugar || "",
      provincia: initialData?.provincia || "",
      ciudad: initialData?.ciudad || "",
      pais: initialData?.pais || "Ecuador",
      fechaInicio: initialData?.fechaInicio
        ? new Date(initialData.fechaInicio)
        : (undefined as unknown as Date),
      fechaFin: initialData?.fechaFin
        ? new Date(initialData.fechaFin)
        : (undefined as unknown as Date),
      numEntrenadoresHombres: initialData?.numEntrenadoresHombres || 0,
      numEntrenadoresMujeres: initialData?.numEntrenadoresMujeres || 0,
      numAtletasHombres: initialData?.numAtletasHombres || 0,
      numAtletasMujeres: initialData?.numAtletasMujeres || 0,
    },
  });

  const onFormSubmit = (data: any) => {
    const submitData = {
      ...data,
      fechaInicio: data.fechaInicio.toISOString(),
      fechaFin: data.fechaFin.toISOString(),
    };
    onSubmit(submitData);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Info General */}
      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
      >
        Información General
      </Text>

      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="Nombre del evento"
            icon="ion:calendar-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.nombre?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="tipoEvento"
        render={({ field: { onChange, value } }) => (
          <ThemedSelect
            label="Tipo de Evento"
            placeholder="Seleccionar tipo"
            value={value}
            onValueChange={onChange}
            options={TIPO_EVENTO_OPTIONS}
            errorMessage={errors.tipoEvento?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="tipoParticipacion"
        render={({ field: { onChange, value } }) => (
          <ThemedSelect
            label="Tipo de Participación"
            placeholder="Seleccionar participación"
            value={value}
            onValueChange={onChange}
            options={TIPO_PARTICIPACION_OPTIONS}
            errorMessage={errors.tipoParticipacion?.message as string}
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
        name="alcance"
        render={({ field: { onChange, value } }) => (
          <ThemedSelect
            label="Alcance"
            placeholder="Seleccionar alcance"
            value={value}
            onValueChange={onChange}
            options={ALCANCE_OPTIONS}
            errorMessage={errors.alcance?.message as string}
          />
        )}
      />

      {/* Ubicación */}
      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
      >
        Ubicación
      </Text>

      <Controller
        control={control}
        name="lugar"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="Lugar"
            icon="ion:location-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.lugar?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="ciudad"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="Ciudad"
            icon="ion:business-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.ciudad?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="provincia"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="Provincia"
            icon="ion:map-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.provincia?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="pais"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="País"
            icon="ion:globe-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.pais?.message as string}
          />
        )}
      />

      {/* Fechas */}
      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
      >
        Fechas
      </Text>

      <DateTimeInput
        control={control}
        name="fechaInicio"
        label="Fecha de Inicio"
        mode="datetime"
        error={errors.fechaInicio?.message as string}
      />

      <DateTimeInput
        control={control}
        name="fechaFin"
        label="Fecha de Fin"
        mode="datetime"
        error={errors.fechaFin?.message as string}
      />

      {/* Participantes */}
      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
      >
        Participantes
      </Text>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Controller
            control={control}
            name="numAtletasHombres"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                label="Atletas (H)"
                type="numeric"
                value={String(value)}
                onChangeText={(t) => onChange(Number(t) || 0)}
                onBlur={onBlur}
                errorMessage={errors.numAtletasHombres?.message as string}
              />
            )}
          />
        </View>
        <View style={styles.halfField}>
          <Controller
            control={control}
            name="numAtletasMujeres"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                label="Atletas (M)"
                type="numeric"
                value={String(value)}
                onChangeText={(t) => onChange(Number(t) || 0)}
                onBlur={onBlur}
                errorMessage={errors.numAtletasMujeres?.message as string}
              />
            )}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Controller
            control={control}
            name="numEntrenadoresHombres"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                label="Entrenadores (H)"
                type="numeric"
                value={String(value)}
                onChangeText={(t) => onChange(Number(t) || 0)}
                onBlur={onBlur}
                errorMessage={errors.numEntrenadoresHombres?.message as string}
              />
            )}
          />
        </View>
        <View style={styles.halfField}>
          <Controller
            control={control}
            name="numEntrenadoresMujeres"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                label="Entrenadores (M)"
                type="numeric"
                value={String(value)}
                onChangeText={(t) => onChange(Number(t) || 0)}
                onBlur={onBlur}
                errorMessage={errors.numEntrenadoresMujeres?.message as string}
              />
            )}
          />
        </View>
      </View>

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
          "Crear Evento"
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 12,
  },
  submitContent: {
    height: 50,
  },
});
