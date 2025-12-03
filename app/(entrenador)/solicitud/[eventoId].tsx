import { SolicitudForm } from "@/presentation/solicitud/components/SolicitudForm";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { useTheme } from "react-native-paper";

export default function SolicitudScreen() {
  const { eventoId } = useLocalSearchParams<{ eventoId: string }>();
  const theme = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Solicitud",
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.onPrimary,
          headerBackTitle: "Volver",
        }}
      />
      <SolicitudForm eventoId={eventoId} />
    </>
  );
}
