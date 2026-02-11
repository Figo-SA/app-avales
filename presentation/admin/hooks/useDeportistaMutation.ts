import {
  createDeportista,
  updateDeportista,
  deleteDeportista,
} from "@/core/deportistas/actions/deportistas-actions";
import type {
  CreateDeportistaDto,
  UpdateDeportistaDto,
} from "@/core/deportistas/interfaces/deportista";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateDeportista = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeportistaDto) => createDeportista(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deportistas"] });
    },
  });
};

export const useUpdateDeportista = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeportistaDto }) =>
      updateDeportista(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deportistas"] });
    },
  });
};

export const useDeleteDeportista = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDeportista(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deportistas"] });
    },
  });
};
