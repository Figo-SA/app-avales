import { registerSchema } from "@/core/auth/schemas/registerSchema";
import { logger } from "@/core/logger";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterScreen = () => {
  const { height } = useWindowDimensions();
  const theme = useTheme();
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    logger.info("Datos del registro:", data);
    // Aquí integrarías con tu store de auth
    // await authStore.register(data);
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
          contentContainerStyle={[styles.scrollContainer, { minHeight: height }]}
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
                name="person-add"
                size={40}
                color={theme.colors.primary}
              />
            </View>

            <ThemedText
              type="title"
              style={[styles.welcomeTitle, { color: theme.colors.onBackground }]}
            >
              Crear cuenta
            </ThemedText>
            <ThemedText
              style={[styles.welcomeSubtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              Completa tus datos para comenzar
            </ThemedText>
          </ThemedView>

          {/* Form Section */}
          <Surface style={styles.formCard} elevation={2}>
            <ThemedView style={styles.inputContainer}>
              {/* Name Fields Row */}
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, value } }) => (
                      <ThemedTextInput
                        mode="outlined"
                        label="Nombre"
                        placeholder="Tu nombre"
                        autoCapitalize="words"
                        autoComplete="given-name"
                        textContentType="givenName"
                        icon="person-outline"
                        value={value}
                        onChangeText={onChange}
                        errorMessage={errors.firstName?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => lastNameRef.current?.focus()}
                        blurOnSubmit={false}
                      />
                    )}
                  />
                </View>

                <View style={styles.nameField}>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, value } }) => (
                      <ThemedTextInput
                        mode="outlined"
                        label="Apellido"
                        placeholder="Tu apellido"
                        autoCapitalize="words"
                        autoComplete="family-name"
                        textContentType="familyName"
                        value={value}
                        onChangeText={onChange}
                        errorMessage={errors.lastName?.message}
                        returnKeyType="next"
                        ref={lastNameRef}
                        onSubmitEditing={() => emailRef.current?.focus()}
                        blurOnSubmit={false}
                      />
                    )}
                  />
                </View>
              </View>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <ThemedTextInput
                    mode="outlined"
                    type="email"
                    label="Correo electrónico"
                    placeholder="tu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    icon="mail-outline"
                    value={value}
                    onChangeText={onChange}
                    errorMessage={errors.email?.message}
                    returnKeyType="next"
                    ref={emailRef}
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
                    placeholder="Mínimo 8 caracteres"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    icon="lock-closed-outline"
                    type="password"
                    value={value}
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                    returnKeyType="next"
                    ref={passwordRef}
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <ThemedTextInput
                    mode="outlined"
                    label="Confirmar contraseña"
                    placeholder="Repite tu contraseña"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    icon="lock-closed-outline"
                    type="password"
                    value={value}
                    onChangeText={onChange}
                    errorMessage={errors.confirmPassword?.message}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    ref={confirmPasswordRef}
                    blurOnSubmit={false}
                  />
                )}
              />

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <ThemedText
                  style={[
                    styles.termsText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Al registrarte, aceptas nuestros{" "}
                  <ThemedLink href="/auth/login">Términos y Condiciones</ThemedLink>{" "}
                  y{" "}
                  <ThemedLink href="/auth/login">Política de Privacidad</ThemedLink>
                </ThemedText>
              </View>
            </ThemedView>

            {/* Submit Button */}
            <ThemeButton
              loading={isSubmitting}
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={styles.registerButton}
              icon={isSubmitting ? undefined : "person-add-outline"}
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
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
              ¿Ya tienes una cuenta?{" "}
            </ThemedText>
            <ThemedLink href="/auth/login" style={styles.loginLink}>
              Inicia sesión aquí
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
    paddingVertical: 32,
  },
  headerContainer: {
    alignItems: "center",
    paddingBottom: 24,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 26,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  inputContainer: {
    gap: 14,
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  termsContainer: {
    marginTop: 4,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  registerButton: {
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
  loginLink: {
    fontWeight: "700",
  },
});

export default RegisterScreen;
