import { getUserById } from "@/core/users/actions/users-actions";
import { showDeleteConfirm } from "@/presentation/admin/components/DeleteConfirmDialog";
import { UserForm } from "@/presentation/admin/components/UserForm";
import {
  useDeleteUser,
  useUpdateUser,
} from "@/presentation/admin/hooks/useUserMutation";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function EditUsuarioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const { data: user, isLoading } = useQuery({
    queryKey: ["users", Number(id)],
    queryFn: () => getUserById(Number(id)),
    enabled: !!id,
  });

  const handleSubmit = (data: any) => {
    updateMutation.mutate(
      { id: Number(id), data },
      {
        onSuccess: () => {
          toast.success("Usuario actualizado exitosamente");
          router.back();
        },
        onError: (error) => {
          toast.error(error.message || "Error al actualizar el usuario");
        },
      }
    );
  };

  const handleDelete = () => {
    showDeleteConfirm({
      title: "Eliminar usuario",
      message: `¿Estás seguro de eliminar a ${user?.nombre} ${user?.apellido}?`,
      onConfirm: () => {
        deleteMutation.mutate(Number(id), {
          onSuccess: () => {
            toast.success("Usuario eliminado");
            router.back();
          },
          onError: (error) => {
            toast.error(error.message || "Error al eliminar el usuario");
          },
        });
      },
    });
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <UserForm
        mode="edit"
        initialData={user || undefined}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
      />
      <View style={styles.deleteContainer}>
        <Button
          mode="outlined"
          textColor={theme.colors.error}
          style={[styles.deleteButton, { borderColor: theme.colors.error }]}
          icon="ion:trash-outline"
          onPress={handleDelete}
          loading={deleteMutation.isPending}
        >
          Eliminar Usuario
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  deleteButton: {
    borderRadius: 12,
  },
});
