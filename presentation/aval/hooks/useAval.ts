import { getAvalById } from "@/core/avales/actions/avalActions";
import { useQuery } from "@tanstack/react-query";

export const useAval = (id: string) => {
  const avalQuery = useQuery({
    queryKey: ["aval", id],
    queryFn: () => getAvalById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

  return {
    avalQuery,
  };
};
