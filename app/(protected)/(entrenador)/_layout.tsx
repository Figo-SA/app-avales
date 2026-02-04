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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="solicitud/[eventoId]" options={{ headerShown: false }} />
      <Stack.Screen name="evento/[id]" options={{ headerShown: true, title: "Detalle del Evento", headerBackTitle: "Volver" }} />
      <Stack.Screen name="aval/[id]" options={{ headerShown: true, title: "Detalle del Aval", headerBackTitle: "Volver" }} />
    </Stack>
  );
}
