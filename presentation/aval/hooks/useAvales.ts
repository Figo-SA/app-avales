import { getAvales } from "@/core/avales/actions/avalActions";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useAvales = () => {
  const avalesQuery = useInfiniteQuery({
    queryKey: ["avales", "infinite"],
    queryFn: ({ pageParam }) => getAvales(10, pageParam * 10),

    staleTime: 1000 * 60 * 60,

    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  return {
    avalesQuery,

    // Methods
    loadNextPage: avalesQuery.fetchNextPage,
  };
};
