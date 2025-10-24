import {
  forgotPassword,
  resetPassword,
} from "@/core/auth/actions/password-recovery-actions";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/core/auth/schemas/password-recovery-schemas";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Step = "email" | "reset";

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  // Animación de la línea de progreso
  const lineProgress = useRef(new Animated.Value(0)).current;

  // Animar línea cuando cambia el paso
  useEffect(() => {
    Animated.timing(lineProgress, {
      toValue: currentStep === "reset" ? 1 : 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

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

  const onSubmitEmail = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const response = await forgotPassword(data.email);
      setEmail(data.email);

      resetPasswordForm({
        code: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success(
        response.message || "Se ha enviado un código a tu correo electrónico"
      );
      setCurrentStep("reset");
    } catch (error: any) {
      toast.error(error.message || "Error al enviar el código");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitReset = async (data: ResetPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const response = await resetPassword(email, data.code, data.newPassword);

      toast.success(response.message || "Contraseña cambiada exitosamente");

      setTimeout(() => {
        router.replace("/auth/login");
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar la contraseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
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
                  currentStep === "reset" && styles.dotCompleted,
                ]}
              >
                {currentStep === "reset" && (
                  <Icon source="checkmark-outline" size={18} color="#FFFFFF" />
                )}
              </View>
              <ThemedText
                style={[
                  styles.stepLabel,
                  currentStep === "reset" && styles.stepLabelCompleted,
                ]}
              >
                Email
              </ThemedText>
            </View>

            <View style={styles.stepLineContainer}>
              <View style={styles.stepLine} />
              <Animated.View
                style={[
                  styles.stepLineProgress,
                  {
                    width: lineProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>

            <View style={styles.stepDot}>
              <View
                style={[
                  styles.dot,
                  currentStep === "reset" && styles.dotActive,
                ]}
              />
              <ThemedText style={styles.stepLabel}>Restablecer</ThemedText>
            </View>
          </View>
          {currentStep === "email" && (
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
          )}
          {currentStep === "reset" && (
            <View style={styles.stepContainer}>
              <ThemedText type="title" style={styles.title}>
                Restablecer Contraseña
              </ThemedText>
              <ThemedText style={styles.description}>
                Hemos enviado un código de 6 dígitos a{" "}
                <ThemedText style={styles.emailText}>{email}</ThemedText>.
                Ingrésalo junto con tu nueva contraseña.
              </ThemedText>

              <Controller
                control={passwordControl}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                  <ThemedTextInput
                    label="Código de 6 Dígitos *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={passwordErrors.code?.message}
                    type="numeric"
                    maxLength={6}
                    editable={!isSubmitting}
                    icon="ion:key-outline"
                  />
                )}
              />

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
                onPress={handlePasswordSubmit(onSubmitReset)}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.button}
              >
                Restablecer Contraseña
              </ThemeButton>

              <ThemeButton
                mode="text"
                onPress={() => {
                  resetPasswordForm({
                    code: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setCurrentStep("email");
                }}
                disabled={isSubmitting}
              >
                Cambiar Email
              </ThemeButton>

              <ThemeButton
                mode="text"
                onPress={handleEmailSubmit(onSubmitEmail)}
                disabled={isSubmitting}
              >
                Reenviar Código
              </ThemeButton>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    justifyContent: "center",
    alignItems: "center",
  },
  dotActive: {
    backgroundColor: "#03A9F4",
  },
  dotCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepLineContainer: {
    flex: 1,
    height: 4,
    marginHorizontal: 10,
    marginBottom: 20,
    position: "relative",
    borderRadius: 2,
    overflow: "hidden",
  },
  stepLine: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  stepLineProgress: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  stepLabelCompleted: {
    color: "#4CAF50",
    fontWeight: "700",
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
