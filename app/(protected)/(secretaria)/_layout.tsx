import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function SecretariaLayout() {
  const theme = useTheme();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="coleccion" options={{ headerShown: false }} />
      <Stack.Screen
        name="evento/create"
        options={{
          title: "Nuevo Evento",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700", fontSize: 18 },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="evento/[id]"
        options={{
          title: "Editar Evento",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700", fontSize: 18 },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="deportista/create"
        options={{
          title: "Nuevo Deportista",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700", fontSize: 18 },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="deportista/[id]"
        options={{
          title: "Editar Deportista",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700", fontSize: 18 },
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
