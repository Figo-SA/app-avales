import {
  Participante,
  ParticipantesPorCategoria,
  SexoParticipante,
  TipoParticipante,
} from "../interfaces/participante";
import { PARTICIPANTES_DATA } from "./dataParticipants";

/**
 * Obtener todos los participantes disponibles
 */
export const getAllParticipantes = async (): Promise<Participante[]> => {
  try {
    // TODO: Implementar llamada al API
    // const response = await apiClient.get('/participantes');
    // return response.data;

    // Mock data por ahora
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simular delay
    return PARTICIPANTES_DATA;
  } catch (error) {
    console.error("Error al obtener participantes:", error);
    throw error;
  }
};

/**
 * Buscar participantes por tipo y sexo
 */
export const searchParticipantes = async (
  tipo: TipoParticipante,
  sexo: SexoParticipante,
  query: string = ""
): Promise<Participante[]> => {
  try {
    // TODO: Implementar llamada al API
    // const response = await apiClient.get('/participantes/search', {
    //   params: { tipo, sexo, query }
    // });
    // return response.data;

    // Mock data por ahora
    await new Promise((resolve) => setTimeout(resolve, 200)); // Simular delay

    return PARTICIPANTES_DATA.filter(
      (p) =>
        p.tipo === tipo &&
        p.sexo === sexo &&
        (query === "" ||
          p.nombres.toLowerCase().includes(query.toLowerCase()) ||
          p.apellidos.toLowerCase().includes(query.toLowerCase()) ||
          p.cedula.includes(query))
    );
  } catch (error) {
    console.error("Error al buscar participantes:", error);
    throw error;
  }
};

/**
 * Obtener participantes de un evento
 */
export const getParticipantesByEvento = async (
  eventoId: number
): Promise<ParticipantesPorCategoria> => {
  try {
    // TODO: Implementar llamada al API
    // const response = await apiClient.get(`/eventos/${eventoId}/participantes`);
    // return response.data;

    // Mock data por ahora
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
    // TODO: Implementar llamada al API
    // const response = await apiClient.post('/participantes', participante);
    // return response.data;

    // Mock por ahora
    return {
      ...participante,
      id: `temp-${Date.now()}`,
    };
  } catch (error) {
    console.error("Error al crear participante:", error);
    throw error;
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
    // TODO: Implementar llamada al API
    // const response = await apiClient.put(`/participantes/${id}`, participante);
    // return response.data;

    throw new Error("Not implemented");
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
    // TODO: Implementar llamada al API
    // await apiClient.delete(`/participantes/${id}`);
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
    // TODO: Implementar llamada al API
    // await apiClient.post(`/eventos/${eventoId}/participantes`, participantes);
  } catch (error) {
    console.error("Error al guardar participantes:", error);
    throw error;
  }
};
