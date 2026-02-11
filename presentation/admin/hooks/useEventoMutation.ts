import {
  createEvento,
  updateEvento,
  deleteEvento,
} from "@/core/eventos/actions/eventos-actions";
import type { CreateEventoDto, UpdateEventoDto } from "@/core/eventos/interfaces/evento";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateEvento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventoDto) => createEvento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-eventos"] });
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
    },
  });
};

export const useUpdateEvento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEventoDto }) =>
      updateEvento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-eventos"] });
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
    },
  });
};

export const useDeleteEvento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteEvento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-eventos"] });
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
    },
  });
};
