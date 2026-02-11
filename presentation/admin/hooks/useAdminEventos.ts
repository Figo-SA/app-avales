import { getEventos } from "@/core/eventos/actions/eventos-actions";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseAdminEventosProps {
  search?: string;
}

export const useAdminEventos = ({ search }: UseAdminEventosProps = {}) => {
  const query = useInfiniteQuery({
    queryKey: ["admin-eventos", "infinite", { search }],
    queryFn: ({ pageParam }) => getEventos(pageParam, 10, undefined, search),
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.hasNext) return undefined;
      return lastPage.pagination.page + 1;
    },
  });

  return {
    query,
    loadNextPage: query.fetchNextPage,
  };
};
