import { Stack } from "expo-router";

export default function MetodologoLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="coleccion" options={{ headerShown: false }} />
    </Stack>
  );
}
