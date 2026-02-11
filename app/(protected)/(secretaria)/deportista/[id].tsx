import { getDeportistaById } from "@/core/deportistas/actions/deportistas-actions";
import { showDeleteConfirm } from "@/presentation/admin/components/DeleteConfirmDialog";
import { DeportistaForm } from "@/presentation/admin/components/DeportistaForm";
import {
  useDeleteDeportista,
  useUpdateDeportista,
} from "@/presentation/admin/hooks/useDeportistaMutation";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function SecretariaEditDeportistaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const updateMutation = useUpdateDeportista();
  const deleteMutation = useDeleteDeportista();

  const { data: deportista, isLoading } = useQuery({
    queryKey: ["deportistas", Number(id)],
    queryFn: () => getDeportistaById(Number(id)),
    enabled: !!id,
  });

  const handleSubmit = (data: any) => {
    updateMutation.mutate(
      { id: Number(id), data },
      {
        onSuccess: () => {
          toast.success("Deportista actualizado exitosamente");
          router.back();
        },
        onError: (error) => {
          toast.error(error.message || "Error al actualizar el deportista");
        },
      }
    );
  };

  const handleDelete = () => {
    showDeleteConfirm({
      title: "Eliminar deportista",
      message: `¿Estás seguro de eliminar a ${deportista?.nombres} ${deportista?.apellidos}?`,
      onConfirm: () => {
        deleteMutation.mutate(Number(id), {
          onSuccess: () => {
            toast.success("Deportista eliminado");
            router.back();
          },
          onError: (error) => {
            toast.error(error.message || "Error al eliminar el deportista");
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
      <DeportistaForm
        mode="edit"
        initialData={deportista || undefined}
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
          Eliminar Deportista
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
