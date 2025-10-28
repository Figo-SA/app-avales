import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import { Evento, EventosPaginatedResponse } from "../interfaces/evento";

export const getEventos = async (
  page = 1,
  limit = 10,
  estado?: string,
  search?: string
): Promise<EventosPaginatedResponse> => {
  try {
    const response = await httpClient.get<EventosPaginatedResponse>(
      API_ENDPOINTS.EVENTOS.LIST,
      {
        params: {
          page,
          limit,
          ...(estado && estado !== "all"
            ? { estado: estado.toUpperCase() }
            : {}),
          ...(search && search.trim() !== "" ? { search: search.trim() } : {}),
        },
      }
    );
    // Retornamos la respuesta completa (items, pagination, counts)
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getEventos");
    throw new Error(errorMessage);
  }
};

export const getEventoById = async (id: number): Promise<Evento | null> => {
  try {
    const response = await httpClient.get<Evento>(
      API_ENDPOINTS.EVENTOS.GET_BY_ID(id)
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getEventoById");
    throw new Error(errorMessage);
  }
};

export const uploadEventoFile = async (
  eventoId: number,
  file: {
    uri: string;
    name: string;
    type: string;
  }
): Promise<{ message: string; fileUrl?: string }> => {
  try {
    const formData = new FormData();

    // Agregar el archivo al FormData
    formData.append("archivo", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const response = await httpClient.patch(
      API_ENDPOINTS.EVENTOS.UPLOAD_FILE(eventoId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "uploadEventoFile");
    throw new Error(errorMessage);
  }
};
