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

/**
 * Obtiene una colección por su ID (con datos completos anidados)
 */
export const getColeccionById = async (
  id: number
): Promise<ColeccionAval | null> => {
  try {
    const response = await httpClient.get<ColeccionAval>(
      API_ENDPOINTS.AVALES.GET_BY_ID(id)
    );
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    const errorMessage = handleApiError(error, "getColeccionById");
    throw new Error(errorMessage);
  }
};

export type ColeccionEstado = "SOLICITADO" | "ACEPTADO" | "RECHAZADO";

export const getColecciones = async (
  page = 1,
  limit = 10,
  estado?: ColeccionEstado,
  search?: string,
  etapa?: string
): Promise<ColeccionResponse> => {
  try {
    const params: Record<string, any> = { page, limit };
    if (estado) params.estado = estado;
    if (search) params.search = search;
    if (etapa) params.etapa = etapa;

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
  usuarioId: number,
  etapa?: string
): Promise<void> => {
  try {
    const payload: { usuarioId: number; etapa?: string } = { usuarioId };
    if (etapa) {
      payload.etapa = etapa;
    }
    await httpClient.patch(API_ENDPOINTS.AVALES.APROBAR(avalId), payload);
  } catch (error) {
    const errorMessage = handleApiError(error, "aprobarSolicitud");
    throw new Error(errorMessage);
  }
};

export interface CreatePdaPayload {
  descripcion: string;
  numeroPda?: string;
  numeroAval?: string;
  codigoActividad?: string;
  nombreFirmante?: string;
  cargoFirmante?: string;
}

export const createPda = async (
  avalId: number,
  payload: CreatePdaPayload
): Promise<void> => {
  try {
    await httpClient.post(API_ENDPOINTS.AVALES.CREATE_PDA(avalId), payload);
  } catch (error) {
    const errorMessage = handleApiError(error, "createPda");
    throw new Error(errorMessage);
  }
};

export interface CreateComprasPublicasPayload {
  numeroCertificado?: string;
  realizoProceso?: boolean;
  codigoNecesidad?: string;
  objetoContratacion?: string;
  nombreFirmante?: string;
  cargoFirmante?: string;
  fechaEmision?: string;
}

export const createComprasPublicas = async (
  avalId: number,
  payload: CreateComprasPublicasPayload
): Promise<void> => {
  try {
    await httpClient.post(
      API_ENDPOINTS.AVALES.CREATE_COMPRAS_PUBLICAS(avalId),
      payload
    );
  } catch (error) {
    const errorMessage = handleApiError(error, "createComprasPublicas");
    throw new Error(errorMessage);
  }
};

export const rechazarSolicitud = async (
  avalId: number,
  usuarioId: number,
  motivo?: string,
  etapa?: string
): Promise<void> => {
  try {
    const payload: { usuarioId: number; motivo?: string; etapa?: string } = {
      usuarioId,
      motivo,
    };
    if (etapa) payload.etapa = etapa;

    await httpClient.patch(API_ENDPOINTS.AVALES.RECHAZAR(avalId), payload);
  } catch (error) {
    const errorMessage = handleApiError(error, "rechazarSolicitud");
    throw new Error(errorMessage);
  }
};
