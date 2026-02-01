import { createAvalTecnico, SolicitudData } from "@/core/solicitud/actions/solicitud-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateSolicitudParams {
  solicitudData: SolicitudData;
  eventoId: number;
}

export const useSolicitudMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ solicitudData }: CreateSolicitudParams) => createAvalTecnico(solicitudData),
    onSuccess: (data, variables) => {
      // Invalidar las queries relacionadas con el evento
      queryClient.invalidateQueries({
        queryKey: ["evento", variables.eventoId],
      });

      // Invalidar otras queries relevantes si es necesario
      queryClient.invalidateQueries({
        queryKey: ["eventos"],
      });
    },
  });

  return mutation;
};
