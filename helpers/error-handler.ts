import { AxiosError } from "axios";
import { ApiError, ERROR_MESSAGES } from "@/core/api/interfaces/api-error";
import { logger } from "@/core/logger";

/**
 * Extrae el mensaje de error amigable de una respuesta de la API
 */
export const getErrorMessage = (error: unknown): string => {
  // Si es un AxiosError
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;

    // Si el backend envió un error estructurado
    if (apiError?.errorCode) {
      // Intentar obtener el mensaje personalizado
      const customMessage = ERROR_MESSAGES[apiError.errorCode];
      if (customMessage) {
        return customMessage;
      }
    }

    // Si hay un mensaje 'detail' del backend
    if (apiError?.detail) {
      return apiError.detail;
    }

    // Si hay un title del error
    if (apiError?.title) {
      return apiError.title;
    }

    // Mensajes por código de estado HTTP
    switch (error.response?.status) {
      case 400:
        return "Solicitud inválida. Verifica los datos enviados";
      case 401:
        return "No estás autenticado. Por favor, inicia sesión";
      case 403:
        return "No tienes permisos para realizar esta acción";
      case 404:
        return "El recurso solicitado no fue encontrado";
      case 409:
        return "El recurso ya existe en el sistema";
      case 422:
        return "Los datos proporcionados no son válidos";
      case 500:
        return "Error interno del servidor. Intenta nuevamente";
      case 503:
        return "El servicio no está disponible. Intenta más tarde";
      default:
        break;
    }

    // Si es un error de red
    if (error.code === "ECONNABORTED") {
      return "La conexión tardó demasiado. Verifica tu conexión a internet";
    }

    if (error.code === "ERR_NETWORK") {
      return "Error de conexión. Verifica tu conexión a internet";
    }
  }

  // Si es un Error nativo de JavaScript
  if (error instanceof Error) {
    return error.message;
  }

  // Mensaje por defecto
  return ERROR_MESSAGES.DEFAULT;
};

/**
 * Extrae información completa del error para logging
 */
export const getErrorDetails = (error: unknown): {
  message: string;
  code?: string;
  status?: number;
  field?: string;
  requestId?: string;
} => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;

    return {
      message: getErrorMessage(error),
      code: apiError?.errorCode,
      status: error.response?.status,
      field: apiError?.field,
      requestId: apiError?.requestId,
    };
  }

  return {
    message: getErrorMessage(error),
  };
};

/**
 * Maneja un error de API de forma centralizada
 * - Extrae el mensaje amigable
 * - Registra el error en logs
 * - Retorna el mensaje para mostrar al usuario
 */
export const handleApiError = (
  error: unknown,
  context?: string
): string => {
  const errorDetails = getErrorDetails(error);

  // Log detallado del error
  logger.error(`API Error${context ? ` [${context}]` : ""}`, {
    message: errorDetails.message,
    code: errorDetails.code,
    status: errorDetails.status,
    field: errorDetails.field,
    requestId: errorDetails.requestId,
  });

  return errorDetails.message;
};

/**
 * Verifica si un error es de un tipo específico
 */
export const isErrorType = (
  error: unknown,
  errorCode: string
): boolean => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    return apiError?.errorCode === errorCode;
  }
  return false;
};

/**
 * Obtiene el campo que causó el error (útil para validaciones)
 */
export const getErrorField = (error: unknown): string | undefined => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    return apiError?.field;
  }
  return undefined;
};
