import {
    ColeccionEstado,
    getColecciones,
} from "@/core/avales/actions/colecciones-actions";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseColeccionesProps {
  estado?: ColeccionEstado;
  search?: string;
  etapa?: string;
}

export const useColecciones = ({ estado, search, etapa }: UseColeccionesProps = {}) => {
  const coleccionesQuery = useInfiniteQuery({
    queryKey: ["colecciones", "infinite", { estado, search, etapa }],
    queryFn: ({ pageParam }) => {
      return getColecciones(pageParam, 10, estado, search, etapa);
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Verificar si hay más páginas usando meta.hasNextPage
      if (!lastPage?.meta?.hasNextPage) return undefined;
      return allPages.length + 1;
    },
  });

  // Extraer los counts de la primera página (ahora está en meta.counts)
  const counts = coleccionesQuery.data?.pages[0]?.meta?.counts;

  return {
    coleccionesQuery,
    counts,
    loadNextPage: coleccionesQuery.fetchNextPage,
  };
};
