import { changePassword } from "@/core/auth/actions/change-password-actions";
import {
  changePasswordSchema,
  type ChangePasswordFormDataValidated,
} from "@/core/auth/schemas/change-password-schemas";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { toast } from "@backpackapp-io/react-native-toast";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { forwardRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

interface ChangePasswordBottomSheetProps {
  onSuccess?: () => void;
}

export const ChangePasswordBottomSheet = forwardRef<
  BottomSheet,
  ChangePasswordBottomSheetProps
>(({ onSuccess }, ref) => {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormDataValidated>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      // Reset form cuando se cierra
      reset();
    }
  };

  const onSubmit = async (data: ChangePasswordFormDataValidated) => {
    try {
      setIsSubmitting(true);
      const response = await changePassword(
        data.currentPassword,
        data.newPassword
      );

      toast.success(response.message || "Contraseña actualizada exitosamente");
      reset();

      // Cerrar bottom sheet
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.close();
      }

      onSuccess?.();
    } catch (error: any) {
      // El error ya viene parseado desde handleApiError con el errorCode
      toast.error(error.message || "Error al cambiar la contraseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={["75%"]}
      enablePanDownToClose
      onChange={handleSheetChanges}
      backgroundStyle={{
        backgroundColor: theme.colors.surface,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.onSurfaceVariant,
      }}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Cambiar Contraseña
          </ThemedText>
          <ThemedText style={styles.description}>
            Ingresa tu contraseña actual y elige una nueva contraseña segura.
          </ThemedText>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                label="Contraseña Actual *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={errors.currentPassword?.message}
                type="password"
                disabled={isSubmitting}
                icon="ion:lock-closed-outline"
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                label="Nueva Contraseña *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={errors.newPassword?.message}
                type="password"
                disabled={isSubmitting}
                icon="ion:key-outline"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                label="Confirmar Nueva Contraseña *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={errors.confirmPassword?.message}
                type="password"
                disabled={isSubmitting}
                icon="ion:checkmark-circle-outline"
              />
            )}
          />

          <ThemeButton
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.button}
          >
            Cambiar Contraseña
          </ThemeButton>

          <ThemeButton
            mode="outlined"
            onPress={() => {
              if (ref && typeof ref !== "function" && ref.current) {
                ref.current.close();
              }
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </ThemeButton>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

ChangePasswordBottomSheet.displayName = "ChangePasswordBottomSheet";

const styles = StyleSheet.create({
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(3, 169, 244, 0.1)",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoItem: {
    fontSize: 13,
    opacity: 0.8,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
});
