import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import { ColeccionAval, ColeccionResponse } from "../interfaces/coleccion";

/**
 * Obtiene la colección de aval de un evento específico
 */
export const getColeccionByEvento = async (
  eventoId: number
): Promise<ColeccionAval | null> => {
  try {
    const response = await httpClient.get<ColeccionAval>(
      API_ENDPOINTS.EVENTOS.GET_COLLECTION(eventoId)
    );
    return response.data;
  } catch (error: any) {
    // Si no existe colección, retornar null en lugar de lanzar error
    if (error?.response?.status === 404) {
      return null;
    }
    const errorMessage = handleApiError(error, "getColeccionByEvento");
    throw new Error(errorMessage);
  }
};

export type ColeccionEstado = "SOLICITADO" | "ACEPTADO" | "RECHAZADO";

export const getColecciones = async (
  page = 1,
  limit = 10,
  estado?: ColeccionEstado,
  search?: string
): Promise<ColeccionResponse> => {
  try {
    const params: Record<string, any> = { page, limit };
    if (estado) params.estado = estado;
    if (search) params.search = search;

    // Usar fetch directamente para obtener la respuesta completa sin unwrapping del httpClient
    const { SecureStorageAdapter } = await import("@/helpers/adapters/secure-storage.adapter");
    const { API_URL } = await import("@/core/api/api.config");

    const token = await SecureStorageAdapter.getItem("token");
    const queryString = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    const fullUrl = `${API_URL}${API_ENDPOINTS.AVALES.LIST}?${queryString}`;

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    // Retornar la respuesta completa con meta y data
    return {
      status: json.status,
      message: json.message,
      meta: json.meta,
      data: json.data || [],
    };
  } catch (error) {
    const errorMessage = handleApiError(error, "getColecciones");
    throw new Error(errorMessage);
  }
};

export const aprobarSolicitud = async (
  avalId: number,
  usuarioId: number
): Promise<void> => {
  try {
    await httpClient.patch(API_ENDPOINTS.AVALES.APROBAR(avalId), {
      usuarioId,
    });
  } catch (error) {
    const errorMessage = handleApiError(error, "aprobarSolicitud");
    throw new Error(errorMessage);
  }
};

export const rechazarSolicitud = async (
  avalId: number,
  usuarioId: number,
  motivo?: string
): Promise<void> => {
  try {
    await httpClient.patch(API_ENDPOINTS.AVALES.RECHAZAR(avalId), {
      usuarioId,
      motivo,
    });
  } catch (error) {
    const errorMessage = handleApiError(error, "rechazarSolicitud");
    throw new Error(errorMessage);
  }
};
