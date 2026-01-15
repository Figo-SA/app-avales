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
 * Interfaz para la respuesta del backend de usuarios/entrenadores
 */
interface UserBackendResponse {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  cedula: string;
  genero?: "MASCULINO" | "FEMENINO";
  categoria?: { id: number; nombre: string };
  disciplina?: { id: number; nombre: string };
}

interface EntrenadoresApiResponse {
  items: UserBackendResponse[];
  pagination: { page: number; limit: number; total: number };
}

/**
 * Interfaz para la respuesta del backend de atletas
 */
interface AthleteBackendResponse {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  genero: "MASCULINO" | "FEMENINO";
  afiliacion: boolean;
}

interface AthletesApiResponse {
  items: AthleteBackendResponse[];
  pagination: { page: number; limit: number; total: number };
}

/**
 * Mapea un usuario (entrenador) del backend al formato Participante
 */
const mapUserToParticipante = (
  user: UserBackendResponse,
  tipo: TipoParticipante = "entrenador"
): Participante => ({
  id: user.id.toString(),
  tipo,
  sexo: user.genero === "FEMENINO" ? "femenino" : "masculino",
  nombres: user.nombre,
  apellidos: user.apellido || "",
  cedula: user.cedula,
  fechaNacimiento: "",
  eventoId: 0,
});

/**
 * Mapea un atleta del backend al formato Participante
 */
const mapAthleteToParticipante = (
  athlete: AthleteBackendResponse
): Participante => ({
  id: athlete.id.toString(),
  tipo: "atleta",
  sexo: athlete.genero === "FEMENINO" ? "femenino" : "masculino",
  nombres: athlete.nombres,
  apellidos: athlete.apellidos,
  cedula: athlete.cedula,
  fechaNacimiento: athlete.fechaNacimiento,
  eventoId: 0,
});

/**
 * Obtener todos los participantes disponibles (atletas)
 */
export const getAllParticipantes = async (): Promise<Participante[]> => {
  try {
    const response = await httpClient.get<AthletesApiResponse>(
      API_ENDPOINTS.ATHLETES.LIST,
      { params: { page: 1, limit: 100, soloAfiliados: true } }
    );
    const responseData = response.data as any;
    const athletes: AthleteBackendResponse[] = Array.isArray(responseData)
      ? responseData
      : (responseData?.items || []);
    return athletes.map(mapAthleteToParticipante);
  } catch (error) {
    console.warn("getAllParticipantes failed", error);
    const errMsg = handleApiError(error, "getAllParticipantes");
    throw new Error(errMsg);
  }
};

/**
 * Buscar participantes por tipo y género
 */
export const searchParticipantes = async (
  tipo?: TipoParticipante,
  sexo?: SexoParticipante,
  query: string = ""
): Promise<Participante[]> => {
  try {
    // Convertir sexo a genero (formato del backend: MASCULINO/FEMENINO)
    const genero = sexo ? sexo.toUpperCase() : undefined;

    // Usamos el endpoint específico para entrenadores cuando corresponde.
    if (tipo === "entrenador") {
      try {
        const res = await httpClient.get<EntrenadoresApiResponse>(
          API_ENDPOINTS.USERS.ENTRENADORES,
          { params: { genero, page: 1, limit: 100 } }
        );
        // La respuesta puede venir como { items, pagination } o directamente como array
        const responseData = res.data as any;
        const users: UserBackendResponse[] = Array.isArray(responseData)
          ? responseData
          : (responseData?.items || []);
        console.log("Entrenadores response:", users.length, "items");
        return users.map((user) => mapUserToParticipante(user, "entrenador"));
      } catch (err) {
        console.warn("searchParticipantes (entrenadores) failed", err);
        return [];
      }
    }

    // Default: buscar entre atletas
    try {
      const res = await httpClient.get<AthletesApiResponse>(
        API_ENDPOINTS.ATHLETES.LIST,
        { params: { genero, page: 1, limit: 100, soloAfiliados: true } }
      );
      // La respuesta puede venir como { items, pagination } o directamente como array
      const responseData = res.data as any;
      const athletes: AthleteBackendResponse[] = Array.isArray(responseData)
        ? responseData
        : (responseData?.items || []);
      console.log("Athletes response:", athletes.length, "items");
      return athletes.map(mapAthleteToParticipante);
    } catch (err) {
      console.warn("searchParticipantes (athletes) failed", err);
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
    try {
      const response = await httpClient.get<ParticipantesPorCategoria>(
        API_ENDPOINTS.ATHLETES.LIST,
        { params: { eventoId } }
      );
      if (response && response.data) return response.data;
    } catch (innerError) {
      console.warn(
        "getParticipantesByEvento: no hay endpoint específico, usando fallback",
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
 * Crear un nuevo participante (atleta)
 */
export const createParticipante = async (
  participante: Omit<Participante, "id">
): Promise<Participante> => {
  try {
    const response = await httpClient.post<Participante>(
      API_ENDPOINTS.ATHLETES.CREATE,
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
  id: number,
  participante: Partial<Participante>
): Promise<Participante> => {
  try {
    const response = await httpClient.patch<Participante>(
      API_ENDPOINTS.ATHLETES.UPDATE(id),
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
export const deleteParticipante = async (id: number): Promise<void> => {
  try {
    await httpClient.delete(API_ENDPOINTS.ATHLETES.DELETE(id));
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
