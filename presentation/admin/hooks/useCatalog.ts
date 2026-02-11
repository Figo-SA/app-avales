import { getCategorias, getDisciplinas } from "@/core/catalog/actions/catalog-actions";
import { useQuery } from "@tanstack/react-query";

export const useCategorias = () => {
  return useQuery({
    queryKey: ["catalog", "categorias"],
    queryFn: getCategorias,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};

export const useDisciplinas = () => {
  return useQuery({
    queryKey: ["catalog", "disciplinas"],
    queryFn: getDisciplinas,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};
