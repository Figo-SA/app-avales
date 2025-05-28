import { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, TextInputProps, useTheme } from "react-native-paper";

interface Props extends TextInputProps {
  icon?: string;
  type?: "text" | "password" | "numeric";
  errorMessage?: string;
}

const ThemedTextInput = ({ icon, type, errorMessage, ...rest }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isPassword = type === "password";
  const hasError = !!errorMessage;

  return (
    <View style={{ marginBottom: 8 }}>
      <TextInput
        {...rest}
        mode="outlined" // ← Agregar esto
        error={hasError}
        secureTextEntry={isPassword && !showPassword}
        keyboardType={type === "numeric" ? "numeric" : "default"}
        textColor={theme.colors.onSurface} // ← Color del texto
        left={icon ? <TextInput.Icon icon={icon} /> : undefined}
        right={
          isPassword ? (
            <TextInput.Icon
              icon={showPassword ? "eye" : "eye-off"}
              onPress={() => setShowPassword(!showPassword)}
            />
          ) : undefined
        }
      />
      {hasError && (
        <Text
          variant="bodySmall"
          style={{
            color: theme.colors.error,
            marginTop: 4,
            marginLeft: 16,
          }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default ThemedTextInput;
