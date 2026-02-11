import type { User } from "@/core/auth/interface/user";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { createUserSchema, updateUserSchema } from "@/validations/user-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Chip, Text, useTheme } from "react-native-paper";

const AVAILABLE_ROLES = [
  "admin",
  "secretaria",
  "entrenador",
  "dtm",
  "pda",
  "metodologo",
  "compras-publicas",
  "control-previo",
  "financiero",
];

interface UserFormProps {
  mode: "create" | "edit";
  initialData?: User;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const UserForm = ({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}: UserFormProps) => {
  const theme = useTheme();
  const schema = mode === "create" ? createUserSchema : updateUserSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      apellido: initialData?.apellido || "",
      email: initialData?.email || "",
      password: "",
      cedula: initialData?.cedula || "",
      roles: initialData?.roles || [],
    },
  });

  const onFormSubmit = (data: any) => {
    const cleanedData = { ...data };
    if (mode === "edit" && (!cleanedData.password || cleanedData.password === "")) {
      delete cleanedData.password;
    }
    if (!cleanedData.cedula || cleanedData.cedula === "") {
      delete cleanedData.cedula;
    }
    onSubmit(cleanedData);
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
        Información Personal
      </Text>

      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="Nombre"
            icon="ion:person-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.nombre?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="apellido"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="Apellido"
            icon="ion:person-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.apellido?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="cedula"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="Cédula (opcional)"
            icon="ion:card-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.cedula?.message as string}
          />
        )}
      />

      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
      >
        Acceso
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label="Email"
            icon="ion:mail-outline"
            type="email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.email?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedTextInput
            label={mode === "create" ? "Contraseña" : "Nueva contraseña (dejar vacío para no cambiar)"}
            icon="ion:lock-closed-outline"
            type="password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={errors.password?.message as string}
          />
        )}
      />

      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
      >
        Roles
      </Text>
      {errors.roles?.message && (
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.error, marginBottom: 8 }}
        >
          {errors.roles.message as string}
        </Text>
      )}

      <Controller
        control={control}
        name="roles"
        render={({ field: { onChange, value } }) => (
          <View style={styles.rolesContainer}>
            {AVAILABLE_ROLES.map((role) => {
              const selected = value.includes(role);
              return (
                <Chip
                  key={role}
                  selected={selected}
                  onPress={() => {
                    if (selected) {
                      onChange(value.filter((r: string) => r !== role));
                    } else {
                      onChange([...value, role]);
                    }
                  }}
                  style={[
                    styles.roleChip,
                    selected && { backgroundColor: theme.colors.primaryContainer },
                  ]}
                  textStyle={
                    selected
                      ? { color: theme.colors.primary, fontWeight: "600" }
                      : undefined
                  }
                >
                  {role}
                </Chip>
              );
            })}
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
          "Crear Usuario"
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
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  roleChip: {
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 12,
  },
  submitContent: {
    height: 50,
  },
});
