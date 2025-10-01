import { getEventoById } from "@/core/eventos/actions/eventos-actions";
import { useQuery } from "@tanstack/react-query";

export const useEventos = (id: string) => {
  const eventoQuery = useQuery({
    queryKey: ["evento", id],
    queryFn: () => getEventoById(Number(id)),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
  return {
    eventoQuery,
  };
};
