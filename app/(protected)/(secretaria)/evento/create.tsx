import { EventoForm } from "@/presentation/admin/components/EventoForm";
import { useCreateEvento } from "@/presentation/admin/hooks/useEventoMutation";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function SecretariaCreateEventoScreen() {
  const createMutation = useCreateEvento();

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Evento creado exitosamente");
        router.back();
      },
      onError: (error) => {
        toast.error(error.message || "Error al crear el evento");
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <EventoForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
