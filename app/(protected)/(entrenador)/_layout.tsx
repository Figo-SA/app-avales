import { usePushNotifications } from "@/presentation/notifications/hooks/usePushNotifications";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function EntrenadorLayout() {
  // Inicializar notificaciones push para entrenadores
  const { expoPushToken, permissionStatus } = usePushNotifications();

  useEffect(() => {
    if (permissionStatus === "granted" && expoPushToken) {
      console.log("✅ Push notifications configuradas");
    }
  }, [expoPushToken, permissionStatus]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="solicitud" />
      <Stack.Screen name="aval" />
    </Stack>
  );
}
