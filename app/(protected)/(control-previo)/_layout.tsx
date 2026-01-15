import { Stack } from "expo-router";

export default function ControlPrevioLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="coleccion/index" />
    </Stack>
  );
}
