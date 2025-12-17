import { loginSchema } from "@/core/auth/schemas/loginSchema";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
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
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Surface, useTheme } from "react-native-paper";
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
            {/* Logo / Icon Container */}
            <View
              style={[
                styles.logoContainer,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={48}
                color={theme.colors.primary}
              />
            </View>

            <ThemedText
              type="title"
              style={[styles.welcomeTitle, { color: theme.colors.onBackground }]}
            >
              Bienvenido
            </ThemedText>
            <ThemedText
              style={[styles.welcomeSubtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              Inicia sesión para gestionar tus avales deportivos
            </ThemedText>
          </ThemedView>

          {/* Form Section */}
          <Surface style={styles.formCard} elevation={2}>
            <ThemedView style={styles.inputContainer}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <ThemedTextInput
                    mode="outlined"
                    label="Correo electrónico"
                    placeholder="tu@email.com"
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
                    placeholder="Tu contraseña"
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
              style={styles.submitButton}
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </ThemeButton>
          </Surface>

          {/* Footer */}
          <ThemedView style={styles.footerContainer}>
            <ThemedText
              style={[
                styles.footerText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              ¿No tienes una cuenta?{" "}
            </ThemedText>
            <ThemedLink href="/auth/register" style={styles.registerLink}>
              Regístrate aquí
            </ThemedLink>
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
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: "center",
    paddingBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 28,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: -4,
  },
  submitButton: {
    borderRadius: 14,
    paddingVertical: 4,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  registerLink: {
    fontWeight: "700",
  },
});

export default LoginScreen;
