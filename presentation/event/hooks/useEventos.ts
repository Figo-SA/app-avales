import { getEventos } from "@/core/eventos/actions/eventos-actions";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useEventos = () => {
  const eventosQuery = useInfiniteQuery({
    queryKey: ["eventos", "infinite"],
    queryFn: ({ pageParam }) => getEventos(10, pageParam * 10),
    staleTime: 1000 * 60 * 60,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });
  return {
    eventosQuery,

    // Methods
    loadNextPage: eventosQuery.fetchNextPage,
  };
};
