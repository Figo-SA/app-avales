import { getEventos } from "@/core/eventos/actions/eventos-actions";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useEventos = () => {
  const eventosQuery = useInfiniteQuery({
    queryKey: ["eventos", "infinite"],
    queryFn: ({ pageParam }) => getEventos(pageParam, 10),
    staleTime: 1000 * 60 * 60,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Si la página actual devolvió menos de 10 elementos, no hay más páginas
      if (lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
  });
  return {
    eventosQuery,

    // Methods
    loadNextPage: eventosQuery.fetchNextPage,
  };
};
