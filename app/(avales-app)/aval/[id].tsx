import { AvalDetail } from "@/presentation/aval/components/AvalDetail";
import { useAval } from "@/presentation/aval/hooks/useAval";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

export default function AvalDetailScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const { avalQuery } = useAval(id as string);

  useEffect(() => {
    if (avalQuery.data) {
    }
  }, [avalQuery.data]);

  if (avalQuery.isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.onPrimary,
          }}
        />
        <ThemedView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </ThemedView>
      </>
    );
  }

  if (avalQuery.error || !avalQuery.data) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error", // Título en caso de error
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.onPrimary,
          }}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text variant="bodyLarge">Error al cargar el aval</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: avalQuery.data.title,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.onPrimary,
          headerBackTitle: "Volver",
        }}
      />
      <AvalDetail aval={avalQuery.data} />
    </>
  );
}
