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

export interface SolicitudRubro {
  rubroId: number;
  cantidadDias: string;
  valorUnitario: number;
}

export interface SolicitudDeportista {
  deportistaId: number;
  rol: string;
}

export interface SolicitudEntrenador {
  entrenadorId: number;
  rol: string;
  esPrincipal: boolean;
}

export interface SolicitudData {
  fechaHoraSalida: string;
  fechaHoraRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  observaciones?: string;
  objetivos: SolicitudObjetivo[];
  criterios: SolicitudCriterio[];
  rubros: SolicitudRubro[];
  deportistas: SolicitudDeportista[];
  entrenadores: SolicitudEntrenador[];
}

export interface UploadSolicitudParams {
  eventoId: number;
  archivo: {
    uri: string;
    name: string;
    type: string;
  };
  solicitudData: SolicitudData;
}

export const uploadSolicitud = async ({
  eventoId,
  archivo,
  solicitudData,
}: UploadSolicitudParams): Promise<{ message: string; fileUrl?: string }> => {
  try {
    const avalResponse = await httpClient.post(
      API_ENDPOINTS.EVENTOS.CREATE_AVAL(eventoId),
      solicitudData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const formData = new FormData();
    formData.append("archivo", {
      uri: archivo.uri,
      name: archivo.name,
      type: archivo.type,
    } as any);

    const archivoResponse = await httpClient.patch(
      API_ENDPOINTS.EVENTOS.UPLOAD_AVAL_ARCHIVO(eventoId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      message: "Solicitud enviada correctamente",
      fileUrl: archivoResponse.data?.fileUrl,
    };
  } catch (error) {
    const errorMessage = handleApiError(error, "uploadSolicitud");
    throw new Error(errorMessage);
  }
};
