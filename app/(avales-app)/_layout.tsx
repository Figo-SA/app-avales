import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { usePushNotifications } from "@/presentation/notifications/hooks/usePushNotifications";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const CheckAuthenticationLayout = () => {
  const { status, checkStatus } = useAuthStore();
  
  // Inicializar notificaciones push solo cuando está autenticado
  const { expoPushToken, isRegistering, permissionStatus } = usePushNotifications();

  useEffect(() => {
    checkStatus();
  }, []);

  // Log del push token para debugging
  useEffect(() => {
    if (status === "authenticated") {
      if (permissionStatus === "granted" && expoPushToken) {
        console.log("✅ Push notifications configuradas correctamente");
        console.log("📱 Push Token:", expoPushToken);
      } else if (permissionStatus === "denied") {
        console.warn("⚠️ Usuario rechazó permisos de notificaciones");
      } else if (permissionStatus === "checking") {
        console.log("🔄 Verificando permisos de notificaciones...");
      }
    }
  }, [status, expoPushToken, permissionStatus]);

  if (status === "checking") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "unauthenticated") {
    // Guardar la ruta del usuario
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default CheckAuthenticationLayout;
