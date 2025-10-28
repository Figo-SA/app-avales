import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import * as Notifications from "expo-notifications";
import { Linking, Platform } from "react-native";
import { Banner, useTheme } from "react-native-paper";

interface NotificationPermissionBannerProps {
  permissionStatus: "checking" | "granted" | "denied" | "unknown";
  visible: boolean;
  onDismiss: () => void;
}

export const NotificationPermissionBanner = ({
  permissionStatus,
  visible,
  onDismiss,
}: NotificationPermissionBannerProps) => {
  const theme = useTheme();

  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  const requestPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        onDismiss();
      } else {
        // Si el usuario rechaza de nuevo, sugerir abrir Settings
        openSettings();
      }
    } catch (error) {
      console.error("Error solicitando permisos:", error);
    }
  };

  if (permissionStatus !== "denied" || !visible) {
    return null;
  }

  return (
    <Banner
      visible={visible}
      icon="bell-outline"
      elevation={1}
      actions={[
        {
          label: "Configurar",
          onPress: openSettings,
        },
        {
          label: "Activar",
          onPress: requestPermissions,
        },
      ]}
      style={{
        backgroundColor: theme.colors.errorContainer,
      }}
    >
      Activa las notificaciones para recibir actualizaciones sobre tus eventos y
      avales.
    </Banner>
  );
};
