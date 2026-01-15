import { Stack } from "expo-router";

export default function DtmLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="coleccion" />
    </Stack>
  );
}
