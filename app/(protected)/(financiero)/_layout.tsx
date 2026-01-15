import { Stack } from "expo-router";

export default function FinancieroLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="coleccion/index" />
    </Stack>
  );
}
