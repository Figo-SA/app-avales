import { DeportistaForm } from "@/presentation/admin/components/DeportistaForm";
import { useCreateDeportista } from "@/presentation/admin/hooks/useDeportistaMutation";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function CreateDeportistaScreen() {
  const createMutation = useCreateDeportista();

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Deportista creado exitosamente");
        router.back();
      },
      onError: (error) => {
        toast.error(error.message || "Error al crear el deportista");
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <DeportistaForm
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
