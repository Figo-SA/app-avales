import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import {
  Evento,
  EventosPaginatedResponse,
  CreateEventoDto,
  UpdateEventoDto,
} from "../interfaces/evento";

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
            ? {
                estado: estado
                  .toUpperCase()
                  .replace("DISPONIBLES", "DISPONIBLE")
                  .replace("SOLICITADOS", "SOLICITADO")
                  .replace("RECHAZADOS", "RECHAZADO")
                  .replace("ACEPTADOS", "ACEPTADO"),
              }
            : {}),
          ...(search && search.trim() !== "" ? { search: search.trim() } : {}),
        },
      }
    );
    console.log("✅ Eventos obtenidos:", response.data);
    
    // Si la respuesta es un array (backend actual), lo adaptamos a la estructura paginada
    if (Array.isArray(response.data)) {
      return {
        items: response.data,
        pagination: {
          total: response.data.length,
          page: page,
          limit: limit,
          lastPage: 1,
          hasNext: false,
          hasPrev: false,
        },
        counts: {
          disponibles: 0,
          solicitados: 0,
          rechazados: 0,
          aceptados: 0,
        }
      };
    }

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

export const createEvento = async (data: CreateEventoDto): Promise<Evento> => {
  try {
    const response = await httpClient.post<Evento>(
      API_ENDPOINTS.EVENTOS.CREATE,
      data
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "createEvento");
    throw new Error(errorMessage);
  }
};

export const updateEvento = async (
  id: number,
  data: UpdateEventoDto
): Promise<Evento> => {
  try {
    const response = await httpClient.patch<Evento>(
      API_ENDPOINTS.EVENTOS.UPDATE(id),
      data
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "updateEvento");
    throw new Error(errorMessage);
  }
};

export const deleteEvento = async (id: number): Promise<void> => {
  try {
    await httpClient.delete(API_ENDPOINTS.EVENTOS.DELETE(id));
  } catch (error) {
    const errorMessage = handleApiError(error, "deleteEvento");
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
