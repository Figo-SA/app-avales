import { loginSchema } from "@/core/auth/schemas/loginSchema";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";

import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

const LoginScreen = () => {
  const { height } = useWindowDimensions();
  const theme = useTheme();
  const { login } = useAuthStore();

  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const wasSuccessful = await login(data.email, data.password);
    if (wasSuccessful) {
      router.replace("/");
      return;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { minHeight: height },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <ThemedView style={styles.headerContainer}>
            <ThemedView style={styles.logoContainer}>
              {/* Logo de la aplicación */}
              <ThemedView style={[{ backgroundColor: theme.colors.primary }]} />
            </ThemedView>

            <ThemedText
              type="title"
              style={[{ color: theme.colors.onBackground }]}
            >
              Bienvenido de nuevo
            </ThemedText>
            <ThemedText style={[{ color: theme.colors.onSurfaceVariant }]}>
              Por favor inicia sesión para continuar
            </ThemedText>
          </ThemedView>

          {/* Form Section */}

          <ThemedView style={styles.inputContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <ThemedTextInput
                  mode="outlined"
                  label="Correo electrónico"
                  placeholder="ejemplo@dominio.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  type="email"
                  icon="mail-outline"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  blurOnSubmit={false}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <ThemedTextInput
                  mode="outlined"
                  label="Contraseña"
                  placeholder="••••••••"
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="password"
                  icon="lock-closed-outline"
                  type="password"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  ref={passwordRef}
                  blurOnSubmit={false}
                />
              )}
            />

            {/* Forgot Password Link */}
            <ThemedView style={styles.forgotPasswordContainer}>
              <ThemedLink href="/auth/forgot-password">
                ¿Olvidaste tu contraseña?
              </ThemedLink>
            </ThemedView>
          </ThemedView>

          {/* Submit Button */}
          <ThemeButton
            loading={isSubmitting}
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            icon={isSubmitting ? undefined : "log-in-outline"}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </ThemeButton>

          {/* Footer */}
          <ThemedView style={styles.footerContainer}>
            <ThemedText
              style={[
                styles.footerText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              ¿No tienes una cuenta?{" "}
              <ThemedLink href="/auth/register" style={styles.registerLink}>
                Regístrate aquí
              </ThemedLink>
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: "center",
  },

  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: -8,
  },

  footerContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  registerLink: {
    fontWeight: "600",
  },
});

export default LoginScreen;
