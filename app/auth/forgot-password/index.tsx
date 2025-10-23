import {
  forgotPassword,
  resetPassword,
  validateRecoveryCode,
} from "@/core/auth/actions/password-recovery-actions";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
  ResetPasswordFormData,
  resetPasswordSchema,
  ValidateCodeFormData,
  validateCodeSchema,
} from "@/core/auth/schemas/password-recovery-schemas";
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
import { SafeAreaView } from "react-native-safe-area-context";

type Step = "email" | "code" | "password";

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulario para email
  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  // Formulario para código
  const {
    control: codeControl,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
    reset: resetCodeForm,
  } = useForm<ValidateCodeFormData>({
    resolver: zodResolver(validateCodeSchema),
    defaultValues: { code: "" },
    mode: "onSubmit",
  });

  // Formulario para nueva contraseña
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  // Paso 1: Enviar código al email
  const onSubmitEmail = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const response = await forgotPassword(data.email);
      setEmail(data.email);

      // Resetear formulario del código antes de cambiar de paso
      resetCodeForm({ code: "" });

      toast.success(
        response.message || "Se ha enviado un código a tu correo electrónico"
      );
      setCurrentStep("code");
    } catch (error: any) {
      toast.error(error.message || "Error al enviar el código");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Paso 2: Validar código
  const onSubmitCode = async (data: ValidateCodeFormData) => {
    try {
      setIsSubmitting(true);
      const response = await validateRecoveryCode(email, data.code);

      if (response.valid) {
        setCode(data.code);

        // Resetear formulario de contraseña antes de cambiar de paso
        resetPasswordForm({
          code: "",
          newPassword: "",
          confirmPassword: "",
        });

        toast.success("Código validado correctamente");
        setCurrentStep("password");
      } else {
        toast.error("Código inválido. Verifica e intenta nuevamente");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al validar el código");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Paso 3: Cambiar contraseña
  const onSubmitPassword = async (data: ResetPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const response = await resetPassword(email, code, data.newPassword);

      toast.success(response.message || "Contraseña cambiada exitosamente");

      // Redirigir al login después de 1 segundo
      setTimeout(() => {
        router.replace("/auth/login");
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar la contraseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar paso actual
  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <View style={styles.stepContainer}>
            <ThemedText type="title" style={styles.title}>
              Recuperar Contraseña
            </ThemedText>
            <ThemedText style={styles.description}>
              Ingresa tu correo electrónico y te enviaremos un código de 6
              dígitos para recuperar tu contraseña.
            </ThemedText>

            <Controller
              control={emailControl}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  label="Correo Electrónico *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={emailErrors.email?.message}
                  type="email"
                  autoCapitalize="none"
                  disabled={isSubmitting}
                  icon="ion:mail-outline"
                />
              )}
            />

            <ThemeButton
              mode="contained"
              onPress={handleEmailSubmit(onSubmitEmail)}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.button}
            >
              Enviar Código
            </ThemeButton>

            <ThemeButton
              mode="text"
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              Volver al Login
            </ThemeButton>
          </View>
        );

      case "code":
        return (
          <View style={styles.stepContainer}>
            <ThemedText type="title" style={styles.title}>
              Verificar Código
            </ThemedText>
            <ThemedText style={styles.description}>
              Hemos enviado un código de 6 dígitos a{" "}
              <ThemedText style={styles.emailText}>{email}</ThemedText>
            </ThemedText>

            <Controller
              control={codeControl}
              name="code"
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  label="Código de 6 Dígitos *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={codeErrors.code?.message}
                  type="numeric"
                  maxLength={6}
                  editable={!isSubmitting}
                  icon="ion:key-outline"
                />
              )}
            />

            <ThemeButton
              mode="contained"
              onPress={handleCodeSubmit(onSubmitCode)}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.button}
            >
              Validar Código
            </ThemeButton>

            <ThemeButton
              mode="text"
              onPress={() => {
                resetCodeForm({ code: "" });
                setCurrentStep("email");
              }}
              disabled={isSubmitting}
            >
              Cambiar Email
            </ThemeButton>

            <ThemeButton
              mode="text"
              onPress={() => {
                resetCodeForm({ code: "" });
                handleEmailSubmit(onSubmitEmail)();
              }}
              disabled={isSubmitting}
            >
              Reenviar Código
            </ThemeButton>
          </View>
        );

      case "password":
        return (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.title}>Nueva Contraseña</ThemedText>
            <ThemedText style={styles.description}>
              Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres, con
              mayúsculas, minúsculas y números.
            </ThemedText>

            <Controller
              control={passwordControl}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  label="Nueva Contraseña *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={passwordErrors.newPassword?.message}
                  type="password"
                  disabled={isSubmitting}
                  icon="ion:lock-closed-outline"
                />
              )}
            />

            <Controller
              control={passwordControl}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  label="Confirmar Contraseña *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={passwordErrors.confirmPassword?.message}
                  type="password"
                  disabled={isSubmitting}
                  icon="ion:lock-closed-outline"
                />
              )}
            />

            <ThemeButton
              mode="contained"
              onPress={handlePasswordSubmit(onSubmitPassword)}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.button}
            >
              Cambiar Contraseña
            </ThemeButton>

            <ThemeButton
              mode="text"
              onPress={() => {
                resetPasswordForm({
                  code: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setCurrentStep("code");
              }}
              disabled={isSubmitting}
            >
              Volver
            </ThemeButton>
          </View>
        );
    }
  };

  return (
    <>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Stack.Screen
          options={{
            title: "Recuperar Contraseña",
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
            keyboardShouldPersistTaps="handled"
          >
            {/* Indicador de pasos */}
            <View style={styles.stepsIndicator}>
              <View style={styles.stepDot}>
                <View
                  style={[
                    styles.dot,
                    currentStep === "email" && styles.dotActive,
                  ]}
                />
                <ThemedText style={styles.stepLabel}>Email</ThemedText>
              </View>

              <View style={styles.stepLine} />

              <View style={styles.stepDot}>
                <View
                  style={[
                    styles.dot,
                    currentStep === "code" && styles.dotActive,
                    currentStep === "password" && styles.dotCompleted,
                  ]}
                />
                <ThemedText style={styles.stepLabel}>Código</ThemedText>
              </View>

              <View style={styles.stepLine} />

              <View style={styles.stepDot}>
                <View
                  style={[
                    styles.dot,
                    currentStep === "password" && styles.dotActive,
                  ]}
                />
                <ThemedText style={styles.stepLabel}>Contraseña</ThemedText>
              </View>
            </View>

            {renderStep()}
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
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
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
    justifyContent: "center",
  },
  stepsIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  stepDot: {
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
  },
  dotActive: {
    backgroundColor: "#03A9F4",
  },
  dotCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepLine: {
    flex: 1,
    height: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
    borderRadius: 2,
    marginBottom: 20,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  stepContainer: {
    gap: 16,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 20,
  },
  emailText: {
    fontWeight: "700",
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
});
