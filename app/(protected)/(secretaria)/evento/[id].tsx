import { getEventoById } from "@/core/eventos/actions/eventos-actions";
import { showDeleteConfirm } from "@/presentation/admin/components/DeleteConfirmDialog";
import { EventoForm } from "@/presentation/admin/components/EventoForm";
import {
  useDeleteEvento,
  useUpdateEvento,
} from "@/presentation/admin/hooks/useEventoMutation";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function SecretariaEditEventoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const updateMutation = useUpdateEvento();
  const deleteMutation = useDeleteEvento();

  const { data: evento, isLoading } = useQuery({
    queryKey: ["admin-eventos", Number(id)],
    queryFn: () => getEventoById(Number(id)),
    enabled: !!id,
  });

  const handleSubmit = (data: any) => {
    updateMutation.mutate(
      { id: Number(id), data },
      {
        onSuccess: () => {
          toast.success("Evento actualizado exitosamente");
          router.back();
        },
        onError: (error) => {
          toast.error(error.message || "Error al actualizar el evento");
        },
      }
    );
  };

  const handleDelete = () => {
    showDeleteConfirm({
      title: "Eliminar evento",
      message: `¿Estás seguro de eliminar "${evento?.nombre}"?`,
      onConfirm: () => {
        deleteMutation.mutate(Number(id), {
          onSuccess: () => {
            toast.success("Evento eliminado");
            router.back();
          },
          onError: (error) => {
            toast.error(error.message || "Error al eliminar el evento");
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
      <EventoForm
        mode="edit"
        initialData={evento || undefined}
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
          Eliminar Evento
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
