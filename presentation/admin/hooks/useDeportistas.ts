import { getDeportistas } from "@/core/deportistas/actions/deportistas-actions";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseDeportistasProps {
  search?: string;
}

export const useDeportistas = ({ search }: UseDeportistasProps = {}) => {
  const query = useInfiniteQuery({
    queryKey: ["deportistas", "infinite", { search }],
    queryFn: ({ pageParam }) => getDeportistas(pageParam, 10, search),
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
