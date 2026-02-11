import { UserForm } from "@/presentation/admin/components/UserForm";
import { useCreateUser } from "@/presentation/admin/hooks/useUserMutation";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function CreateUsuarioScreen() {
  const createMutation = useCreateUser();

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Usuario creado exitosamente");
        router.back();
      },
      onError: (error) => {
        toast.error(error.message || "Error al crear el usuario");
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <UserForm
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
