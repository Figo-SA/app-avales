import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { AccountSettings } from "@/presentation/profile/components/AccountSettings";
import { LogoutSection } from "@/presentation/profile/components/LogoutSection";
import { ProfileHeader } from "@/presentation/profile/components/ProfileHeader";
import { SupportSection } from "@/presentation/profile/components/SupportSection";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { router } from "expo-router";
import { Alert, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";

export default function ProfileTab() {
  const { user, logout } = useAuthStore();
  const theme = useTheme();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push("/(avales-app)/profile");
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Próximamente",
      "Funcionalidad de cambio de contraseña en desarrollo"
    );
  };

  const handleSupport = () => {
    Alert.alert(
      "Soporte",
      "¿Necesitas ayuda? Contáctanos en soporte@avalesapp.com"
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "Acerca de",
      "AvalesApp v1.0.0\nDesarrollado para la gestión eficiente de avales deportivos."
    );
  };
  const dynamicStyles = createDynamicStyles(theme);

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          dynamicStyles.scrollContent,
        ]}
        bounces={true}
        alwaysBounceVertical={false}
      >
        <ProfileHeader user={user} onEditProfile={handleEditProfile} />

        <AccountSettings onChangePassword={handleChangePassword} />

        <SupportSection onSupport={handleSupport} onAbout={handleAbout} />

        <LogoutSection onLogout={handleLogout} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
});

const createDynamicStyles = (theme: any) =>
  StyleSheet.create({
    scrollContent: {
      backgroundColor: theme.colors.background,
    },
  });
