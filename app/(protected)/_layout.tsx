import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { Redirect, Stack } from "expo-router";

/**
 * Layout centralizado para rutas protegidas.
 * La autenticación inicial se hace en el index.tsx raíz.
 * Este layout solo verifica que el usuario siga autenticado.
 */
export default function ProtectedLayout() {
  const { status } = useAuthStore();

  // Si por alguna razón el usuario no está autenticado, redirigir
  if (status === "unauthenticated") {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="(dtm)" />
      <Stack.Screen name="(entrenador)" />
      <Stack.Screen name="(pda)" />
      <Stack.Screen name="(compras-publicas)" />
      <Stack.Screen name="(control-previo)" />
      <Stack.Screen name="(secretaria)" />
      <Stack.Screen name="(financiero)" />
    </Stack>
  );
}
