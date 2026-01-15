import { updateUserProfile } from "@/core/profile/actions/profile-actions";
import {
  UpdateProfileFormData,
  updateProfileSchema,
} from "@/core/profile/schemas/profileSchemas";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function EditProfileScreen() {
  const { user, updateUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      nombre: user?.nombre || "",
      apellido: user?.apellido || "",
      cedula: user?.cedula || "",
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      setIsSubmitting(true);

      // Limpiar campos vacíos
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "")
      );

      const updatedProfile = await updateUserProfile(cleanData);

      // Actualizar el store con los nuevos datos
      updateUser({
        ...user!,
        nombre: updatedProfile.nombre,
        apellido: updatedProfile.apellido,
        cedula: updatedProfile.cedula,
      });

      toast.success("Perfil actualizado correctamente");
      router.back();
    } catch (error: any) {
      // El error ya viene procesado por handleApiError
      toast.error(error.message || "Error al actualizar el perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Editar Perfil",
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.onPrimary,
          headerBackTitle: "Volver",
        }}
      />

      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Información Personal
            </ThemedText>

            {/* Nombres */}
            <Controller
              control={control}
              name="nombre"
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  label="Nombres *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.nombre?.message}
                  autoCapitalize="words"
                  disabled={isSubmitting}
                />
              )}
            />

            {/* Apellidos */}
            <Controller
              control={control}
              name="apellido"
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  label="Apellidos *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.apellido?.message}
                  autoCapitalize="words"
                  disabled={isSubmitting}
                />
              )}
            />

            {/* Cédula */}
            <Controller
              control={control}
              name="cedula"
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  label="Cédula"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.cedula?.message}
                  type="numeric"
                  disabled={isSubmitting}
                />
              )}
            />
          </View>

          {/* Email (Solo lectura) */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Cuenta</ThemedText>
            <ThemedTextInput
              label="Email"
              value={user?.email || ""}
              type="email"
              disabled
              editable={false}
            />
            <ThemedText style={styles.helperText}>
              El email no puede ser modificado
            </ThemedText>
          </View>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <ThemeButton
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
            >
              Guardar Cambios
            </ThemeButton>

            <ThemeButton
              mode="outlined"
              onPress={() => router.back()}
              disabled={isSubmitting}
              style={styles.cancelButton}
            >
              Cancelar
            </ThemeButton>
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  disabledInput: {
    opacity: 0.6,
  },
  helperText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: -8,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
  },
  submitButton: {
    paddingVertical: 8,
  },
  cancelButton: {
    paddingVertical: 8,
  },
});
