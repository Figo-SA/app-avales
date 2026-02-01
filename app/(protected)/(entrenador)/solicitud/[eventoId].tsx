import { SolicitudForm } from "@/presentation/solicitud/components/SolicitudForm";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { useTheme } from "react-native-paper";

export default function SolicitudScreen() {
  const { eventoId, initialStep, coleccionId } = useLocalSearchParams<{ 
    eventoId: string;
    initialStep?: string;
    coleccionId?: string;
  }>();
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
      <SolicitudForm 
        eventoId={eventoId} 
        initialStep={initialStep ? Number(initialStep) : 1}
        coleccionId={coleccionId ? Number(coleccionId) : undefined}
      />
    </>
  );
}
