import { registerSchema } from "@/core/auth/schemas/registerSchema";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";

import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";

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
import { useTheme } from "react-native-paper";
import { z } from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterScreen = () => {
  const { width, height } = useWindowDimensions();
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
    console.log("Datos del registro:", data);
    // Aquí integrarías con tu store de auth
    // await authStore.register(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.keyboardView,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { minHeight: height }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            {/* Logo de la aplicación */}
            <View
              style={[
                styles.logoPlaceholder,
                { backgroundColor: theme.colors.primary },
              ]}
            />
          </View>

          <ThemedText
            type="title"
            style={[{ color: theme.colors.onBackground }]}
          >
            Crear cuenta
          </ThemedText>
          <ThemedText style={[{ color: theme.colors.onSurfaceVariant }]}>
            Completa los datos para registrarte
          </ThemedText>
        </View>

        {/* Form Section */}
        <View style={styles.inputContainer}>
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
                    icon="person-outline"
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
        </View>

        {/* Submit Button */}
        <ThemeButton
          loading={isSubmitting}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={styles.registerButton}
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </ThemeButton>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <ThemedText
            style={[
              styles.footerText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            ¿Ya tienes una cuenta?{" "}
            <ThemedLink href="/auth/login" style={styles.loginLink}>
              Inicia sesión aquí
            </ThemedLink>
          </ThemedText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 32,
  },
  logoContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  termsContainer: {
    marginTop: 8,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  registerButton: {
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
  },
  footerContainer: {
    marginTop: 16,
    alignItems: "center",
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  loginLink: {
    fontWeight: "600",
  },
});

export default RegisterScreen;
