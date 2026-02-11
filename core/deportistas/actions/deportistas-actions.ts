import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import type {
  Deportista,
  DeportistasPaginatedResponse,
  CreateDeportistaDto,
  UpdateDeportistaDto,
} from "../interfaces/deportista";

export const getDeportistas = async (
  page = 1,
  limit = 10,
  search?: string
): Promise<DeportistasPaginatedResponse> => {
  try {
    const response = await httpClient.get<DeportistasPaginatedResponse>(
      API_ENDPOINTS.ATHLETES.LIST,
      {
        params: {
          page,
          limit,
          ...(search && search.trim() !== "" ? { search: search.trim() } : {}),
        },
      }
    );

    if (Array.isArray(response.data)) {
      return {
        items: response.data,
        pagination: {
          total: response.data.length,
          page,
          limit,
          lastPage: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getDeportistas");
    throw new Error(errorMessage);
  }
};

export const getDeportistaById = async (id: number): Promise<Deportista> => {
  try {
    const response = await httpClient.get<Deportista>(
      API_ENDPOINTS.ATHLETES.GET_BY_ID(id)
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getDeportistaById");
    throw new Error(errorMessage);
  }
};

export const createDeportista = async (
  data: CreateDeportistaDto
): Promise<Deportista> => {
  try {
    const response = await httpClient.post<Deportista>(
      API_ENDPOINTS.ATHLETES.CREATE,
      data
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "createDeportista");
    throw new Error(errorMessage);
  }
};

export const updateDeportista = async (
  id: number,
  data: UpdateDeportistaDto
): Promise<Deportista> => {
  try {
    const response = await httpClient.patch<Deportista>(
      API_ENDPOINTS.ATHLETES.UPDATE(id),
      data
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "updateDeportista");
    throw new Error(errorMessage);
  }
};

export const deleteDeportista = async (id: number): Promise<void> => {
  try {
    await httpClient.delete(API_ENDPOINTS.ATHLETES.DELETE(id));
  } catch (error) {
    const errorMessage = handleApiError(error, "deleteDeportista");
    throw new Error(errorMessage);
  }
};
