import { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, TextInputProps, useTheme } from "react-native-paper";

interface Props extends TextInputProps {
  icon?: string;
  type?: "text" | "password" | "numeric" | "email";
  errorMessage?: string;
  multiline?: boolean;
}

const ThemedTextInput = ({
  icon,
  type,
  errorMessage,
  multiline,
  ...rest
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isPassword = type === "password";
  const hasError = !!errorMessage;

  return (
    <View style={{ marginBottom: 8 }}>
      <TextInput
        {...rest}
        mode="outlined"
        error={hasError}
        secureTextEntry={isPassword && !showPassword}
        keyboardType={
          type === "numeric"
            ? "numeric"
            : type === "email"
            ? "email-address"
            : "default"
        }
        textColor={theme.colors.onSurface}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        autoCapitalize={type === "email" ? "none" : "sentences"}
        autoCorrect={type === "email" ? false : true}
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
