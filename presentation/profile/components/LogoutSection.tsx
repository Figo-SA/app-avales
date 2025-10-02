import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

interface LogoutSectionProps {
  onLogout: () => void;
}

export const LogoutSection = ({ onLogout }: LogoutSectionProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.logoutSection}>
      <ThemeButton
        mode="contained"
        icon="ion:log-out"
        onPress={onLogout}
        buttonColor={theme.colors.error}
        textColor={theme.colors.onError}
        style={styles.logoutButton}
      >
        Cerrar Sesión
      </ThemeButton>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    logoutSection: {
      marginHorizontal: 16,
      marginBottom: 24,
    },
    logoutButton: {
      borderRadius: 12,
      paddingVertical: 4,
    },
  });
