import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import type { Categoria, Disciplina } from "@/core/eventos/interfaces/evento";

export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await httpClient.get<Categoria[]>(
      API_ENDPOINTS.CATALOG.CATEGORIAS
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getCategorias");
    throw new Error(errorMessage);
  }
};

export const getDisciplinas = async (): Promise<Disciplina[]> => {
  try {
    const response = await httpClient.get<Disciplina[]>(
      API_ENDPOINTS.CATALOG.DISCIPLINAS
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getDisciplinas");
    throw new Error(errorMessage);
  }
};
