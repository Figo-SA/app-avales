import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";

export interface SolicitudObjetivo {
  orden: number;
  descripcion: string;
}

export interface SolicitudCriterio {
  orden: number;
  descripcion: string;
}

export interface SolicitudDeportista {
  deportistaId: number;
  rol: string;
}

export interface SolicitudEntrenador {
  entrenadorId: number;
  rol: string;
  esPrincipal?: boolean;
}

export interface SolicitudData {
  coleccionAvalId: number;
  fechaHoraSalida: string;
  fechaHoraRetorno: string;
  lugarSalida: string;
  lugarRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  observaciones?: string;
  objetivos: SolicitudObjetivo[];
  criterios: SolicitudCriterio[];
  deportistas: SolicitudDeportista[];
  entrenadores: SolicitudEntrenador[];
}

export interface ArchivoFile {
  uri: string;
  name: string;
  type: string;
}

export interface UploadSolicitudParams {
  eventoId: number;
  archivo: ArchivoFile;
  certificadoMedico: ArchivoFile;
  solicitudData: Omit<SolicitudData, "coleccionAvalId">;
}

/**
 * Paso 1: Subir convocatoria + certificado médico y crear ColeccionAval
 */
export const uploadConvocatoria = async (
  eventoId: number,
  archivo: ArchivoFile,
  certificadoMedico: ArchivoFile
): Promise<{ coleccionAvalId: number }> => {
  try {
    const formData = new FormData();
    formData.append("convocatoria", {
      uri: archivo.uri,
      name: archivo.name,
      type: archivo.type,
    } as any);
    formData.append("certificadoMedico", {
      uri: certificadoMedico.uri,
      name: certificadoMedico.name,
      type: certificadoMedico.type,
    } as any);
    formData.append("eventoId", eventoId.toString());

    const response = await httpClient.post(
      API_ENDPOINTS.AVALES.UPLOAD_CONVOCATORIA,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const coleccionAvalId = response.data?.id || response.data?.data?.id;

    if (!coleccionAvalId) {
      throw new Error("No se pudo crear la colección de aval");
    }

    return { coleccionAvalId };
  } catch (error) {
    const errorMessage = handleApiError(error, "uploadConvocatoria");
    throw new Error(errorMessage);
  }
};

/**
 * Paso 2: Crear solicitud de aval técnico
 */
export const createAvalTecnico = async (
  solicitudData: SolicitudData
): Promise<{ avalId: number }> => {
  try {
    const response = await httpClient.post(
      API_ENDPOINTS.AVALES.CREATE,
      solicitudData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const avalId = response.data?.id || response.data?.data?.id;

    if (!avalId) {
      throw new Error("No se pudo crear el aval técnico");
    }

    return { avalId };
  } catch (error) {
    const errorMessage = handleApiError(error, "createAvalTecnico");
    throw new Error(errorMessage);
  }
};

/**
 * Flujo completo: Subir convocatoria + Crear aval técnico
 */
export const uploadSolicitud = async ({
  eventoId,
  archivo,
  certificadoMedico,
  solicitudData,
}: UploadSolicitudParams): Promise<{ message: string; avalId?: number }> => {
  try {
    // Paso 1: Subir convocatoria + certificado médico y crear ColeccionAval
    const { coleccionAvalId } = await uploadConvocatoria(eventoId, archivo, certificadoMedico);

    // Paso 2: Crear el aval técnico
    const { avalId } = await createAvalTecnico({
      ...solicitudData,
      coleccionAvalId,
    });

    return {
      message: "Solicitud enviada correctamente",
      avalId,
    };
  } catch (error) {
    const errorMessage = handleApiError(error, "uploadSolicitud");
    throw new Error(errorMessage);
  }
};
