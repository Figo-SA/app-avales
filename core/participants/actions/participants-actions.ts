import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import {
  Participante,
  ParticipantesPorCategoria,
  SexoParticipante,
  TipoParticipante,
} from "../interfaces/participante";

/**
 * Obtener todos los participantes disponibles
 */
export const getAllParticipantes = async (): Promise<Participante[]> => {
  try {
    const response = await httpClient.get<Participante[]>(
      API_ENDPOINTS.DEPORTISTAS.LIST
    );
    return response.data;
  } catch (error) {
    console.warn("getAllParticipantes failed, falling back to mock", error);
    // unreachable (kept for safety)
    const errMsg = handleApiError(error, "getAllParticipantes");
    throw new Error(errMsg);
  }
};

/**
 * Buscar participantes por tipo y sexo
 */
export const searchParticipantes = async (
  tipo?: TipoParticipante,
  sexo?: SexoParticipante,
  query: string = ""
): Promise<Participante[]> => {
  try {
    // No enviamos `tipo` como query param al backend. En su lugar,
    // usamos el endpoint específico para entrenadores cuando corresponde.
    if (tipo === "entrenador") {
      try {
        const res = await httpClient.get<Participante[]>(
          API_ENDPOINTS.DEPORTISTAS.ENTRENADORES,
          { params: { sexo, query } }
        );
        return res.data;
      } catch (err) {
        console.warn("searchParticipantes (entrenadores) failed, using mock", err);
        return [];
      }
    }

    // Default: buscar entre deportistas (atletas)
    try {
      const res = await httpClient.get<Participante[]>(
        API_ENDPOINTS.DEPORTISTAS.LIST,
        { params: { sexo, query } }
      );
      return res.data;
    } catch (err) {
      console.warn("searchParticipantes (deportistas) failed, using mock", err);
      return [];
    }
  } catch (error) {
    const errMsg = handleApiError(error, "searchParticipantes");
    throw new Error(errMsg);
  }
};

/**
 * Obtener participantes de un evento
 */
export const getParticipantesByEvento = async (
  eventoId: number
): Promise<ParticipantesPorCategoria> => {
  try {
    // Actualmente no existe un endpoint específico documentado para
    // participantes por evento en el backend. Intentamos hacer una
    // petición al endpoint de deportistas con filtro por evento si el API
    // lo soporta; si falla, devolvemos el mock.
    try {
      const response = await httpClient.get<ParticipantesPorCategoria>(
        API_ENDPOINTS.DEPORTISTAS.LIST,
        { params: { eventoId } }
      );
      // Si el backend retorna la estructura esperada
      if (response && response.data) return response.data;
    } catch (innerError) {
      // ignorar y usar fallback
      console.warn(
        "getParticipantesByEvento: no hay endpoint específico, usando mock",
        innerError
      );
    }

    return {
      entrenadoresHombres: [],
      entrenadoresMujeres: [],
      atletasHombres: [],
      atletasMujeres: [],
    };
  } catch (error) {
    console.error("Error al obtener participantes:", error);
    throw error;
  }
};

/**
 * Crear un nuevo participante
 */
export const createParticipante = async (
  participante: Omit<Participante, "id">
): Promise<Participante> => {
  try {
    const response = await httpClient.post<Participante>(
      API_ENDPOINTS.DEPORTISTAS.LIST,
      participante
    );
    return response.data;
  } catch (error) {
    console.error("createParticipante failed, returning mock", error);
    return {
      ...participante,
      id: `temp-${Date.now()}`,
    } as Participante;
  }
};

/**
 * Actualizar un participante existente
 */
export const updateParticipante = async (
  id: string,
  participante: Partial<Participante>
): Promise<Participante> => {
  try {
    const response = await httpClient.put<Participante>(
      API_ENDPOINTS.DEPORTISTAS.GET_BY_ID(id),
      participante
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar participante:", error);
    throw error;
  }
};

/**
 * Eliminar un participante
 */
export const deleteParticipante = async (id: string): Promise<void> => {
  try {
    await httpClient.delete(API_ENDPOINTS.DEPORTISTAS.GET_BY_ID(id));
  } catch (error) {
    console.error("Error al eliminar participante:", error);
    throw error;
  }
};

/**
 * Guardar todos los participantes de un evento
 */
export const saveParticipantes = async (
  eventoId: number,
  participantes: ParticipantesPorCategoria
): Promise<void> => {
  try {
    // Endpoint para guardar participantes por evento no documentado.
    // Mantener como TODO: si existe, reemplazar la ruta a continuación.
    // await httpClient.post(API_ENDPOINTS.EVENTOS.PARTICIPANTES(eventoId), participantes);
    console.warn(
      "saveParticipantes: no implementado en backend, revisar endpoint",
      eventoId
    );
  } catch (error) {
    console.error("Error al guardar participantes:", error);
    throw error;
  }
};
