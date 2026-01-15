import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import { ColeccionResponse } from "../interfaces/coleccion";

export const getColecciones = async (
  page = 1,
  limit = 10
): Promise<ColeccionResponse> => {
  try {
    // Usar el endpoint de avales para obtener las colecciones/solicitudes
    const response = await httpClient.get<ColeccionResponse>(
      API_ENDPOINTS.AVALES.LIST,
      {
        params: {
          page,
          limit,
        },
      }
    );
    console.log("✅ Avales obtenidos:", response.data);

    // Si la respuesta es un array, lo envolvemos en la estructura ColeccionResponse
    if (Array.isArray(response.data)) {
      return {
        status: "success",
        message: "Datos obtenidos correctamente",
        meta: {
          requestId: "",
          timestamp: new Date().toISOString(),
          apiVersion: "v1",
          durationMs: 0,
          page,
          limit,
          total: response.data.length,
        },
        data: response.data,
      };
    }

    return response.data;
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
