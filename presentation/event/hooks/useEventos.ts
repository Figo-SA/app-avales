import { getEventos } from "@/core/eventos/actions/eventos-actions";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseEventosProps {
  estado?: string;
  search?: string;
}

export const useEventos = ({ estado, search }: UseEventosProps = {}) => {
  const eventosQuery = useInfiniteQuery({
    queryKey: ["eventos", "infinite", { estado, search }],
    queryFn: ({ pageParam, queryKey }) => {
      const [, , args] = queryKey;
      const { estado, search } = args as UseEventosProps;
      
      return getEventos(pageParam, 10, estado, search);
    },
    staleTime: 1000 * 60 * 60,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Si la página actual devolvió menos de 10 elementos, no hay más páginas
      if (lastPage.items.length < 10) return undefined;
      return allPages.length + 1;
    },
  });

  // Extraer los counts de la primera página (son los mismos en todas las páginas)
  const counts = eventosQuery.data?.pages[0]?.counts;

  return {
    eventosQuery,
    counts,

    // Methods
    loadNextPage: eventosQuery.fetchNextPage,
  };
};
