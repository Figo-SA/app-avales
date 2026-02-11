import { getUsers } from "@/core/users/actions/users-actions";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseUsersProps {
  search?: string;
}

export const useUsers = ({ search }: UseUsersProps = {}) => {
  const query = useInfiniteQuery({
    queryKey: ["users", "infinite", { search }],
    queryFn: ({ pageParam }) => getUsers(pageParam, 10, search),
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
